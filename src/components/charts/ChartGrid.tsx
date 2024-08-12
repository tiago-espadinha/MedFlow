import { useId } from "react";

// Chart paper drawn in SVG user units: 8 units = 1 small square, 40 units = 1 large square.
// originY puts a 5 mm line exactly on the chart's baseline, so the grid can carry the scale.
// The small lines take --grid-dash, which turns them into dots in the monitor (dark) theme.
export const SQ = 40;

export function ChartGrid({
  width,
  height,
  originY = 0,
}: {
  width: number;
  height: number;
  originY?: number;
}) {
  const id = useId().replace(/:/g, "");
  return (
    <>
      <defs>
        <pattern
          id={id}
          width={SQ}
          height={SQ}
          y={originY}
          patternUnits="userSpaceOnUse"
        >
          {[8, 16, 24, 32].map((v) => (
            <path
              key={v}
              d={`M${v} 0V${SQ}M0 ${v}H${SQ}`}
              strokeWidth={1.2}
              style={{
                stroke: "var(--grid)",
                strokeDasharray: "var(--grid-dash)",
                strokeDashoffset: 0.5,
              }}
            />
          ))}
          <path
            d={`M0 0V${SQ}M0 0H${SQ}`}
            strokeWidth={1}
            style={{ stroke: "var(--grid5)" }}
          />
        </pattern>
      </defs>
      <rect width={width} height={height} style={{ fill: "var(--sheet)" }} />
      <rect width={width} height={height} fill={`url(#${id})`} />
    </>
  );
}
