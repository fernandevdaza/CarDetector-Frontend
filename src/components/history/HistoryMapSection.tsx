import { useEffect, useState } from 'react';
import SectionCard from '../common/SectionCard';
import {
    MapContainer,
    TileLayer,
    Marker,
    Popup,
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
    const [selectedPointId, setSelectedPointId] = useState<number | null>(null);

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

    const selectedPoint = points.find((p) => p.id === selectedPointId) ?? null;

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
                                click: () => {
                                    setCenter([p.lat, p.lng]);
                                    setZoom(15);
                                    setSelectedPointId(p.id);
                                },
                            }}
                        >
                            <Popup>
                                <div className="rounded-2xl bg-slate-900 border border-slate-700 shadow-lg shadow-slate-900/70 overflow-hidden w-56">
                                    <div className="w-full h-28 bg-slate-950 overflow-hidden">
                                        <img
                                            src={p.imageUrl}
                                            alt={`${p.brand} ${p.model}`}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="p-3 space-y-1">
                                        <p className="text-xs font-semibold text-slate-100">
                                            {p.brand} {p.model}
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            Año aprox: {p.yearApprox}
                                        </p>
                                        <p className="text-[11px] text-slate-500">
                                            Lat: {p.lat.toFixed(4)} · Lng: {p.lng.toFixed(4)}
                                        </p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {selectedPoint && (
                <div className="mt-3 text-xs text-slate-400">
                    Punto seleccionado:{' '}
                    <span className="font-medium text-slate-100">
                        {selectedPoint.brand} {selectedPoint.model}
                    </span>{' '}
                    · Año aprox: {selectedPoint.yearApprox}
                </div>
            )}
        </SectionCard>
    );
}
