import { useEffect, useRef, useState } from 'react';
import { polygonHull, polygonCentroid } from 'd3-polygon';

const WIDTH = 600;
const HEIGHT = 300;
const PAD = 28;
const POINT_R = 7;

type Pt = [number, number];

function randomPoints(n: number): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    pts.push([PAD + Math.random() * (WIDTH - 2 * PAD), PAD + Math.random() * (HEIGHT - 2 * PAD)]);
  }
  return pts;
}

// 固定的初始座標（非亂數）：SSR 與 client hydration 都要算出同一組點，
// 用 Math.random() 當初始狀態會讓兩邊算出不同結果，造成 React hydration mismatch。
// 亂數只用在使用者按下「重新產生」之後（純 client 端事件，不受 SSR 影響）。
const INITIAL_POINTS: Pt[] = [
  [120, 60],
  [340, 40],
  [520, 110],
  [560, 220],
  [400, 270],
  [180, 250],
  [60, 160],
  [300, 150],
];

export default function ConvexHullDemo() {
  const [mounted, setMounted] = useState(false);
  const [points, setPoints] = useState<Pt[]>(INITIAL_POINTS);
  const dragIndex = useRef<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const hull = points.length >= 3 ? polygonHull(points) : null;
  const hullSet = new Set((hull ?? []).map((p) => `${p[0]},${p[1]}`));

  function toSvgPoint(clientX: number, clientY: number): Pt {
    const svg = svgRef.current;
    if (!svg) return [0, 0];
    const rect = svg.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * WIDTH;
    const y = ((clientY - rect.top) / rect.height) * HEIGHT;
    return [Math.min(Math.max(x, PAD), WIDTH - PAD), Math.min(Math.max(y, PAD), HEIGHT - PAD)];
  }

  function handlePointerDown(e: React.PointerEvent<SVGCircleElement>, i: number) {
    dragIndex.current = i;
    (e.target as Element).setPointerCapture(e.pointerId);
  }

  function handlePointerMove(e: React.PointerEvent<SVGSVGElement>) {
    if (dragIndex.current === null) return;
    const next = toSvgPoint(e.clientX, e.clientY);
    setPoints((pts) => pts.map((p, i) => (i === dragIndex.current ? next : p)));
  }

  function handlePointerUp() {
    dragIndex.current = null;
  }

  function reshuffle() {
    setPoints(randomPoints(6 + Math.floor(Math.random() * 4)));
  }

  function addPoint() {
    setPoints((pts) => [...pts, [PAD + Math.random() * (WIDTH - 2 * PAD), PAD + Math.random() * (HEIGHT - 2 * PAD)]]);
  }

  const centroid = hull ? polygonCentroid(hull) : null;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        style={{ width: '100%', height: '100%', display: 'block', touchAction: 'none', cursor: 'default' }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {hull && (
          <polygon
            points={hull.map((p) => p.join(',')).join(' ')}
            fill="var(--soft)"
            stroke="var(--accent)"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        )}
        {centroid && (
          <text x={centroid[0]} y={centroid[1]} textAnchor="middle" dominantBaseline="middle" fontFamily="var(--font-mono)" fontSize={11} fill="var(--muted)">
            conv(S)
          </text>
        )}
        {points.map((p, i) => {
          const onHull = hullSet.has(`${p[0]},${p[1]}`);
          return (
            <circle
              key={i}
              cx={p[0]}
              cy={p[1]}
              r={POINT_R}
              fill={onHull ? 'var(--accent)' : 'var(--surface)'}
              stroke="var(--accent)"
              strokeWidth={2}
              style={{ cursor: 'grab' }}
              onPointerDown={(e) => handlePointerDown(e, i)}
            />
          );
        })}
      </svg>
      <div style={{ position: 'absolute', top: 10, left: 14, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--muted)' }}>
        拖曳圓點試試看
      </div>
      <div style={{ position: 'absolute', bottom: 10, right: 12, display: 'flex', gap: 8 }}>
        <button type="button" className="demo-expand" onClick={addPoint}>
          + 加點
        </button>
        <button type="button" className="demo-expand" onClick={reshuffle}>
          ↻ 重新產生
        </button>
      </div>
      {!mounted && (
        <div className="loadstate">
          <span>◌ 互動元件載入中…</span>
        </div>
      )}
    </div>
  );
}
