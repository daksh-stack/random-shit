import { motion } from 'framer-motion';
import { RiskScoreCard } from './RiskScoreCard.jsx';
import { SummarySection } from './SummarySection.jsx';
import { RiskCard } from './RiskCard.jsx';
import { QuestionsSection } from './QuestionsSection.jsx';
import { ClausesPanel } from './ClausesPanel.jsx';
import { SuggestedActions } from './SuggestedActions.jsx';
import { ActionButtons } from './ActionButtons.jsx';
import { sortRisksBySeverity } from '../../utils/formatters.js';
import { collectQuestions } from '../../utils/copyBuilder.js';
import { buildSuggestedActions } from '../../utils/suggestedActions.js';
import { fadeIn, getTransition } from '../../utils/motion.js';

export function ResultsDashboard({
  result,
  reducedMotion,
  onCopy,
  onDownload,
  onReset,
  copied,
  isDownloading,
  downloadError,
}) {
  const sortedRisks = sortRisksBySeverity(result.risks || []);
  const questions = collectQuestions(result.risks);
  const actions = buildSuggestedActions(result.risks);

  return (
    <motion.div
      {...fadeIn}
      transition={getTransition(reducedMotion)}
      className="space-y-8 md:space-y-10"
    >
      <ActionButtons
        onCopy={onCopy}
        onDownload={onDownload}
        onReset={onReset}
        copied={copied}
        isDownloading={isDownloading}
        downloadError={downloadError}
      />

      <RiskScoreCard score={result.riskScore} level={result.riskLevel} />

      <SummarySection summary={result.summary} warnings={result.warnings} />

      {sortedRisks.length > 0 ? (
        <section>
          <h2 className="text-lg font-semibold text-text-primary mb-4">
            Detected Risks
          </h2>
          <div className="space-y-4">
            {sortedRisks.map((risk, index) => (
              <RiskCard
                key={`${risk.type}-${index}`}
                risk={risk}
                index={index}
                reducedMotion={reducedMotion}
              />
            ))}
          </div>
        </section>
      ) : (
        <div className="rounded-xl border border-white/[0.08] bg-surface-1 p-8 text-center">
          <p className="text-sm text-text-secondary">
            No high-confidence risky clauses were detected. Always review the full
            document before signing.
          </p>
        </div>
      )}

      <QuestionsSection questions={questions} />

      <ClausesPanel risks={sortedRisks} />

      <SuggestedActions actions={actions} />

      {result.requestId && (
        <p className="text-xs text-text-muted text-center">
          Reference: {result.requestId}
        </p>
      )}
    </motion.div>
  );
}
