#!/usr/bin/env node
/**
 * video — project lifecycle CLI for the AI motion-design studio.
 *
 * One command surface so an AI agent (or a human) never has to remember the
 * plumbing: scaffolding projects from the Remotion template, generating
 * voiceover with Kokoro, syncing audio timings into the Remotion project,
 * applying design styles, previewing and rendering.
 *
 *   video doctor                     Verify the environment is ready.
 *   video new <name> [flags]         Scaffold a project (see --help).
 *   video list                       List projects and their phase.
 *   video status <name>              Show project state and next steps.
 *   video tts <name> [--only L2,L5] [--force] [--play]
 *   video play <name> [--line L2]    Play full voiceover or one line.
 *   video sync <name>                Regenerate timeline.ts from audio manifest.
 *   video style <name> [--list] [--set <style>]
 *   video dev <name>                 Start Remotion Studio for a project.
 *   video render <name> [--quality preview|final]
 *   video delete <name> [--yes]      Delete a project.
 */

import { spawnSync, spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TEMPLATES = path.join(ROOT, "templates");
const TEMPLATE_DIR = path.join(TEMPLATES, "remotion-vertical");
const PROJECTS = path.join(ROOT, "projects");
const STYLES = path.join(ROOT, "video-design-types");
const VOICE_LAB = path.join(ROOT, "voice-lab");

const PRESETS = {
  reel: { width: 1080, height: 1920, note: "Instagram Reel / TikTok / Shorts" },
  youtube: { width: 1920, height: 1080, note: "YouTube landscape" },
  "youtube-short": { width: 1080, height: 1920, note: "YouTube Shorts" },
  square: { width: 1080, height: 1080, note: "Square post" },
  custom: { width: null, height: null, note: "Provide --width and --height" },
};

const PHASES = ["intake", "script", "voice", "storyboard", "design", "build", "render", "done"];

// ---------------------------------------------------------------- helpers

const argv = process.argv.slice(2);
const cmd = argv[0];

function flag(name, fallback = null) {
  const idx = argv.indexOf(`--${name}`);
  if (idx === -1) return fallback;
  const next = argv[idx + 1];
  if (next === undefined || next.startsWith("--")) return true; // boolean flag
  return next;
}

function has(name) {
  return argv.includes(`--${name}`);
}

function die(msg, code = 1) {
  console.error(`\x1b[31merror:\x1b[0m ${msg}`);
  process.exit(code);
}

function info(msg) {
  console.log(`\x1b[36m▸\x1b[0m ${msg}`);
}

function ok(msg) {
  console.log(`\x1b[32m✓\x1b[0m ${msg}`);
}

function projectDir(name) {
  return path.join(PROJECTS, name);
}

function videoDir(name) {
  return path.join(projectDir(name), "video");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

function requireProject(name) {
  if (!name) die("Missing project name.");
  const dir = projectDir(name);
  if (!fs.existsSync(path.join(dir, "project.json"))) {
    die(`No project named "${name}". Run: video list`);
  }
  return dir;
}

function run(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { stdio: "inherit", ...opts });
  if (res.error) die(`${cmd} failed: ${res.error.message}`);
  if (res.status !== 0) process.exit(res.status ?? 1);
  return res;
}

function runCapture(cmd, args, opts = {}) {
  const res = spawnSync(cmd, args, { encoding: "utf8", ...opts });
  if (res.error) die(`${cmd} failed: ${res.error.message}`);
  return (res.stdout ?? "").trim();
}

function listProjects() {
  if (!fs.existsSync(PROJECTS)) return [];
  return fs
    .readdirSync(PROJECTS)
    .filter((n) => fs.existsSync(path.join(PROJECTS, n, "project.json")))
    .sort();
}

function availableStyles() {
  if (!fs.existsSync(STYLES)) return [];
  return fs
    .readdirSync(STYLES)
    .filter((n) => {
      if (n.startsWith("_")) return false; // _template and future underscore-prefixed helpers
      const d = path.join(STYLES, n);
      return fs.statSync(d).isDirectory() && fs.existsSync(path.join(d, "style.json"));
    })
    .sort();
}

// ---------------------------------------------------------------- commands

function doctor() {
  let failed = false;
  const check = (label, cmd, args) => {
    const res = spawnSync(cmd, args, { encoding: "utf8" });
    const good = !res.error && res.status === 0;
    if (good) ok(label);
    else {
      console.log(`\x1b[31m✗\x1b[0m ${label}`);
      failed = true;
    }
    return good;
  };

  info("Checking environment...");
  check("node >= 20", "node", ["--version"]);
  check("ffmpeg (rendering)", "ffmpeg", ["-version"]);

  // uv + kokoro models
  const uvOk = check("uv (voice synthesis)", "uv", ["--version"]);
  if (uvOk) {
    const model = path.join(VOICE_LAB, "models", "kokoro-v1.0.int8.onnx");
    const voices = path.join(VOICE_LAB, "models", "voices-v1.0.bin");
    if (fs.existsSync(model) && fs.existsSync(voices)) ok("kokoro models present");
    else {
      console.log(`\x1b[31m✗\x1b[0m kokoro models missing in voice-lab/models/`);
      failed = true;
    }
  }

  // template intact
  const pkg = path.join(TEMPLATE_DIR, "package.json");
  const src = path.join(TEMPLATE_DIR, "src", "Root.tsx");
  if (fs.existsSync(pkg) && fs.existsSync(src)) ok("remotion template intact");
  else {
    console.log(`\x1b[31m✗\x1b[0m templates/remotion-vertical is incomplete`);
    failed = true;
  }

  // template deps installed
  if (fs.existsSync(path.join(TEMPLATE_DIR, "node_modules", "remotion"))) {
    ok("template node_modules installed");
  } else {
    console.log(
      `\x1b[33m!\x1b[0m template deps not installed — run: cd templates/remotion-vertical && npm i`
    );
  }

  const styles = availableStyles();
  if (styles.length) ok(`design styles available: ${styles.join(", ")}`);
  else {
    console.log(`\x1b[33m!\x1b[0m no design styles found in video-design-types/`);
  }

  const projects = listProjects();
  console.log(
    `\x1b[36m▸\x1b[0m ${projects.length} project(s): ${projects.join(", ") || "none"}`
  );

  if (failed) {
    console.error("\n\x1b[31mEnvironment has problems — fix them before starting.\x1b[0m");
    process.exit(1);
  }
  console.log("\n\x1b[32mAll good. You can start a project: video new <name>\x1b[0m");
}

function newProject(name) {
  if (!name) die("Usage: video new <name> --preset reel|youtube|youtube-short|square|custom");
  if (!/^[a-z0-9][a-z0-9-]*$/.test(name)) {
    die("Project name must be lowercase letters, digits and dashes.");
  }
  const dir = projectDir(name);
  if (fs.existsSync(dir)) die(`Project "${name}" already exists.`);

  const presetName = flag("preset", "reel");
  const preset = PRESETS[presetName];
  if (!preset) die(`Unknown preset "${presetName}". Options: ${Object.keys(PRESETS).join(", ")}`);

  const width = parseInt(flag("width", preset.width ?? ""), 10);
  const height = parseInt(flag("height", preset.height ?? ""), 10);
  if (!width || !height) die("Custom preset requires --width and --height.");
  const fps = parseInt(flag("fps", "30"), 10);
  const durationSec = parseFloat(flag("duration", "30"));
  const style = flag("style", availableStyles()[0] ?? null);
  if (style && !availableStyles().includes(style)) {
    die(`Unknown style "${style}". Available: ${availableStyles().join(", ")}`);
  }

  info(`Scaffolding project "${name}" (${width}x${height} @ ${fps}fps, ~${durationSec}s)...`);

  // Copy template without node_modules, .git, build outputs.
  const exclusions = new Set(["node_modules", ".git", "out", "dist", ".DS_Store"]);
  fs.mkdirSync(dir, { recursive: true });
  fs.cpSync(TEMPLATE_DIR, videoDir(name), {
    recursive: true,
    filter: (src) => !exclusions.has(path.basename(src)),
  });

  // Link template node_modules into the project (saves a full reinstall).
  // On Linux/macOS a symlink works; fall back to npm install if linking fails.
  const templateNm = path.join(TEMPLATE_DIR, "node_modules");
  const projectNm = path.join(videoDir(name), "node_modules");
  let linked = false;
  if (fs.existsSync(templateNm)) {
    try {
      fs.symlinkSync(templateNm, projectNm, "junction");
      linked = true;
      ok("linked template node_modules (no reinstall needed)");
    } catch {
      info("Symlink failed — running npm install...");
      run("npm", ["install", "--no-audit", "--no-fund"], { cwd: videoDir(name) });
    }
  } else {
    info("Template has no node_modules — running npm install...");
    run("npm", ["install", "--no-audit", "--no-fund"], { cwd: videoDir(name) });
  }

  // Project record
  const record = {
    name,
    createdAt: new Date().toISOString(),
    phase: "intake",
    frame: { preset: presetName, width, height },
    fps,
    targetDurationSec: durationSec,
    style,
    voice: { name: "af_heart", speed: 1.0 },
    audioApproved: false,
    scriptApproved: false,
    storyboardApproved: false,
    designApproved: false,
  };
  writeJson(path.join(dir, "project.json"), record);

  // Starter script.json (empty lines — agent fills during script phase)
  writeJson(path.join(dir, "script.json"), {
    voice: record.voice.name,
    speed: record.voice.speed,
    lines: [],
  });

  // Folder layout
  fs.mkdirSync(path.join(dir, "audio"), { recursive: true });
  fs.mkdirSync(path.join(dir, "video", "public", "audio"), { recursive: true });

  // Starter storyboard.md and design.md with guidance comments
  fs.writeFileSync(
    path.join(dir, "storyboard.md"),
    `# Storyboard — ${name}\n\n<!-- One section per audio line:\n     ## L1 — "<first few words>"\n     Visual: what the viewer sees (layout, elements, text on screen)\n     Motion: how it enters, behaves, exits; which frames\n     Style notes: colors, fonts, animation choices from the design style\n     Keep each section VERY detailed — this is what turns into Remotion code. -->\n`
  );
  fs.writeFileSync(
    path.join(dir, "design.md"),
    `# Design — ${name}\n\n<!-- Design discussion outcome: mood, palette, fonts (how many, which),\n     animation density, transitions, references. The active style is: ${
      style ?? "none"
    }. -->\n`
  );

  // Apply the design style's tokens into the video project
  if (style) applyStyleTokens(name, style, false);

  // Phase 1 state
  ok(`Project "${name}" created at projects/${name}`);
  console.log(`
Next steps (agent workflow — see AGENTS.md):
  1. Ask the user for the idea / script        (phase: intake → script)
  2. video tts ${name}                         (phase: voice)
  3. video play ${name}                        (let user approve audio)
  4. Write storyboard.md                       (phase: storyboard)
  5. Discuss design → video style ${name} --set <style>
  6. Build scenes in video/src/scenes/
  7. video dev ${name}                         (phase: build)
  8. video render ${name}                      (phase: render)`);
}

function listCmd() {
  const projects = listProjects();
  if (!projects.length) {
    console.log("No projects yet. Create one: video new <name> --preset reel");
    return;
  }
  console.log("Projects:\n");
  for (const name of projects) {
    const p = readJson(path.join(PROJECTS, name, "project.json"));
    const audio = fs.existsSync(path.join(PROJECTS, name, "audio", "manifest.json"));
    const dur = audio
      ? readJson(path.join(PROJECTS, name, "audio", "manifest.json")).totalDuration.toFixed(1)
      : "-";
    console.log(
      `  \x1b[36m${name.padEnd(24)}\x1b[0m phase: ${p.phase.padEnd(10)} ` +
        `${p.frame.width}x${p.frame.height}  audio: ${dur}s  style: ${p.style ?? "-"}`
    );
  }
}

function statusCmd(name) {
  const dir = requireProject(name);
  const p = readJson(path.join(dir, "project.json"));
  const manifestPath = path.join(dir, "audio", "manifest.json");
  const hasAudio = fs.existsSync(manifestPath);
  const scenesDir = path.join(dir, "video", "src", "scenes");
  const sceneCount = fs.existsSync(scenesDir)
    ? fs.readdirSync(scenesDir).filter((f) => f.endsWith(".tsx")).length
    : 0;

  console.log(`\n\x1b[1m${name}\x1b[0m`);
  console.log(`  phase:       ${p.phase}`);
  console.log(`  frame:       ${p.frame.width}x${p.frame.height} (${p.frame.preset}) @ ${p.fps}fps`);
  console.log(`  style:       ${p.style ?? "not chosen"}`);
  console.log(`  voice:       ${p.voice.name} @ ${p.voice.speed}x`);
  console.log(`  script:      ${p.scriptApproved ? "✓ approved" : "○ not approved"}`);
  if (hasAudio) {
    const m = readJson(manifestPath);
    console.log(
      `  audio:       ${p.audioApproved ? "✓" : "○"} ${m.lines.length} lines, ${m.totalDuration.toFixed(1)}s`
    );
  } else {
    console.log(`  audio:       not generated (video tts ${name})`);
  }
  console.log(`  storyboard:  ${p.storyboardApproved ? "✓ approved" : "○ not approved"}`);
  console.log(`  design:      ${p.designApproved ? "✓ approved" : "○ not approved"}`);
  console.log(`  scenes:      ${sceneCount}`);
  console.log();
}

function ttsCmd(name) {
  const dir = requireProject(name);
  const p = readJson(path.join(dir, "project.json"));
  const scriptPath = path.join(dir, "script.json");
  const script = readJson(scriptPath);
  if (!script.lines?.length) die(`script.json for "${name}" has no lines. Write the script first.`);

  const only = flag("only", null);
  const force = has("force");
  const voice = flag("voice", script.voice ?? p.voice.name);
  const speed = parseFloat(flag("speed", script.speed ?? p.voice.speed));

  const args = [
    "run",
    "--project",
    VOICE_LAB,
    "python",
    path.join(VOICE_LAB, "tts.py"),
    "batch",
    "--script",
    scriptPath,
    "--outdir",
    path.join(dir, "audio"),
    "--voice",
    String(voice),
    "--speed",
    String(speed),
  ];
  if (only) args.push("--only", String(only));
  if (force) args.push("--force");

  info(`Synthesizing voiceover for "${name}"...`);
  run("uv", args);

  // Concatenate to single track
  run("uv", [
    "run",
    "--project",
    VOICE_LAB,
    "python",
    path.join(VOICE_LAB, "tts.py"),
    "concat",
    "--outdir",
    path.join(dir, "audio"),
    "--out",
    path.join(dir, "audio", "voiceover.wav"),
  ]);

  const manifest = readJson(path.join(dir, "audio", "manifest.json"));
  ok(
    `Audio ready: ${manifest.lines.length} lines, ${manifest.totalDuration.toFixed(1)}s → projects/${name}/audio/voiceover.wav`
  );

  // Keep project record in sync
  p.voice = { name: voice, speed };
  writeJson(path.join(dir, "project.json"), p);

  syncCmd(name, true);

  if (has("play")) playCmd(name);
}

function playCmd(name) {
  const dir = requireProject(name);
  const line = flag("line", null);
  const file = line
    ? path.join(dir, "audio", `${line}.wav`)
    : path.join(dir, "audio", "voiceover.wav");
  if (!fs.existsSync(file)) die(`Audio not found: ${file}\nRun: video tts ${name}`);

  const players = [
    ["ffplay", ["-nodisp", "-autoexit", "-loglevel", "quiet", file]],
    ["paplay", [file]],
    ["aplay", ["-q", file]],
    ["mpv", ["--no-video", file]],
    ["afplay", [file]], // macOS
  ];
  for (const [cmd, args] of players) {
    const res = spawnSync(cmd, args, { stdio: "ignore" });
    if (!res.error && res.status === 0) return;
  }
  die("No audio player found (tried ffplay, paplay, aplay, mpv, afplay).");
}

function syncCmd(name, quiet = false) {
  const dir = requireProject(name);
  const p = readJson(path.join(dir, "project.json"));
  const manifestPath = path.join(dir, "audio", "manifest.json");
  if (!fs.existsSync(manifestPath)) die(`No audio manifest. Run: video tts ${name}`);
  const manifest = readJson(manifestPath);

  const { fps, frame } = p;
  const gapFrames = Math.round((manifest.gap ?? 0.25) * fps);

  const lines = manifest.lines.map((l) => ({
    id: l.id,
    text: l.text,
    audio: `audio/${l.id}.wav`,
    startFrame: Math.round(l.start * fps),
    durationFrames: Math.round(l.duration * fps),
  }));

  // Total: last line end + a little tail so the video doesn't cut off
  const last = lines[lines.length - 1];
  const totalFrames = last.startFrame + last.durationFrames + Math.round(fps * 0.5);

  // Copy per-line wavs + full track into video/public/audio
  const pubAudio = path.join(dir, "video", "public", "audio");
  fs.mkdirSync(pubAudio, { recursive: true });
  for (const l of manifest.lines) {
    fs.copyFileSync(path.join(dir, "audio", l.file), path.join(pubAudio, l.file));
  }
  fs.copyFileSync(path.join(dir, "audio", "voiceover.wav"), path.join(pubAudio, "voiceover.wav"));

  // Write generated timeline data (this file is regenerated — don't hand-edit)
  const timelinePath = path.join(dir, "video", "src", "data", "timeline.ts");
  fs.mkdirSync(path.dirname(timelinePath), { recursive: true });
  const content = `// AUTO-GENERATED by \`video sync\` — do not edit by hand.
// Source: projects/${name}/audio/manifest.json

export type TimelineLine = {
  id: string;
  text: string;
  /** Path relative to public/ */
  audio: string;
  startFrame: number;
  durationFrames: number;
};

/** False until voiceover exists; Video.tsx skips <Audio> when unset. */
export const HAS_AUDIO = true;

export const FPS = ${fps};
export const WIDTH = ${frame.width};
export const HEIGHT = ${frame.height};
export const TOTAL_DURATION_IN_FRAMES = ${totalFrames};

export const LINES: TimelineLine[] = ${JSON.stringify(lines, null, 2)};
`;
  fs.writeFileSync(timelinePath, content);

  // Also record in project.json
  p.audioTotalSec = Number(manifest.totalDuration.toFixed(3));
  p.totalFrames = totalFrames;
  writeJson(path.join(dir, "project.json"), p);

  if (!quiet) ok(`Synced ${lines.length} lines → ${path.relative(ROOT, timelinePath)}`);
}

function styleCmd(name) {
  if (has("list") || !name) {
    const styles = availableStyles();
    console.log("Available design styles:\n");
    for (const s of styles) {
      const meta = readJson(path.join(STYLES, s, "style.json"));
      console.log(`  \x1b[36m${s.padEnd(22)}\x1b[0m ${meta.description ?? ""}`);
    }
    return;
  }
  const dir = requireProject(name);
  const setStyle = flag("set", null);
  if (!setStyle) {
    // show current
    const p = readJson(path.join(dir, "project.json"));
    console.log(`Current style for ${name}: ${p.style ?? "none"}`);
    console.log(`Available: ${availableStyles().join(", ")}`);
    return;
  }
  if (!availableStyles().includes(setStyle)) {
    die(`Unknown style "${setStyle}". Available: ${availableStyles().join(", ")}`);
  }
  applyStyleTokens(name, setStyle, true);
}

function applyStyleTokens(name, style, announce) {
  const styleFile = path.join(STYLES, style, "tokens.ts");
  if (!fs.existsSync(styleFile)) die(`Style "${style}" has no tokens.ts at ${styleFile}`);
  const destDir = path.join(videoDir(name), "src", "data");
  fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(styleFile, path.join(destDir, "theme.ts"));

  const p = readJson(path.join(projectDir(name), "project.json"));
  p.style = style;
  writeJson(path.join(projectDir(name), "project.json"), p);
  if (announce) ok(`Style "${style}" applied → video/src/data/theme.ts`);
}

function devCmd(name) {
  const dir = requireProject(name);
  if (!fs.existsSync(path.join(videoDir(name), "node_modules"))) {
    die(`Dependencies missing for "${name}". Re-run: video new ${name}`);
  }
  info(`Starting Remotion Studio for "${name}"...`);
  const child = spawn("npm", ["run", "dev"], { cwd: videoDir(name), stdio: "inherit" });
  child.on("exit", (code) => process.exit(code ?? 0));
}

function renderCmd(name) {
  const dir = requireProject(name);
  const quality = flag("quality", "final");
  const outDir = path.join(dir, "output");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, `${name}.mp4`);
  info(`Rendering "${name}" → ${path.relative(ROOT, outFile)} (${quality})...`);
  const args = ["remotion", "render", "Main", "--output", outFile];
  if (quality === "preview") args.push("--scale", "0.5");
  run("npx", args, { cwd: videoDir(name) });
  ok(`Rendered: ${path.relative(ROOT, outFile)}`);
}

