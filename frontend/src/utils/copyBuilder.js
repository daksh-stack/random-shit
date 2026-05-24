import {
  formatRiskType,
  formatSeverity,
  formatRiskLevel,
} from './formatters.js';

export function buildCopyText(result) {
  const lines = [];

  lines.push('CONTRACT RISK ANALYSIS');
  lines.push('========================');
  lines.push('');
  lines.push(`Risk Score: ${result.riskScore}/100 (${formatRiskLevel(result.riskLevel)})`);
  lines.push('');
  lines.push('SUMMARY');
  lines.push('-------');
  lines.push(result.summary || 'No summary available.');
  lines.push('');

  if (result.risks?.length) {
    lines.push('DETECTED RISKS');
    lines.push('--------------');

    result.risks.forEach((risk, index) => {
      lines.push('');
      lines.push(`${index + 1}. ${formatRiskType(risk.type)} [${formatSeverity(risk.severity)}]`);
      if (risk.simplifiedMeaning) {
        lines.push(`   In short: ${risk.simplifiedMeaning}`);
      }
      lines.push(`   ${risk.explanation}`);
      if (risk.clause) {
        lines.push(`   Clause: "${risk.clause}"`);
      }
      if (risk.questionsToAsk?.length) {
        lines.push('   Questions to ask:');
        risk.questionsToAsk.forEach((q) => lines.push(`   - ${q}`));
      }
    });
  } else {
    lines.push('No risky clauses detected.');
  }

  const allQuestions = collectQuestions(result.risks);
  if (allQuestions.length) {
    lines.push('');
    lines.push('QUESTIONS TO ASK');
    lines.push('----------------');
    allQuestions.forEach((q, i) => lines.push(`${i + 1}. ${q}`));
  }

  lines.push('');
  lines.push(
    result.meta?.disclaimer ||
      'This is not legal advice. Consult a qualified professional before signing.'
  );

  if (result.requestId) {
    lines.push(`Reference: ${result.requestId}`);
  }

  return lines.join('\n');
}

export function collectQuestions(risks = []) {
  const seen = new Set();
  const questions = [];

  for (const risk of risks) {
    for (const q of risk.questionsToAsk || []) {
      const trimmed = q.trim();
      if (trimmed && !seen.has(trimmed)) {
        seen.add(trimmed);
        questions.push(trimmed);
      }
    }
  }

  return questions;
}
