import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { THEME } from "../data/theme";
import {
  AGED,
  Check,
  Cross,
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
  BLUE,
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

const ellipsePath = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} A${r} ${r} 0 1 1 ${cx + r} ${cy} A${r} ${r} 0 1 1 ${cx - r} ${cy}`;

/* ------------------------------- L23 ------------------------------- */

export const L23Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const slide = interpolate(frame, [60, 70], [0, -330], clamp);
  const fadeTech = interpolate(frame, [54, 62], [1, 0], clamp);

  return (
    <Paper>
      <Fig n={23} note="ROOT CAUSE" />

      <div style={{ position: "absolute", left: SAFE, top: 140 }}>
        <div style={{ ...MONO, fontSize: 20, color: GREY }}>THE TECHNOLOGY</div>
        <div style={{ ...HEAD, fontSize: 96 }}>NOT THE</div>
        <div style={{ ...HEAD, fontSize: 96 }}>PROBLEM.</div>
      </div>

      <div style={{ position: "absolute", left: SAFE, top: 470 }}>
        {[
          ["chip", 0, 0],
          ["rocket", 250, 0],
          ["code", 0, 250],
          ["neural", 250, 250],
        ].map(([kind, dx, dy], i) => (
          <div
            key={kind as string}
            style={{
              position: "absolute",
              left: Number(dx),
              top: Number(dy),
              width: 190,
              height: 190,
              border: `4px solid ${INK}`,
              background: SURFACE,
              opacity: fadeTech,
              transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)`,
            }}
          >
            <svg width={190} height={190}>
              {kind === "chip" && (
                <>
                  <Ink d="M50 50 L140 50 L140 140 L50 140 Z" delay={6 + i * 3} dur={7} w={5} />
                  <Ink d="M80 80 L110 80 L110 110 L80 110 Z" delay={9 + i * 3} dur={5} w={5} fill={YELLOW} />
                  {[65, 85, 105, 125].map((p) => (
                    <React.Fragment key={p}>
                      <Ink d={`M50 ${p} L28 ${p}`} delay={12 + i * 3} dur={3} w={4} />
                      <Ink d={`M140 ${p} L162 ${p}`} delay={12 + i * 3} dur={3} w={4} />
                      <Ink d={`M${p} 50 L${p} 28`} delay={13 + i * 3} dur={3} w={4} />
                      <Ink d={`M${p} 140 L${p} 162`} delay={13 + i * 3} dur={3} w={4} />
                    </React.Fragment>
                  ))}
                </>
              )}
              {kind === "rocket" && (
                <>
                  <Ink d="M95 30 C130 60 130 110 95 145 C60 110 60 60 95 30 Z" delay={9 + i * 3} dur={8} w={5} fill={SURFACE} />
                  <Ink d="M80 120 L60 160 M110 120 L130 160" delay={13 + i * 3} dur={5} w={4} />
                  <Ink d="M95 145 C88 160 102 172 95 186" delay={15 + i * 3} dur={5} w={4} color={RED} />
                  <Ink d={ellipsePath(95, 75, 14)} delay={14 + i * 3} dur={5} w={4} />
                </>
              )}
              {kind === "code" && (
                <>
                  <Ink d="M70 55 L38 95 L70 135" delay={9 + i * 3} dur={7} w={6} />
                  <Ink d="M120 55 L152 95 L120 135" delay={10 + i * 3} dur={7} w={6} />
                  <Ink d="M108 45 L82 145" delay={13 + i * 3} dur={6} w={5} color={RED} />
                </>
              )}
              {kind === "neural" && (
                <>
                  <Ink d={ellipsePath(60, 60, 16)} delay={9 + i * 3} dur={5} w={4} fill={YELLOW} />
                  <Ink d={ellipsePath(135, 70, 16)} delay={11 + i * 3} dur={5} w={4} fill={SURFACE} />
                  <Ink d={ellipsePath(95, 140, 16)} delay={13 + i * 3} dur={5} w={4} fill={SURFACE} />
                  <Ink d="M74 68 L120 72 M68 75 L88 126 M132 84 L104 128" delay={15 + i * 3} dur={6} w={3} />
                </>
              )}
              <Check x={152} y={34} size={30} delay={14 + i * 4} color={BLUE} w={6} />
            </svg>
          </div>
        ))}
      </div>

      {/* syllabus book */}
      <div
        style={{
          position: "absolute",
          left: 1120 + slide,
          top: 260,
          width: 520,
          height: 560,
          transform: `rotate(${interpolate(frame, [60, 70], [4, -2], clamp)}deg)`,
          opacity: interpolate(frame, [16, 24], [0, 1], clamp),
        }}
      >
        <svg width={520} height={560}>
          <Ink d="M40 40 L440 40 L440 520 L40 520 Z" delay={16} dur={10} w={7} fill={AGED} />
          <Ink d="M40 40 L70 60 L70 540 L40 520" delay={20} dur={8} w={6} fill={SURFACE} />
          <Ink d="M70 60 L440 60 M70 540 L440 520" delay={24} dur={6} w={4} />
          <React.Fragment>
            <text x={110} y={190} fontFamily={THEME.fonts.heading} fontSize={68} fill={INK} fontWeight={900}>
              SYLLABUS
            </text>
            <text x={110} y={260} fontFamily={THEME.fonts.heading} fontSize={62} fill={RED} fontWeight={900}>
              2004
            </text>
          </React.Fragment>
          <Ink d="M110 300 L400 300 M110 330 L360 330 M110 360 L390 360" delay={28} dur={6} w={3} color={GREY} />
          {/* cobwebs */}
          <Ink d="M60 60 C90 80 110 110 120 140 M60 60 C80 60 110 70 140 80" delay={30} dur={7} w={2} color={GREY} />
          <Ink d="M440 500 C410 480 390 450 380 420 M440 500 C420 500 390 490 360 480" delay={34} dur={7} w={2} color={GREY} />
          <Cross x={150} y={210} size={120} delay={38} color={RED} w={12} />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 800,
          opacity: interpolate(frame, [66, 72], [0, 1], clamp),
        }}
      >
        <Marker x={-6} y={6} w={520} h={76} delay={74} />
        <div style={{ ...HEAD, fontSize: 92, position: "relative", zIndex: 2 }}>THE SYLLABUS.</div>
      </div>
    </Paper>
  );
};

