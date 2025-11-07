import { useState } from 'react';
import SectionCard from '../common/SectionCard';
import UploadBox from '../common/UploadBox';
import InfoField from '../common/InfoField';
import { detectCarFromImage } from '../../api/carDetectionApi';

interface DetectionState {
    brand: string;
    model: string;
    yearApprox: string;
}

export default function ImageDetectionSection() {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<DetectionState | null>(null);
    const [loading, setLoading] = useState(false);

    const hasImage = Boolean(previewUrl);

    const handleFileSelected = async (file: File) => {
        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
        setResult(null);
        setLoading(true);

        try {
            const data = await detectCarFromImage(file);
            setResult({
                brand: data.brand,
                model: data.model,
                yearApprox: data.yearApprox,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SectionCard
            title="Detección desde Imagen"
            subtitle="Sube una foto y el modelo intentará identificar la marca, modelo y año."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* IZQUIERDA: upload */}
                <div className="flex items-center">
                    <UploadBox
                        label="Subir foto del auto"
                        accept="image/*"
                        onFileSelected={handleFileSelected}
                    />
                </div>

                {/* DERECHA: preview + datos */}
                <div
                    className={
                        'flex flex-col gap-4 rounded-2xl border p-3 md:p-4 ' +
                        (hasImage
                            ? 'border-slate-700 bg-slate-900'
                            : 'border-slate-800 bg-slate-900/70 opacity-60')
                    }
                >
                    <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
                        {previewUrl ? (
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <span className="text-xs md:text-sm text-slate-500">
                                Aún no se ha subido ninguna imagen
                            </span>
                        )}
                    </div>

                    <div className="space-y-3">
                        <InfoField
                            label="Marca"
                            value={result?.brand ?? null}
                            disabled={!hasImage || loading}
                        />
                        <InfoField
                            label="Modelo"
                            value={result?.model ?? null}
                            disabled={!hasImage || loading}
                        />
                        <InfoField
                            label="Año aproximado"
                            value={result?.yearApprox ?? null}
                            disabled={!hasImage || loading}
                        />

                        {loading && (
                            <p className="text-xs text-indigo-300 mt-1">
                                Procesando imagen...
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
