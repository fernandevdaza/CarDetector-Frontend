interface InfoFieldProps {
    label: string;
    value?: string | null;
    disabled?: boolean;
}

export default function InfoField({
    label,
    value,
    disabled,
}: InfoFieldProps) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-slate-400">
                {label}
            </span>
            <div
                className={
                    'rounded-xl border px-3 py-2 text-sm ' +
                    (disabled
                        ? 'border-slate-800 bg-slate-900/60 text-slate-600'
                        : 'border-slate-700 bg-slate-900 text-slate-100')
                }
            >
                {value || (disabled ? '—' : 'N/A')}
            </div>
        </div>
    );
}
