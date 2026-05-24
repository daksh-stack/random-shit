export function Button({
  children,
  variant = 'primary',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-base disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]';

  const variants = {
    primary: 'bg-accent text-base hover:bg-accent-hover',
    secondary:
      'bg-surface-1 text-text-primary border border-white/10 hover:bg-surface-2',
    ghost: 'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-1',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
