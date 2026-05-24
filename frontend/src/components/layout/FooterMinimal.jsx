export function FooterMinimal({ disclaimer }) {
  return (
    <footer className="mt-16 pt-8 border-t border-white/[0.06]">
      <p className="text-xs text-text-muted leading-relaxed text-center max-w-prose mx-auto">
        {disclaimer ||
          'This tool provides informational risk highlights, not legal advice. Consult a qualified professional before signing any contract.'}
      </p>
    </footer>
  );
}
