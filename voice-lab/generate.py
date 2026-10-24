from pathlib import Path

import soundfile as sf
from kokoro_onnx import Kokoro

ROOT = Path(__file__).resolve().parent
MODEL = ROOT / "models" / "kokoro-v1.0.int8.onnx"
VOICES = ROOT / "models" / "voices-v1.0.bin"
OUTPUT = ROOT / "test-voiceover.wav"

text = (
    "Welcome to AI Video Gen. "
    "A new idea, a little imagination, "
    "and we're ready to create."
)

kokoro = Kokoro(str(MODEL), str(VOICES))

try:
    audio, sample_rate = kokoro.create(
        text,
        voice="af_heart",
        speed=1.0,
        lang="en-us",
    )

    sf.write(OUTPUT, audio, sample_rate, subtype="PCM_16")
    print(f"Voiceover saved to: {OUTPUT}")
    print(f"Sample rate: {sample_rate} Hz")
finally:
    kokoro.voices.close()
