export default function Button({
    children,
    type = 'button',
    variant = 'primary',
    className = '',
    disabled,
    ...props
}) {
    const variants = {
        primary:
            'bg-brand-primary text-white shadow-sm hover:bg-zellige-dark hover:shadow-md focus-visible:outline-brand-primary',
        accent:
            'bg-brand-accent text-white shadow-sm hover:bg-terracotta-dark hover:shadow-md focus-visible:outline-brand-accent',
        secondary:
            'border border-brand-primary/20 bg-white text-brand-primary shadow-sm hover:border-brand-primary/40 hover:bg-brand-bg focus-visible:outline-brand-primary',
        ghost:
            'bg-transparent text-brand-primary hover:bg-brand-primary/10 focus-visible:outline-brand-primary',
        danger: 'bg-henne text-white hover:opacity-90 focus-visible:outline-henne',
    };

    return (
        <button
            type={type}
            disabled={disabled}
            className={`inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
