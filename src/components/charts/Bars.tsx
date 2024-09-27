import { motion } from "framer-motion";

// fontSize is in viewBox units; raise it when the chart renders narrow so labels stay legible.
export function Bars({
  data,
  labels,
  fontSize = 11,
}: {
  data: number[];
  labels: string[];
  fontSize?: number;
}) {
  const w = 520,
    h = 150,
    top = fontSize + 10,
    bottom = fontSize + 10,
    bw = w / data.length;
  const max = Math.max(...data) || 1;
  return (
    <svg
      viewBox={`0 0 ${w} ${top + h + bottom}`}
      role="img"
      aria-label="Bar chart"
    >
      {data.map((n, i) => {
        const bh = (n / max) * h;
        return (
          <g key={i}>
            <motion.rect
              x={i * bw + 8}
              width={bw - 16}
              rx={2}
              fill={i === data.length - 1 ? "var(--pri)" : "var(--line)"}
              initial={{ height: 0, y: top + h }}
              animate={{ height: bh, y: top + h - bh }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
            />
            <text
              x={i * bw + bw / 2}
              y={top + h + fontSize + 4}
              fontSize={fontSize}
              textAnchor="middle"
              fill="var(--mut)"
            >
              {labels[i]}
            </text>
            <text
              x={i * bw + bw / 2}
              y={top + h - bh - 6}
              fontSize={fontSize}
              fontWeight={650}
              textAnchor="middle"
              fill="var(--tx)"
            >
              {n}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
