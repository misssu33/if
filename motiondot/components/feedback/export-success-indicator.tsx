'use client';

import { motion, useReducedMotion } from 'framer-motion';

/** Export 완료 체크 — framer-motion pop (고정 32×32, 레이아웃 시프트 방지) */
export function ExportSuccessIndicator() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.span
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white"
      aria-hidden="true"
      initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: 'spring', stiffness: 440, damping: 24, mass: 0.75 }
      }
    >
      <svg
        viewBox="0 0 16 16"
        className="h-4 w-4 stroke-[2.5] text-white"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <motion.path
          d="M3.5 8.5 6.5 11.5 12.5 4.5"
          initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : { pathLength: { delay: 0.12, duration: 0.28 }, opacity: { duration: 0.15 } }
          }
        />
      </svg>
    </motion.span>
  );
}
