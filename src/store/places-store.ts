import { create } from 'zustand';
import type { PlaceSummary, PlaceDetail } from '@/types/places';

interface PlacesState {
	places: PlaceSummary[];
	selectedPlace: PlaceDetail | null;
	loading: boolean;
	detailLoading: boolean;
	upvotedIds: Set<string>;

	setPlaces: (places: PlaceSummary[]) => void;
	addPlace: (place: PlaceSummary) => void;
	setSelectedPlace: (place: PlaceDetail | null) => void;
	setLoading: (loading: boolean) => void;
	setDetailLoading: (loading: boolean) => void;

	optimisticUpvote: (placeId: string) => void;
	rollbackUpvote: (placeId: string, previousCount: number) => void;
}

export const usePlacesStore = create<PlacesState>((set) => ({
	places: [],
	selectedPlace: null,
	loading: false,
	detailLoading: false,
	upvotedIds: new Set(),

	setPlaces: (places) => set({ places }),
	addPlace: (place) => set((state) => ({ places: [...state.places, place] })),
	setSelectedPlace: (place) => set({ selectedPlace: place }),
	setLoading: (loading) => set({ loading }),
	setDetailLoading: (loading) => set({ detailLoading: loading }),

	optimisticUpvote: (placeId) =>
		set((state) => {
			const newUpvoted = new Set(state.upvotedIds);
			newUpvoted.add(placeId);

			const updatedPlaces = state.places.map((p) =>
				p.id === placeId
					? { ...p, upvote_count: p.upvote_count + 1 }
					: p
			);

			const updatedSelected =
				state.selectedPlace?.id === placeId
					? {
							...state.selectedPlace,
							upvote_count: state.selectedPlace.upvote_count + 1,
						}
					: state.selectedPlace;

			return {
				upvotedIds: newUpvoted,
				places: updatedPlaces,
				selectedPlace: updatedSelected,
			};
		}),

	rollbackUpvote: (placeId, previousCount) =>
		set((state) => {
			const newUpvoted = new Set(state.upvotedIds);
			newUpvoted.delete(placeId);

			const updatedPlaces = state.places.map((p) =>
				p.id === placeId ? { ...p, upvote_count: previousCount } : p
			);

			const updatedSelected =
				state.selectedPlace?.id === placeId
					? { ...state.selectedPlace, upvote_count: previousCount }
					: state.selectedPlace;

			return {
				upvotedIds: newUpvoted,
				places: updatedPlaces,
				selectedPlace: updatedSelected,
			};
		}),
}));
