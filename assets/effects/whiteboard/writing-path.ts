/**
 * Turns a rasterised text mask into a pen path.
 *
 * The trick that makes this font-agnostic: we never look at font outlines or
 * stroke data. We rasterise whatever the font renders, thin the ink down to a
 * 1px skeleton, and walk that skeleton. The result is a path that follows the
 * actual curves of the glyphs — for any font, weight, or script.
 *
 * Pure module: no DOM, no React. Runs in the browser and in Node (tests).
 */

export type Point = { x: number; y: number };

export type InkMask = {
  width: number;
  height: number;
  /** 1 = ink, 0 = empty, row-major. */
  data: Uint8Array;
};

export type PathSegment = {
  points: Point[];
  /** Pen is in the air: moving between strokes, no ink should be revealed. */
  travel: boolean;
  /** Index of the segment's first point inside `WritingPath.points`. */
  offset: number;
};

export type WritingPath = {
  segments: PathSegment[];
  /** Every point of every segment, in order. */
  points: Point[];
  /** Cumulative distance travelled at each point, in px. */
  cumulative: number[];
  /** Cumulative *animation* time at each point (pen-in-air is weighted down). */
  time: number[];
  /** Total path length in px. */
  length: number;
  /** Total weighted time; progress 0..1 maps onto this. */
  duration: number;
  /** Brush diameter needed to reveal the whole glyph stroke. */
  brushWidth: number;
  inkArea: number;
  skeletonLength: number;
};

export type WritingPathOptions = {
  /** Reveal brush diameter in px. Derived from stroke thickness by default. */
  brushWidth?: number;
  /** Simplification tolerance in px. Smaller = smoother, bigger path. */
  simplify?: number;
  /** Strokes shorter than this (px) are junction noise and get dropped. */
  minStroke?: number;
  /**
   * How much time a pen-in-air move costs per pixel compared to drawing.
   * 0 = teleport, 1 = same speed as drawing. Default 0.35.
   */
  travelWeight?: number;
};

const N8 = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
];

/* ------------------------------------------------------------------ */
/* 1. Zhang-Suen thinning                                              */
/* ------------------------------------------------------------------ */

function thin(mask: InkMask): Uint8Array {
  const { width: w, height: h } = mask;
  const img = new Uint8Array(mask.data);
  if (w < 3 || h < 3) return img;

  const marker = new Uint8Array(w * h);
  let changed = true;

  const px = (x: number, y: number) => img[y * w + x];

  while (changed) {
    changed = false;

    for (let step = 0; step < 2; step += 1) {
      marker.fill(0);
      let marked = 0;

      for (let y = 1; y < h - 1; y += 1) {
        for (let x = 1; x < w - 1; x += 1) {
          const i = y * w + x;
          if (img[i] === 0) continue;

          const p2 = px(x, y - 1);
          const p3 = px(x + 1, y - 1);
          const p4 = px(x + 1, y);
          const p5 = px(x + 1, y + 1);
          const p6 = px(x, y + 1);
          const p7 = px(x - 1, y + 1);
          const p8 = px(x - 1, y);
          const p9 = px(x - 1, y - 1);

          const neighbours = p2 + p3 + p4 + p5 + p6 + p7 + p8 + p9;
          if (neighbours < 2 || neighbours > 6) continue;

          const transitions =
            (p2 === 0 && p3 === 1 ? 1 : 0) +
            (p3 === 0 && p4 === 1 ? 1 : 0) +
            (p4 === 0 && p5 === 1 ? 1 : 0) +
            (p5 === 0 && p6 === 1 ? 1 : 0) +
            (p6 === 0 && p7 === 1 ? 1 : 0) +
            (p7 === 0 && p8 === 1 ? 1 : 0) +
            (p8 === 0 && p9 === 1 ? 1 : 0) +
            (p9 === 0 && p2 === 1 ? 1 : 0);
          if (transitions !== 1) continue;

          if (step === 0) {
            if (p2 * p4 * p6 !== 0 || p4 * p6 * p8 !== 0) continue;
          } else if (p2 * p4 * p8 !== 0 || p2 * p6 * p8 !== 0) {
            continue;
          }

          marker[i] = 1;
          marked += 1;
        }
      }

      if (marked > 0) {
        changed = true;
        for (let i = 0; i < img.length; i += 1) {
          if (marker[i] === 1) img[i] = 0;
        }
      }
    }
  }

  return img;
}

