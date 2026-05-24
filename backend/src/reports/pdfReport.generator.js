const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const { DISCLAIMER } = require('../config/constants');

function writeSection(doc, title, content) {
  doc.fontSize(12).fillColor('#111111').text(title, { underline: true });
  doc.moveDown(0.3);
  doc.fontSize(10).fillColor('#333333').text(content, { align: 'left' });
  doc.moveDown(0.8);
}

async function generatePdfReport(analysis, outputPath) {
  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const stream = fs.createWriteStream(outputPath);

    stream.on('finish', resolve);
    stream.on('error', reject);
    doc.on('error', reject);

    doc.pipe(stream);

    doc.fontSize(18).fillColor('#000000').text('Contract Risk Analysis Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(10).fillColor('#666666').text(`Request ID: ${analysis.requestId}`, { align: 'center' });
    doc.text(`Contract Type: ${analysis.meta.contractType}`, { align: 'center' });
    doc.text(`Risk Score: ${analysis.riskScore} (${analysis.riskLevel})`, { align: 'center' });
    doc.moveDown(1);

    writeSection(doc, 'Summary', analysis.summary);

    if (!analysis.risks.length) {
      writeSection(doc, 'Findings', 'No risky clauses detected.');
    } else {
      analysis.risks.forEach((risk, index) => {
        doc.fontSize(13).fillColor('#000000').text(`${index + 1}. ${risk.type} [${risk.severity}]`);
        doc.moveDown(0.3);
        writeSection(doc, 'Clause Excerpt', risk.clause);
        writeSection(doc, 'Explanation', risk.explanation);

        if (risk.simplifiedMeaning) {
          writeSection(doc, 'In Simple Terms', risk.simplifiedMeaning);
        }

        if (risk.questionsToAsk?.length) {
          writeSection(
            doc,
            'Questions To Ask',
            risk.questionsToAsk.map((q, i) => `${i + 1}. ${q}`).join('\n')
          );
        }

        doc.moveDown(0.5);
      });
    }

    doc.fontSize(9).fillColor('#888888').text(DISCLAIMER, { align: 'left' });
    doc.end();
  });

  return outputPath;
}

module.exports = { generatePdfReport };
