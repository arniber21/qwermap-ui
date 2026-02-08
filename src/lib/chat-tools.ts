import { useMapStore } from '@/store/map-store';
import { usePlacesStore } from '@/store/places-store';
import { MOCK_PLACES } from '@/data/mock-places';
import { CATEGORY_CONFIG } from '@/data/categories';
import type { Category, PlaceType } from '@/types/places';

function fuzzyMatch(query: string, text: string): boolean {
	return text.toLowerCase().includes(query.toLowerCase());
}

export function flyToPlace(name: string): string {
	const place = MOCK_PLACES.find((p) => fuzzyMatch(name, p.name));
	if (!place) return `Could not find a place matching "${name}".`;

	const { flyTo } = useMapStore.getState();
	const [lng, lat] = place.location.coordinates;
	flyTo(lng, lat, 16);

	// Also select it in the detail panel
	usePlacesStore.getState().setSelectedPlace(place);

	return `Flying to ${place.name} at (${lat.toFixed(4)}, ${lng.toFixed(4)}).`;
}

export function zoomIn(): string {
	const { viewport, flyTo } = useMapStore.getState();
	const newZoom = Math.min(viewport.zoom + 2, 20);
	flyTo(viewport.center.lng, viewport.center.lat, newZoom);
	return `Zoomed in to level ${newZoom.toFixed(1)}.`;
}

export function zoomOut(): string {
	const { viewport, flyTo } = useMapStore.getState();
	const newZoom = Math.max(viewport.zoom - 2, 1);
	flyTo(viewport.center.lng, viewport.center.lat, newZoom);
	return `Zoomed out to level ${newZoom.toFixed(1)}.`;
}

export function toggleSafetyHeatmap(show: boolean): string {
	const { layers, toggleLayer } = useMapStore.getState();
	if (layers.safetyHeatmap !== show) toggleLayer('safetyHeatmap');
	return show
		? 'Safety heatmap is now visible.'
		: 'Safety heatmap is now hidden.';
}

export function searchPlaces(params: {
	category?: string;
	type?: string;
	query?: string;
}): string {
	let results = [...MOCK_PLACES];

	if (params.query) {
		const q = params.query.toLowerCase();
		results = results.filter(
			(p) =>
				p.name.toLowerCase().includes(q) ||
				(p.description?.toLowerCase().includes(q) ?? false)
		);
	}

	if (params.category) {
		results = results.filter(
			(p) => p.category === (params.category as Category)
		);
	}

	if (params.type) {
		results = results.filter(
			(p) => p.place_type === (params.type as PlaceType)
		);
	}

	if (results.length === 0) return 'No places match your search criteria.';

	return results
		.slice(0, 8)
		.map((p) => {
			const cfg = CATEGORY_CONFIG[p.category];
			return `- **${p.name}** (${cfg.label}) — Safety: ${p.safety_score}/100, Upvotes: ${p.upvote_count}`;
		})
		.join('\n');
}

export function getPlaceDetails(name: string): string {
	const place = MOCK_PLACES.find((p) => fuzzyMatch(name, p.name));
	if (!place) return `Could not find a place matching "${name}".`;

	const cfg = CATEGORY_CONFIG[place.category];
	const lines = [
		`**${place.name}**`,
		`Category: ${cfg.label}`,
		`Type: ${place.place_type === 'historical' ? 'Historical' : 'Active'}`,
		place.era ? `Era: ${place.era}` : '',
		`Safety Score: ${place.safety_score}/100`,
		`Upvotes: ${place.upvote_count}`,
		place.address ? `Address: ${place.address}` : '',
		place.description ? `\n${place.description}` : '',
	];

	return lines.filter(Boolean).join('\n');
}
