export function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border border-white/[0.08] bg-surface-1 ${className}`}
    >
      {children}
    </div>
  );
}
