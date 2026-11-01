import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { SPRING } from "@/lib/site";

/** Physics-based spring reveal (stiffness/damping, no fixed duration). */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ ...SPRING, delay }}
    >
      {children}
    </motion.div>
  );
}
