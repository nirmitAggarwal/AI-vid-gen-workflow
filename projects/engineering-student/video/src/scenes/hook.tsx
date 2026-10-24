import React from "react";
import { useCurrentFrame } from "remotion";
import { THEME } from "../data/theme";
import {
  AGED,
  Fig,
  GREY,
  INK,
  Marker,
  Paper,
  Rohan,
  SAFE,
  Sheet,
  Stamp,
  Sticky,
  Type,
  BLUE,
  RED,
  YELLOW,
  useJolt,
  usePop,
} from "./doodle";
import type { SceneProps } from "./index";

const HEAD: React.CSSProperties = {
  fontFamily: THEME.fonts.heading,
  fontWeight: THEME.fonts.headingWeight,
  textTransform: "uppercase",
  color: INK,
  lineHeight: THEME.fonts.lineHeights.heading,
  letterSpacing: THEME.fonts.headingLetterSpacing,
};

const MONO: React.CSSProperties = {
  fontFamily: THEME.fonts.mono,
  color: GREY,
  letterSpacing: "0.12em",
  textTransform: "uppercase",
};

/** Reusable student ID card with the Rohan doodle. */
export const IdCard: React.FC<{
  x: number;
  y: number;
  scale?: number;
  delay?: number;
  rotate?: number;
}> = ({ x, y, scale = 1, delay = 0, rotate = 2 }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      transform: `scale(${scale}) rotate(${rotate}deg)`,
      transformOrigin: "top left",
    }}
  >
    <Sheet x={0} y={0} w={560} h={720} delay={delay} fill="#FFFDF6">
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          right: 0,
          height: 64,
          background: AGED,
          borderBottom: `4px solid ${INK}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 22px",
          ...MONO,
          fontSize: 20,
          color: INK,
        }}
      >
        <span>STUDENT ID</span>
        <span>2026</span>
      </div>

      <div
        style={{
          position: "absolute",
          left: 34,
          top: 92,
          width: 492,
          height: 430,
          border: `4px solid ${INK}`,
          background: THEME.colors.background,
          overflow: "hidden",
        }}
      >
        <svg
          width={392}
          height={430}
          viewBox="0 0 300 350"
          style={{ position: "absolute", left: 48, top: 8 }}
        >
          <Rohan x={0} y={0} scale={1.14} delay={delay + 6} />
        </svg>
      </div>

      <div style={{ position: "absolute", left: 34, top: 550 }}>
        <div style={{ ...HEAD, fontSize: 46 }}>Rohan</div>
        <div style={{ ...MONO, fontSize: 19, marginTop: 8 }}>
          B.TECH · COMPUTER SCIENCE · YEAR 2
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 34,
          top: 660,
          ...MONO,
          fontSize: 17,
          color: INK,
          letterSpacing: "0.18em",
        }}
      >
        ID 2024/CSE/0917
      </div>

      <div style={{ position: "absolute", right: 30, bottom: 30, display: "flex", gap: 4 }}>
        {[3, 1, 4, 2, 1, 3, 5, 1, 2, 4, 1, 3].map((w, i) => (
          <div key={i} style={{ width: w * 3, height: 34, background: INK }} />
        ))}
      </div>
    </Sheet>
  </div>
);

/* ------------------------------------------------------------------ */

export const L1Scene: React.FC<SceneProps> = () => {
  const jolt = useJolt(6, 12, 7);
  const nameScale = usePop(6, 1.5);
  const frame = useCurrentFrame();

  return (
    <Paper>
      <Fig n={1} note="SUBJECT FILE" />

      <div style={{ position: "absolute", left: SAFE, top: 150, ...MONO, fontSize: 22 }}>
        SUBJECT 001 / CSE
      </div>

      <div style={{ position: "absolute", left: SAFE - 8, top: 292 }}>
        <Marker x={-6} y={86} w={586} h={148} delay={14} />
        <div
          style={{
            ...HEAD,
            position: "relative",
            zIndex: 2,
            fontSize: 212,
            transform: `translateX(${jolt}px) scale(${nameScale})`,
            transformOrigin: "left center",
          }}
        >
          Rohan
        </div>
      </div>

      <Type
        text="SECOND YEAR · ENGINEERING"
        delay={24}
        dur={22}
        style={{ position: "absolute", left: SAFE + 4, top: 566, ...MONO, fontSize: 30, color: INK }}
      />

      {/* status form */}
      <div
        style={{
          position: "absolute",
          left: SAFE + 4,
          top: 660,
          width: 620,
          height: 126,
          border: `4px solid ${INK}`,
          background: "#FFFDF6",
          transform: "rotate(-0.6deg)",
          boxShadow: "5px 5px 0 rgba(20,20,20,0.25)",
        }}
      >
        <div style={{ position: "absolute", left: 22, top: 18, ...MONO, fontSize: 18 }}>
          STATUS
        </div>
        <div
          style={{
            position: "absolute",
            left: 22,
            top: 52,
            width: 430,
            borderBottom: `3px dashed ${GREY}`,
          }}
        />
        <Type
          text="ON TRACK?"
          delay={48}
          dur={14}
          style={{
            position: "absolute",
            left: 26,
            top: 50,
            fontFamily: THEME.fonts.body,
            fontWeight: 700,
            fontSize: 46,
            color: BLUE,
            letterSpacing: "0.02em",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 26,
            bottom: 12,
            fontFamily: THEME.fonts.mono,
            fontSize: 18,
            color: RED,
            opacity: frame > 62 ? 1 : 0,
            transform: `rotate(${frame > 62 ? -3 : 0}deg)`,
          }}
        >
          allegedly
        </div>
      </div>

      <IdCard x={1160} y={170} scale={1.06} delay={2} rotate={2} />
    </Paper>
  );
};

/* ------------------------------------------------------------------ */

export const L2Scene: React.FC<SceneProps> = () => {
  const jolt = useJolt(18, 12, 8);

  return (
    <Paper>
      <Fig n={2} note="PEER REVIEW" />

      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 120,
          ...MONO,
          fontSize: 26,
          color: INK,
          transform: "rotate(-2deg)",
          width: 560,
          lineHeight: 1.6,
        }}
      >
        ACCORDING TO THE INTERNET,
      </div>

      <div style={{ position: "absolute", left: 660, top: 90 }}>
        <IdCard x={0} y={0} scale={1.2} delay={0} rotate={-1.5} />
      </div>

      <Stamp
        text="OBSOLETE"
        x={760 + jolt}
        y={400}
        size={132}
        rotate={-9}
        delay={18}
        border={8}
        pad="18px 30px"
      />

      <Sticky x={300} y={790} w={330} rotate={-7} delay={40} bg={YELLOW}>
        <div style={{ fontFamily: THEME.fonts.mono, fontSize: 20, letterSpacing: "0.08em" }}>
          AI REPLACED THIS
        </div>
        <svg width={220} height={80} style={{ marginTop: 4 }}>
          <ArrowDoodle />
        </svg>
      </Sticky>

      <Sticky x={1530} y={160} w={250} rotate={6} delay={54} bg="#FFFDF6">
        <div
          style={{
            fontFamily: THEME.fonts.heading,
            fontSize: 44,
            color: RED,
            textTransform: "uppercase",
          }}
        >
          Too late?
        </div>
      </Sticky>
    </Paper>
  );
};

const ArrowDoodle: React.FC = () => {
  const p = usePop(46, 0.9);
  return (
    <g opacity={p}>
      <path
        d="M10 20 C60 8 120 22 196 54"
        fill="none"
        stroke={INK}
        strokeWidth={5}
        strokeLinecap="round"
      />
      <path d="M196 54 L172 46 M196 54 L178 68" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    </g>
  );
};
