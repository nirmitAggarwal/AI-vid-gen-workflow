import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../data/theme";
import {
  AGED,
  Bubble,
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
  Stamp,
  SURFACE,
  YELLOW,
  clamp,
  useJolt,
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

/* ------------------------------- L13 ------------------------------- */

export const L13Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();

  return (
    <Paper>
      <Fig n={13} note="APPLICATION LOG" />

      <div style={{ position: "absolute", left: SAFE, top: 150, ...MONO, fontSize: 20, color: GREY }}>
        OUTBOUND
      </div>
      <div style={{ position: "absolute", left: SAFE - 6, top: 190 }}>
        <div style={{ ...HEAD, fontSize: 168 }}>400</div>
        <div style={{ ...MONO, fontSize: 22, color: GREY, marginTop: 8 }}>APPLICATIONS</div>
      </div>
      <div style={{ position: "absolute", left: SAFE - 6, top: 460 }}>
        <div style={{ ...HEAD, fontSize: 168, color: RED }}>2</div>
        <div style={{ ...MONO, fontSize: 22, color: RED, marginTop: 8 }}>REPLIES</div>
      </div>
      <div style={{ position: "absolute", left: SAFE, top: 740, ...MONO, fontSize: 18, color: GREY }}>
        RESPONSE RATE: 0.5%
      </div>
      <div style={{ position: "absolute", left: SAFE, top: 790, width: 620, height: 26, border: `3px solid ${INK}` }}>
        <div style={{ width: "0.5%", height: "100%", background: RED }} />
      </div>

      <div style={{ position: "absolute", left: 860, top: 190 }}>
        {Array.from({ length: 20 }).map((_, row) => (
          <div
            key={row}
            style={{
              display: "flex",
              gap: 32,
              height: 42,
              alignItems: "center",
              opacity: interpolate(frame, [row * 1.2, row * 1.2 + 5], [0, 1], clamp),
            }}
          >
            {Array.from({ length: 20 }).map((__, col) => (
              <div
                key={col}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 99,
                  background: INK,
                  opacity: 0.55,
                }}
              />
            ))}
          </div>
        ))}
      </div>

      {[
        [9, 9],
        [14, 13],
      ].map(([r, c], i) => {
        const x = 860 + c * 42 + 5;
        const y = 190 + r * 42 + 5;
        return (
          <div key={i}>
            <div
              style={{
                position: "absolute",
                left: x - 7,
                top: y - 7,
                width: 24,
                height: 24,
                borderRadius: 99,
                background: YELLOW,
                border: `2px solid ${INK}`,
                transform: `scale(${1 + Math.sin((frame + i * 10) / 8) * 0.12})`,
              }}
            />
            <svg width={220} height={110} style={{ position: "absolute", left: x - 6, top: y + 12 }}>
              <Ink d={`M3 3 C40 40 80 34 104 26`} delay={44 + i * 6} dur={8} w={3} />
              <text
                x={112}
                y={32}
                fontFamily={THEME.fonts.mono}
                fontSize={15}
                fill={RED}
                letterSpacing="1"
              >
                REPLY 0{i + 1}
              </text>
            </svg>
          </div>
        );
      })}
    </Paper>
  );
};

/* ------------------------------- L14 ------------------------------- */

const Letter: React.FC<{ kindly?: boolean; delay: number; x: number; y: number; rotate: number }> = ({
  kindly = false,
  delay,
  x,
  y,
  rotate,
}) => (
  <Sheet x={x} y={y} w={800} h={560} rotate={rotate} delay={delay} fill={SURFACE}>
    <div style={{ ...MONO, fontSize: 16, color: GREY }}>CAREERS@BIGCORP.COM</div>
    <div style={{ ...HEAD, fontSize: 30, marginTop: 12, letterSpacing: "0.02em" }}>APPLICATION UPDATE</div>
    <div
      style={{
        marginTop: 22,
        fontFamily: THEME.fonts.body,
        fontWeight: 600,
        fontSize: 24,
        lineHeight: 1.55,
        color: INK,
      }}
    >
      Dear candidate,
      <br />
      <br />
      We regret to inform you{kindly ? (
        <span style={{ color: RED, textDecoration: "underline" }}>, kindly, </span>
      ) : (
        " "
      )}
      that your application was not successful.
      <br />
      After careful consideration, we have decided to move forward with other candidates.
      <br />
      <br />
      Regards,
      <br />
      Human Resources
    </div>

  </Sheet>
);

