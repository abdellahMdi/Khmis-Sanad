export default function EmptyState({ title, children, action }) {
    return (
        <div className="rounded-2xl border border-dashed border-brand-gold bg-white px-6 py-12 text-center shadow-sm">
            <h2 className="text-xl font-bold text-brand-primary">{title}</h2>
            {children ? (
                <p className="mt-2 text-encre-muted">{children}</p>
            ) : null}
            {action ? <div className="mt-6">{action}</div> : null}
        </div>
    );
}
