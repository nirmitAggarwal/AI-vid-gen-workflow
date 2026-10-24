import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../data/theme";
import {
  AGED,
  Bubble,
  Fig,
  GREY,
  INK,
  Ink,
  Marker,
  Num,
  Paper,
  RED,
  Rohan,
  SAFE,
  Sticky,
  SURFACE,
  YELLOW,
  BLUE,
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
  letterSpacing: "0.1em",
  textTransform: "uppercase",
};

const ellipsePath = (cx: number, cy: number, rx: number, ry: number) =>
  `M${cx - rx} ${cy} A${rx} ${ry} 0 1 0 ${cx + rx} ${cy} A${rx} ${ry} 0 1 0 ${cx - rx} ${cy}`;

/* ------------------------------- L18 ------------------------------- */

export const L18Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const tick1 = useAnim(36, 8);
  const tick2 = useAnim(62, 12);
  const angle = interpolate(frame, [24, 36, 56, 68], [0, -16, -16, 20], clamp);

  return (
    <Paper>
      <Fig n={18} note="SELF ASSESSMENT" />

      <svg width={600} height={688} viewBox="0 0 300 344" style={{ position: "absolute", left: 60, top: 170 }}>
        <Rohan x={0} y={0} scale={1} delay={0} mood="flat" />
      </svg>

      <Sticky x={980} y={210} w={470} rotate={-3} delay={14} bg={YELLOW}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 58,
              height: 58,
              border: `4px solid ${INK}`,
              background: SURFACE,
              position: "relative",
              flex: "0 0 auto",
            }}
          >
            <svg width={58} height={58} style={{ position: "absolute", left: 0, top: 0 }}>
              <Ink
                d="M12 30 L24 43 L48 12"
                delay={36}
                dur={9}
                w={7}
                color={INK}
                opacity={tick1}
              />
            </svg>
          </div>
          <div style={{ ...HEAD, fontSize: 58 }}>EMPLOYED?</div>
        </div>
      </Sticky>

      <Sticky x={1080} y={520} w={470} rotate={3} delay={24} bg={SURFACE}>
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <div
            style={{
              width: 58,
              height: 58,
              border: `4px solid ${BLUE}`,
              background: SURFACE,
              position: "relative",
              flex: "0 0 auto",
            }}
          >
            <svg width={58} height={58} style={{ position: "absolute", left: 0, top: 0 }}>
              <Ink
                d="M12 30 L24 42 L46 16"
                delay={62}
                dur={12}
                w={7}
                color={BLUE}
                opacity={tick2}
              />
            </svg>
          </div>
          <div style={{ ...HEAD, fontSize: 58 }}>ALIVE?</div>
        </div>
      </Sticky>

      <svg
        width={230}
        height={70}
        viewBox="0 0 230 70"
        style={{
          position: "absolute",
          left: 920,
          top: 430,
          transform: `rotate(${angle}deg)`,
          transformOrigin: "left center",
          opacity: interpolate(frame, [18, 24], [0, 1], clamp),
        }}
      >
        <Ink d="M20 24 L176 24 L176 46 L20 46 Z" delay={20} dur={7} w={4} fill={YELLOW} />
        <Ink d="M176 24 L212 35 L176 46 Z" delay={24} dur={5} w={4} fill={SURFACE} />
        <Ink d="M212 33 L224 35 L212 38" delay={28} dur={4} w={3} />
      </svg>

      <div style={{ position: "absolute", left: 96, top: 890, ...MONO, fontSize: 26, color: GREY }}>
        HOPEFULLY. IDEALLY.
      </div>
    </Paper>
  );
};

/* ------------------------------- L19 ------------------------------- */

