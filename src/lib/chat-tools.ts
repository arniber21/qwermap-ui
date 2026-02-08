import { useMapStore } from '@/store/map-store';
import { usePlacesStore } from '@/store/places-store';
import { MOCK_PLACES } from '@/data/mock-places';
import { CATEGORY_CONFIG } from '@/data/categories';
import type { Category, PlaceType, PlaceDetail } from '@/types/places';

function fuzzyMatch(query: string, text: string): boolean {
	return text.toLowerCase().includes(query.toLowerCase());
}

function humanizeTag(tag: string): string {
	return tag
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

/** City bounding boxes for filtering by approximate coordinates */
const CITY_BOUNDS: Record<string, { minLng: number; maxLng: number; minLat: number; maxLat: number }> = {
	la: { minLng: -118.7, maxLng: -118.1, minLat: 33.7, maxLat: 34.2 },
	sf: { minLng: -122.6, maxLng: -122.3, minLat: 37.7, maxLat: 37.85 },
	nyc: { minLng: -74.1, maxLng: -73.8, minLat: 40.6, maxLat: 40.9 },
	miami: { minLng: -80.4, maxLng: -80.05, minLat: 25.7, maxLat: 25.95 },
};

function isInCity(place: PlaceDetail, city: string): boolean {
	const bounds = CITY_BOUNDS[city];
	if (!bounds) return true;
	const [lng, lat] = place.location.coordinates;
	return lng >= bounds.minLng && lng <= bounds.maxLng && lat >= bounds.minLat && lat <= bounds.maxLat;
}

/** Get all available places from store + mock fallback */
function getAllPlaces(): PlaceDetail[] {
	return MOCK_PLACES;
}

export function flyToPlace(name: string): string {
	const place = getAllPlaces().find((p) => fuzzyMatch(name, p.name));
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
	city?: string;
}): string {
	let results = getAllPlaces();

	if (params.city) {
		results = results.filter((p) => isInCity(p, params.city!));
	}

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

	const header = `Found ${results.length} place${results.length === 1 ? '' : 's'}:\n`;
	return (
		header +
		results
			.slice(0, 8)
			.map((p) => {
				const cfg = CATEGORY_CONFIG[p.category];
				const sig = p.significance ? ` [${humanizeTag(p.significance)}]` : '';
				return `- **${p.name}** (${cfg.label})${sig} — Safety: ${p.safety_score}/100`;
			})
			.join('\n') +
		(results.length > 8 ? `\n...and ${results.length - 8} more` : '')
	);
}

export function getPlaceDetails(name: string): string {
	const place = getAllPlaces().find((p) => fuzzyMatch(name, p.name));
	if (!place) return `Could not find a place matching "${name}".`;

	const cfg = CATEGORY_CONFIG[place.category];
	const lines = [
		`**${place.name}**`,
		`Category: ${cfg.label}`,
		`Type: ${place.place_type === 'historical' ? 'Historical' : 'Active'}`,
		place.year_opened
			? `Years: ${place.year_opened}–${place.year_closed ?? (place.still_exists === 'yes' ? 'present' : '?')}`
			: place.era
				? `Era: ${place.era}`
				: '',
		place.significance ? `Significance: ${humanizeTag(place.significance)}` : '',
		place.still_exists && place.still_exists !== 'unknown'
			? `Still exists: ${place.still_exists}`
			: '',
		`Safety Score: ${place.safety_score}/100`,
		`Upvotes: ${place.upvote_count}`,
		place.address ? `Address: ${place.address}` : '',
		place.description ? `\n${place.description}` : '',
	];

	// Events
	if (place.events && place.events.length > 0) {
		lines.push('\n**Key Events:**');
		for (const e of place.events) {
			lines.push(`- ${e.date ? `(${e.date}) ` : ''}${e.title}${e.description ? ` — ${e.description}` : ''}`);
		}
	}

	// Related figures
	if (place.related_figures && place.related_figures.length > 0) {
		lines.push('\n**Related Figures:**');
		for (const f of place.related_figures) {
			lines.push(`- **${f.name}**${f.role ? ` (${f.role})` : ''}${f.description ? ` — ${f.description}` : ''}`);
		}
	}

	// Tags
	if (place.movements && place.movements.length > 0) {
		lines.push(`\nMovements: ${place.movements.map(humanizeTag).join(', ')}`);
	}
	if (place.community_tags && place.community_tags.length > 0) {
		lines.push(`Communities: ${place.community_tags.map(humanizeTag).join(', ')}`);
	}

	return lines.filter(Boolean).join('\n');
}

