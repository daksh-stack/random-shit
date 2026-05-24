const path = require('path');
const { generatePdfReport } = require('../reports/pdfReport.generator');

async function createReport(analysis, requestDir, registry) {
  const reportPath = path.join(requestDir, 'risk-report.pdf');
  await generatePdfReport(analysis, reportPath);
  registry.addFile(reportPath);
  return reportPath;
}

module.exports = { createReport };
