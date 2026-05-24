function buildClauseAnalysisPrompt(contractType, clauses) {
  const payload = {
    contractType,
    clauses: clauses.map((c) => ({
      id: c.id,
      type: c.riskType || c.type,
      severityHint: c.baseSeverity,
      excerpt: c.clause,
    })),
  };

  return `Analyze the following pre-flagged contract clause excerpts for contract type "${contractType}".

Return JSON with this exact shape:
{
  "clauses": [
    {
      "id": "string (must match input id)",
      "type": "string",
      "severity": "low|medium|high|critical",
      "explanation": "string",
      "simplifiedMeaning": "string",
      "questionsToAsk": ["string"]
    }
  ],
  "summary": "string (2-4 sentences overall)"
}

Input excerpts (do not analyze anything not listed):
${JSON.stringify(payload, null, 2)}`;
}

module.exports = { buildClauseAnalysisPrompt };