export function exploreMovement(movement: string): string {
	const normalized = movement.toLowerCase().replace(/\s+/g, '_');
	const places = getAllPlaces().filter(
		(p) => p.movements?.includes(normalized)
	);

	if (places.length === 0) {
		return `No places found connected to the "${humanizeTag(normalized)}" movement. Try: stonewall, aids_activism, trans_rights, gay_liberation, marriage_equality, pride, drag_culture, ballroom_culture, homophile_movement.`;
	}

	const header = `**${humanizeTag(normalized)}** — ${places.length} connected place${places.length === 1 ? '' : 's'}:\n`;
	return (
		header +
		places
			.slice(0, 10)
			.map((p) => {
				const sig = p.significance ? ` [${humanizeTag(p.significance)}]` : '';
				return `- **${p.name}**${sig}${p.year_opened ? ` (${p.year_opened})` : ''}`;
			})
			.join('\n') +
		(places.length > 10 ? `\n...and ${places.length - 10} more` : '')
	);
}

export function findFigures(query: string): string {
	const q = query.toLowerCase();
	const results: Array<{
		figure: { name: string; role?: string; description?: string };
		placeName: string;
	}> = [];

	for (const place of getAllPlaces()) {
		if (!place.related_figures) continue;
		for (const fig of place.related_figures) {
			if (
				fig.name.toLowerCase().includes(q) ||
				(fig.role && fig.role.toLowerCase().includes(q)) ||
				(fig.description && fig.description.toLowerCase().includes(q))
			) {
				results.push({ figure: fig, placeName: place.name });
			}
		}
	}

	if (results.length === 0) {
		return `No figures found matching "${query}". Try searching for names like "Harvey Milk", "Marsha P. Johnson", or roles like "Founder" or "Activist".`;
	}

	const header = `Found ${results.length} result${results.length === 1 ? '' : 's'}:\n`;
	return (
		header +
		results
			.slice(0, 8)
			.map(
				(r) =>
					`- **${r.figure.name}**${r.figure.role ? ` (${r.figure.role})` : ''} — at ${r.placeName}${r.figure.description ? `. ${r.figure.description}` : ''}`
			)
			.join('\n')
	);
}

export function browseTimeline(startYear: number, endYear: number): string {
	const events: Array<{
		date: string;
		title: string;
		description?: string;
		placeName: string;
		year: number;
	}> = [];

	for (const place of getAllPlaces()) {
		if (!place.events) continue;
		for (const e of place.events) {
			if (!e.date) continue;
			// Extract year from flexible date formats
			const yearMatch = e.date.match(/\d{4}/);
			if (!yearMatch) continue;
			const year = parseInt(yearMatch[0], 10);
			if (year >= startYear && year <= endYear) {
				events.push({
					date: e.date,
					title: e.title,
					description: e.description,
					placeName: place.name,
					year,
				});
			}
		}
	}

	if (events.length === 0) {
		return `No events found between ${startYear} and ${endYear}.`;
	}

	// Sort chronologically
	events.sort((a, b) => a.year - b.year);

	const header = `**Timeline ${startYear}–${endYear}** — ${events.length} event${events.length === 1 ? '' : 's'}:\n`;
	return (
		header +
		events
			.slice(0, 12)
			.map(
				(e) =>
					`- **${e.date}**: ${e.title} _(${e.placeName})_${e.description ? ` — ${e.description}` : ''}`
			)
			.join('\n') +
		(events.length > 12 ? `\n...and ${events.length - 12} more` : '')
	);
}

export function filterByCommunity(tag: string): string {
	const normalized = tag.toLowerCase().replace(/\s+/g, '_');
	const places = getAllPlaces().filter(
		(p) => p.community_tags?.includes(normalized)
	);

	if (places.length === 0) {
		return `No places found for "${humanizeTag(normalized)}" community. Try: lesbian, gay, trans, bisexual, queer, nonbinary, bipoc_queer, drag, leather, two_spirit, youth, elders.`;
	}

	const header = `**${humanizeTag(normalized)}** community — ${places.length} place${places.length === 1 ? '' : 's'}:\n`;
	return (
		header +
		places
			.slice(0, 10)
			.map((p) => {
				const cfg = CATEGORY_CONFIG[p.category];
				return `- **${p.name}** (${cfg.label})${p.year_opened ? ` — est. ${p.year_opened}` : ''}`;
			})
			.join('\n') +
		(places.length > 10 ? `\n...and ${places.length - 10} more` : '')
	);
}