/* ------------------------------------------------------------------ */
/* 1b. Spur pruning + stroke thickness                                  */
/* ------------------------------------------------------------------ */

/**
 * Thinning leaves tiny hairs where the glyph has corners and where the
 * anti-aliased edge is noisy. Each hair would become its own "stroke" with a
 * pen hop, so cut off branches that die within a few pixels.
 */
function pruneSpurs(skel: Uint8Array, w: number, h: number, maxSpur: number): void {
  const degreeOf = (i: number): number => {
    const x = i % w;
    const y = (i - x) / w;
    let d = 0;
    for (const [dx, dy] of N8) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
      if (skel[ny * w + nx] === 1) d += 1;
    }
    return d;
  };

  for (let pass = 0; pass < 4; pass += 1) {
    const remove = new Set<number>();

    for (let i = 0; i < skel.length; i += 1) {
      if (skel[i] === 0 || degreeOf(i) !== 1) continue;

      const branch: number[] = [i];
      let prev = -1;
      let cur = i;
      let hitJunction = false;

      for (let step = 0; step < maxSpur; step += 1) {
        const x = cur % w;
        const y = (cur - x) / w;
        let next = -1;
        for (const [dx, dy] of N8) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= w || ny >= h) continue;
          const n = ny * w + nx;
          if (skel[n] === 1 && n !== prev) {
            next = n;
            break;
          }
        }
        if (next === -1) break;

        const d = degreeOf(next);
        if (d >= 3) {
          hitJunction = true;
          break;
        }
        branch.push(next);
        prev = cur;
        cur = next;
      }

      if (hitJunction) for (const pixel of branch) remove.add(pixel);
    }

    if (remove.size === 0) break;
    for (const pixel of remove) skel[pixel] = 0;
  }
}

/** Chamfer distance from every ink pixel to the closest empty pixel. */
function distanceTransform(mask: InkMask): Float32Array {
  const { width: w, height: h, data } = mask;
  const dist = new Float32Array(w * h);
  const infty = 1e9;
  for (let i = 0; i < dist.length; i += 1) dist[i] = data[i] ? infty : 0;

  const diag = 1.41421356;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      const i = y * w + x;
      if (dist[i] === 0) continue;
      let best = dist[i];
      if (x > 0) best = Math.min(best, dist[i - 1] + 1);
      if (y > 0) best = Math.min(best, dist[i - w] + 1);
      if (x > 0 && y > 0) best = Math.min(best, dist[i - w - 1] + diag);
      if (x < w - 1 && y > 0) best = Math.min(best, dist[i - w + 1] + diag);
      dist[i] = best;
    }
  }

  for (let y = h - 1; y >= 0; y -= 1) {
    for (let x = w - 1; x >= 0; x -= 1) {
      const i = y * w + x;
      if (dist[i] === 0) continue;
      let best = dist[i];
      if (x < w - 1) best = Math.min(best, dist[i + 1] + 1);
      if (y < h - 1) best = Math.min(best, dist[i + w] + 1);
      if (x < w - 1 && y < h - 1) best = Math.min(best, dist[i + w + 1] + diag);
      if (x > 0 && y < h - 1) best = Math.min(best, dist[i + w - 1] + diag);
      dist[i] = best;
    }
  }

  return dist;
}

/** 95th percentile of stroke half-width measured on the skeleton. */
function strokeThickness(mask: InkMask, skel: Uint8Array): number {
  const dist = distanceTransform(mask);
  const widths: number[] = [];
  for (let i = 0; i < skel.length; i += 1) {
    if (skel[i] === 1) widths.push(dist[i]);
  }
  if (widths.length === 0) return 0;
  widths.sort((a, b) => a - b);
  return widths[Math.min(widths.length - 1, Math.floor(widths.length * 0.95))] * 2;
}

/* ------------------------------------------------------------------ */
/* 2. Skeleton -> polylines                                            */
/* ------------------------------------------------------------------ */

