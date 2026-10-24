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
  Paper,
  RED,
  SAFE,
  SURFACE,
  YELLOW,
  clamp,
  useAnim,
  useJolt,
} from "./doodle";
import type { SceneProps } from "./index";

const HEAD: React.CSSProperties = {
  fontFamily: THEME.fonts.heading,
  fontWeight: THEME.fonts.headingWeight,
  textTransform: "uppercase",
  color: INK,
  lineHeight: THEME.fonts.lineHeights.heading,
};

const MONO: React.CSSProperties = {
  fontFamily: THEME.fonts.mono,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

/* ------------------------------- L3 ------------------------------- */

const ellipsePath = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy}`;

export const L3Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [12, 46], [0, 560], clamp);
  const vanish = interpolate(frame, [46, 62], [1, 0], clamp);
  const intoBox = interpolate(frame, [46, 62], [1, 0], clamp);

  return (
    <Paper>
      <Fig n={3} note="CURRICULUM" />

      <div style={{ position: "absolute", left: SAFE, top: 212 }}>
        <div style={{ ...MONO, fontSize: 22, color: GREY }}>TRAINED FOR</div>
        <div style={{ ...HEAD, fontSize: 96, marginTop: 14 }}>A WORLD THAT</div>
        <div style={{ ...HEAD, fontSize: 96 }}>NO LONGER</div>
        <div style={{ ...HEAD, fontSize: 96 }}>EXISTS.</div>
      </div>

      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0 }}
        aria-hidden
      >
        {/* conveyor */}
        <Ink d="M900 560 L1770 560" delay={0} dur={10} />
        <Ink d="M900 632 L1770 632" delay={2} dur={10} />
        {[970, 1110, 1250, 1390, 1530, 1670].map((cx, i) => (
          <g key={cx}>
            <Ink d={ellipsePath(cx, 596, 24)} delay={2 + i * 2} dur={10} w={5} />
            <Ink d={`M${cx - 12} 596 L${cx + 12} 596`} delay={6 + i * 2} dur={4} w={3} />
            <Ink d={`M${cx} 584 L${cx} 608`} delay={7 + i * 2} dur={4} w={3} />
          </g>
        ))}
        <Ink d="M940 632 L918 744" delay={6} dur={7} />
        <Ink d="M1700 632 L1722 744" delay={6} dur={7} />
        <Ink d="M880 744 L960 744" delay={10} dur={5} w={5} />
        <Ink d="M1680 744 L1760 744" delay={10} dur={5} w={5} />

        {/* graduation cap + degree riding the belt */}
        <g transform={`translate(${960 + slide} 508)`} opacity={intoBox}>
          <Ink d="M-72 24 L0 -20 L72 24 L0 68 Z" delay={10} dur={8} w={6} fill={AGED} />
          <Ink d="M-26 50 L-26 88 L26 88 L26 50" delay={14} dur={7} w={6} />
          <Ink d="M0 24 L0 4" delay={18} dur={4} w={4} />
          <Ink d="M0 4 C15 4 24 13 24 26" delay={20} dur={5} w={4} />
        </g>
        <g transform={`translate(${1150 + slide} 538)`} opacity={intoBox}>
          <Ink d="M-70 -22 L62 -22 L62 44 L-70 44 Z" delay={14} dur={8} w={5} fill={SURFACE} />
          <Ink d="M-48 -22 L-48 44" delay={18} dur={4} w={4} />
          <Ink d="M62 -22 C84 -22 84 44 62 44" delay={20} dur={5} w={5} fill={SURFACE} />
          <Ink d="M-70 10 L-24 10" delay={22} dur={4} w={4} color={RED} />
        </g>

        {/* the future, briefly */}
        <g opacity={vanish}>
          <Ink d="M1500 280 L1780 280" delay={14} dur={20} w={6} dashed color={GREY} />
          <Ink d="M1500 280 L1500 632" delay={14} dur={20} w={6} dashed color={GREY} />
          <Ink d="M1780 280 L1780 632" delay={14} dur={20} w={6} dashed color={GREY} />
        </g>

        {/* junk pile of the recent past */}
        <g>
          <Ink d="M960 660 L1090 660 L1090 760 L960 760 Z" delay={30} dur={8} fill={SURFACE} />
          <Ink d="M960 660 L1010 660 L1010 760" delay={34} dur={6} w={4} />
          <Ink d="M1050 660 L1030 690 L1080 690" delay={36} dur={6} w={4} />
          <Ink d="M1150 700 L1290 700 L1290 770 L1150 770 Z" delay={34} dur={8} fill={AGED} />
          <Ink d="M1170 720 L1270 720" delay={38} dur={4} w={3} />
          <Ink d="M1330 640 L1470 640 L1470 760 L1330 760 Z" delay={38} dur={8} fill={SURFACE} />
          <Ink d="M1350 662 L1450 662 L1450 726 L1350 726 Z" delay={42} dur={6} w={4} />
          <Ink d="M1360 760 L1340 790 M1440 760 L1460 790" delay={44} dur={4} w={4} />
        </g>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 1500,
          top: 224,
          ...MONO,
          fontSize: 22,
          color: GREY,
          opacity: vanish,
        }}
      >
        FUTURE (TBD)
      </div>
      <div
        style={{ position: "absolute", left: 1118, top: 660, ...MONO, fontSize: 20, color: RED, transform: "rotate(-6deg)" }}
      >
        2004
      </div>

      <svg width={400} height={40} style={{ position: "absolute", left: 92, top: 470 }}>
        <Ink d="M6 16 L336 4" delay={64} dur={12} w={8} color={RED} />
      </svg>
    </Paper>
  );
};

/* ------------------------------- L4 ------------------------------- */

export const L4Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const board = useAnim(0, 10);
  const jolt = useJolt(42, 10, 5);
  const chalk = "rgba(247,241,227,0.92)";

  return (
    <Paper>
      <Fig n={4} note="LECTURE HALL" />

      {/* left type */}
      <div style={{ position: "absolute", left: SAFE, top: 210, ...MONO, fontSize: 24, color: GREY }}>
        IN 2026,
      </div>
      <div style={{ position: "absolute", left: SAFE - 4, top: 250 }}>
        <div style={{ ...HEAD, fontSize: 122, position: "relative", zIndex: 2, transform: `translateX(${jolt}px)` }}>
          STILL
        </div>
        <div style={{ ...HEAD, fontSize: 122, position: "relative", zIndex: 2 }}>TEACHING.</div>
        <Marker x={-4} y={150} w={620} h={104} delay={20} />
      </div>
      <div style={{ position: "absolute", left: SAFE, top: 600, ...MONO, fontSize: 20, color: RED }}>
        SAME SLIDES SINCE 2004
      </div>

      {/* blackboard */}
      <div
        style={{
          position: "absolute",
          left: 860,
          top: 120,
          width: 960,
          height: 760,
          background: INK,
          border: `6px solid ${INK}`,
          transform: `scaleY(${board})`,
          transformOrigin: "top center",
          boxShadow: "10px 10px 0 rgba(20,20,20,0.25)",
        }}
      >
        <div style={{ ...MONO, position: "absolute", left: 34, top: 26, fontSize: 18, color: "rgba(247,241,227,0.55)" }}>
          UNIT 4 — 2004 SYLLABUS
        </div>

        <div
          style={{
            ...HEAD,
            position: "absolute",
            left: 34,
            top: 78,
            fontSize: 104,
            color: chalk,
          }}
        >
          JAVA APPLETS
        </div>

        <svg width={960} height={760} style={{ position: "absolute", inset: 0 }} aria-hidden>
          <g transform="translate(700 300)">
            <Ink d={ellipsePath(0, 0, 30)} delay={22} dur={8} w={5} color={chalk} />
            <Ink d="M0 30 L0 118" delay={26} dur={7} w={5} color={chalk} />
            <Ink d="M0 58 L-52 96" delay={28} dur={6} w={5} color={chalk} />
            <Ink d="M0 58 L48 28" delay={28} dur={6} w={5} color={chalk} />
            <Ink d="M0 118 L-32 190" delay={30} dur={7} w={5} color={chalk} />
            <Ink d="M0 118 L34 190" delay={30} dur={7} w={5} color={chalk} />
            <Ink d="M48 28 L170 4" delay={34} dur={8} w={7} color={YELLOW} />
            {[36, 40, 44].map((d, i) => (
              <circle key={i} cx={180 + i * 14} cy={2 + i * 5} r={2.6} fill={chalk} />
            ))}
          </g>
        </svg>

        {/* applet window */}
        <div
          style={{
            position: "absolute",
            left: 500,
            top: 430,
            width: 360,
            height: 210,
            border: `3px solid ${chalk}`,
            background: "rgba(247,241,227,0.07)",
          }}
        >
          <div
            style={{
              height: 38,
              borderBottom: `2px solid ${chalk}`,
              display: "flex",
              alignItems: "center",
              padding: "0 10px",
              gap: 6,
              ...MONO,
              fontSize: 15,
              color: chalk,
            }}
          >
            <span>applet_viewer.exe</span>
          </div>
          <div style={{ ...MONO, fontSize: 30, color: chalk, padding: "24px 18px 8px", letterSpacing: "0.12em" }}>
            HELLO WORLD
          </div>
          <div
            style={{
              margin: "16px 18px 0",
              height: 14,
              border: `2px solid ${chalk}`,
            }}
          >
            <div style={{ width: `${12 * Math.min(1, frame / 60)}%`, height: "100%", background: chalk }} />
          </div>
          <div style={{ ...MONO, fontSize: 13, color: chalk, padding: "8px 18px" }}>12% · LOADING…</div>
        </div>

        {/* speech bubble */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: 560,
            width: 360,
            border: `3px solid ${chalk}`,
            borderRadius: 20,
            padding: "16px 22px",
            color: chalk,
            fontFamily: THEME.fonts.body,
            fontWeight: 700,
            fontSize: 30,
            transform: "rotate(-3deg)",
            opacity: useAnim(84, 8),
          }}
        >
          ANY QUESTIONS?
        </div>
      </div>

      {/* calendar page */}
      <div
        style={{
          position: "absolute",
          left: 738,
          top: 716,
          width: 176,
          height: 218,
          background: SURFACE,
          border: `4px solid ${INK}`,
          boxShadow: "6px 6px 0 rgba(20,20,20,0.3)",
          transform: "rotate(-7deg)",
          textAlign: "center",
          paddingTop: 18,
          boxSizing: "border-box",
          zIndex: 15,
        }}
      >
        <div style={{ ...MONO, fontSize: 15, color: GREY }}>YEAR</div>
        <div style={{ ...HEAD, fontSize: 76, color: RED, lineHeight: 1 }}>2026</div>
        <div style={{ ...MONO, fontSize: 14, color: GREY, marginTop: 10 }}>SEM II</div>
      </div>
    </Paper>
  );
};
