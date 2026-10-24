import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../data/theme";
import {
  AGED,
  Arrow,
  Fig,
  GREY,
  INK,
  Ink,
  Marker,
  Paper,
  RED,
  SAFE,
  Sheet,
  Sticky,
  SURFACE,
  YELLOW,
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

/* ------------------------------- L10 ------------------------------- */

const TITLES = ["YOU'RE LATE", "START EARLY", "IT'S TOO LATE"];

export const L10Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const swipe = interpolate(frame, [44, 50], [0, -1300], clamp);
  const hero = interpolate(frame, [52, 58], [0, 1], clamp);
  const bar = interpolate(frame, [56, 80], [0, 0.92], clamp);

  return (
    <Paper>
      <Fig n={10} note="THE ALGORITHM" />

      {TITLES.map((title, i) => {
        const s = interpolate(frame, [i * 5, i * 5 + 8], [0.4, 1], clamp);
        return (
        <div
          key={title}
          style={{
            position: "absolute",
            left: 120 + i * 600,
            top: 260 + swipe,
            width: 460,
            transform: `rotate(${(i - 1) * 1.6}deg) scale(${s})`,
            opacity: Math.min(1, s),
            zIndex: 10,
          }}
        >
          <div
            style={{
              border: `4px solid ${INK}`,
              background: SURFACE,
              boxShadow: "7px 7px 0 rgba(20,20,20,0.25)",
              padding: 18,
            }}
          >
            <div style={{ position: "relative", height: 280, background: AGED, border: `3px solid ${INK}` }}>
              <svg width={420} height={280} style={{ position: "absolute", inset: 0 }}>
                <Ink d="M330 50 C250 60 200 80 150 150" delay={8 + i * 5} dur={10} w={15} color={RED} />
                <Ink d="M150 150 L188 140" delay={16 + i * 5} dur={5} w={15} color={RED} />
                <Ink d="M150 150 L166 186" delay={16 + i * 5} dur={5} w={15} color={RED} />
                <Ink d="M40 236 L84 214 L84 258 Z" delay={12 + i * 5} dur={6} w={4} />
              </svg>
              <div
                style={{
                  position: "absolute",
                  right: 10,
                  bottom: 8,
                  background: INK,
                  color: THEME.colors.surface,
                  ...MONO,
                  fontSize: 13,
                  padding: "2px 8px",
                }}
              >
                12:04
              </div>
            </div>
            <div style={{ ...HEAD, fontSize: 40, marginTop: 14 }}>{title}</div>
            <div style={{ ...MONO, fontSize: 14, color: GREY, marginTop: 6 }}>DEFINITELY AN EXPERT</div>
          </div>
        </div>
        );
      })}

      <div style={{ position: "absolute", left: SAFE, top: 230, opacity: hero, zIndex: 20 }}>
        <div style={{ ...HEAD, fontSize: 112 }}>YOU'RE ALREADY</div>
        <div style={{ ...HEAD, fontSize: 238, color: RED, marginTop: -8 }}>BEHIND.</div>
      </div>

      <div style={{ position: "absolute", left: SAFE, top: 760, width: 900, opacity: hero, zIndex: 20 }}>
        <div style={{ ...MONO, fontSize: 17, color: GREY, marginBottom: 8 }}>YOUR PROGRESS</div>
        <div style={{ height: 32, border: `4px solid ${INK}`, background: SURFACE, position: "relative" }}>
          <div style={{ width: `${bar * 100}%`, height: "100%", background: YELLOW }} />
          <div
            style={{
              position: "absolute",
              left: `calc(${bar * 100}% - 2px)`,
              top: -10,
              width: 4,
              height: 48,
              background: RED,
            }}
          />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", ...MONO, fontSize: 15, color: GREY, marginTop: 8 }}>
          <span>2004</span>
          <span style={{ color: RED }}>{Math.round(bar * 100)}%</span>
          <span>2026</span>
        </div>
      </div>
    </Paper>
  );
};

/* ------------------------------- L11 ------------------------------- */

const Node: React.FC<{
  x: number;
  y: number;
  label: string;
  tone?: "ink" | "red" | "blue";
  small?: boolean;
}> = ({ x, y, label, tone = "ink", small = false }) => {
  const color = tone === "red" ? RED : tone === "blue" ? THEME.colors.accentBlue : INK;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        border: `3px solid ${color}`,
        borderRadius: 999,
        background: SURFACE,
        padding: small ? "5px 12px" : "9px 18px",
        ...MONO,
        fontSize: small ? 14 : 17,
        color,
        whiteSpace: "nowrap",
        transform: "rotate(-2deg)",
      }}
    >
      {label}
    </div>
  );
};

