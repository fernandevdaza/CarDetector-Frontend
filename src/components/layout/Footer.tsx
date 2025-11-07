export default function Footer() {
    return (
        <footer className="mt-10 border-t border-slate-800 bg-slate-950/80 backdrop-blur">
            <div className="mx-auto max-w-6xl px-4 py-4 text-xs md:text-sm text-slate-500 flex items-center justify-between">
                <span>© {new Date().getFullYear()} LLM Car Detector</span>
                <span className="text-slate-600">Built with React + Tailwind</span>
            </div>
        </footer>
    );
}
