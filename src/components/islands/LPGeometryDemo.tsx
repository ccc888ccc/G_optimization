import { useState } from 'react';

const WIDTH = 600;
const HEIGHT = 300;

type Pt = [number, number];

// 固定的凸五邊形（可行域），非亂數——原因見 ConvexHullDemo 的踩坑筆記。
const FEASIBLE: Pt[] = [
  [300, 30],
  [414.1, 112.9],
  [370.5, 247.1],
  [229.5, 247.1],
  [185.9, 112.9],
];

function dot(a: Pt, c: Pt) {
  return a[0] * c[0] + a[1] * c[1];
}

// 把「過某點、方向為 dir」的無限長直線，裁切成落在畫布內的線段。
function clipLineToRect(point: Pt, dir: Pt): [Pt, Pt] | null {
  const [px, py] = point;
  const [dx, dy] = dir;
  const candidates: { t: number; x: number; y: number }[] = [];
  if (dx !== 0) {
    for (const x of [0, WIDTH]) {
      const t = (x - px) / dx;
      const y = py + t * dy;
      if (y >= -1 && y <= HEIGHT + 1) candidates.push({ t, x, y });
    }
  }
  if (dy !== 0) {
    for (const y of [0, HEIGHT]) {
      const t = (y - py) / dy;
      const x = px + t * dx;
      if (x >= -1 && x <= WIDTH + 1) candidates.push({ t, x, y });
    }
  }
  if (candidates.length < 2) return null;
  candidates.sort((a, b) => a.t - b.t);
  const p0 = candidates[0];
  const p1 = candidates[candidates.length - 1];
  return [
    [p0.x, p0.y],
    [p1.x, p1.y],
  ];
}

export default function LPGeometryDemo() {
  const [theta, setTheta] = useState(35); // 度數，固定初始值（非亂數）

  const rad = (theta * Math.PI) / 180;
  const c: Pt = [Math.cos(rad), Math.sin(rad)];
  const perp: Pt = [-c[1], c[0]];

  const dots = FEASIBLE.map((v) => dot(v, c));
  const zMax = Math.max(...dots);
  const zMin = Math.min(...dots);
  const optIndex = dots.indexOf(zMax);

  const LEVELS = 5;
  const lines = Array.from({ length: LEVELS }, (_, i) => {
    const z = zMin + ((zMax - zMin) * i) / (LEVELS - 1);
    const point: Pt = [z * c[0], z * c[1]];
    return { z, seg: clipLineToRect(point, perp), isOpt: i === LEVELS - 1 };
  });

  const center: Pt = [
    FEASIBLE.reduce((s, p) => s + p[0], 0) / FEASIBLE.length,
    FEASIBLE.reduce((s, p) => s + p[1], 0) / FEASIBLE.length,
  ];
  const arrowEnd: Pt = [center[0] + c[0] * 60, center[1] + c[1] * 60];

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: '100%', flex: 1, display: 'block' }}>
        {lines.map((l, i) =>
          l.seg ? (
            <line
              key={i}
              x1={l.seg[0][0]}
              y1={l.seg[0][1]}
              x2={l.seg[1][0]}
              y2={l.seg[1][1]}
              stroke={l.isOpt ? 'var(--accent)' : 'var(--line)'}
              strokeWidth={l.isOpt ? 2.5 : 1}
            />
          ) : null
        )}

        <polygon
          points={FEASIBLE.map((p) => p.join(',')).join(' ')}
          fill="var(--soft)"
          stroke="var(--ink)"
          strokeOpacity={0.35}
          strokeWidth={1.5}
        />

        <line
          x1={center[0]}
          y1={center[1]}
          x2={arrowEnd[0]}
          y2={arrowEnd[1]}
          stroke="var(--accent)"
          strokeWidth={2}
          markerEnd="url(#arrowhead)"
        />
        <defs>
          <marker id="arrowhead" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--accent)" />
          </marker>
        </defs>

        {FEASIBLE.map((p, i) => (
          <circle
            key={i}
            cx={p[0]}
            cy={p[1]}
            r={i === optIndex ? 8 : 4.5}
            fill={i === optIndex ? 'var(--accent)' : 'var(--surface)'}
            stroke={i === optIndex ? 'var(--surface)' : 'var(--muted)'}
            strokeWidth={i === optIndex ? 2 : 1.5}
          />
        ))}
        <text
          x={FEASIBLE[optIndex][0]}
          y={FEASIBLE[optIndex][1] - 14}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={11}
          fontWeight={700}
          fill="var(--accent)"
        >
          x*
        </text>
      </svg>

      <div className="democtl">
        <div className="sldwrap">
          <span className="sldlab mono">方向 θ = {theta}°</span>
          <input
            type="range"
            min={0}
            max={359}
            step={1}
            value={theta}
            onChange={(e) => setTheta(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
