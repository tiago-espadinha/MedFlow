import { motion } from "framer-motion";
import { useI18n } from "../../i18n/I18nProvider";
import { ChartGrid, SQ } from "./ChartGrid";

// A trace on chart paper. One large square is always a round step of the unit (1, 2, 5, 10...),
// stated on the chart, so values can be read off the grid. Data is drawn in ink (or a vital's
// monitor colour); red is never used for data, only for critical status elsewhere.
const STEPS = [0.5, 1, 2, 5, 10, 20, 25, 50, 100, 200, 500, 1000];

export function LineChart({
  data,
  data2,
  dates,
  unit,
  color = "var(--trace)",
  zero = false,
  calibration = false,
  average = false,
  thresholds = [],
  valueLabels = "last",
  lastLabel,
}: {
  data: number[];
  // optional second series, drawn dashed with square markers (e.g. diastolic)
  data2?: number[];
  dates: string[];
  unit: string;
  color?: string;
  // start the scale at zero (counts) instead of fitting the data (vitals)
  zero?: boolean;
  // draw the 1-square calibration pulse that opens an ECG strip
  calibration?: boolean;
  average?: boolean;
  thresholds?: { value: number; label: string }[];
  valueLabels?: "all" | "last";
  lastLabel?: string;
}) {
  const { t } = useI18n();
  const all = [...data, ...(data2 ?? []), ...thresholds.map((x) => x.value)];
  const min = Math.min(...all),
    max = Math.max(...all);
  const lo0 = zero ? 0 : min;
  // counts get a compact 4-square chart; vitals get finer resolution (up to 8 squares)
  const maxSquares = zero ? 4 : 8;
  const step = STEPS.find((s) => (max - lo0) / s <= maxSquares) ?? 1000;
  const lo = zero
    ? 0
    : Math.floor(min / step) * step - (min % step === 0 ? step : 0);
  let hi = Math.ceil(max / step) * step;
  if (hi <= lo) hi = lo + step;
  const squares = Math.round((hi - lo) / step);

  const W = 720,
    top = 44,
    bottom = 36,
    left = calibration ? 150 : 64,
    right = 28;
  const base = top + squares * SQ;
  const H = base + bottom;
  const n = data.length;
  const x = (i: number) =>
    left + 24 + (n > 1 ? (i * (W - left - right - 48)) / (n - 1) : 0);
  const y = (v: number) => base - ((v - lo) / step) * SQ;
  const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(1));
  const pts = (d: number[]) => d.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const avg = data.reduce((a, b) => a + b, 0) / Math.max(1, n);
  const halo = {
    paintOrder: "stroke" as const,
    stroke: "var(--pan)",
    strokeWidth: 5,
    strokeLinejoin: "round" as const,
  };
  const scale = t("1 large square = {n} {unit}", { n: fmt(step), unit });

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${scale}. ${data.map((v, i) => `${dates[i]}: ${fmt(v)}`).join(", ")}`}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      <ChartGrid width={W} height={H} originY={base} />
      <text x={left - 40} y={22} fontSize={14} fill="var(--mut)" style={halo}>
        {scale}
      </text>
      {Array.from({ length: squares + 1 }, (_, k) => lo + k * step).map((v) => (
        <text
          key={v}
          x={left - 10}
          y={y(v) + 5}
          fontSize={14}
          textAnchor="end"
          fill="var(--mut)"
          style={halo}
        >
          {fmt(v)}
        </text>
      ))}
      {zero && (
        <line
          x1={left - 4}
          x2={W - right}
          y1={base}
          y2={base}
          stroke="var(--tx)"
          strokeWidth={1.5}
        />
      )}
      {calibration && (
        <>
          <path
            d={`M24 ${base} H40 V${base - SQ} H72 V${base} H88`}
            fill="none"
            stroke="var(--tx)"
            strokeWidth={2.25}
          />
          <text
            x={56}
            y={base - SQ - 8}
            fontSize={14}
            textAnchor="middle"
            fill="var(--mut)"
            style={halo}
          >
            {fmt(step)}
          </text>
        </>
      )}
      {thresholds.map((th) => (
        <g key={th.label}>
          <line
            x1={left - 4}
            x2={W - right}
            y1={y(th.value)}
            y2={y(th.value)}
            stroke="var(--warnt)"
            strokeWidth={1.75}
            strokeDasharray="2 4"
          />
          <text
            x={left + 2}
            y={y(th.value) - 7}
            fontSize={13}
            fontWeight={700}
            fill="var(--warnt)"
            style={halo}
          >
            {th.label}
          </text>
        </g>
      ))}
      {average && (
        <>
          <line
            x1={left - 4}
            x2={W - right}
            y1={y(avg)}
            y2={y(avg)}
            stroke="var(--mut)"
            strokeWidth={1.5}
            strokeDasharray="6 5"
          />
          <text
            x={W - right}
            y={y(avg) + 18}
            fontSize={13}
            textAnchor="end"
            fill="var(--mut)"
            style={halo}
          >
            {t("Average {n}", { n: Math.round(avg) })}
          </text>
        </>
      )}
      {data2 && (
        <motion.polyline
          fill="none"
          stroke={color}
          strokeWidth={2.25}
          strokeDasharray="6 4"
          strokeLinejoin="round"
          points={pts(data2)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      )}
      <motion.polyline
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinejoin="round"
        points={pts(data)}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      />
      {data.map((v, i) => {
        const last = i === n - 1;
        const show = valueLabels === "all" || last;
        return (
          <g key={i}>
            {data2 && (
              <rect
                x={x(i) - 3.5}
                y={y(data2[i]) - 3.5}
                width={7}
                height={7}
                fill="var(--pan)"
                stroke={color}
                strokeWidth={1.8}
              />
            )}
            <circle
              cx={x(i)}
              cy={y(v)}
              r={last ? 6 : 4.5}
              fill={last ? color : "var(--pan)"}
              stroke={color}
              strokeWidth={2.5}
            />
            {show && (
              <text
                x={x(i)}
                y={y(v) - 14}
                fontSize={last ? 24 : 20}
                fontWeight={800}
                textAnchor="middle"
                fill={valueLabels === "all" ? "var(--tx)" : color}
                style={{ ...halo, fontFamily: "var(--num)" }}
              >
                {fmt(v)}
              </text>
            )}
            {last && data2 && (
              <text
                x={x(i)}
                y={y(data2[i]) + 28}
                fontSize={24}
                fontWeight={800}
                textAnchor="middle"
                fill={color}
                style={{ ...halo, fontFamily: "var(--num)" }}
              >
                {fmt(data2[i])}
              </text>
            )}
            <text
              x={x(i)}
              y={base + 26}
              fontSize={14}
              fontWeight={last ? 800 : 500}
              textAnchor="middle"
              fill={last ? "var(--tx)" : "var(--mut)"}
              style={halo}
            >
              {last && lastLabel ? lastLabel : dates[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
