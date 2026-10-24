import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../data/theme";
import {
  AGED,
  CircleScribble,
  Fig,
  GREY,
  INK,
  Ink,
  Marker,
  Paper,
  RED,
  Rohan,
  SAFE,
  Sheet,
  Sticky,
  SURFACE,
  Win,
  BLUE,
  clamp,
} from "./doodle";
import type { SceneProps } from "./index";

const HEAD: React.CSSProperties = {
  fontFamily: THEME.fonts.heading,
  fontWeight: THEME.fonts.headingWeight,
  textTransform: "uppercase",
  lineHeight: THEME.fonts.lineHeights.heading,
  color: INK,
};

const MONO: React.CSSProperties = {
  fontFamily: THEME.fonts.mono,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

/* ------------------------------- L7 ------------------------------- */

export const L7Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const cursorX = interpolate(frame, [16, 30], [450, 0], clamp);
  const cursorY = interpolate(frame, [16, 30], [290, 0], clamp);
  const ripple = (at: number) =>
    interpolate(frame, [at, at + 14], [0, 1], clamp);

  return (
    <Paper>
      <Fig n={7} note="SELF STUDY" />

      <div style={{ position: "absolute", left: SAFE - 4, top: 300 }}>
        <div style={{ ...HEAD, fontSize: 106 }}>SO ROHAN</div>
        <div style={{ ...HEAD, fontSize: 106 }}>OPENS</div>
        <div style={{ ...HEAD, fontSize: 106 }}>YOUTUBE.</div>
      </div>
      <div style={{ position: "absolute", left: SAFE, top: 700, ...MONO, fontSize: 20, color: GREY }}>
        INTENT: ONE TUTORIAL
      </div>

      <Win x={620} y={150} w={1130} h={700} url="youtube.com/one-tutorial" delay={2} accent={INK}>
        {/* video card */}
        <div style={{ position: "absolute", left: 52, top: 60, width: 500 }}>
          <div
            style={{
              width: 500,
              height: 300,
              background: AGED,
              border: `4px solid ${INK}`,
              position: "relative",
              transform: "rotate(-1deg)",
            }}
          >
            <svg width={500} height={300} style={{ position: "absolute", inset: 0 }}>
              <Ink d="M250 82 L250 218 L368 150 Z" delay={16} dur={7} color={RED} w={6} fill={RED} />
              <Ink d="M20 270 L180 270" delay={18} dur={6} w={3} color={GREY} />
            </svg>
            <div
              style={{
                position: "absolute",
                right: 10,
                bottom: 8,
                background: INK,
                color: THEME.colors.surface,
                ...MONO,
                fontSize: 15,
                padding: "2px 8px",
              }}
            >
              12:04
            </div>
            {[0, 1].map((i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: 230,
                  top: 130,
                  width: 40,
                  height: 40,
                  marginLeft: -20,
                  marginTop: -20,
                  border: `3px solid ${RED}`,
                  borderRadius: 999,
                  opacity: 1 - ripple(30 + i * 3),
                  transform: `scale(${1 + ripple(30 + i * 3) * 3.2})`,
                }}
              />
            ))}
          </div>

          <div style={{ fontFamily: THEME.fonts.body, fontWeight: 700, fontSize: 33, marginTop: 16, lineHeight: 1.15 }}>
            Learn EVERYTHING in 12 Minutes
          </div>
          <div style={{ ...MONO, fontSize: 17, color: GREY, marginTop: 10 }}>
            DEFINITELY AN EXPERT · 1.2M VIEWS
          </div>
        </div>

        {/* sidebar */}
        <div style={{ position: "absolute", left: 600, top: 70, width: 470 }}>
          <div
            style={{
              background: RED,
              color: THEME.colors.surface,
              ...MONO,
              fontSize: 18,
              padding: "10px 0",
              textAlign: "center",
              width: 210,
              transform: "rotate(-1deg)",
            }}
          >
            SUBSCRIBE
          </div>
          <div style={{ ...MONO, fontSize: 15, color: GREY, marginTop: 26, lineHeight: 2 }}>
            UP NEXT
          </div>
          {[
            ["FULL STACK IN 1 HOUR", "impossible"],
            ["AI WILL REPLACE YOU", "probably"],
            ["DSA: THE ONLY VIDEO", "not really"],
          ].map(([title, sub], i) => (
            <div
              key={title}
              style={{
                display: "flex",
                gap: 14,
                marginBottom: 18,
                opacity: interpolate(frame, [40 + i * 8, 46 + i * 8], [0, 1], clamp),
              }}
            >
              <div style={{ width: 110, height: 66, background: AGED, border: `3px solid ${INK}` }} />
              <div>
                <div style={{ fontFamily: THEME.fonts.body, fontWeight: 700, fontSize: 20 }}>{title}</div>
                <div style={{ ...MONO, fontSize: 12, color: GREY, marginTop: 4 }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* progress bar */}
        <div style={{ position: "absolute", left: 52, right: 52, bottom: 30 }}>
          <div style={{ height: 10, background: AGED, border: `2px solid ${INK}` }}>
            <div style={{ width: "2%", height: "100%", background: RED }} />
          </div>
          <div style={{ ...MONO, fontSize: 13, color: GREY, marginTop: 6 }}>0:00 / 12:04</div>
        </div>
      </Win>

      <svg
        width={70}
        height={80}
        viewBox="0 0 24 32"
        style={{
          position: "absolute",
          left: 860 + cursorX,
          top: 360 + cursorY,
          transform: "scale(2.1) rotate(-8deg)",
          transformOrigin: "top left",
        }}
      >
        <path d="M1 1 L1 26 L8 20 L13 31 L18 29 L13 18 L22 18 Z" fill={INK} stroke={THEME.colors.surface} strokeWidth={1.4} />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 1750,
          top: 250,
          width: 150,
          border: `3px solid ${INK}`,
          background: SURFACE,
          padding: "8px 12px",
          ...MONO,
          fontSize: 16,
          color: BLUE,
          opacity: interpolate(frame, [64, 68], [0, 1], clamp),
          transform: "rotate(5deg)",
          zIndex: 30,
        }}
      >
        +1 TAB
      </div>

      <CircleScribble cx={990} cy={215} rx={290} ry={74} rotate={-2} delay={44} dur={18} />
    </Paper>
  );
};

