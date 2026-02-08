export interface Viewport {
	center: { lng: number; lat: number };
	zoom: number;
}

export interface LayerVisibility {
	safetyHeatmap: boolean;
}

export interface MapBounds {
	north: number;
	south: number;
	east: number;
	west: number;
}
