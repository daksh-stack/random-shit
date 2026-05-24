const { v4: uuidv4 } = require('uuid');
const config = require('../../config');
const { extractWindow, findSectionBoost } = require('../../utils/clauseUtils');

function runRule(text, ruleDef) {
  const matches = [];
  const lowerText = text.toLowerCase();

  for (const keyword of ruleDef.keywords || []) {
    let searchFrom = 0;
    const kw = keyword.toLowerCase();

    while (searchFrom < lowerText.length) {
      const index = lowerText.indexOf(kw, searchFrom);
      if (index === -1) break;

      const excerpt = extractWindow(
        text,
        index,
        kw.length,
        200,
        config.analysis.excerptMaxChars - 200
      );

      matches.push({
        id: uuidv4(),
        type: ruleDef.id,
        riskType: ruleDef.riskType,
        clause: excerpt,
        startIndex: index,
        endIndex: index + kw.length,
        baseSeverity: ruleDef.baseSeverity,
        templateExplanation: ruleDef.templateExplanation,
        confidence: 0.55 + findSectionBoost(text, index),
        matchSource: 'keyword',
      });

      searchFrom = index + kw.length;
    }
  }

  for (const pattern of ruleDef.patterns || []) {
    const regex = new RegExp(pattern.source, pattern.flags);
    let match;

    while ((match = regex.exec(text)) !== null) {
      const index = match.index;
      const matchLength = match[0].length;
      const excerpt = extractWindow(
        text,
        index,
        matchLength,
        200,
        config.analysis.excerptMaxChars - 200
      );

      matches.push({
        id: uuidv4(),
        type: ruleDef.id,
        riskType: ruleDef.riskType,
        clause: excerpt,
        startIndex: index,
        endIndex: index + matchLength,
        baseSeverity: ruleDef.baseSeverity,
        templateExplanation: ruleDef.templateExplanation,
        confidence: 0.65 + findSectionBoost(text, index),
        matchSource: 'regex',
      });

      if (!pattern.flags.includes('g')) break;
    }
  }

  return matches;
}

module.exports = { runRule };
