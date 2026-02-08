import { create } from 'zustand';
import type { Viewport, LayerVisibility } from '@/types/map';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/constants';

interface MapState {
	viewport: Viewport;
	layers: LayerVisibility;
	setViewport: (viewport: Viewport) => void;
	toggleLayer: (layer: keyof LayerVisibility) => void;
	flyTo: (lng: number, lat: number, zoom?: number) => void;
	// This gets set by the map component so other code can trigger flyTo
	_mapFlyTo: ((lng: number, lat: number, zoom: number) => void) | null;
	setMapFlyTo: (fn: (lng: number, lat: number, zoom: number) => void) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
	viewport: {
		center: { lng: DEFAULT_CENTER.lng, lat: DEFAULT_CENTER.lat },
		zoom: DEFAULT_ZOOM,
	},
	layers: {
		safetyHeatmap: false,
	},
	setViewport: (viewport) => set({ viewport }),
	toggleLayer: (layer) =>
		set((state) => ({
			layers: { ...state.layers, [layer]: !state.layers[layer] },
		})),
	flyTo: (lng, lat, zoom = 15) => {
		const mapFlyTo = get()._mapFlyTo;
		if (mapFlyTo) mapFlyTo(lng, lat, zoom);
	},
	_mapFlyTo: null,
	setMapFlyTo: (fn) => set({ _mapFlyTo: fn }),
}));