export const L19Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const confetti = Array.from({ length: 14 }).map((_, i) => ({
    x: 120 + ((i * 47) % 360),
    y: 340 + ((i * 71) % 300),
    dx: Math.cos(i) * 80,
    dy: 90 + (i % 5) * 30,
    color: [YELLOW, RED, BLUE][i % 3],
    d: 40 + i * 2,
  }));

  return (
    <Paper>
      <Fig n={19} note="FEED" />

      <div style={{ position: "absolute", left: SAFE - 4, top: 260 }}>
        <Marker x={-6} y={6} w={490} h={118} delay={14} />
        <div style={{ ...HEAD, fontSize: 138, position: "relative", zIndex: 2 }}>SEVENTEEN.</div>
      </div>
      <div style={{ position: "absolute", left: SAFE, top: 430, ...MONO, fontSize: 19, color: GREY }}>
        JUST RAISED ONE MILLION DOLLARS
      </div>

      <svg width={345} height={396} viewBox="0 0 300 344" style={{ position: "absolute", left: 100, top: 570 }}>
        <Rohan x={0} y={0} scale={1} delay={30} mood="sad" />
      </svg>

      {/* phone */}
      <div
        style={{
          position: "absolute",
          left: 820,
          top: 90,
          width: 640,
          height: 900,
          border: `7px solid ${INK}`,
          borderRadius: 48,
          background: SURFACE,
          boxShadow: "12px 12px 0 rgba(20,20,20,0.25)",
          overflow: "hidden",
          transform: `translateY(${interpolate(frame, [0, 12], [40, 0], clamp)}px)`,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 220,
            top: 0,
            width: 200,
            height: 26,
            background: INK,
            borderBottomLeftRadius: 18,
            borderBottomRightRadius: 18,
          }}
        />
        <div style={{ position: "absolute", left: 30, top: 60, right: 30, display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 99,
              border: `3px solid ${INK}`,
              background: AGED,
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", left: 18, top: 20, width: 6, height: 6, background: INK, borderRadius: 9 }} />
            <div style={{ position: "absolute", left: 38, top: 20, width: 6, height: 6, background: INK, borderRadius: 9 }} />
            <div style={{ position: "absolute", left: 22, top: 38, width: 18, height: 3, background: INK }} />
          </div>
          <div>
            <div style={{ fontFamily: THEME.fonts.body, fontWeight: 700, fontSize: 21 }}>17-YEAR-OLD FOUNDER</div>
            <div style={{ ...MONO, fontSize: 13, color: GREY }}>2H · STEALTH MODE</div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              width: 26,
              height: 26,
              borderRadius: 99,
              background: BLUE,
              color: THEME.colors.surface,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 17,
              fontWeight: 900,
            }}
          >
            ✓
          </div>
        </div>

        <div style={{ position: "absolute", left: 30, top: 170, ...MONO, fontSize: 15, color: GREY }}>
          ANNOUNCEMENT
        </div>
        <Num
          value={1000000}
          delay={22}
          dur={40}
          prefix="$"
          style={{ position: "absolute", left: 24, top: 196, ...HEAD, fontSize: 96, color: RED }}
        />
        <div style={{ position: "absolute", left: 30, top: 310, ...MONO, fontSize: 18, color: INK }}>
          RAISED · PRESEED
        </div>

        <div style={{ position: "absolute", left: 30, top: 372, right: 30 }}>
          {[
            "Built an app. Dropped out.",
            "Disrupted an industry.",
            "Now hiring 30-year-olds.",
          ].map((line, i) => (
            <div
              key={line}
              style={{
                fontFamily: THEME.fonts.body,
                fontWeight: 600,
                fontSize: 25,
                marginBottom: 10,
                opacity: interpolate(frame, [28 + i * 6, 33 + i * 6], [0, 1], clamp),
              }}
            >
              {line}
            </div>
          ))}
        </div>

        <div style={{ position: "absolute", left: 30, bottom: 60, ...MONO, fontSize: 17, color: GREY }}>
          2,847 LIKES · 412 COMMENTS
        </div>
        <div
          style={{
            position: "absolute",
            left: 30,
            right: 30,
            bottom: 16,
            height: 6,
            background: AGED,
            borderRadius: 9,
          }}
        >
          <div style={{ width: "42%", height: "100%", background: INK, borderRadius: 9 }} />
        </div>

        {confetti.map((c, i) => {
          const p = interpolate(frame, [c.d, c.d + 22], [0, 1], clamp);
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: c.x + p * c.dx,
                top: c.y - p * c.dy,
                width: 12,
                height: 12,
                background: c.color,
                border: `2px solid ${INK}`,
                transform: `rotate(${p * 240}deg)`,
                opacity: 1 - p,
              }}
            />
          );
        })}
      </div>
    </Paper>
  );
};

