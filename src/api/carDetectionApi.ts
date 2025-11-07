export interface ImageDetectionResult {
    imageUrl: string;
    brand: string;
    model: string;
    yearApprox: string;
}

export interface VideoCrop {
    id: string;
    imageUrl: string;
    label: string;
}

export interface VideoUploadResult {
    videoUrl: string;
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

// MOCKS – aquí enchufas tu backend real
export async function detectCarFromImage(
    file: File,
): Promise<ImageDetectionResult> {
    return new Promise((resolve) =>
        setTimeout(
            () =>
                resolve({
                    imageUrl: URL.createObjectURL(file),
                    brand: 'Toyota',
                    model: 'Corolla',
                    yearApprox: '2015–2018',
                }),
            800,
        ),
    );
}

export async function uploadVideoAndGetCrops(
    file: File,
): Promise<VideoUploadResult> {
    return new Promise((resolve) =>
        setTimeout(
            () =>
                resolve({
                    videoUrl: URL.createObjectURL(file),
                    crops: [
                        {
                            id: 'crop-1',
                            imageUrl: 'data:image/jpeg;base64,AAA...',
                            label: 'Crop 1',
                        },
                        {
                            id: 'crop-2',
                            imageUrl: 'data:image/jpeg;base64,BBB...',
                            label: 'Crop 2',
                        },
                    ],
                }),
            800,
        ),
    );
}

export async function detectCarFromCrop(
    cropId: string,
): Promise<CropDetectionResult> {
    console.log('Detect from crop', cropId);

    return new Promise((resolve) =>
        setTimeout(
            () =>
                resolve({
                    brand: 'Honda',
                    model: 'Civic',
                    yearApprox: '2018–2020',
                }),
            800,
        ),
    );
}

export async function fetchHistoryPoints(): Promise<HistoryPoint[]> {
    return new Promise((resolve) =>
        setTimeout(
            () =>
                resolve([
                    {
                        id: 1,
                        lat: -17.7833,
                        lng: -63.1821,
                        imageUrl: 'https://via.placeholder.com/160x90.png?text=Auto+1',
                        brand: 'Ford',
                        model: 'Focus',
                        yearApprox: '2012–2015',
                    },
                    {
                        id: 2,
                        lat: -17.79,
                        lng: -63.19,
                        imageUrl: 'https://via.placeholder.com/160x90.png?text=Auto+2',
                        brand: 'Toyota',
                        model: 'Yaris',
                        yearApprox: '2016–2019',
                    },
                ]),
            600,
        ),
    );
}
