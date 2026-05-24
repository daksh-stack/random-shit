import { Shield } from 'lucide-react';

export function Header({ compact = false }) {
  return (
    <header className={`text-center ${compact ? 'mb-8' : 'mb-12 md:mb-16'}`}>
      <div className="mb-4 inline-flex items-center justify-center rounded-xl bg-surface-1 p-3 border border-white/[0.08]">
        <Shield className="h-6 w-6 text-accent" aria-hidden="true" />
      </div>
      <h1
        className={`font-semibold tracking-tight text-text-primary text-balance ${
          compact ? 'text-2xl' : 'text-3xl md:text-4xl'
        }`}
      >
        Clause Shield
      </h1>
      {!compact && (
        <p className="mt-3 text-base text-text-secondary max-w-md mx-auto leading-relaxed">
          Upload your contract. Find hidden traps in plain language — before you sign.
        </p>
      )}
    </header>
  );
}