function skeletonToPolylines(skel: Uint8Array, w: number, h: number): Point[][] {
  const at = (x: number, y: number) =>
    x < 0 || y < 0 || x >= w || y >= h ? 0 : skel[y * w + x];

  const point = (i: number): Point => ({ x: i % w, y: Math.floor(i / w) });

  const neighbourIndexes = (i: number): number[] => {
    const x = i % w;
    const y = (i - x) / w;
    const out: number[] = [];
    for (const [dx, dy] of N8) {
      if (at(x + dx, y + dy) === 1) out.push((y + dy) * w + (x + dx));
    }
    return out;
  };

  const used = new Set<number>();
  const edgeKey = (a: number, b: number) => (a < b ? a : b) * w * h + (a < b ? b : a);

  /** Pixels with exactly one 8-neighbour are stroke ends. */
  const endpoints: number[] = [];
  for (let i = 0; i < skel.length; i += 1) {
    if (skel[i] === 0) continue;
    if (neighbourIndexes(i).length === 1) endpoints.push(i);
  }

  // Writers go left to right, so start from the leftmost stroke ends.
  endpoints.sort((a, b) => a % w - (b % w) || Math.floor(a / w) - Math.floor(b / w));

  const walk = (start: number): Point[] => {
    const pts: Point[] = [point(start)];
    let prev = -1;
    let cur = start;
    let hx = 0;
    let hy = 0;

    for (;;) {
      const cx = cur % w;
      const cy = (cur - cx) / w;
      let next = -1;
      let bestScore = -Infinity;

      for (const n of neighbourIndexes(cur)) {
        if (n === prev) continue;
        if (used.has(edgeKey(cur, n))) continue;
        const nx = n % w;
        const ny = (n - nx) / w;
        let score = 0;
        if (hx !== 0 || hy !== 0) {
          const dx = nx - cx;
          const dy = ny - cy;
          const len = Math.hypot(dx, dy) || 1;
          // Keep going in the direction we were already moving: that walks
          // straight through junctions instead of stopping at them.
          score = (dx / len) * hx + (dy / len) * hy;
        }
        if (score > bestScore) {
          bestScore = score;
          next = n;
        }
      }

      if (next === -1) break;

      const nx = next % w;
      const ny = (next - nx) / w;
      const dx = nx - cx;
      const dy = ny - cy;
      const len = Math.hypot(dx, dy) || 1;
      hx = hx * 0.35 + (dx / len) * 0.65;
      hy = hy * 0.35 + (dy / len) * 0.65;
      const norm = Math.hypot(hx, hy) || 1;
      hx /= norm;
      hy /= norm;

      used.add(edgeKey(cur, next));
      prev = cur;
      cur = next;
      pts.push(point(cur));
    }

    return pts;
  };

  const polylines: Point[][] = [];

  for (const start of endpoints) {
    if (neighbourIndexes(start).every((n) => used.has(edgeKey(start, n)))) continue;
    polylines.push(walk(start));
  }

  // Closed loops have no endpoint at all — pick them up anywhere.
  for (let i = 0; i < skel.length; i += 1) {
    if (skel[i] === 0) continue;
    const ns = neighbourIndexes(i);
    if (ns.length === 0) {
      const p = point(i);
      polylines.push([p, { x: p.x + 0.01, y: p.y }]);
      continue;
    }
    if (ns.every((n) => used.has(edgeKey(i, n)))) continue;
    polylines.push(walk(i));
  }

  return polylines;
}

/* ------------------------------------------------------------------ */
/* 3. Geometry helpers                                                 */
/* ------------------------------------------------------------------ */

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

/**
 * Smooth corners (Chaikin) — skeleton walks are staircases and would make the
 * pen visibly zig-zag at 1px scale.
 */
function chaikin(points: Point[], iterations: number): Point[] {
  let pts = points;
  for (let it = 0; it < iterations; it += 1) {
    if (pts.length < 3) return pts;
    const out: Point[] = [pts[0]];
    for (let i = 0; i < pts.length - 1; i += 1) {
      const a = pts[i];
      const b = pts[i + 1];
      out.push({ x: a.x * 0.75 + b.x * 0.25, y: a.y * 0.75 + b.y * 0.25 });
      out.push({ x: a.x * 0.25 + b.x * 0.75, y: a.y * 0.25 + b.y * 0.75 });
    }
    out.push(pts[pts.length - 1]);
    pts = out;
  }
  return pts;
}

