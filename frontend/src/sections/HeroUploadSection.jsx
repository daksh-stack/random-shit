import { motion } from 'framer-motion';
import { UploadZone } from '../components/upload/UploadZone.jsx';
import { Select } from '../components/ui/Select.jsx';
import { Button } from '../components/ui/Button.jsx';
import { ErrorBanner } from '../components/feedback/ErrorBanner.jsx';
import { CONTRACT_TYPES } from '../constants/contractTypes.js';
import { fadeIn, getTransition } from '../utils/motion.js';
import { Loader2 } from 'lucide-react';

export function HeroUploadSection({
  file,
  contractType,
  onContractTypeChange,
  onFileSelect,
  onClearFile,
  onSubmit,
  fileError,
  apiError,
  onDismissError,
  disabled,
  reducedMotion,
}) {
  return (
    <motion.section
      {...fadeIn}
      transition={getTransition(reducedMotion)}
      className="w-full"
    >
      <ErrorBanner message={apiError} onDismiss={onDismissError} />

      <div className="space-y-6">
        <Select
          id="contract-type"
          label="Document type"
          value={contractType}
          onChange={onContractTypeChange}
          options={CONTRACT_TYPES}
        />

        <UploadZone
          file={file}
          onFileSelect={onFileSelect}
          onClear={onClearFile}
          disabled={disabled}
          error={fileError}
        />

        <Button
          type="button"
          variant="primary"
          className="w-full"
          disabled={!file || disabled}
          onClick={onSubmit}
        >
          {disabled ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            'Analyze contract'
          )}
        </Button>
      </div>
    </motion.section>
  );
}
