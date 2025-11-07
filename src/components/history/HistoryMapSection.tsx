import { useEffect, useState } from 'react';
import SectionCard from '../common/SectionCard';
import {
    MapContainer,
    TileLayer,
    Marker,
    useMap,
} from 'react-leaflet';
import { type LatLngExpression, icon, Marker as MarkerL } from 'leaflet';
import { fetchHistoryPoints, type HistoryPoint } from '../../api/carDetectionApi';

// Icono default
const defaultIcon = icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
(MarkerL as any).prototype.options.icon = defaultIcon;

interface FlyToOnClickProps {
    position: LatLngExpression;
    zoom: number;
}

function FlyToOnClick({ position, zoom }: FlyToOnClickProps) {
    const map = useMap();
    useEffect(() => {
        if (position) {
            map.flyTo(position, zoom, { duration: 0.6 });
        }
    }, [position, zoom, map]);
    return null;
}

export default function HistoryMapSection() {
    const [points, setPoints] = useState<HistoryPoint[]>([]);
    const [center, setCenter] = useState<LatLngExpression>([
        -17.7833, -63.1821,
    ]);
    const [zoom, setZoom] = useState(12);

    // 👉 lista de autos en la ubicación seleccionada
    const [selectedCars, setSelectedCars] = useState<HistoryPoint[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const data = await fetchHistoryPoints();
                setPoints(data);
                if (data.length > 0) {
                    setCenter([data[0].lat, data[0].lng]);
                }
            } catch (err) {
                console.error(err);
            }
        })();
    }, []);

    const handleMarkerClick = (p: HistoryPoint) => {
        setCenter([p.lat, p.lng]);
        setZoom(15);

        // todos los autos con misma lat/lng
        const sameLocationCars = points.filter(
            (q) =>
                Math.abs(q.lat - p.lat) < 1e-6 &&
                Math.abs(q.lng - p.lng) < 1e-6,
        );
        setSelectedCars(sameLocationCars);
    };

    return (
        <SectionCard
            title="Histórico de detecciones"
            subtitle="Explora en el mapa los autos detectados a partir de las fotos y videos."
        >
            <div className="h-[380px] rounded-2xl border border-slate-800 overflow-hidden bg-slate-950">
                <MapContainer
                    center={center}
                    zoom={zoom}
                    className="h-full w-full"
                    scrollWheelZoom
                >
                    <TileLayer
                        attribution="&copy; OpenStreetMap"
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <FlyToOnClick position={center} zoom={zoom} />

                    {points.map((p) => (
                        <Marker
                            key={p.id}
                            position={[p.lat, p.lng]}
                            eventHandlers={{
                                click: () => handleMarkerClick(p),
                            }}
                        />
                    ))}
                </MapContainer>
            </div>

            {/* Panel de lista debajo del mapa */}
            {selectedCars.length > 0 && (
                <div className="mt-4 max-h-40 overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-3">
                    <p className="text-xs text-slate-400 mb-2">
                        Vehículos en esta ubicación ({selectedCars.length})
                    </p>
                    <ul className="space-y-1 text-sm">
                        {selectedCars.map((car) => (
                            <li
                                key={car.id}
                                className="truncate text-slate-100"
                            >
                                {car.brand} {car.model} {car.yearApprox}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedCars.length === 0 && (
                <div className="mt-3 text-xs text-slate-500">
                    Haz clic en un punto del mapa para ver los autos detectados en esa ubicación.
                </div>
            )}
        </SectionCard>
    );
}
