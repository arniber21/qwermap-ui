import { create } from 'zustand';
import type { Category, PlaceType } from '@/types/places';

interface SearchState {
	isOpen: boolean;
	query: string;
	selectedCategories: Set<Category>;
	placeTypeFilter: 'all' | PlaceType;
	sortBy: 'distance' | 'safety_score' | 'upvotes';

	togglePanel: () => void;
	setQuery: (query: string) => void;
	toggleCategory: (category: Category) => void;
	setPlaceTypeFilter: (filter: 'all' | PlaceType) => void;
	setSortBy: (sortBy: 'distance' | 'safety_score' | 'upvotes') => void;
	resetFilters: () => void;
}

export const useSearchStore = create<SearchState>((set) => ({
	isOpen: false,
	query: '',
	selectedCategories: new Set(),
	placeTypeFilter: 'all',
	sortBy: 'upvotes',

	togglePanel: () => set((s) => ({ isOpen: !s.isOpen })),
	setQuery: (query) => set({ query }),
	toggleCategory: (category) =>
		set((s) => {
			const next = new Set(s.selectedCategories);
			if (next.has(category)) {
				next.delete(category);
			} else {
				next.add(category);
			}
			return { selectedCategories: next };
		}),
	setPlaceTypeFilter: (placeTypeFilter) => set({ placeTypeFilter }),
	setSortBy: (sortBy) => set({ sortBy }),
	resetFilters: () =>
		set({
			query: '',
			selectedCategories: new Set(),
			placeTypeFilter: 'all',
			sortBy: 'upvotes',
		}),
}));
