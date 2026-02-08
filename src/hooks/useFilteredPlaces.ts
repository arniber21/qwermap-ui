import { useMemo } from 'react';
import { usePlacesStore } from '@/store/places-store';
import { useSearchStore } from '@/store/search-store';
import type { PlaceSummary } from '@/types/places';

export function useFilteredPlaces() {
	const places = usePlacesStore((s) => s.places);
	const query = useSearchStore((s) => s.query);
	const selectedCategories = useSearchStore((s) => s.selectedCategories);
	const placeTypeFilter = useSearchStore((s) => s.placeTypeFilter);
	const sortBy = useSearchStore((s) => s.sortBy);

	const filteredPlaces = useMemo(() => {
		let result: PlaceSummary[] = places;

		// Text search (name match)
		if (query.trim()) {
			const q = query.toLowerCase().trim();
			result = result.filter((p) => p.name.toLowerCase().includes(q));
		}

		// Category filter
		if (selectedCategories.size > 0) {
			result = result.filter((p) => selectedCategories.has(p.category));
		}

		// Place type filter
		if (placeTypeFilter !== 'all') {
			result = result.filter((p) => p.place_type === placeTypeFilter);
		}

		// Sort
		result = [...result].sort((a, b) => {
			switch (sortBy) {
				case 'safety_score':
					return b.safety_score - a.safety_score;
				case 'upvotes':
					return b.upvote_count - a.upvote_count;
				case 'distance':
					return (
						(a.distance_meters ?? Infinity) -
						(b.distance_meters ?? Infinity)
					);
			}
		});

		return result;
	}, [places, query, selectedCategories, placeTypeFilter, sortBy]);

	return { filteredPlaces, resultCount: filteredPlaces.length };
}
