import { AnimatePresence } from 'framer-motion';
import { AppShell } from './components/layout/AppShell.jsx';
import { Header } from './components/layout/Header.jsx';
import { FooterMinimal } from './components/layout/FooterMinimal.jsx';
import { HeroUploadSection } from './sections/HeroUploadSection.jsx';
import { ProcessingState } from './components/processing/ProcessingState.jsx';
import { ResultsDashboard } from './components/results/ResultsDashboard.jsx';
import { useAnalysis } from './hooks/useAnalysis.js';
import { useClipboard } from './hooks/useClipboard.js';
import { useReducedMotion } from './hooks/useReducedMotion.js';
import { buildCopyText } from './utils/copyBuilder.js';

export default function App() {
  const reducedMotion = useReducedMotion();
  const { copy, copied } = useClipboard();

  const {
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
  } = useAnalysis();

  const showUpload = phase === 'idle' || phase === 'error';
  const showResults = phase === 'success' && result;

  const handleCopy = async () => {
    if (!result) return;
    await copy(buildCopyText(result));
  };

  const apiErrorMessage =
    phase === 'error' && error ? error.message : null;

  return (
    <AppShell>
      <Header compact={showResults} />

      <AnimatePresence mode="wait">
        {isProcessing && (
          <ProcessingState
            key="processing"
            stepIndex={processingStep}
            reducedMotion={reducedMotion}
          />
        )}

        {showUpload && !isProcessing && (
          <HeroUploadSection
            key="upload"
            file={file}
            contractType={contractType}
            onContractTypeChange={setContractType}
            onFileSelect={selectFile}
            onClearFile={clearFile}
            onSubmit={submit}
            fileError={fileError}
            apiError={apiErrorMessage}
            onDismissError={dismissError}
            disabled={false}
            reducedMotion={reducedMotion}
          />
        )}

        {showResults && !isProcessing && (
          <ResultsDashboard
            key="results"
            result={result}
            reducedMotion={reducedMotion}
            onCopy={handleCopy}
            onDownload={downloadPdf}
            onReset={reset}
            copied={copied}
            isDownloading={isDownloading}
            downloadError={downloadError}
          />
        )}
      </AnimatePresence>

      <FooterMinimal
        disclaimer={
          result?.meta?.disclaimer ||
          'This tool provides informational risk highlights, not legal advice.'
        }
      />
    </AppShell>
  );
}
