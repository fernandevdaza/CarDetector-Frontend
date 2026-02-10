// src/api/carDetectionApi.ts
export interface ImageDetectionResult {
    imageUrl: string;          // para el preview local
    brand: string;
    model: string;
    yearApprox: string;
}

export interface VideoCrop {
    id: string;
    imageUrl: string | undefined;
    label: string;
    videoLat?: number | null;
    videoLon?: number | null;
    sourceVideoId?: string | null;
}

export interface VideoUploadResult {
    videoUrl: string;          // object URL para preview del video
    crops: VideoCrop[];
}

export interface CropDetectionResult {
    brand: string;
    model: string;
    yearApprox: string;
}

export interface HistoryPoint {
    id: number;
    lat: number;
    lng: number;
    imageUrl: string;
    brand: string;
    model: string;
    yearApprox: string;
}

// 👉 cambia esto según tu entorno:
const BASE_URL = 'http://1.2.3.4:80';

/* Util: convertir data URL base64 -> File para enviar a /car-with-image */
async function dataUrlToFile(dataUrl: string, filename: string): Promise<File> {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type || 'image/jpeg' });
}

/**
 * Detección a partir de imagen subida por el usuario
 * POST /inference/car-with-image
 */
export async function detectCarFromImage(
    file: File,
): Promise<ImageDetectionResult> {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${BASE_URL}/inference/car-with-image`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Error detectCarFromImage: ${res.status}`);
    }

    const json = await res.json();
    const msg = json.message || {};

    return {
        imageUrl: URL.createObjectURL(file),
        brand: msg.brand ?? '',
        // backend usa model_name
        model: msg.model_name ?? '',
        yearApprox:
            (msg.year != null ? String(msg.year) : json.metadata?.yearApprox) ?? '',
    };
}

/**
 * Subir video y obtener crops en base64
 * POST /inference/car-with-video
 */
export async function uploadVideoAndGetCrops(
    file: File,
): Promise<VideoUploadResult> {
    const formData = new FormData();
    formData.append('file', file);

    // puedes ajustar los query params si quieres otros valores
    const url = new URL(`${BASE_URL}/inference/car-with-video`);
    url.searchParams.set('frame_stride', '5');
    url.searchParams.set('conf', '0.90');
    // url.searchParams.set('iou', '0.45');
    // url.searchParams.set('max_crops', '50');
    // url.searchParams.set('min_crop_side', '48');
    // url.searchParams.set('thumb_width', '256');
    // url.searchParams.append('vehicle_types', 'car');
    // url.searchParams.append('vehicle_types', 'truck');

    const res = await fetch(url.toString(), {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Error uploadVideoAndGetCrops: ${res.status}`);
    }

    const json = await res.json();

    const meta = json.metadata ?? {};
    const videoLat: number | null =
        meta.lat != null ? Number(meta.lat) : null;
    const videoLon: number | null =
        meta.lon != null ? Number(meta.lon) : null;
    const sourceVideoId: string | null =
        meta.source_video_id ?? meta.video_id ?? null;

    // Ajusta aquí según tu DetectResponse real
    const cropsRaw: any[] = json.crops ?? [];

    const crops: VideoCrop[] = cropsRaw.map((c, idx) => ({
        id: String(c.id ?? c.crop_id ?? idx),
        // 👇 OJO: aquí usamos thumb_b64 del backend
        imageUrl: c.thumb_b64,
        label: c.label ?? `Crop ${idx + 1}`,
        videoLat,
        videoLon,
        sourceVideoId,
    }));


    return {
        videoUrl: URL.createObjectURL(file),
        crops,
    };
}

/**
 * Detectar auto a partir de un crop (base64) de un video
 * Vuelve a usar /inference/car-with-image, pero enviando el crop
 * y heredando lat/lon + source_video_id.
 */
export async function detectCarFromCrop(
    crop: VideoCrop,
): Promise<CropDetectionResult> {
    if (!crop.imageUrl) {
        throw new Error('Crop sin imagen');
    }

    const file = await dataUrlToFile(crop.imageUrl, `${crop.id}.jpg`);

    const formData = new FormData();
    formData.append('file', file);

    if (crop.videoLat != null) {
        formData.append('lat', String(crop.videoLat));
    }
    if (crop.videoLon != null) {
        formData.append('lon', String(crop.videoLon));
    }
    if (crop.sourceVideoId) {
        formData.append('source_video_id', crop.sourceVideoId);
    }

    const res = await fetch(`${BASE_URL}/inference/car-with-image`, {
        method: 'POST',
        body: formData,
    });

    if (!res.ok) {
        throw new Error(`Error detectCarFromCrop: ${res.status}`);
    }

    const json = await res.json();
    const msg = json.message || {};

    return {
        brand: msg.brand ?? '',
        model: msg.model_name ?? '',
        yearApprox:
            (msg.year != null ? String(msg.year) : json.metadata?.yearApprox) ?? '',
    };
}

/**
 * Histórico para el mapa
 * GET /car/get_cars
 */
export async function fetchHistoryPoints(): Promise<HistoryPoint[]> {
    const res = await fetch(`${BASE_URL}/car/get_cars`);
    if (!res.ok) {
        throw new Error(`Error fetchHistoryPoints: ${res.status}`);
    }

    const rows: any[] = await res.json();

    const points: HistoryPoint[] = rows
        .filter(
            (r) =>
                r.lat != null &&
                r.lng != null,
        )
        .map((r) => ({
            id: r.id,
            lat: Number(r.lat),
            lng: Number(r.lng),
            brand: r.brand,
            model: r.model_name,
            yearApprox: r.year != null ? String(r.year) : '',
            // si luego guardas URL de imagen en la BD, la usas aquí;
            // por ahora placeholder:
            imageUrl: 'https://via.placeholder.com/160x90.png?text=Auto',
        }));

    return points;
}