async function deleteCmd(name) {
  const dir = requireProject(name);
  if (!has("yes")) {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const answer = await new Promise((res) =>
      rl.question(`Delete project "${name}" and ALL its files? [y/N] `, res)
    );
    rl.close();
    if (!/^y(es)?$/i.test(answer.trim())) {
      console.log("Aborted.");
      return;
    }
  }
  fs.rmSync(dir, { recursive: true, force: true });
  ok(`Deleted projects/${name}`);
}

// ---------------------------------------------------------------- dispatch

const HELP = `video — AI motion-design studio CLI

Usage: video <command> [args]

  doctor                      Check that everything is installed and ready
  new <name>                  Scaffold a project
      --preset reel|youtube|youtube-short|square|custom
      --width <px> --height <px>   (for custom preset)
      --fps <n>                Default 30
      --duration <seconds>     Target duration, default 30
      --style <name>           Design style from video-design-types/
  list                        List projects
  status <name>               Project state and next steps
  tts <name>                  Synthesize voiceover from script.json
      --only L2,L5             Regenerate only these lines
      --force                  Regenerate everything
      --voice <id>             Kokoro voice (e.g. af_heart, am_michael)
      --speed <x>              Speech speed, default 1.0
      --play                   Play the result when done
  play <name>                 Play the full voiceover
      --line L2                Play a single line instead
  sync <name>                 Regenerate video/src/data/timeline.ts from audio
  style                       List styles / show current
  style <name> --set <style>  Apply a design style to a project
  dev <name>                  Start Remotion Studio (live preview)
  render <name>               Render final MP4 to projects/<name>/output/
      --quality preview|final  preview = half-scale fast render
  delete <name> [--yes]       Delete a project
`;

switch (cmd) {
  case "doctor":
    doctor();
    break;
  case "new":
    newProject(argv[1]);
    break;
  case "list":
    listCmd();
    break;
  case "status":
    statusCmd(argv[1]);
    break;
  case "tts":
    ttsCmd(argv[1]);
    break;
  case "play":
    playCmd(argv[1]);
    break;
  case "sync":
    syncCmd(argv[1]);
    break;
  case "style":
    styleCmd(argv[1]);
    break;
  case "dev":
    devCmd(argv[1]);
    break;
  case "render":
    renderCmd(argv[1]);
    break;
  case "delete":
    await deleteCmd(argv[1]);
    break;
  case "help":
  case "--help":
  case "-h":
  case undefined:
    console.log(HELP);
    break;
  default:
    die(`Unknown command "${cmd}". Run: video help`);
}
