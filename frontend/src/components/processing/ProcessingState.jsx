import { motion } from 'framer-motion';
import { ANALYSIS_STEPS } from '../../constants/analysisSteps.js';
import { getTransition } from '../../utils/motion.js';

export function ProcessingState({ stepIndex, reducedMotion }) {
  const currentStep = ANALYSIS_STEPS[stepIndex] || ANALYSIS_STEPS[0];
  const progress = ((stepIndex + 1) / ANALYSIS_STEPS.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={getTransition(reducedMotion)}
      className="py-16 text-center"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-auto mb-8 h-1 max-w-xs overflow-hidden rounded-full bg-surface-2">
        <motion.div
          className="h-full bg-accent/80 rounded-full"
          initial={{ width: '5%' }}
          animate={{ width: `${Math.max(progress, 8)}%` }}
          transition={getTransition(reducedMotion, 0.5)}
        />
      </div>

      <div className="space-y-3 mb-6">
        {ANALYSIS_STEPS.map((step, index) => (
          <p
            key={step.id}
            className={`text-sm transition-colors ${
              index === stepIndex
                ? 'text-text-primary font-medium'
                : index < stepIndex
                  ? 'text-text-muted'
                  : 'text-text-muted/50'
            }`}
          >
            {index < stepIndex ? '✓ ' : ''}
            {step.label}
          </p>
        ))}
      </div>

      <div className="mx-auto max-w-sm space-y-2">
        <div className="h-3 rounded-md bg-surface-2 animate-shimmer" />
        <div className="h-3 rounded-md bg-surface-2 animate-shimmer w-4/5 mx-auto" />
      </div>

      <p className="mt-8 text-xs text-text-muted">{currentStep.label}…</p>
    </motion.div>
  );
}
