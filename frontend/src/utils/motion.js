export const fadeIn = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export const fadeInReduced = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export function getTransition(reducedMotion, duration = 0.3) {
  if (reducedMotion) {
    return { duration: 0.01 };
  }
  return { duration, ease: [0.25, 0.1, 0.25, 1] };
}
