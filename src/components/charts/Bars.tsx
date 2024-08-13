import { motion } from "framer-motion";

export function Bars({ data, labels }: { data: number[]; labels: string[] }) {
  const w = 520,
    h = 150,
    top = 20,
    bottom = 20,
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
              rx={4}
              fill="var(--pri)"
              opacity={i === data.length - 1 ? 1 : 0.55}
              initial={{ height: 0, y: top + h }}
              animate={{ height: bh, y: top + h - bh }}
              transition={{ duration: 0.5, delay: i * 0.04, ease: "easeOut" }}
            />
            <text
              x={i * bw + bw / 2}
              y={top + h + 14}
              fontSize={10}
              textAnchor="middle"
              fill="var(--mut)"
            >
              {labels[i]}
            </text>
            <text
              x={i * bw + bw / 2}
              y={top + h - bh - 6}
              fontSize={10}
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
