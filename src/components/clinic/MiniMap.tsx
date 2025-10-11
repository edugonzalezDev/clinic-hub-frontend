export default function MiniMap({ lat, lng }: { lat: number; lng: number }) {
    const bbox = `${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}`;
    const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
    return (
        <div className="rounded-xl overflow-hidden border bg-muted">
            <iframe
                title="map"
                src={src}
                className="w-full h-48"
                style={{ border: 0 }}
                loading="lazy"
            />
        </div>
    );
}