export const L14Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();

  return (
    <Paper>
      <Fig n={14} note="INBOX" />

      <Letter x={100} y={160} delay={0} rotate={-2} />
      <Letter x={1010} y={210} delay={40} rotate={3} kindly />

      <Stamp text="REJECTED" x={430} y={520} size={96} rotate={-9} delay={14} />
      <Stamp text="REJECTED" x={1340} y={570} size={96} rotate={7} delay={54} />

      <div
        style={{
          position: "absolute",
          left: 1470,
          top: 790,
          ...MONO,
          fontSize: 19,
          color: RED,
          transform: "rotate(3deg)",
          opacity: interpolate(frame, [76, 82], [0, 1], clamp),
        }}
      >
        BETTER GRAMMAR. ↑
      </div>

      <div style={{ position: "absolute", left: 96, top: 850, ...MONO, fontSize: 19, color: GREY }}>
        ONE REJECTION. AND ONE REJECTION WITH BETTER GRAMMAR.
      </div>
    </Paper>
  );
};

/* ------------------------------- L15 ------------------------------- */

export const L15Scene: React.FC<SceneProps> = () => {
  const jolt = useJolt(40, 10, 6);

  return (
    <Paper>
      <Fig n={15} note="OPPORTUNITY" />

      <div style={{ position: "absolute", left: SAFE - 6, top: 280 }}>
        <Marker x={-8} y={88} w={420} h={120} delay={14} />
        <div style={{ ...HEAD, fontSize: 128, position: "relative", zIndex: 2 }}>ENTRY</div>
        <div style={{ ...HEAD, fontSize: 128, position: "relative", zIndex: 2 }}>LEVEL.</div>
      </div>
      <div style={{ position: "absolute", left: SAFE, top: 610, ...MONO, fontSize: 18, color: GREY }}>
        THE DOOR IS THIS WIDE.
      </div>

      <Sheet x={680} y={150} w={980} h={660} rotate={-1} delay={0}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ ...MONO, fontSize: 18, color: GREY }}>JOB OPENING</div>
          <div style={{ ...MONO, fontSize: 14, border: `2px solid ${INK}`, padding: "3px 10px" }}>
            FULL TIME
          </div>
        </div>
        <div style={{ ...HEAD, fontSize: 62, marginTop: 18, textTransform: "none", fontFamily: THEME.fonts.body, fontWeight: 700 }}>
          Entry Level Developer
        </div>
        <div style={{ ...MONO, fontSize: 18, color: GREY, marginTop: 18, lineHeight: 2.1 }}>
          LOCATION: ANYWHERE
          <br />
          SALARY: COMPETITIVE
          <br />
          OPENINGS: 1
        </div>

        <div style={{ ...MONO, fontSize: 15, color: GREY, lineHeight: 1.9, marginTop: 14 }}>
          REQUIREMENTS
          <br />· REACT · NODE · CLOUD · AI
          <br />· 3 SHIPPED PRODUCTS
          <br />· PROVEN LEADERSHIP
        </div>

        <div style={{ position: "absolute", left: 36, bottom: 26, ...MONO, fontSize: 15, color: GREY }}>
          *EXPERIENCE NOT SUPPLIED BY YOUR COLLEGE
        </div>
      </Sheet>

      <Stamp
        text="5+ YEARS EXPERIENCE"
        x={740 + jolt}
        y={520}
        size={66}
        rotate={-7}
        delay={40}
        border={7}
      />
      <CircleScribble cx={1080} cy={566} rx={340} ry={52} rotate={-2} delay={90} dur={16} />

      {/* the too-small door */}
      <svg width={720} height={440} style={{ position: "absolute", left: 330, top: 700 }} aria-hidden>
        <Ink d="M40 60 L40 320 L150 320 L150 60 Z" delay={56} dur={10} w={6} />
        <Ink d="M60 90 L130 90 L130 300 L60 300 Z" delay={60} dur={8} w={3} color={GREY} />
        <Ink d="M136 210 L136 218" delay={64} dur={4} w={7} />

        <Ink d="M300 90 A26 26 0 1 1 300 91" delay={62} dur={7} w={5} />
        <Ink d="M300 118 L292 210" delay={66} dur={5} w={5} />
        <Ink d="M300 140 L270 186" delay={68} dur={5} w={5} />
        <Ink d="M300 140 L330 178" delay={68} dur={5} w={5} />
        <Ink d="M292 210 L258 300 M292 210 L330 300" delay={70} dur={5} w={5} />
        <Ink d="M334 66 L334 30 M334 16 L334 12" delay={78} dur={5} w={6} color={RED} />
      </svg>
      <div
        style={{
          position: "absolute",
          left: 340,
          top: 690,
          ...MONO,
          fontSize: 15,
          color: INK,
          transform: "rotate(-2deg)",
        }}
      >
        ENTRY
      </div>
    </Paper>
  );
};

