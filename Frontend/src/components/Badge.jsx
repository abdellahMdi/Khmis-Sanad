const tones = {
    pending: 'bg-brand-gold/35 text-brand-text',
    approved: 'bg-brand-primary/10 text-brand-primary',
    blocked: 'bg-henne/15 text-henne',
    olive: 'bg-brand-primary/10 text-brand-primary',
    henne: 'bg-henne/15 text-henne',
    safran: 'bg-brand-gold/35 text-brand-text',
};

export default function Badge({ children, tone = 'pending', className = '' }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${tones[tone] || tones.pending} ${className}`}
        >
            {children}
        </span>
    );
}
