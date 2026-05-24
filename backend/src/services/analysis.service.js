const path = require('path');
const config = require('../config');
const { DISCLAIMER } = require('../config/constants');
const { extractText } = require('./textExtraction.service');
const { detectRiskyClauses } = require('./clauseDetector.service');
const { enrichClausesWithAi } = require('./geminiAnalysis.service');
const {
  calculateRiskScore,
  getRiskLevel,
  buildSummary,
} = require('./riskScoring.service');
const { createReport } = require('./report.service');
const { CleanupRegistry } = require('./cleanup.service');
const logger = require('../utils/logger');

function formatRiskResponse(risk) {
  const item = {
    type: risk.type,
    severity: risk.severity,
    clause: risk.clause,
    explanation: risk.explanation,
    questionsToAsk: risk.questionsToAsk || [],
  };

  if (risk.simplifiedMeaning) {
    item.simplifiedMeaning = risk.simplifiedMeaning;
  }

  return item;
}

async function analyzeContract({ file, contractType, generateReport, requestId }) {
  const start = Date.now();
  const registry = new CleanupRegistry();
  const requestDir = path.join(config.paths.tempDir, requestId);

  registry.addRequestDir(requestId);
  registry.addFile(file.path);

  logger.info('Analysis started', { requestId, contractType });

  const extraction = await extractText(file, requestId);
  const detectedClauses = detectRiskyClauses(extraction.text, contractType);

  const aiResult = await enrichClausesWithAi(detectedClauses, contractType, requestId);

  const riskScore = calculateRiskScore(aiResult.risks);
  const riskLevel = getRiskLevel(riskScore);
  const summary = buildSummary(aiResult.risks, aiResult.summary);

  const analysis = {
    success: true,
    requestId,
    summary,
    riskScore,
    riskLevel,
    risks: aiResult.risks.map(formatRiskResponse),
    meta: {
      contractType,
      processingMs: Date.now() - start,
      usedOcr: extraction.metadata.usedOcr,
      clauseCount: detectedClauses.length,
      aiEnriched: aiResult.aiEnriched,
      partial: aiResult.partial,
      disclaimer: DISCLAIMER,
      charCount: extraction.metadata.charCount,
    },
  };

  if (aiResult.warnings.length) {
    analysis.warnings = aiResult.warnings;
  }

  let reportPath = null;

  if (generateReport) {
    reportPath = await createReport(
      {
        ...analysis,
        risks: aiResult.risks,
      },
      requestDir,
      registry
    );
    analysis.report = {
      filename: 'risk-report.pdf',
      path: reportPath,
    };
  }

  return {
    analysis,
    registry,
    reportPath,
  };
}

module.exports = { analyzeContract };