const MapSheet: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  delay: number;
  title: string;
  children: React.ReactNode;
  arrows?: React.ReactNode;
}> = ({ x, y, w, h, rotate, delay, title, children, arrows }) => (
  <div style={{ position: "absolute", left: x, top: y, zIndex: Math.round(delay) }}>
    <Sheet x={0} y={0} w={w} h={h} rotate={rotate} delay={delay} fill={SURFACE} style={{ padding: 24 }}>
      <div style={{ ...MONO, fontSize: 18, color: INK, borderBottom: `2px solid ${INK}`, paddingBottom: 10 }}>
        {title}
      </div>
      <div style={{ position: "relative", width: "100%", height: `calc(100% - 46px)` }}>
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0 }} viewBox={`0 0 ${w - 48} ${h - 70}`}>
          {arrows}
        </svg>
        {children}
      </div>
    </Sheet>
  </div>
);

export const L11Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();

  return (
    <Paper>
      <Fig n={11} note="STRATEGY" />

      <MapSheet
        x={300}
        y={250}
        w={700}
        h={480}
        rotate={-3}
        delay={0}
        title="ROADMAP v1"
        arrows={
          <>
            <Arrow from={[130, 160]} to={[280, 140]} delay={14} dur={8} w={4} />
            <Arrow from={[380, 140]} to={[520, 160]} delay={18} dur={8} w={4} />
            <Arrow from={[330, 200]} to={[330, 300]} delay={24} dur={8} w={4} color={RED} />
          </>
        }
      >
        <Node x={60} y={135} label="START" />
        <Node x={270} y={115} label="???" />
        <Node x={510} y={135} label="JOB" />
        <div style={{ position: "absolute", left: 296, top: 320, ...MONO, fontSize: 13, color: RED }}>DEAD END</div>
      </MapSheet>

      <MapSheet
        x={560}
        y={300}
        w={720}
        h={480}
        rotate={4}
        delay={34}
        title="ROADMAP v2 — FINAL(2)"
        arrows={
          <>
            <Arrow from={[100, 140]} to={[220, 200]} delay={46} dur={7} w={4} />
            <Arrow from={[300, 190]} to={[430, 140]} delay={50} dur={7} w={4} />
            <Arrow from={[510, 160]} to={[560, 260]} delay={54} dur={7} w={4} curve={-40} />
          </>
        }
      >
        <Node x={40} y={115} label="START" small />
        <Node x={200} y={185} label="LEARN" />
        <Node x={410} y={120} label="BUILD" />
        <Node x={510} y={240} label="JOB?" />
        <div style={{ position: "absolute", left: 60, top: 290, ...MONO, fontSize: 13, color: RED, transform: "rotate(-4deg)" }}>
          STILL CONFUSED
        </div>
      </MapSheet>

      <MapSheet
        x={820}
        y={270}
        w={780}
        h={520}
        rotate={-6}
        delay={62}
        title="ROADMAP FOR CHOOSING ROADMAPS"
        arrows={
          <>
            <Arrow from={[230, 155]} to={[440, 130]} delay={74} dur={8} w={4} />
            <Arrow from={[520, 190]} to={[420, 300]} delay={78} dur={9} w={4} curve={-50} />
            <Arrow from={[260, 350]} to={[160, 210]} delay={84} dur={9} w={4} curve={80} color={RED} />
          </>
        }
      >
        <Node x={80} y={120} label="WHICH ROADMAP?" tone="red" />
        <Node x={420} y={105} label="HOW MANY?" />
        <Node x={230} y={300} label="IS THIS A ROADMAP?" />
        <div style={{ position: "absolute", left: 470, top: 300, ...MONO, fontSize: 60, color: RED }}>?</div>
      </MapSheet>

      <div style={{ position: "absolute", left: SAFE, top: 900, zIndex: 40 }}>
        <Marker x={-6} y={4} w={330} h={62} delay={92} />
        <div style={{ ...HEAD, fontSize: 58, position: "relative", zIndex: 2 }}>
          ROADMAPS ALL THE WAY DOWN.
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 1640,
          top: 120,
          ...MONO,
          fontSize: 16,
          color: GREY,
          transform: "rotate(4deg)",
          opacity: interpolate(frame, [90, 96], [0, 1], clamp),
        }}
      >
        SEND HELP.
      </div>
    </Paper>
  );
};

/* ------------------------------- L12 ------------------------------- */

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP"];