/* ------------------------------- L20 ------------------------------- */

export const L20Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const dad = interpolate(frame, [16, 36], [0, 250], clamp);
  const cuz = interpolate(frame, [46, 64], [0, 600], clamp);

  return (
    <Paper>
      <Fig n={20} note="FAMILY BENCHMARK" />

      <div style={{ position: "absolute", left: SAFE - 4, top: 220 }}>
        <div style={{ ...MONO, fontSize: 20, color: GREY }}>COUSIN</div>
        <div style={{ ...HEAD, fontSize: 118, color: RED }}>6 WEEKS.</div>
        <div style={{ ...MONO, fontSize: 20, color: GREY, marginTop: 90 }}>DAD</div>
        <div style={{ ...HEAD, fontSize: 88 }}>25 YEARS.</div>
      </div>

      <div
        style={{
          position: "absolute",
          left: 560,
          top: 330,
          width: 120,
          height: 120,
          border: `4px solid ${RED}`,
          borderRadius: 999,
          ...HEAD,
          fontSize: 46,
          color: RED,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transform: "rotate(-8deg)",
          background: SURFACE,
        }}
      >
        VS
      </div>

      <svg width={1100} height={800} style={{ position: "absolute", left: 820, top: 170 }}>
        <Ink d="M60 660 L1040 660" delay={0} dur={12} w={5} />
        <Ink d="M60 660 L60 20" delay={4} dur={10} w={5} />
        <text
          x={-300}
          y={-28}
          transform="rotate(-90)"
          fontFamily={THEME.fonts.mono}
          fontSize={18}
          fill={GREY}
          letterSpacing="2"
        >
          SALARY (ALLEGEDLY)
        </text>
        <Ink d="M60 400 L1040 400" delay={8} dur={8} w={2} dashed color={GREY} />
        <text x={80} y={392} fontFamily={THEME.fonts.mono} fontSize={14} fill={GREY}>
          ENOUGH?
        </text>
      </svg>

      <div
        style={{
          position: "absolute",
          left: 980,
          bottom: 240,
          width: 170,
          height: dad,
          background: AGED,
          border: `4px solid ${INK}`,
        }}
      />
      <div style={{ position: "absolute", left: 940, top: 856, ...MONO, fontSize: 16, color: INK }}>
        DAD · 25 YRS
      </div>

      <div
        style={{
          position: "absolute",
          left: 1360,
          bottom: 240,
          width: 170,
          height: cuz,
          background: YELLOW,
          border: `4px solid ${INK}`,
        }}
      />
      <div style={{ position: "absolute", left: 1320, top: 856, ...MONO, fontSize: 16, color: INK }}>
        COUSIN · 6 WKS
      </div>

      <div
        style={{
          position: "absolute",
          left: 1370,
          bottom: 850,
          ...HEAD,
          fontSize: 54,
          color: RED,
          opacity: interpolate(frame, [60, 66], [0, 1], clamp),
        }}
      >
        ×24
      </div>

      {/* dad + teacup */}
      <svg width={260} height={300} style={{ position: "absolute", left: 740, top: 520 }}>
        <Ink d={ellipsePath(90, 50, 26, 26)} delay={20} dur={6} w={5} />
        <Ink d="M90 76 L90 160" delay={22} dur={5} w={5} />
        <Ink d="M90 100 L60 140 M90 100 L120 130" delay={24} dur={5} w={5} />
        <Ink d="M90 160 L70 210 M90 160 L112 210" delay={26} dur={5} w={5} />
        <Ink d="M150 130 L170 130 L166 170 L154 170 Z" delay={28} dur={6} w={4} />
        <Ink d="M170 138 C186 138 186 158 168 158" delay={30} dur={4} w={4} />
        <Ink d="M152 118 C148 108 158 104 152 94" delay={32} dur={4} w={3} color={GREY} />
        <text x={130} y={70} fontFamily={THEME.fonts.mono} fontSize={22} fill={RED}>
          ?
        </text>
      </svg>

      {/* cousin */}
      <svg width={300} height={300} style={{ position: "absolute", left: 1560, top: 230 }}>
        <Ink d={ellipsePath(70, 40, 26, 26)} delay={54} dur={6} w={5} />
        <Ink d="M70 66 L70 140" delay={56} dur={5} w={5} />
        <Ink d="M70 88 L40 110 M70 88 L100 78" delay={58} dur={5} w={5} />
        <Ink d="M70 140 L50 200 M70 140 L92 200" delay={60} dur={5} w={5} />
        <Ink d="M22 32 C44 10 92 10 118 34" delay={62} dur={7} w={4} />
        <Ink d="M96 24 L118 34 L98 48" delay={66} dur={4} w={3} />
        <text x={40} y={30} fontFamily={THEME.fonts.mono} fontSize={20} fill={INK}>
          :)
        </text>
      </svg>
    </Paper>
  );
};

