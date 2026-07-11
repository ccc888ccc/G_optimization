import { useState } from 'react';

// 具體例子（非亂數，固定教學範例，方便對照證明）：
// 原問題：max 2x+3y  s.t. x+y<=4, x+2y<=5, x,y>=0 → 頂點依序 (0,0)(4,0)(3,1)(0,2.5)，最佳在 (3,1)，值 9。
// 對偶：  min 4y1+5y2 s.t. y1+y2>=2, y1+2y2>=3, y1,y2>=0 → 頂點依序 (3,0)(1,1)(0,2)，最佳在 (1,1)，值 9。
const PRIMAL = [
  { p: [0, 0] as [number, number], label: '(0, 0)' },
  { p: [4, 0] as [number, number], label: '(4, 0)' },
  { p: [3, 1] as [number, number], label: '(3, 1)' },
  { p: [0, 2.5] as [number, number], label: '(0, 2.5)' },
];
const PRIMAL_OPT = 2;
const primalObj = (p: [number, number]) => 2 * p[0] + 3 * p[1];

const DUAL = [
  { p: [3, 0] as [number, number], label: '(3, 0)' },
  { p: [1, 1] as [number, number], label: '(1, 1)' },
  { p: [0, 2] as [number, number], label: '(0, 2)' },
];
const DUAL_OPT = 1;
const dualObj = (p: [number, number]) => 4 * p[0] + 5 * p[1];

const SCALE_MAX = 13;
const AXIS_W = 520;
const AXIS_X0 = 40;

function xPos(v: number) {
  return AXIS_X0 + (v / SCALE_MAX) * AXIS_W;
}

export default function StrongDualityDemo() {
  const [pi, setPi] = useState(0);
  const [di, setDi] = useState(0);

  const pv = primalObj(PRIMAL[pi].p);
  const dv = dualObj(DUAL[di].p);
  const bothOptimal = pi === PRIMAL_OPT && di === DUAL_OPT;
  const gap = dv - pv;

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <svg viewBox="0 0 600 200" style={{ width: '100%', flex: 1, display: 'block' }}>
        <line x1={AXIS_X0} y1={100} x2={AXIS_X0 + AXIS_W} y2={100} stroke="var(--line)" strokeWidth={1.5} />
        {Array.from({ length: SCALE_MAX + 1 }, (_, v) => (
          <line key={v} x1={xPos(v)} y1={95} x2={xPos(v)} y2={105} stroke="var(--faint)" strokeWidth={1} />
        ))}
        <text x={xPos(0)} y={122} fontFamily="var(--font-mono)" fontSize={10} fill="var(--muted)">0</text>
        <text x={xPos(SCALE_MAX)} y={122} fontFamily="var(--font-mono)" fontSize={10} fill="var(--muted)" textAnchor="end">
          {SCALE_MAX}
        </text>

        {gap > 0.01 && (
          <line
            x1={xPos(pv)}
            y1={100}
            x2={xPos(dv)}
            y2={100}
            stroke="var(--warn)"
            strokeWidth={4}
            strokeOpacity={0.35}
          />
        )}

        {/* 原問題目標值：三角形往上指 */}
        <path d={`M ${xPos(pv)},70 l -8,14 l 16,0 Z`} fill="var(--accent)" />
        <text x={xPos(pv)} y={62} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill="var(--accent)" fontWeight={700}>
          primal {pv.toFixed(1)}
        </text>

        {/* 對偶目標值：三角形往下指 */}
        <path d={`M ${xPos(dv)},130 l -8,-14 l 16,0 Z`} fill="var(--muted)" />
        <text x={xPos(dv)} y={148} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={11} fill="var(--muted)" fontWeight={700}>
          dual {dv.toFixed(1)}
        </text>

        {bothOptimal && (
          <text x={xPos(pv)} y={185} textAnchor="middle" fontFamily="var(--font-sans)" fontSize={13} fontWeight={700} fill="var(--accent)">
            ✓ 強對偶：兩者相遇於 {pv.toFixed(1)}
          </text>
        )}
      </svg>

      <div className="democtl" style={{ flexWrap: 'wrap' }}>
        <span className="sldlab mono">
          原問題頂點 {PRIMAL[pi].label}{pi === PRIMAL_OPT ? '（最佳）' : ''}
        </span>
        <button type="button" className="demo-expand" onClick={() => setPi((i) => (i + 1) % PRIMAL.length)}>
          ↻ 換原問題頂點
        </button>
        <span className="sldlab mono">
          對偶頂點 {DUAL[di].label}{di === DUAL_OPT ? '（最佳）' : ''}
        </span>
        <button type="button" className="demo-expand" onClick={() => setDi((i) => (i + 1) % DUAL.length)}>
          ↻ 換對偶頂點
        </button>
      </div>
    </div>
  );
}