/* ------------------------------- L24 ------------------------------- */

const PermissionSlip: React.FC<{ delay: number }> = ({ delay }) => (
  <Sheet x={0} y={0} w={880} h={500} delay={delay} rotate={-1.5}>
    <div style={{ ...HEAD, fontSize: 58 }}>PERMISSION TO LEARN</div>
    <div style={{ ...MONO, fontSize: 17, color: GREY, marginTop: 10 }}>FORM 27-B · DEPARTMENT OF APPROVAL</div>
    <div style={{ marginTop: 34, ...MONO, fontSize: 22, lineHeight: 2.5, color: INK }}>
      NAME: ROHAN
      <br />
      PURPOSE: <span style={{ borderBottom: `3px solid ${INK}`, paddingRight: 200 }} />
      <br />
      SIGNATURE: <span style={{ borderBottom: `3px solid ${INK}`, paddingRight: 200 }} />
    </div>
    <div style={{ position: "absolute", right: 60, bottom: 40, ...MONO, fontSize: 16, color: GREY }}>
      VALID FOR ONE (1) ACADEMIC YEAR
    </div>
  </Sheet>
);

export const L24Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const split = interpolate(frame, [30, 44], [0, 1], clamp);
  const drop = interpolate(frame, [40, 56], [0, 700], clamp);
  const rise = interpolate(frame, [42, 56], [140, 0], clamp);

  return (
    <Paper>
      <Fig n={24} note="AUTHORISATION" />

      <div
        style={{
          position: "absolute",
          left: 480,
          top: 180,
          width: 880,
          height: 500,
          clipPath: "inset(0 50% 0 0)",
          transform: `translate(${-split * 220}px, ${drop * split}px) rotate(${-split * 16}deg)`,
          opacity: 1 - split,
        }}
      >
        <div style={{ transform: "translate(0,0)" }}>
          <PermissionSlip delay={0} />
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          left: 480,
          top: 180,
          width: 880,
          height: 500,
          clipPath: "inset(0 0 0 50%)",
          transform: `translate(${split * 240}px, ${drop * split}px) rotate(${split * 14}deg)`,
          opacity: 1 - split,
        }}
      >
        <PermissionSlip delay={0} />
      </div>

      <div style={{ opacity: 1 - split }}>
        <Stamp text="PENDING" x={1060} y={200} size={76} rotate={-8} delay={14} />
      </div>

      <svg width={40} height={560} style={{ position: "absolute", left: 925, top: 160, opacity: 1 - split }}>
        <Ink
          d="M20 4 L12 60 L30 96 L10 150 L28 210 L10 268 L30 330 L12 390 L28 450 L14 510 L20 556"
          delay={24}
          dur={10}
          w={6}
          color={RED}
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: 1200,
          top: 470,
          transform: `translateY(${rise}px)`,
          opacity: interpolate(frame, [34, 42], [0, 1], clamp),
        }}
      >
        <svg width={420} height={482} viewBox="0 0 300 344">
          <Rohan x={0} y={0} scale={1} delay={30} crossed mood="happy" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 780,
          opacity: interpolate(frame, [52, 58], [0, 1], clamp),
        }}
      >
        <Marker x={-6} y={6} w={660} h={102} delay={56} />
        <div style={{ ...HEAD, fontSize: 116, position: "relative", zIndex: 2 }}>NOT REQUIRED.</div>
      </div>
    </Paper>
  );
};

