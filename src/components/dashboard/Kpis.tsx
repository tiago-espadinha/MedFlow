import { motion } from "framer-motion";
import { AnimatedNumber } from "./AnimatedNumber";

// Cards sit in a CSS grid, so every card in a row is already the same height.
// The heading can wrap to one or two lines depending on the label length, so the
// value/sub block is pushed to the bottom of the card (margin-top:auto, in globals.css)
// rather than sitting right under the heading — that's what keeps them aligned across a row.
// An optional fourth value marks the readout critical: its number turns red.
export function Kpis({
  items,
}: {
  items: [string, string | number, string, boolean?][];
}) {
  return (
    <div className="grid kp">
      {items.map(([l, v, s, alert], i) => (
        <motion.div
          className={alert ? "card alert" : "card"}
          key={l}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: i * 0.03 }}
        >
          <h2>{l}</h2>
          <div className="card-body">
            <div className={String(v).length > 6 ? "k long" : "k"}>
              {typeof v === "number" ? <AnimatedNumber value={v} /> : v}
            </div>
            <div className="sub">{s}</div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
