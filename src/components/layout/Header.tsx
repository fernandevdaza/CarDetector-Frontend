export default function Header() {
    return (
        <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
                <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-slate-100">
                    LLM Car Detector
                </h1>
                <span className="text-xs md:text-sm text-slate-400">
                    powered by CV + LLMs
                </span>
            </div>
        </header>
    );
}
