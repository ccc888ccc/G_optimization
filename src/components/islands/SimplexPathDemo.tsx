import { useState } from 'react';

const WIDTH = 600;
const HEIGHT = 300;

type Pt = [number, number];

// 固定的凸六邊形（非亂數，理由同 ConvexHullDemo）：頂點依序相鄰，模擬單體法在頂點-邊圖上移動。
const HEX: Pt[] = [
  [420, 150],
  [360, 253.9],
  [240, 253.9],
  [180, 150],
  [240, 46.1],
  [360, 46.1],
];

const C: Pt = [1, -0.4]; // 固定目標方向（往右上）
const START_INDEX = 2; // 故意從離最佳解較遠的頂點出發，才有 pivot 步驟可看

function dot(v: Pt, c: Pt) {
  return v[0] * c[0] + v[1] * c[1];
}

const OBJ = HEX.map((v) => dot(v, C));
const OPT_INDEX = OBJ.indexOf(Math.max(...OBJ));

export default function SimplexPathDemo() {
  const [current, setCurrent] = useState(START_INDEX);
  const [path, setPath] = useState<number[]>([START_INDEX]);
  const [finished, setFinished] = useState(false);

  const center: Pt = [
    HEX.reduce((s, p) => s + p[0], 0) / HEX.length,
    HEX.reduce((s, p) => s + p[1], 0) / HEX.length,
  ];
  const arrowEnd: Pt = [center[0] + C[0] * 70, center[1] + C[1] * 70];

  function step() {
    if (finished) return;
    const n = HEX.length;
    const prevIdx = (current - 1 + n) % n;
    const nextIdx = (current + 1) % n;
    const prevObj = OBJ[prevIdx];
    const nextObj = OBJ[nextIdx];
    const curObj = OBJ[current];
    if (prevObj <= curObj && nextObj <= curObj) {
      setFinished(true);
      return;
    }
    const target = nextObj > prevObj ? nextIdx : prevIdx;
    setCurrent(target);
    setPath((p) => [...p, target]);
  }

  function reset() {
    setCurrent(START_INDEX);
    setPath([START_INDEX]);
    setFinished(false);
  }

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} style={{ width: '100%', flex: 1, display: 'block' }}>
        <polygon
          points={HEX.map((p) => p.join(',')).join(' ')}
          fill="var(--soft)"
          stroke="var(--ink)"
          strokeOpacity={0.35}
          strokeWidth={1.5}
        />

        {path.length > 1 && (
          <polyline
            points={path.map((i) => HEX[i].join(',')).join(' ')}
            fill="none"
            stroke="var(--accent)"
            strokeWidth={2.5}
            strokeOpacity={0.6}
            strokeLinejoin="round"
          />
        )}

        <line
          x1={center[0]}
          y1={center[1]}
          x2={arrowEnd[0]}
          y2={arrowEnd[1]}
          stroke="var(--muted)"
          strokeWidth={1.5}
          markerEnd="url(#arrowhead2)"
        />
        <defs>
          <marker id="arrowhead2" markerWidth={8} markerHeight={8} refX={6} refY={4} orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="var(--muted)" />
          </marker>
        </defs>

        {HEX.map((p, i) => {
          const isCurrent = i === current;
          const isOpt = i === OPT_INDEX;
          return (
            <circle
              key={i}
              cx={p[0]}
              cy={p[1]}
              r={isCurrent ? 9 : isOpt ? 6 : 4.5}
              fill={isCurrent ? 'var(--accent)' : isOpt ? 'var(--surface)' : 'var(--surface)'}
              stroke={isCurrent ? 'var(--surface)' : isOpt ? 'var(--accent)' : 'var(--muted)'}
              strokeWidth={isCurrent ? 2 : isOpt ? 2 : 1.5}
              strokeDasharray={isOpt && !isCurrent ? '3 2' : undefined}
            />
          );
        })}
      </svg>

      <div className="democtl">
        <span className="sldlab mono">
          目前頂點 v{current}（{finished ? '已達最佳解' : '可再 pivot'}） · c·x = {OBJ[current].toFixed(1)}
        </span>
        <button type="button" className="replay" onClick={step} disabled={finished}>
          ▶ 下一步 pivot
        </button>
        <button type="button" className="demo-expand" onClick={reset}>
          ↻ 重置
        </button>
      </div>
    </div>
  );
}
