import { useEffect, useRef, useState } from "react";

export function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current,
      to = value,
      start = performance.now(),
      dur = 500;
    if (from === to) return;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur),
        ease = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * ease);
      if (p < 1) raf = requestAnimationFrame(step);
      else prev.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  const rounded = Number.isInteger(value)
    ? Math.round(display)
    : Math.round(display * 10) / 10;
  return <>{rounded.toLocaleString()}</>;
}