/* ------------------------------- L8 ------------------------------- */

const TABS: { l: string; x: number; y: number; r: number }[] = [
  { l: "WEB DEV", x: 30, y: 120, r: -3 },
  { l: "MACHINE LEARNING", x: 330, y: 200, r: 2 },
  { l: "CYBERSECURITY", x: 30, y: 320, r: 1 },
  { l: "QUANTUM", x: 330, y: 400, r: -2 },
  { l: "DSA", x: 30, y: 540, r: 3 },
  { l: "CLOUD", x: 330, y: 620, r: -1 },
  { l: "DEVOPS", x: 30, y: 760, r: -4 },
  { l: "AI AGENTS", x: 330, y: 840, r: 2 },
  { l: "RUST", x: 1560, y: 120, r: 3 },
  { l: "BLOCKCHAIN", x: 1270, y: 210, r: -2 },
  { l: "PROMPT ENG", x: 1560, y: 340, r: 1 },
  { l: "UI / UX", x: 1270, y: 430, r: -3 },
  { l: "SYSTEM DESIGN", x: 1560, y: 560, r: 2 },
  { l: "DATA SCIENCE", x: 1270, y: 650, r: -1 },
  { l: "PRODUCT", x: 1560, y: 780, r: -4 },
  { l: "MORE TABS", x: 1270, y: 870, r: 3 },
];

