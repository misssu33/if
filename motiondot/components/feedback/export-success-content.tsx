'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

type ExportSuccessContentProps = {
  children: ReactNode;
};

/** Export 완료 영역 — fade/slide (성공 UI만) */
export function ExportSuccessContent({ children }: ExportSuccessContentProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="flex flex-col gap-3"
      initial={reduceMotion ? false : { opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: 0.32, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
