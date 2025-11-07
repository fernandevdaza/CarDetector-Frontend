
export default function UploadBox({ label, accept, onFileSelected }: { label: string, accept: string, onFileSelected: Function }) {
    const handleChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) onFileSelected(file);
    };

    return (
        <label className="flex h-44 md:h-52 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/70 hover:border-indigo-400 hover:bg-slate-900/90 transition-all">
            <div className="flex flex-col items-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800">
                    <span className="text-2xl">⬆️</span>
                </div>
                <div className="text-center">
                    <p className="text-sm font-medium text-slate-100">
                        {label}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                        Haz clic para elegir un archivo
                    </p>
                </div>
            </div>
            <input
                type="file"
                className="hidden"
                accept={accept}
                onChange={handleChange}
            />
        </label>
    );
}
