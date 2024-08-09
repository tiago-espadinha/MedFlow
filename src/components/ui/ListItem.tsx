import type { ReactNode } from "react";
import { motion } from "framer-motion";

export function ListItem({ children }: { children: ReactNode; k: string }) {
  return (
    <motion.tr
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      {children}
    </motion.tr>
  );
}
