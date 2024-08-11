import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";

// Cards sit in a CSS grid, so every card in a row is already the same height.
// The heading can wrap to one or two lines depending on the label length, so the
// value/sub block is pushed to the bottom of the card (margin-top:auto, in globals.css)
// rather than sitting right under the heading — that's what keeps them aligned across a row.
export function Kpis({
  items,
}: {
  items: [string, string | number, string][];
}) {
  return (
    <div className="grid kp">
      {items.map(([l, v, s], i) => (
        <motion.div
          className="card"
          key={l}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.03 }}
        >
          <h2>{l}</h2>
          <div className="card-body">
            <div className="k">
              {typeof v === "number" ? <AnimatedNumber value={v} /> : v}
            </div>
            <div className="sub">{s}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