/* ------------------------------- L16 ------------------------------- */

export const L16Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const travel = interpolate(frame, [40, 62], [0, -1160], clamp);
  const ghost = interpolate(frame, [58, 70], [0, 1], clamp);

  return (
    <Paper>
      <Fig n={16} note="LABOUR MARKET" />

      <div style={{ position: "absolute", left: SAFE - 4, top: 180 }}>
        <div style={{ ...MONO, fontSize: 22, color: GREY }}>FOR A JOB THAT</div>
        <div style={{ ...HEAD, fontSize: 124, marginTop: 4 }}>DIDN'T EXIST.</div>
        <div style={{ width: 700, height: 10, background: RED, marginTop: 6, transform: "rotate(-0.6deg)" }} />
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} aria-hidden>
        <Ink d="M220 600 L1740 600" delay={0} dur={14} w={5} />
        {[
          [300, "2023"],
          [660, "2024"],
          [1020, "2025"],
          [1380, "2026"],
        ].map(([x, label], i) => (
          <g key={label as string}>
            <Ink d={`M${x} 578 L${x} 622`} delay={6 + i * 3} dur={6} w={5} />
            <text
              x={Number(x) - 22}
              y={660}
              fontFamily={THEME.fonts.mono}
              fontSize={19}
              fill={GREY}
              letterSpacing="1"
            >
              {label}
            </text>
          </g>
        ))}
        <Ink d={ellipsePath(1660, 600, 7)} delay={16} dur={4} w={4} color={RED} />
      </svg>

      <div style={{ position: "absolute", left: 1600, top: 668, ...MONO, fontSize: 15, color: RED }}>
        NOW
      </div>

      <div
        style={{
          position: "absolute",
          left: 1430 + travel,
          top: 430,
          width: 300,
          background: SURFACE,
          border: `4px solid ${INK}`,
          boxShadow: "6px 6px 0 rgba(20,20,20,0.25)",
          padding: "16px 18px",
          transform: "rotate(1.5deg)",
          opacity: 1 - ghost,
        }}
      >
        <div style={{ ...MONO, fontSize: 13, color: GREY }}>JOB TITLE</div>
        <div style={{ fontFamily: THEME.fonts.body, fontWeight: 700, fontSize: 26, marginTop: 6 }}>
          AI Prompt Engineer
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 270,
          top: 430,
          width: 300,
          height: 104,
          border: `3px dashed ${GREY}`,
          opacity: ghost,
          boxSizing: "border-box",
        }}
      />

      <svg width={110} height={110} style={{ position: "absolute", left: 370, top: 445 }}>
        <Ink d="M6 6 L82 82" delay={68} dur={7} w={10} color={RED} />
        <Ink d="M82 6 L6 82" delay={74} dur={7} w={10} color={RED} />
      </svg>
    </Paper>
  );
};

