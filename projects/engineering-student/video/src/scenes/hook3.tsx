import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../data/theme";
import {
  AGED,
  Fig,
  GREY,
  INK,
  Ink,
  Marker,
  PAPER,
  Paper,
  RED,
  SAFE,
  Stamp,
  SURFACE,
  Win,
  clamp,
  useAnim,
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
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

const Cursor: React.FC<{ x: number; y: number; scale?: number }> = ({ x, y, scale = 1.4 }) => (
  <svg
    width={40}
    height={50}
    viewBox="0 0 24 32"
    style={{ position: "absolute", left: x, top: y, transform: `scale(${scale})`, transformOrigin: "top left" }}
  >
    <path d="M1 1 L1 26 L8 20 L13 31 L18 29 L13 18 L22 18 Z" fill={INK} stroke={PAPER} strokeWidth={1.4} />
  </svg>
);

/* ------------------------------- L5 ------------------------------- */

const ESSAY = [
  "In today's rapidly evolving landscape,",
  "artificial intelligence has fundamentally",
  "transformed the way we approach problem",
  "solving. This essay will explore the key",
  "dimensions of modern computation and",
  "its profound implications for society.",
];

export const L5Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const elapsed = Math.max(0, 4 - Math.floor(Math.max(0, frame - 58) / 10));

  return (
    <Paper>
      <Fig n={5} note="ACADEMIC INTEGRITY" />

      <div style={{ position: "absolute", left: SAFE, top: 150, ...MONO, fontSize: 23, color: GREY }}>
        MEANWHILE…
      </div>
      <div style={{ position: "absolute", left: SAFE - 4, top: 190 }}>
        <div style={{ ...HEAD, fontSize: 88, position: "relative", zIndex: 2 }}>NOT ALLOWED.</div>
        <Marker x={-4} y={62} w={560} h={44} delay={24} />
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} aria-hidden>
        <Ink d="M96 322 C240 312 420 330 610 318" delay={20} dur={10} w={8} color={RED} />
      </svg>

      {/* laptop */}
      <div style={{ position: "absolute", left: 120, top: 420, width: 660 }}>
        <div
          style={{
            position: "relative",
            width: 640,
            height: 372,
            marginLeft: 20,
            border: `6px solid ${INK}`,
            background: SURFACE,
            transform: "rotate(-1.4deg)",
            boxShadow: "8px 8px 0 rgba(20,20,20,0.28)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: 58,
              borderBottom: `3px solid ${INK}`,
              background: "rgba(255,75,62,0.12)",
              display: "flex",
              alignItems: "center",
              padding: "0 18px",
              ...MONO,
              fontSize: 20,
              color: RED,
            }}
          >
            AI TOOLS: BLOCKED
          </div>

          <svg width={640} height={314} style={{ position: "absolute", top: 58, left: 0 }}>
            <g transform="translate(290 92)">
              <Ink d="M20 62 L20 30 C20 4 92 4 92 30 L92 62" delay={10} dur={9} w={10} />
              <Ink d="M6 62 L106 62 L106 132 L6 132 Z" delay={12} dur={8} w={10} fill={AGED} />
              <Ink d="M44 92 L44 108" delay={18} dur={4} w={9} />
              <Ink d="M40 108 L40 114 L48 114 L48 108" delay={18} dur={4} w={6} />
            </g>
          </svg>

          <div
            style={{
              position: "absolute",
              left: 190,
              bottom: 26,
              width: 260,
              height: 56,
              border: `3px dashed ${GREY}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              ...MONO,
              fontSize: 19,
              color: GREY,
            }}
          >
            GENERATE
          </div>

          {[42, 62, 84].map((at) => (
            <div
              key={at}
              style={{
                position: "absolute",
                left: 460,
                bottom: 60 + ((at / 10) % 3) * 44,
                ...MONO,
                fontSize: 17,
                color: RED,
                opacity: interpolate(frame, [at, at + 2, at + 10, at + 13], [0, 1, 1, 0], clamp),
                transform: "rotate(-6deg)",
              }}
            >
              DENIED
            </div>
          ))}

          <div style={{ opacity: interpolate(frame, [30, 34], [0, 1], clamp) }}>
            <Cursor x={470} y={250} />
          </div>
        </div>

        <div
          style={{
            width: 700,
            height: 46,
            background: AGED,
            border: `5px solid ${INK}`,
            clipPath: "polygon(3% 0, 97% 0, 100% 100%, 0 100%)",
          }}
        />
      </div>

      {/* chat window */}
      <Win x={1030} y={150} w={760} h={700} url="chat.ai/essay — 1 tab" delay={4} accent={INK}>
        <div
          style={{
            position: "absolute",
            right: 24,
            top: 16,
            ...MONO,
            fontSize: 32,
            color: frame > 56 ? RED : GREY,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18 }}>BOOT</span> 00:0{elapsed}
        </div>

        <div
          style={{
            position: "absolute",
            left: 26,
            top: 74,
            right: 26,
            bottom: 96,
          }}
        >
          <div
            style={{
              marginLeft: "46%",
              border: `2px solid ${INK}`,
              background: AGED,
              padding: "10px 14px",
              fontFamily: THEME.fonts.mono,
              fontSize: 20,
              width: 380,
              boxSizing: "border-box",
              opacity: interpolate(frame, [18, 22], [0, 1], clamp),
            }}
          >
            write my assignment
          </div>

          <div style={{ marginTop: 26 }}>
            {ESSAY.map((line, i) => (
              <div
                key={line}
                style={{
                  fontFamily: THEME.fonts.body,
                  fontWeight: 600,
                  fontSize: 24,
                  lineHeight: 1.55,
                  color: INK,
                  opacity: interpolate(frame, [30 + i * 8, 36 + i * 8], [0, 0.92], clamp),
                  transform: `translateY(${interpolate(frame, [30 + i * 8, 36 + i * 8], [6, 0], clamp)}px)`,
                }}
              >
                {line}
              </div>
            ))}
          </div>

          <div
            style={{
              position: "absolute",
              bottom: 4,
              left: 0,
              display: "flex",
              alignItems: "center",
              gap: 12,
              ...MONO,
              fontSize: 20,
              color: "#1E7A34",
              opacity: interpolate(frame, [100, 106], [0, 1], clamp),
            }}
          >
            <svg width={30} height={30}>
              <Ink d="M4 16 L12 24 L26 6" delay={100} dur={7} w={6} color="#1E7A34" />
            </svg>
            SUBMITTED
          </div>
        </div>
      </Win>

      <Stamp text="A+" x={1450} y={620} size={116} rotate={8} delay={100} border={7} pad="6px 22px" />
    </Paper>
  );
};

/* ------------------------------- L6 ------------------------------- */

const ring = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy}`;

export const L6Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const p = useAnim(0, 6);

  return (
    <Paper>
      <Fig n={6} note="SPEED RUN" />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} aria-hidden>
        <Ink d={ring(960, 520, 286)} delay={0} dur={7} w={12} />
        <Ink d="M916 206 L1004 206" delay={4} dur={5} w={18} />
        <Ink d="M940 174 L980 174" delay={5} dur={4} w={12} />
        <g transform={`rotate(${frame * 26} 960 520)`} opacity={p}>
          <path
            d="M960 520 L960 300"
            stroke={RED}
            strokeWidth={10}
            strokeLinecap="round"
          />
        </g>
        <circle cx={960} cy={520} r={14} fill={INK} />
      </svg>

      {[4, 3, 2, 1].map((n, i) => {
        const d = 2 + i * 8;
        const op = interpolate(frame, [d, d + 1, d + 7, d + 8], [0, 1, 1, 0], clamp);
        const s = interpolate(frame, [d, d + 4], [1.7, 1], clamp);
        return (
          <div
            key={n}
            style={{
              position: "absolute",
              left: 960,
              top: 520,
              transform: `translate(-50%, -50%) scale(${s})`,
              ...HEAD,
              fontSize: 310,
              color: RED,
              opacity: op,
            }}
          >
            {n}
          </div>
        );
      })}

      <Stamp
        text="DONE."
        x={720}
        y={700}
        size={150}
        rotate={-5}
        delay={33}
        filled
        color={INK}
        border={8}
        pad="10px 26px"
      />

      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 150,
          ...MONO,
          fontSize: 22,
          color: GREY,
        }}
      >
        TIME TO COMPLETE: 00:04
      </div>

      <div
        style={{
          position: "absolute",
          left: 960 - 140,
          top: 830,
          ...MONO,
          fontSize: 26,
          color: INK,
          letterSpacing: "0.3em",
          opacity: interpolate(frame, [10, 16], [0, 1], clamp),
        }}
      >
        00:0{Math.max(0, 4 - Math.floor(frame / 8))}
      </div>
    </Paper>
  );
};