/* ------------------------------- L25 ------------------------------- */

export const L25Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const fly2 = interpolate(frame, [38, 48], [0, 1], clamp);
  const fly3 = interpolate(frame, [58, 68], [0, 1], clamp);

  return (
    <Paper>
      <Fig n={25} note="SHIPPING LOG" />

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} aria-hidden>
        <Ink d="M180 840 L1760 840" delay={0} dur={12} w={6} />
        <Ink d="M600 840 L600 900 M580 900 L620 900" delay={6} dur={5} w={5} />
        <Ink d="M1080 320 L1640 320" delay={4} dur={10} w={6} />
        <Ink d="M1100 320 L1100 370 M1620 320 L1620 370" delay={8} dur={5} w={5} />

        {/* laptop */}
        <Ink d="M540 560 L1000 560 L1000 820 L540 820 Z" delay={2} dur={10} w={6} fill={SURFACE} />
        <Ink d="M540 820 L500 870 L1040 870 L1000 820" delay={8} dur={8} w={6} fill={AGED} />
        <Ink d="M580 600 L960 600 L960 780 L580 780 Z" delay={10} dur={8} w={4} color={GREY} />

        {/* lamp */}
        <Ink d="M300 840 L380 840 L370 900 L310 900 Z" delay={14} dur={7} w={5} fill={AGED} />
        <Ink d="M340 840 L340 620 L420 540" delay={16} dur={8} w={5} />
        <Ink d="M380 515 L470 560 L430 585 Z" delay={20} dur={6} w={5} fill={YELLOW} />
      </svg>

      {/* project 01 on the laptop */}
      <div
        style={{
          position: "absolute",
          left: 630,
          top: 630,
          width: 290,
          height: 130,
          border: `3px solid ${INK}`,
          background: SURFACE,
          transform: "rotate(-1deg)",
          opacity: interpolate(frame, [14, 20], [0, 1], clamp),
        }}
      >
        <div style={{ ...MONO, fontSize: 14, color: GREY, padding: "10px 12px 0" }}>PROJECT 01</div>
        <div style={{ fontFamily: THEME.fonts.body, fontWeight: 700, fontSize: 24, padding: "6px 12px" }}>
          a thing that works
        </div>
        <svg width={290} height={130} style={{ position: "absolute", inset: 0 }}>
          <Check x={240} y={92} size={32} delay={22} color={BLUE} />
        </svg>
      </div>

      {/* project 02 flying to shelf */}
      <div
        style={{
          position: "absolute",
          left: 800 + fly2 * 320,
          top: 700 - fly2 * 500,
          width: 230,
          height: 120,
          border: `3px solid ${INK}`,
          background: YELLOW,
          transform: `rotate(${fly2 * -6}deg) scale(${1 - fly2 * 0.25})`,
          opacity: fly2,
          padding: 12,
          boxSizing: "border-box",
        }}
      >
        <div style={{ ...MONO, fontSize: 13, color: INK }}>PROJECT 02</div>
        <div style={{ fontFamily: THEME.fonts.body, fontWeight: 700, fontSize: 20, marginTop: 6 }}>a second thing</div>
      </div>
      <div style={{ position: "absolute", left: 1120, top: 120, opacity: interpolate(frame, [46, 50], [0, 1], clamp) }}>
        <Stamp text="SHIPPED" x={0} y={0} size={34} rotate={-6} delay={46} border={4} pad="4px 10px" />
      </div>

      {/* project 03 */}
      <div
        style={{
          position: "absolute",
          left: 1080 + fly3 * 350,
          top: 660 - fly3 * 470,
          width: 210,
          height: 116,
          border: `3px solid ${INK}`,
          background: SURFACE,
          transform: `rotate(${fly3 * 5}deg) scale(${1 - fly3 * 0.22})`,
          opacity: fly3,
          padding: 12,
          boxSizing: "border-box",
        }}
      >
        <div style={{ ...MONO, fontSize: 13, color: GREY }}>PROJECT 03</div>
        <div style={{ fontFamily: THEME.fonts.body, fontWeight: 700, fontSize: 20, marginTop: 6 }}>and another</div>
      </div>
      <div style={{ position: "absolute", left: 1430, top: 110, opacity: interpolate(frame, [66, 70], [0, 1], clamp) }}>
        <Stamp text="SHIPPED" x={0} y={0} size={34} rotate={5} delay={66} border={4} pad="4px 10px" />
      </div>

      <div style={{ position: "absolute", left: 1230, top: 540 }}>
        <div style={{ ...HEAD, fontSize: 84 }}>ONE SMALL</div>
        <div style={{ ...HEAD, fontSize: 84 }}>THING.</div>
        <div style={{ ...HEAD, fontSize: 62, marginTop: 24, color: RED }}>THEN ONE MORE.</div>
      </div>
    </Paper>
  );
};

