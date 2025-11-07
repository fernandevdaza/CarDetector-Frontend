import { useState } from 'react';
import SectionCard from '../common/SectionCard';
import UploadBox from '../common/UploadBox';
import InfoField from '../common/InfoField';
import {
    uploadVideoAndGetCrops,
    detectCarFromCrop,
    type VideoCrop,
} from '../../api/carDetectionApi';

interface DetectionState {
    brand: string;
    model: string;
    yearApprox: string;
}

export default function VideoDetectionSection() {
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
    const [crops, setCrops] = useState<VideoCrop[]>([]);
    const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
    const [result, setResult] = useState<DetectionState | null>(null);
    const [loadingVideo, setLoadingVideo] = useState(false);
    const [loadingCrop, setLoadingCrop] = useState(false);

    const hasCropSelected = Boolean(selectedCropId);

    const handleVideoSelected = async (file: File) => {
        setLoadingVideo(true);
        setSelectedCropId(null);
        setResult(null);

        try {
            const data = await uploadVideoAndGetCrops(file);
            setVideoPreviewUrl(data.videoUrl);
            setCrops(data.crops ?? []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingVideo(false);
        }
    };

    const handleSelectCrop = (cropId: string) => {
        setSelectedCropId(cropId);
        setResult(null);
    };

    const handlePredictCrop = async () => {
        if (!selectedCropId) return;
        setLoadingCrop(true);
        try {
            const data = await detectCarFromCrop(selectedCropId);
            setResult({
                brand: data.brand,
                model: data.model,
                yearApprox: data.yearApprox,
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingCrop(false);
        }
    };

    return (
        <SectionCard
            title="Detección desde Video"
            subtitle="Sube un video, revisa los crops detectados y selecciona uno para predecir."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BLOQUE IZQUIERDO: upload video */}
                <div className="flex items-center">
                    <UploadBox
                        label="Subir video del auto"
                        accept="video/*"
                        onFileSelected={handleVideoSelected}
                    />
                </div>

                {/* BLOQUE DERECHO: se subdivide en 2 -> crops (centro) + preview/datos (derecha) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Centro: lista de crops */}
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 flex flex-col">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">
                            Crops detectados
                        </h3>
                        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                            {crops.length === 0 ? (
                                <p className="text-xs text-slate-500">
                                    Aún no hay crops. Sube un video para ver resultados.
                                </p>
                            ) : (
                                crops.map((crop) => (
                                    <button
                                        key={crop.id}
                                        onClick={() => handleSelectCrop(crop.id)}
                                        className={
                                            'flex items-center gap-3 w-full rounded-xl border p-2 text-left transition-colors ' +
                                            (selectedCropId === crop.id
                                                ? 'border-indigo-400 bg-indigo-500/10'
                                                : 'border-slate-800 bg-slate-900 hover:border-slate-600')
                                        }
                                    >
                                        <div className="h-12 w-16 overflow-hidden rounded-lg bg-slate-950 border border-slate-800">
                                            <img
                                                src={crop.imageUrl}
                                                alt={crop.label}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-medium text-slate-100">
                                                {crop.label}
                                            </span>
                                            <span className="text-[11px] text-slate-500">
                                                ID: {crop.id}
                                            </span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Derecha: preview + datos */}
                    <div
                        className={
                            'flex flex-col gap-4 rounded-2xl border p-3 md:p-4 ' +
                            (hasCropSelected
                                ? 'border-slate-700 bg-slate-900'
                                : 'border-slate-800 bg-slate-900/70 opacity-60')
                        }
                    >
                        <div className="aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950 flex items-center justify-center">
                            {hasCropSelected ? (
                                (() => {
                                    const crop = crops.find((c) => c.id === selectedCropId);
                                    if (!crop) {
                                        return (
                                            <span className="text-xs md:text-sm text-slate-500">
                                                Crop seleccionado no encontrado
                                            </span>
                                        );
                                    }
                                    return (
                                        <img
                                            src={crop.imageUrl}
                                            alt={crop.label}
                                            className="h-full w-full object-cover"
                                        />
                                    );
                                })()
                            ) : videoPreviewUrl ? (
                                <video
                                    src={videoPreviewUrl}
                                    controls
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-xs md:text-sm text-slate-500">
                                    Aún no se ha subido ningún video
                                </span>
                            )}
                        </div>

                        <div className="space-y-3">
                            <InfoField
                                label="Marca"
                                value={result?.brand ?? null}
                                disabled={!hasCropSelected || loadingCrop}
                            />
                            <InfoField
                                label="Modelo"
                                value={result?.model ?? null}
                                disabled={!hasCropSelected || loadingCrop}
                            />
                            <InfoField
                                label="Año aproximado"
                                value={result?.yearApprox ?? null}
                                disabled={!hasCropSelected || loadingCrop}
                            />

                            <div className="flex items-center justify-between mt-2">
                                <button
                                    onClick={handlePredictCrop}
                                    disabled={!hasCropSelected || loadingCrop}
                                    className={
                                        'rounded-xl px-4 py-2 text-sm font-medium transition-colors ' +
                                        (hasCropSelected && !loadingCrop
                                            ? 'bg-indigo-500 text-white hover:bg-indigo-400'
                                            : 'bg-slate-800 text-slate-500 cursor-not-allowed')
                                    }
                                >
                                    {loadingCrop ? 'Prediciendo…' : 'Predecir crop seleccionado'}
                                </button>
                                {loadingVideo && (
                                    <span className="text-xs text-indigo-300">
                                        Procesando video...
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </SectionCard>
    );
}
