/**
 * Apply warm retro-modern color tinting to a Mapbox map.
 * Must be called after the style has loaded.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyRetroColors(map: any) {
	const layers = map.getStyle().layers;
	if (!layers) return;

	for (const layer of layers) {
		const id = layer.id;
		if (!map.getLayer(id)) continue;

		// Background → warm cream
		if (layer.type === 'background') {
			map.setPaintProperty(id, 'background-color', '#FFFDF8');
			continue;
		}

		// Water fills → soft sky blue
		if (id.includes('water') && layer.type === 'fill') {
			map.setPaintProperty(id, 'fill-color', '#C8E8F2');
			continue;
		}

		// Parks and landuse → sage green
		if (
			(id.includes('park') || id.includes('landuse')) &&
			layer.type === 'fill'
		) {
			map.setPaintProperty(id, 'fill-color', '#D0E2D1');
			continue;
		}

		// Buildings → warm cream with transparency
		if (id.includes('building') && layer.type === 'fill') {
			map.setPaintProperty(id, 'fill-color', '#FDF6EC');
			map.setPaintProperty(id, 'fill-opacity', 0.7);
			continue;
		}

		// Road lines → muted warm tone
		if (id.startsWith('road') && layer.type === 'line') {
			map.setPaintProperty(id, 'line-color', '#E8E2D8');
			map.setPaintProperty(id, 'line-opacity', 0.8);
			continue;
		}
	}
}