/* ------------------------------- L26 ------------------------------- */

export const L26Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const sweep = interpolate(frame, [54, 66], [0, -1], clamp);

  return (
    <Paper>
      <Fig n={26} note="MOTIVATION" />

      <div
        style={{
          position: "absolute",
          left: 150,
          top: 200,
          transform: `translate(${sweep * 900}px, ${sweep * 200}px) rotate(${sweep * 40}deg)`,
          opacity: 1 + sweep,
        }}
      >
        <Sheet x={0} y={0} w={620} h={520} rotate={-3} delay={0} fill={SURFACE}>
          <div style={{ ...MONO, fontSize: 16, color: GREY }}>UNIVERSITY EXAMINATION</div>
          <div style={{ ...HEAD, fontSize: 74, marginTop: 16 }}>MARKS: 87/100</div>
          <div style={{ marginTop: 24 }}>
            {[90, 80, 86, 70].map((w, i) => (
              <div key={i} style={{ height: 10, background: AGED, width: `${w}%`, marginBottom: 14 }} />
            ))}
          </div>
          <div style={{ ...MONO, fontSize: 15, color: GREY, marginTop: 14 }}>GRADE: A · VERY PROUD PARENTS</div>
          <svg width={620} height={520} style={{ position: "absolute", inset: 0 }}>
            <Cross x={340} y={90} size={150} delay={18} color={RED} w={12} />
          </svg>
        </Sheet>
      </div>

      <div
        style={{
          position: "absolute",
          left: 810,
          top: 240,
          transform: `translate(${sweep * 900}px, ${sweep * 150}px) rotate(${sweep * -35}deg)`,
          opacity: 1 + sweep,
        }}
      >
        <Sheet x={0} y={0} w={620} h={520} rotate={2.5} delay={4} fill={SURFACE}>
          <div style={{ ...HEAD, fontSize: 64 }}>RESUME</div>
          <div style={{ ...MONO, fontSize: 14, color: GREY, marginTop: 6 }}>2 PAGES · 1 OBJECTIVE</div>
          <div style={{ marginTop: 24 }}>
            {[60, 88, 74, 82, 68].map((w, i) => (
              <div key={i} style={{ height: 9, background: AGED, width: `${w}%`, marginBottom: 13 }} />
            ))}
          </div>
          <div style={{ ...MONO, fontSize: 15, color: GREY, marginTop: 16 }}>OBJECTIVE: PASSIONATE</div>
          <svg width={620} height={520} style={{ position: "absolute", inset: 0 }}>
            <Cross x={340} y={90} size={150} delay={34} color={RED} w={12} />
          </svg>
        </Sheet>
      </div>

      <div
        style={{
          position: "absolute",
          left: 730,
          top: 400,
          width: 460,
          height: 250,
          border: `4px solid ${INK}`,
          background: YELLOW,
          transform: `rotate(-2deg) scale(${interpolate(frame, [64, 70], [0.6, 1], clamp)})`,
          opacity: interpolate(frame, [64, 69], [0, 1], clamp),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "8px 8px 0 rgba(20,20,20,0.25)",
          zIndex: 20,
        }}
      >
        <div style={{ ...HEAD, fontSize: 92 }}>BUILT.</div>
      </div>

      <div style={{ position: "absolute", left: SAFE, top: 900, ...MONO, fontSize: 21, color: GREY }}>
        NOT FOR MARKS. NOT FOR THE RESUME.
      </div>
    </Paper>
  );
};

