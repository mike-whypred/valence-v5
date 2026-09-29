'use client';

import { motion, useMotionValue, useReducedMotion, useTransform, type PanInfo } from 'motion/react';
import type { ReactNode } from 'react';

export type Direction = 'left' | 'right';

const SWIPE_DISTANCE = 120;
const SWIPE_VELOCITY = 600;

/**
 * The top card of a deck. Wrap in <AnimatePresence custom={direction}> so the exit knows which way to fly.
 * Drag it sideways to decide; keyboard and buttons call the same onDecide.
 * Motion values drive tilt and the decision labels so dragging never re-renders React.
 */
export function SwipeCard({
  children,
  onDecide,
  labels = { left: 'Pass', right: 'Interested' },
}: {
  children: ReactNode;
  onDecide: (dir: Direction) => void;
  labels?: Record<Direction, string>;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-9, 9]);
  const rightOpacity = useTransform(x, [30, SWIPE_DISTANCE], [0, 1]);
  const leftOpacity = useTransform(x, [-SWIPE_DISTANCE, -30], [1, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    if (info.offset.x > SWIPE_DISTANCE || info.velocity.x > SWIPE_VELOCITY) onDecide('right');
    else if (info.offset.x < -SWIPE_DISTANCE || info.velocity.x < -SWIPE_VELOCITY) onDecide('left');
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      style={{ x, rotate }}
      drag={reduce ? false : 'x'}
      dragSnapToOrigin
      dragElastic={0.6}
      onDragEnd={handleDragEnd}
      initial={reduce ? false : { scale: 0.96, y: 14, opacity: 0.6 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      variants={{
        exit: (dir: Direction | null) =>
          reduce
            ? { opacity: 0, transition: { duration: 0.15 } }
            : {
                x: dir === 'left' ? -560 : 560,
                rotate: dir === 'left' ? -14 : 14,
                opacity: 0,
                transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              },
      }}
      exit="exit"
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      {children}
      <motion.span
        aria-hidden
        style={{ opacity: rightOpacity }}
        className="bg-ember text-ember-ink pointer-events-none absolute top-6 left-6 -rotate-6 rounded-full px-4 py-1.5 text-sm font-semibold"
      >
        {labels.right}
      </motion.span>
      <motion.span
        aria-hidden
        style={{ opacity: leftOpacity }}
        className="bg-ink text-canvas pointer-events-none absolute top-6 right-6 rotate-6 rounded-full px-4 py-1.5 text-sm font-semibold"
      >
        {labels.left}
      </motion.span>
    </motion.div>
  );
}

/** Static cards stacked under the active one, so the deck reads as a deck. */
export function BackCard({ depth, children }: { depth: 1 | 2; children: ReactNode }) {
  return (
    <div
      aria-hidden
      className="ease-out-expo pointer-events-none absolute inset-0 transition-transform duration-500"
      style={{
        transform: `translateY(${depth * 12}px) scale(${1 - depth * 0.045})`,
        transformOrigin: 'bottom center',
        opacity: depth === 1 ? 0.85 : 0.55,
      }}
    >
      {children}
    </div>
  );
}
