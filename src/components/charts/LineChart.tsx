import { motion } from "framer-motion";
import { h3 } from "framer-motion/client";

export function LineChart({
  data,
  dates,
  unit,
}: {
  data: number[];
  dates: string[];
  unit: string;
}) {
  const w = 600,
    h = 200,
    p = 30,
    top = 14;
  const span = Math.max(...data) - Math.min(...data);
  const mn = Math.min(...data) - span * 0.2 - 0.5,
    mx = Math.max(...data) + span * 0.2 + 0.5;
  const x = (i: number) => p + (i * (w - 2 * p)) / Math.max(1, data.length - 1);
  const y = (v: number) =>
    top + (h - top - p) - ((v - mn) / (mx - mn)) * (h - top - p - p);
  const points = data.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label="Trend chart">
      {[0, 1, 2, 3].map((i) => {
        const val = mn + ((mx - mn) * i) / 3,
          yy = y(val);
        return (
          <g key={i}>
            <line x1={p} x2={w - p} y1={yy} y2={yy} stroke="var(--line)" />
            <text x={0} y={yy + 4} fontSize={10} fill="var(--mut)">
              {val.toFixed(1)}
            </text>
          </g>
        );
      })}
      <motion.polyline
        fill="none"
        stroke="var(--pri)"
        strokeWidth={2.5}
        points={points}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {data.map((v, i) => (
        <motion.circle
          key={i}
          cx={x(i)}
          cy={y(v)}
          r={3.5}
          fill="var(--pan)"
          stroke="var(--pri)"
          strokeWidth={2}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + i * 0.03 }}
        />
      ))}
      <text x={p} y={h - 6} fontSize={14} fill="var(--mut)">
        {dates[0]} → {dates[dates.length - 1]} · {unit}
      </text>
    </svg>
  );
}
