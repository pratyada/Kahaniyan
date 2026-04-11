// Shopify-style section card: titled container with optional action.
export default function SectionCard({ title, action, children, className = '' }) {
  return (
    <section className={`mb-6 ${className}`}>
      {(title || action) && (
        <header className="mb-3 flex items-center justify-between gap-3 px-1">
          {title && <h2 className="ui-label">{title}</h2>}
          {action}
        </header>
      )}
      {children}
    </section>
  );
}