/* ------------------------------- L27 ------------------------------- */

export const L27Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const handDown = interpolate(frame, [0, 14], [-260, 0], clamp);
  const leave = interpolate(frame, [54, 70], [0, -560], clamp);
  const leaveP = interpolate(frame, [54, 70], [0, 1], clamp);

  return (
    <Paper>
      <Fig n={27} note="ENTITLEMENT" />

      <div style={{ position: "absolute", left: SAFE - 4, top: 280 }}>
        <div style={{ ...HEAD, fontSize: 118 }}>NOT HANDED</div>
        <div style={{ ...HEAD, fontSize: 118 }}>TO HIM.</div>
        <div style={{ width: 700, height: 10, background: RED, marginTop: 10, transform: "rotate(-0.6deg)" }} />
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} aria-hidden>
        {/* giant hand + box */}
        <g transform={`translate(0 ${handDown + leave})`} opacity={1 - leaveP}>
          <Ink d="M1040 -40 L1040 260 L1300 260 L1300 -40" delay={0} dur={10} w={7} fill={AGED} />
          <Ink d="M1040 260 L1300 260 L1300 380 C1300 440 1240 470 1170 470 C1100 470 1040 440 1040 380 Z" delay={4} dur={10} w={7} fill={SURFACE} />
          {[1070, 1120, 1170, 1220].map((x, i) => (
            <Ink
              key={x}
              d={`M${x} 380 C${x - 12} 430 ${x + 12} 460 ${x} 500`}
              delay={8 + i * 3}
              dur={6}
              w={6}
            />
          ))}

          {/* gift box */}
          <g transform={`translate(1080 500) rotate(${Math.sin(frame / 6) * 2})`}>
            <Ink d="M0 40 L220 40 L220 240 L0 240 Z" delay={10} dur={9} w={7} fill={YELLOW} />
            <Ink d="M0 100 L220 100" delay={14} dur={5} w={5} />
            <Ink d="M110 40 L110 240" delay={16} dur={6} w={5} />
            <Ink d="M110 40 C70 0 40 20 60 44 C80 62 108 48 110 40 C112 48 140 62 160 44 C180 20 150 0 110 40" delay={18} dur={7} w={6} fill={RED} />
            <text x={40} y={200} fontFamily={THEME.fonts.heading} fontSize={46} fill={INK} fontWeight={900}>
              FUTURE
            </text>
          </g>
        </g>


        {/* dashed outline left behind */}
        <g opacity={interpolate(frame, [60, 66], [0, 1], clamp)}>
          <Ink d="M1080 540 L1300 540 L1300 740 L1080 740 Z" delay={60} dur={12} w={5} dashed color={GREY} />
        </g>
      </svg>

      <div style={{ position: "absolute", left: 470, top: 560 }}>
        <svg width={390} height={448} viewBox="0 0 300 344">
          <Rohan x={0} y={0} scale={1} delay={20} mood="flat" />
        </svg>
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 930,
          ...MONO,
          fontSize: 18,
          color: GREY,
          opacity: interpolate(frame, [66, 72], [0, 1], clamp),
        }}
      >
        STILL WAITING.
      </div>
    </Paper>
  );
};