export const L12Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const idx = Math.min(8, Math.floor(Math.max(0, frame - 2) / 4));
  const flip = 1 - Math.abs(((frame - 2) % 4) - 2) * 0.04;

  return (
    <Paper>
      <Fig n={12} note="TIME WELL SPENT" />

      <div style={{ position: "absolute", left: 120, top: 160, transform: `rotate(-2deg) scaleX(${flip})`, transformOrigin: "left center" }}>
        <Sheet x={0} y={0} w={420} h={480} delay={0} rotate={0} fill={SURFACE}>
          <div style={{ ...MONO, fontSize: 16, color: GREY }}>MONTH {idx + 1} / 9</div>
          <div style={{ ...HEAD, fontSize: 118, marginTop: 22 }}>{MONTHS[idx]}</div>
          <div style={{ ...MONO, fontSize: 18, color: GREY, marginTop: 2 }}>2026</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 10, marginTop: 28 }}>
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: 22,
                  height: 22,
                  border: `2px solid ${INK}`,
                  borderRadius: 99,
                  background: i % 7 === 3 ? YELLOW : "transparent",
                }}
              />
            ))}
          </div>
        </Sheet>
      </div>

      {/* roadmap tower */}
      <div style={{ position: "absolute", left: 700, top: 250 }}>
        {Array.from({ length: 8 }).map((_, i) => {
          const d = 34 + i * 4;
          const s = interpolate(frame, [d, d + 8], [0.8, 1], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i * 5,
                top: -i * 12,
                width: 620,
                height: 430,
                background: SURFACE,
                border: `3px solid ${INK}`,
                boxShadow: "5px 5px 0 rgba(20,20,20,0.18)",
                transform: `rotate(${(i % 3) * 1.2 - 1.2}deg) scale(${s})`,
                opacity: Math.min(1, s),
                padding: 24,
                boxSizing: "border-box",
              }}
            >
              <div style={{ ...MONO, fontSize: 15, color: GREY }}>ROADMAP #{i + 1}</div>
              <div style={{ marginTop: 22 }}>
                {[92, 78, 86, 60].map((w, j) => (
                  <div key={j} style={{ height: 8, background: AGED, width: `${w}%`, marginBottom: 12 }} />
                ))}
              </div>
            </div>
          );
        })}
        <div
          style={{
            position: "absolute",
            left: 180,
            top: -60,
            zIndex: 30,
            transform: "rotate(-4deg)",
            opacity: interpolate(frame, [66, 72], [0, 1], clamp),
          }}
        >
          <Sticky x={0} y={0} w={330} rotate={4} delay={66} bg={YELLOW}>
            <div style={{ ...HEAD, fontSize: 30, lineHeight: 1 }}>CERTIFIED ROADMAPPER</div>
            <svg width={220} height={54} style={{ marginTop: 4 }}>
              <Ink
                d="M14 27 A22 22 0 1 0 58 27 A22 22 0 1 0 14 27"
                delay={72}
                dur={9}
                w={5}
                color={RED}
              />
              <Ink d="M26 27 L34 36 L50 16" delay={78} dur={6} w={5} color={RED} />
            </svg>
          </Sticky>
        </div>
      </div>

      <div style={{ position: "absolute", left: SAFE, top: 730, zIndex: 20 }}>
        <div style={{ ...MONO, fontSize: 22, color: GREY }}>NINE MONTHS LATER.</div>
        <div style={{ ...HEAD, fontSize: 108, marginTop: 6 }}>A LOT.</div>
        <div style={{ position: "relative", marginTop: 2 }}>
          <Marker x={-6} y={10} w={640} h={64} delay={78} />
          <div style={{ ...HEAD, fontSize: 76, position: "relative", zIndex: 2 }}>ABOUT ROADMAPS.</div>
        </div>
      </div>

      {/* coffee */}
      <svg width={260} height={220} style={{ position: "absolute", left: 1470, top: 760 }}>
        <Ink d="M40 90 L150 90 L140 190 L50 190 Z" delay={20} dur={10} w={6} fill={SURFACE} />
        <Ink d="M150 110 C196 110 196 162 146 164" delay={26} dur={8} w={6} />
        <Ink d="M52 210 L146 210" delay={30} dur={5} w={5} />
        <Ink d="M80 60 C70 40 90 30 80 10" delay={34} dur={8} w={4} color={GREY} />
        <Ink d="M112 60 C102 40 122 30 112 10" delay={38} dur={8} w={4} color={GREY} />
      </svg>
    </Paper>
  );
};
