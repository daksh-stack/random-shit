export function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-base">
      <div className="mx-auto w-full max-w-content px-4 py-12 md:px-6 md:py-16">
        {children}
      </div>
    </div>
  );
}