/* ------------------------------- L28 ------------------------------- */

export const L28Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const jolt = useJolt(30, 10, 6);
  const stack = (at: number) => interpolate(frame, [at, at + 6], [-80, 0], clamp);

  return (
    <Paper>
      <Fig n={28} note="CONSTRUCTION" />

      <div
        style={{
          position: "absolute",
          left: 220,
          top: 130,
          width: 1480,
          height: 820,
          background: SURFACE,
          border: `4px solid ${BLUE}`,
          transform: "rotate(-0.4deg)",
          backgroundImage: `linear-gradient(${BLUE}22 1px, transparent 1px), linear-gradient(90deg, ${BLUE}22 1px, transparent 1px)`,
          backgroundSize: "46px 46px",
          opacity: interpolate(frame, [0, 5], [0, 1], clamp),
        }}
      />

      <div style={{ position: "absolute", left: 300, top: 180, ...HEAD, fontSize: 86 }}>
        IT HAS TO
        <br />
        BE BUILT.
      </div>

      {/* Rohan in a hard hat */}
      <div style={{ position: "absolute", left: 330, top: 480 }}>
        <svg width={330} height={380} viewBox="0 0 300 344">
          <Rohan x={0} y={0} scale={1} delay={4} mood="happy" />
          <path d="M70 46 C82 2 218 2 230 46 L230 58 L70 58 Z" fill={YELLOW} stroke={INK} strokeWidth={5} />
          <path d="M54 60 L246 60" stroke={INK} strokeWidth={6} strokeLinecap="round" />
        </svg>
      </div>

      {/* tower */}
      {[
        ["SKILL", 10, 0],
        ["PROJECT", 16, 1],
        ["REPS", 22, 2],
      ].map(([label, at, i]) => (
        <div
          key={label as string}
          style={{
            position: "absolute",
            left: 1000,
            top: 720 - Number(i) * 100,
            width: 300,
            height: 90,
            border: `4px solid ${INK}`,
            background: i === 2 ? YELLOW : SURFACE,
            transform: `translateY(${stack(Number(at))}px)`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            ...HEAD,
            fontSize: 34,
          }}
        >
          {label}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: 1030,
          top: 400,
          width: 240,
          height: 90,
          border: `4px solid ${INK}`,
          background: INK,
          color: THEME.colors.surface,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...HEAD,
          fontSize: 30,
          transform: `translateY(${stack(28)}px)`,
        }}
      >
        FUTURE
      </div>

      <Stamp
        text="BUILT."
        x={1020 + jolt}
        y={250}
        size={110}
        rotate={-8}
        delay={30}
        filled
        color={INK}
        border={7}
      />
    </Paper>
  );
};