/* ------------------------------- L17 ------------------------------- */

export const L17Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();

  return (
    <Paper>
      <Fig n={17} note="INTERVIEW · Q7" />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} aria-hidden>
        {/* floor + desk */}
        <Ink d="M260 800 L1680 800" delay={0} dur={10} w={5} />
        <Ink d="M520 760 L1240 760" delay={4} dur={8} w={7} />
        <Ink d="M560 760 L540 800 M1200 760 L1220 800" delay={8} dur={5} w={4} />

        {/* chairs */}
        <Ink d="M640 760 L640 880 M640 880 L600 940 M640 880 L680 940" delay={10} dur={7} w={5} />
        <Ink d="M560 760 L560 690 L700 690 L700 760" delay={12} dur={8} w={5} />
        <Ink d="M1140 760 L1140 880 M1140 880 L1100 940 M1140 880 L1180 940" delay={12} dur={7} w={5} />
        <Ink d="M1080 760 L1080 700 L1220 700 L1220 760" delay={14} dur={8} w={5} />

        {/* interviewer */}
        <Ink d={ellipsePath(1320, 570, 28)} delay={18} dur={8} w={5} />
        <Ink d="M1320 598 L1320 690" delay={20} dur={6} w={5} />
        <Ink d="M1320 620 L1280 680 M1320 620 L1370 650" delay={22} dur={6} w={5} />
        <Ink d="M1320 690 L1300 760 M1320 690 L1345 760" delay={24} dur={6} w={5} />
        <Ink d="M1270 620 L1370 600 L1370 680 L1270 700 Z" delay={26} dur={8} w={4} fill={SURFACE} />
        <Ink d="M1290 640 L1350 628 M1290 660 L1340 650" delay={30} dur={4} w={3} color={GREY} />

        {/* plant */}
        <Ink d="M320 800 L380 800 L370 900 L330 900 Z" delay={14} dur={8} w={5} fill={AGED} />
        <Ink d="M350 800 C320 760 340 720 360 700 C370 740 360 780 350 800 Z" delay={18} dur={8} w={4} />
        <Ink d="M350 800 C390 750 410 760 420 730" delay={22} dur={7} w={4} />

        {/* clock */}
        <Ink d={ellipsePath(1700, 220, 54)} delay={8} dur={8} w={5} />
        <Ink d="M1700 220 L1700 186 M1700 220 L1724 232" delay={14} dur={5} w={4} />

        {/* HR poster */}
        <Ink d="M130 210 L330 210 L330 380 L130 380 Z" delay={16} dur={8} w={5} fill={SURFACE} />
        <Ink d="M160 250 L300 250" delay={20} dur={5} w={3} color={GREY} />
        <Ink d="M160 280 L280 280" delay={22} dur={5} w={3} color={GREY} />
        <text x={168} y={340} fontFamily={THEME.fonts.heading} fontSize={54} fill={INK}>
          HR
        </text>
      </svg>

      <div style={{ position: "absolute", left: 620, top: 640 }}>
        <svg width={300} height={230} viewBox="0 0 300 344">
          <Rohan x={0} y={0} scale={0.62} delay={28} />
        </svg>
      </div>

      <Bubble x={600} y={150} w={1040} h={250} delay={22} tail="bottom">
        <div
          style={{
            fontFamily: THEME.fonts.body,
            fontWeight: 700,
            fontSize: 48,
            lineHeight: 1.25,
            color: INK,
            opacity: interpolate(frame, [30, 34], [0, 1], clamp),
          }}
        >
          WHERE DO YOU SEE YOURSELF IN{" "}
          <span style={{ color: RED }}>FIVE YEARS?</span>
        </div>
      </Bubble>

      <div style={{ position: "absolute", left: 96, top: 96, ...MONO, fontSize: 17, color: GREY }}>
        ROOM 3B · 11:40 AM
      </div>
    </Paper>
  );
};

const ellipsePath = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy}`;