/** Ramer-Douglas-Peucker — keeps the shape, drops the point spam. */
function simplifyPath(points: Point[], tolerance: number): Point[] {
  if (points.length < 3 || tolerance <= 0) return points;

  const keep = new Uint8Array(points.length);
  keep[0] = 1;
  keep[points.length - 1] = 1;

  const stack: Array<[number, number]> = [[0, points.length - 1]];

  while (stack.length > 0) {
    const [start, end] = stack.pop() as [number, number];
    const a = points[start];
    const b = points[end];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy);

    let maxDist = -1;
    let maxIndex = -1;

    for (let i = start + 1; i < end; i += 1) {
      const p = points[i];
      const d =
        len === 0
          ? distance(p, a)
          : Math.abs(dy * p.x - dx * p.y + b.x * a.y - b.y * a.x) / len;
      if (d > maxDist) {
        maxDist = d;
        maxIndex = i;
      }
    }

    if (maxDist > tolerance && maxIndex !== -1) {
      keep[maxIndex] = 1;
      stack.push([start, maxIndex], [maxIndex, end]);
    }
  }

  const out: Point[] = [];
  for (let i = 0; i < points.length; i += 1) if (keep[i] === 1) out.push(points[i]);
  return out;
}

function polylineLength(points: Point[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i += 1) total += distance(points[i - 1], points[i]);
  return total;
}

function measureSkeleton(polylines: Point[][]): number {
  return polylines.reduce((sum, line) => sum + polylineLength(line), 0);
}

function countInk(mask: InkMask): number {
  let count = 0;
  for (let i = 0; i < mask.data.length; i += 1) if (mask.data[i] !== 0) count += 1;
  return count;
}

/* ------------------------------------------------------------------ */
/* 4. Order strokes like a writer                                      */
/* ------------------------------------------------------------------ */

function orderStrokes(lines: Point[][]): PathSegment[] {
  const remaining = lines.slice();
  const result: PathSegment[] = [];
  let cursor: Point | null = null;

  // Writers start on the left. Pick the stroke endpoint with the smallest x.
  let startIndex = 0;
  let startReversed = false;
  let startX = Infinity;
  for (let i = 0; i < remaining.length; i += 1) {
    const first = remaining[i][0];
    const last = remaining[i][remaining[i].length - 1];
    if (first.x < startX) {
      startX = first.x;
      startIndex = i;
      startReversed = false;
    }
    if (last.x < startX) {
      startX = last.x;
      startIndex = i;
      startReversed = true;
    }
  }

  while (remaining.length > 0) {
    let pickIndex = startIndex;
    let reversed = startReversed;
    let bestCost = Infinity;

    if (cursor) {
      for (let i = 0; i < remaining.length; i += 1) {
        const line = remaining[i];
        const head = line[0];
        const tail = line[line.length - 1];
        const headCost = distance(cursor, head);
        const tailCost = distance(cursor, tail);
        if (headCost < bestCost) {
          bestCost = headCost;
          pickIndex = i;
          reversed = false;
        }
        if (tailCost < bestCost) {
          bestCost = tailCost;
          pickIndex = i;
          reversed = true;
        }
      }
    }

    const line = remaining.splice(pickIndex, 1)[0];
    const stroke = reversed ? line.slice().reverse() : line;

    if (cursor) {
      result.push({ points: [cursor, stroke[0]], travel: true, offset: 0 });
    }

    result.push({ points: stroke, travel: false, offset: 0 });
    cursor = stroke[stroke.length - 1];
    startIndex = 0;
    startReversed = false;
  }

  return result;
}

/* ------------------------------------------------------------------ */
/* 5. Public API                                                       */
/* ------------------------------------------------------------------ */

