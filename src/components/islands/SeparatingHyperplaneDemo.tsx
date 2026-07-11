import { useRef, useState } from 'react';
import { polygonHull } from 'd3-polygon';

const WIDTH = 600;
const HEIGHT = 300;
const PAD = 22;
const POINT_R = 6.5;

type Pt = [number, number];

// 固定初始座標（非亂數）：理由同 ConvexHullDemo，避免 SSR/client hydration mismatch。
const INITIAL_A: Pt[] = [
  [70, 60],
  [150, 40],
  [200, 110],
  [140, 160],
  [60, 140],
];

const INITIAL_B: Pt[] = [
  [420, 70],
  [520, 60],
  [560, 140],
  [480, 190],
  [400, 150],
];

function dist2(a: Pt, b: Pt) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

// 找兩點集之間距離最近的一對點（brute force，點數少所以沒問題）。
function closestPair(A: Pt[], B: Pt[]): [Pt, Pt] {
  let best: [Pt, Pt] = [A[0], B[0]];
  let bestD = Infinity;
  for (const a of A) {
    for (const b of B) {
      const d = dist2(a, b);
      if (d < bestD) {
        bestD = d;
        best = [a, b];
      }
    }
  }
  return best;
}

// 把「過中點、垂直於 a-b」的無限長直線，裁切成落在 [0,W]x[0,H] 內的線段。
function perpendicularBisectorSegment(a: Pt, b: Pt): [Pt, Pt] | null {
  const mx = (a[0] + b[0]) / 2;
  const my = (a[1] + b[1]) / 2;
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  if (len < 1e-6) return null;
  // 方向向量：把 (dx,dy) 旋轉 90 度
  const ux = -dy / len;
  const uy = dx / len;

  const ts: number[] = [];
  // 與四條邊界線求交，收集落在範圍內的 t
  const candidates: { t: number; x: number; y: number }[] = [];
  if (ux !== 0) {
    for (const x of [0, WIDTH]) {
      const t = (x - mx) / ux;
      const y = my + t * uy;
      if (y >= -1 && y <= HEIGHT + 1) candidates.push({ t, x, y });
    }
  }
  if (uy !== 0) {
    for (const y of [0, HEIGHT]) {
      const t = (y - my) / uy;
      const x = mx + t * ux;
      if (x >= -1 && x <= WIDTH + 1) candidates.push({ t, x, y });
    }
  }
  if (candidates.length < 2) return null;
  candidates.sort((p, q) => p.t - q.t);
  const p0 = candidates[0];
  const p1 = candidates[candidates.length - 1];
  return [
    [p0.x, p0.y],
    [p1.x, p1.y],
  ];
}

function clamp(v: number, lo: number, hi: number) {
  return Math.min(Math.max(v, lo), hi);
}

export default function SeparatingHyperplaneDemo() {
  const [A, setA] = useState<Pt[]>(INITIAL_A);
  const [B, setB] = useState<Pt[]>(INITIAL_B);
  const dragRef = useRef<{ set: 'A' | 'B'; index: number } | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const hullA = A.length >= 3 ? polygonHull(A) : A;
  const hullB = B.length >= 3 ? polygonHull(B) : B;
  const [closeA, closeB] = closestPair(A, B);
  const seg = perpendicularBisectorSegment(closeA, closeB);

  function toSvgPoint(clientX: number, clientY: number): Pt {
    const svg = svgRef.current;
    if (!svg) return [0, 0];
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * WIDTH;
    const y = ((clientY - rect.top) / rect.height) * HEIGHT;
    return [clamp(x, PAD, WIDTH - PAD), clamp(y, PAD, HEIGHT - PAD)];
  }

  function handlePointerDown(set: 'A' | 'B', index: number, e: React.PointerEvent) {
    dragRef.current = { set, index };
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    const next = toSvgPoint(e.clientX, e.clientY);
    const setter = drag.set === 'A' ? setA : setB;
    setter((pts) => pts.map((p, i) => (i === drag.index ? next : p)));
  }

  function handlePointerUp() {
    dragRef.current = null;
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {hullA.length >= 3 && (
          <polygon points={hullA.map((p) => p.join(',')).join(' ')} fill="var(--soft)" stroke="var(--accent)" strokeWidth={1.5} />
        )}
        {hullB.length >= 3 && (
          <polygon
            points={hullB.map((p) => p.join(',')).join(' ')}
            fill="none"
            stroke="var(--muted)"
            strokeWidth={1.5}
            strokeDasharray="4 3"
          />
        )}

        {seg && (
          <line x1={seg[0][0]} y1={seg[0][1]} x2={seg[1][0]} y2={seg[1][1]} stroke="var(--accent)" strokeWidth={2} />
        )}
        <line
          x1={closeA[0]}
          y1={closeA[1]}
          x2={closeB[0]}
          y2={closeB[1]}
          stroke="var(--faint)"
          strokeWidth={1}
          strokeDasharray="2 3"
        />

        {A.map((p, i) => (
          <circle
            key={`a${i}`}
            cx={p[0]}
            cy={p[1]}
            r={POINT_R}
            fill="var(--accent)"
            stroke="var(--surface)"
            strokeWidth={1.5}
            style={{ cursor: 'grab' }}
            onPointerDown={(e) => handlePointerDown('A', i, e)}
          />
        ))}
        {B.map((p, i) => (
          <circle
            key={`b${i}`}
            cx={p[0]}
            cy={p[1]}
            r={POINT_R}
            fill="var(--surface)"
            stroke="var(--muted)"
            strokeWidth={2}
            style={{ cursor: 'grab' }}
            onPointerDown={(e) => handlePointerDown('B', i, e)}
          />
        ))}
      </svg>
      <div style={{ position: 'absolute', top: 10, left: 14, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>
        實心 = C（拖曳） · 空心虛線 = D（拖曳）
      </div>
    </div>
  );
}