export const L8Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const count = Math.min(47, Math.round(47 * interpolate(frame, [8, 108], [0, 1], clamp)));

  return (
    <Paper>
      <Fig n={8} note="TAB MANAGEMENT" />

      {TABS.map((t, i) => {
        const d = 8 + i * 6;
        const scale = interpolate(frame, [d, d + 6], [0.4, 1], clamp);
        return (
          <div
            key={t.l}
            style={{
              position: "absolute",
              left: t.x,
              top: t.y,
              width: 280,
              border: `3px solid ${INK}`,
              background: SURFACE,
              boxShadow: "5px 5px 0 rgba(20,20,20,0.22)",
              transform: `rotate(${t.r}deg) scale(${scale})`,
              opacity: Math.min(1, scale),
              padding: "12px 14px",
              display: "flex",
              alignItems: "center",
              gap: 10,
              zIndex: 10 + (i % 3),
            }}
          >
            <div style={{ width: 12, height: 12, borderRadius: 99, background: i % 2 ? RED : BLUE }} />
            <div style={{ ...MONO, fontSize: 16, color: INK }}>{t.l}</div>
            <div style={{ marginLeft: "auto", color: GREY, fontSize: 16 }}>×</div>
          </div>
        );
      })}

      <Sticky x={812} y={392} w={300} rotate={-3} delay={60} style={{ zIndex: 6, padding: 16 }}>
        <svg width={268} height={286} viewBox="0 0 300 340">
          <Rohan x={0} y={0} scale={0.9} delay={62} mood="sad" />
        </svg>
        <div style={{ ...MONO, fontSize: 15, textAlign: "center", marginTop: -14 }}>ROHAN</div>
      </Sticky>

      <div
        style={{
          position: "absolute",
          right: 70,
          top: 26,
          textAlign: "right",
          zIndex: 40,
        }}
      >
        <div style={{ ...MONO, fontSize: 15, color: GREY }}>TABS OPEN</div>
        <div style={{ ...HEAD, fontSize: 74, color: count >= 47 ? RED : INK }}>
          {String(count).padStart(2, "0")}
        </div>
      </div>

      <div style={{ position: "absolute", left: 780, top: 820, width: 300 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              height: 9,
              border: `2px solid ${INK}`,
              marginBottom: 9,
              width: 210 + i * 30,
              background: AGED,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${(Math.sin((frame + i * 20) / 9) * 0.5 + 0.5) * 100}%`,
                background: i === 1 ? RED : INK,
                opacity: 0.6,
              }}
            />
          </div>
        ))}
      </div>

      <div style={{ position: "absolute", left: SAFE, top: 920, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ ...HEAD, fontSize: 66 }}>FORTY-SEVEN TABS.</div>
        <div
          style={{
            background: RED,
            color: THEME.colors.surface,
            ...HEAD,
            fontSize: 52,
            padding: "2px 14px",
            transform: "rotate(-4deg)",
          }}
        >
          47
        </div>
      </div>
    </Paper>
  );
};

/* ------------------------------- L9 ------------------------------- */

export const L9Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const colon = Math.floor(frame / 10) % 2 === 0;

  return (
    <Paper>
      <Fig n={9} note="LOCAL TIME" />

      <Sheet x={170} y={170} w={640} h={620} rotate={-3} delay={0} fill={SURFACE}>
        <div style={{ ...MONO, fontSize: 20, color: GREY }}>DAY 47</div>
        <div style={{ ...HEAD, fontSize: 72, marginTop: 10 }}>TUESDAY</div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 20, marginTop: 10 }}>
          <div style={{ ...HEAD, fontSize: 250, lineHeight: 0.85, color: INK }}>23</div>
          <div style={{ ...MONO, fontSize: 18, color: GREY, marginTop: 30, lineHeight: 2 }}>
            OCTOBER
            <br />
            2026
          </div>
        </div>
        <div
          style={{
            marginTop: 22,
            borderTop: `3px solid ${INK}`,
            paddingTop: 20,
            ...MONO,
            fontSize: 54,
            color: RED,
            letterSpacing: "0.06em",
          }}
        >
          02<span style={{ opacity: colon ? 1 : 0.25 }}>:</span>47 AM
        </div>
      </Sheet>

      <div style={{ position: "absolute", left: 980, top: 340 }}>
        <div style={{ ...HEAD, fontSize: 118, position: "relative", zIndex: 2 }}>STILL</div>
        <div style={{ ...HEAD, fontSize: 154, position: "relative", zIndex: 2, marginTop: 6 }}>TUESDAY.</div>
        <Marker x={-8} y={240} w={560} h={62} delay={18} />
      </div>

      <div style={{ position: "absolute", left: 984, top: 700, ...MONO, fontSize: 18, color: GREY }}>
        NO SLEEP. JUST ONE MORE VIDEO.
      </div>
    </Paper>
  );
};
