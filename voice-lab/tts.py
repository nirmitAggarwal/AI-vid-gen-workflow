#!/usr/bin/env python3
"""Kokoro TTS CLI for the video studio.

Subcommands:
  voices            List available voices.
  line              Synthesize a single line of text to a WAV file.
  batch             Synthesize a list of lines (JSON) to per-line WAVs + a manifest.
  concat            Concatenate per-line WAVs into one voiceover track.

The `batch` command is what the pipeline uses: it reads a script JSON of the form
    {"voice": "af_heart", "speed": 1.0, "lines": [{"id": "L1", "text": "..."}, ...]}
and writes outdir/L1.wav ... plus outdir/manifest.json:
    {"sampleRate": 24000, "voice": "af_heart", "speed": 1.0,
     "lines": [{"id": "L1", "file": "L1.wav", "duration": 2.41,
                "start": 0.0, "hash": "ab12..."}]}
Lines whose text hash already matches the previous manifest are skipped (not
regenerated), so re-running after editing one line only re-synthesizes that line.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent
MODEL = ROOT / "models" / "kokoro-v1.0.int8.onnx"
VOICES = ROOT / "models" / "voices-v1.0.bin"

DEFAULT_GAP = 0.25  # seconds of silence between concatenated lines

_kokoro = None


def get_kokoro():
    global _kokoro
    if _kokoro is None:
        from kokoro_onnx import Kokoro

        if not MODEL.exists() or not VOICES.exists():
            sys.exit(
                f"Kokoro models not found. Expected:\n  {MODEL}\n  {VOICES}\n"
                "Download kokoro-v1.0.int8.onnx and voices-v1.0.bin into voice-lab/models/."
            )
        _kokoro = Kokoro(str(MODEL), str(VOICES))
    return _kokoro


def list_voices() -> list[str]:
    import numpy as np

    with np.load(VOICES) as v:
        return sorted(v.files)


def text_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()[:16]


def synth(text: str, voice: str, speed: float) -> tuple[np.ndarray, int]:
    k = get_kokoro()
    audio, sr = k.create(text, voice=voice, speed=speed, lang="en-us")
    return audio, sr


def cmd_voices(_args) -> None:
    for name in list_voices():
        print(name)


def cmd_line(args) -> None:
    text = args.text
    if args.text_file:
        text = Path(args.text_file).read_text(encoding="utf-8")
    if not text or not text.strip():
        sys.exit("No text provided (use --text or --text-file).")
    audio, sr = synth(text.strip(), args.voice, args.speed)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    sf.write(out, audio, sr, subtype="PCM_16")
    print(json.dumps({"file": str(out), "duration": round(len(audio) / sr, 3)}))


def load_manifest(outdir: Path) -> dict:
    path = outdir / "manifest.json"
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            pass
    return {}


def cmd_batch(args) -> None:
    script = json.loads(Path(args.script).read_text(encoding="utf-8"))
    lines = script.get("lines", [])
    if not lines:
        sys.exit("Script has no lines.")
    voice = args.voice or script.get("voice") or "af_heart"
    speed = args.speed if args.speed is not None else float(script.get("speed", 1.0))

    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    previous = load_manifest(outdir) if not args.force else {}
    prev_lines = {l["id"]: l for l in previous.get("lines", [])}
    only_ids = set(args.only.split(",")) if args.only else None

    manifest_lines = []
    generated = skipped = 0
    sr = 24000  # kokoro default; corrected from any wav we read
    for entry in lines:
        lid, text = entry["id"], entry["text"].strip()
        th = text_hash(f"{voice}|{speed}|{text}")
        prev = prev_lines.get(lid)
        wav_path = outdir / f"{lid}.wav"

        # Decide whether this line needs (re)generation:
        #   --force: everything; --only: just those ids; default: changed hash or missing wav
        if only_ids is not None:
            needs = lid in only_ids and (not prev or prev.get("hash") != th or not wav_path.exists())
        else:
            needs = not prev or prev.get("hash") != th or not wav_path.exists()

        if needs:
            audio, sr = synth(text, voice, speed)
            sf.write(wav_path, audio, sr, subtype="PCM_16")
            duration = round(len(audio) / sr, 3)
            generated += 1
        else:
            duration = prev["duration"]
            skipped += 1
        manifest_lines.append(
            {"id": lid, "text": text, "file": f"{lid}.wav", "duration": duration, "hash": th}
        )
        print(f"  [{lid}] {duration:>6.2f}s  {text[:60]}", file=sys.stderr)

    # Compute cumulative start times
    t = 0.0
    for l in manifest_lines:
        l["start"] = round(t, 3)
        t += l["duration"] + args.gap

    manifest = {
        "sampleRate": sr,
        "voice": voice,
        "speed": speed,
        "gap": args.gap,
        "totalDuration": round(t, 3),
        "lines": manifest_lines,
    }
    (outdir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    print(
        json.dumps(
            {
                "manifest": str(outdir / "manifest.json"),
                "totalDuration": manifest["totalDuration"],
                "generated": generated,
                "skipped": skipped,
            }
        )
    )


def cmd_concat(args) -> None:
    outdir = Path(args.outdir)
    manifest = json.loads((outdir / "manifest.json").read_text(encoding="utf-8"))
    sr = manifest.get("sampleRate", 24000)
    gap = args.gap if args.gap is not None else manifest.get("gap", DEFAULT_GAP)
    parts = []
    for l in manifest["lines"]:
        audio, file_sr = sf.read(outdir / l["file"], dtype="float32")
        if file_sr != sr:
            sys.exit(f"Sample rate mismatch in {l['file']}: {file_sr} vs {sr}")
        parts.append(audio)
        parts.append(np.zeros(int(gap * sr), dtype=np.float32))
    combined = np.concatenate(parts)
    out = Path(args.out)
    out.parent.mkdir(parents=True, exist_ok=True)
    sf.write(out, combined, sr, subtype="PCM_16")
    print(json.dumps({"file": str(out), "duration": round(len(combined) / sr, 3)}))


def main() -> None:
    p = argparse.ArgumentParser(description="Kokoro TTS CLI")
    sub = p.add_subparsers(dest="cmd", required=True)

    sub.add_parser("voices", help="List available voices").set_defaults(func=cmd_voices)

    pl = sub.add_parser("line", help="Synthesize one line")
    pl.add_argument("--text")
    pl.add_argument("--text-file")
    pl.add_argument("--voice", default="af_heart")
    pl.add_argument("--speed", type=float, default=1.0)
    pl.add_argument("--out", required=True)
    pl.set_defaults(func=cmd_line)

    pb = sub.add_parser("batch", help="Synthesize a script JSON")
    pb.add_argument("--script", required=True, help="Path to script.json")
    pb.add_argument("--outdir", required=True)
    pb.add_argument("--voice", default=None)
    pb.add_argument("--speed", type=float, default=None)
    pb.add_argument("--gap", type=float, default=DEFAULT_GAP, help="Gap between lines in seconds")
    pb.add_argument("--force", action="store_true", help="Regenerate all lines")
    pb.add_argument("--only", default=None, help="Comma-separated line ids to regenerate (e.g. L2,L5)")
    pb.set_defaults(func=cmd_batch)

    pc = sub.add_parser("concat", help="Concatenate per-line WAVs into one track")
    pc.add_argument("--outdir", required=True)
    pc.add_argument("--out", required=True)
    pc.add_argument("--gap", type=float, default=None)
    pc.set_defaults(func=cmd_concat)

    args = p.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