export function buildWritingPath(
  mask: InkMask,
  options: WritingPathOptions = {},
): WritingPath | null {
  if (mask.width < 2 || mask.height < 2) return null;

  const minStroke = Math.max(1.5, options.minStroke ?? 2.5);

  const inkArea = countInk(mask);
  if (inkArea === 0) return null;

  const skeleton = thin(mask);
  const thickness = strokeThickness(mask, skeleton);
  pruneSpurs(skeleton, mask.width, mask.height, Math.max(3, Math.round(thickness * 0.5)));

  const traced = skeletonToPolylines(skeleton, mask.width, mask.height);
  // Junction clusters produce piles of 1px fragments. They are already covered
  // by the strokes that meet there, and each one would cost a pen hop.
  const rawLines = traced.filter((line) => polylineLength(line) >= minStroke);
  if (rawLines.length === 0) return null;

  const skeletonLength = measureSkeleton(rawLines);
  if (skeletonLength <= 0) return null;

  const ordered = orderStrokes(rawLines);
  const tolerance = options.simplify ?? 0.35;

  const segments: PathSegment[] = ordered.map((segment) => {
    const points = segment.travel
      ? segment.points
      : simplifyPath(chaikin(segment.points, 2), tolerance);
    return { points, travel: segment.travel, offset: 0 };
  });

  const points: Point[] = [];
  const cumulative: number[] = [];
  const time: number[] = [];
  const travelWeight = options.travelWeight ?? 0.35;
  let total = 0;
  let elapsed = 0;

  for (const segment of segments) {
    segment.offset = points.length;
    for (let i = 0; i < segment.points.length; i += 1) {
      if (points.length > 0) {
        const step = distance(points[points.length - 1], segment.points[i]);
        total += step;
        elapsed += step * (segment.travel ? travelWeight : 1);
      }
      points.push(segment.points[i]);
      cumulative.push(total);
      time.push(elapsed);
    }
  }

  if (total <= 0) return null;

  const brushWidth =
    options.brushWidth ?? Math.max(1.5, (thickness || inkArea / skeletonLength) * 1.05);

  return {
    segments,
    points,
    cumulative,
    time,
    length: total,
    duration: elapsed,
    brushWidth,
    inkArea,
    skeletonLength,
  };
}

/**
 * The part of the writing that is on the board at `progress`.
 * Returns path data split at pen-lift gaps, so travelling between strokes
 * never smears ink across the surface.
 */
export function revealPathData(path: WritingPath, progress: number): string {
  const target = distanceAt(path, progress);
  const parts: string[] = [];
  let penDown = false;

  for (const segment of path.segments) {
    if (segment.offset > 0 && path.cumulative[segment.offset] > target) break;

    for (let i = 0; i < segment.points.length; i += 1) {
      const index = segment.offset + i;
      if (path.cumulative[index] > target) return parts.join("");

      if (segment.travel) {
        penDown = false;
        continue;
      }

      const p = segment.points[i];
      parts.push(`${penDown ? "L" : "M"}${round(p.x)} ${round(p.y)}`);
      penDown = true;
    }

    penDown = false;
  }

  return parts.join("");
}

/**
 * Map 0..1 progress (weighted time) onto distance travelled along the path.
 * Pen-in-air segments are compressed by `travelWeight`, so the hand doesn't
 * crawl between strokes.
 */
function distanceAt(path: WritingPath, progress: number): number {
  const clamped = Math.max(0, Math.min(1, progress));
  const targetTime = path.duration * clamped;

  let low = 0;
  let high = path.time.length - 1;
  while (low < high - 1) {
    const mid = (low + high) >> 1;
    if (path.time[mid] <= targetTime) low = mid;
    else high = mid;
  }

  const span = path.time[high] - path.time[low];
  const t = span > 0 ? (targetTime - path.time[low]) / span : 0;
  return path.cumulative[low] + (path.cumulative[high] - path.cumulative[low]) * t;
}

function pointAtDistance(path: WritingPath, distanceAlong: number): Point {
  if (distanceAlong <= 0) return path.points[0];
  if (distanceAlong >= path.length) return path.points[path.points.length - 1];

  let low = 0;
  let high = path.cumulative.length - 1;
  while (low < high - 1) {
    const mid = (low + high) >> 1;
    if (path.cumulative[mid] <= distanceAlong) low = mid;
    else high = mid;
  }

  const a = path.points[low];
  const b = path.points[low + 1] ?? a;
  const span = path.cumulative[low + 1] - path.cumulative[low];
  const t = span > 0 ? (distanceAlong - path.cumulative[low]) / span : 0;
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

/** Where the nib is, and which way the path is heading, at `progress`. */
export function pointAt(
  path: WritingPath,
  progress: number,
): { x: number; y: number; angle: number } {
  const distanceAlong = distanceAt(path, progress);
  const here = pointAtDistance(path, distanceAlong);
  const ahead = pointAtDistance(path, Math.min(path.length, distanceAlong + 6));
  const behind = pointAtDistance(path, Math.max(0, distanceAlong - 6));
  const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * (180 / Math.PI);

  return { x: here.x, y: here.y, angle };
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}
