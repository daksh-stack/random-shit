export function Select({ label, value, onChange, options, id }) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="mb-2 block text-sm text-text-secondary">
          {label}
        </label>
      )}
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-white/10 bg-surface-1 px-4 py-3 text-sm text-text-primary transition-colors hover:border-white/15 focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/30"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