/* ------------------------------- L21 ------------------------------- */

export const L21Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const steam = Math.sin(frame / 7) * 5;

  return (
    <Paper>
      <Fig n={21} note="DINNER" />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} aria-hidden>
        {/* table */}
        <Ink d={ellipsePath(960, 680, 450, 240)} delay={0} dur={14} w={7} fill={SURFACE} />
        <Ink d={ellipsePath(960, 680, 390, 190)} delay={6} dur={12} w={2} color={GREY} />

        {/* plates */}
        {[
          [760, 600],
          [960, 560],
          [1160, 600],
        ].map(([x, y], i) => (
          <g key={i}>
            <Ink d={ellipsePath(x, y, 80, 48)} delay={10 + i * 4} dur={8} w={5} fill="#FFFDF6" />
            <Ink d={ellipsePath(x, y, 48, 28)} delay={14 + i * 4} dur={7} w={3} color={GREY} />
          </g>
        ))}

        {/* tumblers */}
        <Ink d="M520 600 L560 600 L554 700 L526 700 Z" delay={24} dur={7} w={4} />
        <Ink d="M1400 610 L1440 610 L1434 706 L1406 706 Z" delay={26} dur={7} w={4} />

        {/* parents */}
        <Ink d={ellipsePath(700, 300, 66, 72)} delay={24} dur={9} w={6} />
        <Ink d="M634 286 C660 230 740 230 766 286" delay={28} dur={8} w={7} fill={INK} />
        <Ink d="M700 372 L700 440 M700 440 L640 480 M700 440 L770 480" delay={32} dur={8} w={5} />
        <Ink d="M676 298 L680 298 M720 298 L724 298" delay={34} dur={4} w={6} />
        <Ink d="M684 324 C692 330 708 330 716 324" delay={36} dur={4} w={4} />

        <Ink d={ellipsePath(1230, 286, 66, 72)} delay={28} dur={9} w={6} />
        <Ink d="M1164 272 C1190 216 1270 216 1296 272" delay={32} dur={8} w={7} fill={INK} />
        <Ink d="M1230 358 L1230 426 M1230 426 L1170 466 M1230 426 L1300 466" delay={36} dur={8} w={5} />
        <Ink d="M1206 284 L1210 284 M1250 284 L1254 284" delay={38} dur={4} w={6} />
        <Ink d="M1214 310 C1222 316 1238 316 1246 310" delay={40} dur={4} w={4} />

        {/* Rohan at the near edge */}
        <Ink d={ellipsePath(960, 988, 56, 58)} delay={36} dur={8} w={6} />
        <Ink d="M904 970 C924 932 996 932 1016 970" delay={40} dur={7} w={7} fill={INK} />
        <Ink d="M938 982 L942 982 M978 982 L982 982" delay={42} dur={4} w={6} />
        <Ink d="M946 1008 L974 1008" delay={44} dur={4} w={4} />
        <Ink d="M960 1046 L960 1110" delay={46} dur={5} w={5} />

        {/* steam */}
        {[
          [760, 540],
          [960, 500],
          [1160, 560],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${steam * (i + 1) * 0.4} 0)`}>
            <Ink
              d={`M${x} ${y} C${x - 12} ${y - 30} ${x + 16} ${y - 46} ${x - 2} ${y - 76}`}
              delay={30 + i * 3}
              dur={9}
              w={3}
              color={GREY}
            />
          </g>
        ))}
      </svg>

      {/* dotted empty question */}
      <div
        style={{
          position: "absolute",
          left: 1130,
          top: 108,
          width: 360,
          height: 126,
          border: `4px dashed ${GREY}`,
          borderRadius: 30,
          transform: `rotate(${interpolate(frame, [52, 75], [-4, 2], clamp)}deg) scale(${interpolate(frame, [52, 70], [0.6, 1], clamp)})`,
          opacity: interpolate(frame, [52, 62], [0, 1], clamp),
        }}
      />

      <div style={{ position: "absolute", left: SAFE, top: 880 }}>
        <div style={{ ...HEAD, fontSize: 64 }}>VERY GENTLY.</div>
        <div style={{ ...MONO, fontSize: 17, color: GREY, marginTop: 8 }}>NOBODY IS ANGRY. THAT IS WORSE.</div>
      </div>

      <svg width={90} height={110} style={{ position: "absolute", left: 570, top: 880 }}>
        <Ink d="M45 60 C20 55 20 30 45 30 C70 30 70 55 45 60 Z" delay={76} dur={7} w={3} color={RED} />
        <Ink d="M45 60 L45 96" delay={78} dur={5} w={3} color={RED} />
        <Ink d="M45 74 C32 68 26 78 34 84 C40 88 45 80 45 74 Z" delay={80} dur={5} w={3} color={RED} />
        <Ink d="M45 84 C60 78 64 88 56 94 C50 98 45 90 45 84 Z" delay={82} dur={5} w={3} color={RED} />
      </svg>
    </Paper>
  );
};

/* ------------------------------- L22 ------------------------------- */

export const L22Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const reveal = useAnim(6, 30);
  const underline = useAnim(36, 8);

  return (
    <Paper>
      <Fig n={22} note="DINNER · CONTINUED" />

      <Bubble x={200} y={150} w={1480} h={440} delay={0} tail="bottom">
        <div style={{ clipPath: `inset(-10% ${(1 - reveal) * 100}% -10% -2%)` }}>
          <div
            style={{
              fontFamily: THEME.fonts.body,
              fontWeight: 700,
              fontSize: 76,
              lineHeight: 1.2,
              color: INK,
            }}
          >
            SO WHAT{" "}
            <span style={{ position: "relative", display: "inline-block" }}>
              EXACTLY
              <span
                style={{
                  position: "absolute",
                  left: -4,
                  right: -4,
                  bottom: -6,
                  height: 7,
                  background: RED,
                  transform: `scaleX(${underline})`,
                  transformOrigin: "left center",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: -4,
                  right: -4,
                  bottom: -18,
                  height: 5,
                  background: RED,
                  transform: `scaleX(${underline})`,
                  transformOrigin: "left center",
                }}
              />
            </span>{" "}
            IS IT THAT YOU DO?
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            right: 40,
            bottom: 20,
            ...HEAD,
            fontSize: 190,
            color: RED,
            transform: "rotate(6deg)",
            opacity: interpolate(frame, [46, 52], [0, 1], clamp),
          }}
        >
          ?
        </div>
      </Bubble>

      <svg width={300} height={340} viewBox="0 0 300 344" style={{ position: "absolute", left: 1520, top: 700 }}>
        <Rohan x={0} y={0} scale={0.8} delay={20} mood="flat" />
      </svg>


    </Paper>
  );
};
