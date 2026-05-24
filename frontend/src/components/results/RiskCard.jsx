import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Badge } from '../ui/Badge.jsx';
import { formatRiskType, formatSeverity } from '../../utils/formatters.js';
import {
  getSeverityBadgeClasses,
  getSeverityBorderClass,
} from '../../utils/riskColors.js';
import { getTransition } from '../../utils/motion.js';

export function RiskCard({ risk, index, reducedMotion }) {
  const [expanded, setExpanded] = useState(index === 0);

  const toggle = () => setExpanded((prev) => !prev);

  return (
    <div
      className={`rounded-xl border border-white/[0.08] bg-surface-1 border-l-4 ${getSeverityBorderClass(risk.severity)}`}
    >
      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left hover:bg-surface-2/50 transition-colors rounded-xl"
      >
        <div className="flex flex-wrap items-center gap-3 min-w-0">
          <span className="text-sm font-medium text-text-primary">
            {formatRiskType(risk.type)}
          </span>
          <Badge className={getSeverityBadgeClasses(risk.severity)}>
            {formatSeverity(risk.severity)}
          </Badge>
        </div>
        <ChevronDown
          className={`h-5 w-5 shrink-0 text-text-muted transition-transform ${
            expanded ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={getTransition(reducedMotion, 0.25)}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-6 space-y-4 border-t border-white/[0.06] pt-4">
              {risk.simplifiedMeaning && (
                <p className="text-[15px] text-text-primary leading-relaxed">
                  {risk.simplifiedMeaning}
                </p>
              )}
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
                  Explanation
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {risk.explanation}
                </p>
              </div>
              {risk.clause && (
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
                    Clause excerpt
                  </p>
                  <p className="text-xs font-mono text-text-muted leading-relaxed bg-elevated/80 rounded-lg p-4 border border-white/[0.06]">
                    {risk.clause}
                  </p>
                </div>
              )}
              {risk.questionsToAsk?.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">
                    Questions to ask
                  </p>
                  <ul className="space-y-2">
                    {risk.questionsToAsk.map((q) => (
                      <li
                        key={q}
                        className="text-sm text-text-secondary flex gap-2"
                      >
                        <span className="text-accent shrink-0">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
