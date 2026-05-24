import { apiRequestJson, apiRequestBlob } from './apiClient.js';

function buildFormData(file, contractType, generateReport = false) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('contractType', contractType);
  formData.append('generateReport', generateReport ? 'true' : 'false');
  return formData;
}

export async function analyzeContract(file, contractType) {
  const formData = buildFormData(file, contractType, false);

  const data = await apiRequestJson('/api/v1/analyze', {
    method: 'POST',
    body: formData,
  });

  return data;
}

export async function downloadReport(file, contractType) {
  const formData = buildFormData(file, contractType, true);

  const blob = await apiRequestBlob('/api/v1/analyze', {
    method: 'POST',
    body: formData,
  });

  return blob;
}
