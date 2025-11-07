export default function SectionCard({ title, subtitle, children }: { title: string, subtitle: string, children?: any }) {
    return (
        <section className="mb-8">
            <div className="mb-3">
                <h2 className="text-lg md:text-xl font-semibold text-slate-100">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-xs md:text-sm text-slate-400 mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 shadow-lg shadow-slate-900/40 p-4 md:p-6">
                {children}
            </div>
        </section>
    );
}