/* ------------------------------- L29 ------------------------------- */

export const L29Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();
  const jolt = useJolt(12, 12, 7);

  return (
    <Paper>
      <Fig n={29} note="VERDICT" />

      <div style={{ position: "absolute", left: SAFE, top: 250 }}>
        <div style={{ ...MONO, fontSize: 22, color: GREY }}>THE SYLLABUS IS</div>
        <div style={{ ...HEAD, fontSize: 188, color: RED, marginTop: 4 }}>OUTDATED.</div>
        <div style={{ ...MONO, fontSize: 18, color: GREY, marginTop: 16 }}>
          LAST REVISION: BEFORE YOUR LAPTOP HAD A BATTERY.
        </div>
      </div>

      <div style={{ position: "absolute", left: 1240, top: 180, transform: "rotate(5deg)" }}>
        <svg width={500} height={560}>
          <Ink d="M40 30 L400 30 L400 500 L40 500 Z" delay={0} dur={8} w={7} fill={AGED} />
          <Ink d="M40 30 L70 50 L70 520 L40 500" delay={4} dur={7} w={6} fill={SURFACE} />
          <Ink d="M70 50 L400 50 M70 520 L400 500" delay={8} dur={5} w={4} />
          <text x={100} y={190} fontFamily={THEME.fonts.heading} fontSize={58} fill={INK} fontWeight={900}>
            SYLLABUS
          </text>
          <text x={100} y={250} fontFamily={THEME.fonts.heading} fontSize={54} fill={RED} fontWeight={900}>
            2004
          </text>
          <Ink d="M100 290 L360 290 M100 320 L320 320" delay={12} dur={5} w={3} color={GREY} />
          <Ink d="M60 50 C90 70 110 100 116 130" delay={14} dur={6} w={2} color={GREY} />
          <Ink d="M400 470 C370 450 350 420 344 390" delay={16} dur={6} w={2} color={GREY} />
        </svg>
      </div>

      <div style={{ position: "absolute", left: 1030, top: 360 }}>
        <Stamp
          text="OUTDATED"
          x={0 + jolt}
          y={0}
          size={128}
          rotate={-8}
          delay={12}
          border={8}
        />
      </div>

      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }} aria-hidden>
        {[
          [300, 900],
          [560, 820],
          [900, 940],
          [1500, 880],
          [1750, 800],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y - Math.sin((frame + i * 20) / 20) * 8} r={3} fill={GREY} />
        ))}
      </svg>
    </Paper>
  );
};

/* ------------------------------- L30 ------------------------------- */

export const L30Scene: React.FC<SceneProps> = () => {
  const frame = useCurrentFrame();

  return (
    <Paper>
      <Fig n={30} note="THE END (FOR NOW)" />

      <div style={{ position: "absolute", left: 1020, top: 150 }}>
        <svg width={555} height={636} viewBox="0 0 300 344">
          <Rohan x={0} y={0} scale={1} delay={0} crossed mood="happy" />
        </svg>
      </div>

      <div style={{ position: "absolute", left: SAFE - 8, top: 520 }}>
        <div style={{ ...HEAD, fontSize: 140 }}>HE</div>
        <div style={{ position: "relative" }}>
          <Marker x={-8} y={10} w={560} h={190} delay={10} />
          <div style={{ ...HEAD, fontSize: 236, position: "relative", zIndex: 2 }}>ISN&apos;T.</div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          left: SAFE,
          top: 910,
          ...MONO,
          fontSize: 22,
          color: GREY,
          opacity: interpolate(frame, [18, 26], [0, 1], clamp),
        }}
      >
        FOR EVERY ROHAN.
      </div>
    </Paper>
  );
};
