import { useState, useCallback, useRef, useEffect } from 'react';
import { analyzeContract, downloadReport } from '../services/analysisApi.js';
import { ApiError } from '../services/apiClient.js';
import { validateFile } from '../utils/fileValidation.js';
import { ANALYSIS_STEPS } from '../constants/analysisSteps.js';

export function useAnalysis() {
  const [phase, setPhase] = useState('idle');
  const [file, setFile] = useState(null);
  const [contractType, setContractType] = useState('offer_letter');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [fileError, setFileError] = useState(null);
  const [processingStep, setProcessingStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState(null);
  const stepTimerRef = useRef(null);

  const clearStepTimer = useCallback(() => {
    if (stepTimerRef.current) {
      clearInterval(stepTimerRef.current);
      stepTimerRef.current = null;
    }
  }, []);

  const startStepAnimation = useCallback(() => {
    clearStepTimer();
    setProcessingStep(0);
    stepTimerRef.current = setInterval(() => {
      setProcessingStep((prev) =>
        prev < ANALYSIS_STEPS.length - 1 ? prev + 1 : prev
      );
    }, 2200);
  }, [clearStepTimer]);

  useEffect(() => clearStepTimer, [clearStepTimer]);

  const selectFile = useCallback((selectedFile) => {
    setError(null);
    const validation = validateFile(selectedFile);
    if (!validation.valid) {
      setFile(null);
      setFileError(validation.error);
      return false;
    }
    setFile(selectedFile);
    setFileError(null);
    return true;
  }, []);

  const clearFile = useCallback(() => {
    setFile(null);
    setFileError(null);
  }, []);

  const dismissError = useCallback(() => {
    setError(null);
    setPhase('idle');
  }, []);

  const reset = useCallback(() => {
    clearStepTimer();
    setPhase('idle');
    setFile(null);
    setResult(null);
    setError(null);
    setFileError(null);
    setProcessingStep(0);
    setDownloadError(null);
    setIsDownloading(false);
  }, [clearStepTimer]);

  const submit = useCallback(async () => {
    setError(null);
    setDownloadError(null);

    const validation = validateFile(file);
    if (!validation.valid) {
      setFileError(validation.error);
      setPhase('idle');
      return;
    }

    setPhase('uploading');
    startStepAnimation();

    setTimeout(() => setPhase('analyzing'), 400);

    try {
      const data = await analyzeContract(file, contractType);
      clearStepTimer();
      setResult(data);
      setPhase('success');
    } catch (err) {
      clearStepTimer();
      setPhase('error');
      if (err instanceof ApiError) {
        setError({ code: err.code, message: err.message });
      } else {
        setError({ code: 'UNKNOWN', message: err.message || 'Analysis failed.' });
      }
    }
  }, [file, contractType, startStepAnimation, clearStepTimer]);

  const downloadPdf = useCallback(async () => {
    if (!file) {
      setDownloadError('Original file is no longer available. Please analyze again.');
      return;
    }

    setIsDownloading(true);
    setDownloadError(null);

    try {
      const blob = await downloadReport(file, contractType);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `risk-report-${result?.requestId || 'report'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      const message =
        err instanceof ApiError ? err.message : 'Failed to download report.';
      setDownloadError(message);
    } finally {
      setIsDownloading(false);
    }
  }, [file, contractType, result?.requestId]);

  const isProcessing = phase === 'uploading' || phase === 'analyzing';

  return {
    phase,
    file,
    contractType,
    setContractType,
    result,
    error,
    fileError,
    processingStep,
    isProcessing,
    isDownloading,
    downloadError,
    selectFile,
    clearFile,
    submit,
    reset,
    dismissError,
    downloadPdf,
  };
}
