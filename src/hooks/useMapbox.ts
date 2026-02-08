import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { MAPBOX_TOKEN, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/constants';
import { useMapStore } from '@/store/map-store';
import { applyRetroColors } from '@/lib/map-colors';

export function useMapbox(
	containerRef: React.RefObject<HTMLDivElement | null>
) {
	const mapRef = useRef<mapboxgl.Map | null>(null);
	const { setViewport, setMapFlyTo } = useMapStore();
	const initial3D = useMapStore.getState().is3D;

	useEffect(() => {
		if (!containerRef.current || mapRef.current) return;

		mapboxgl.accessToken = MAPBOX_TOKEN;
		let cancelled = false;

		const map = new mapboxgl.Map({
			container: containerRef.current,
			style: 'mapbox://styles/mapbox/standard',
			center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
			zoom: DEFAULT_ZOOM,
			pitch: initial3D ? 45 : 0,
			bearing: initial3D ? -15 : 0,
			attributionControl: false,
			antialias: true,
		});

		map.dragRotate.enable();
		map.touchZoomRotate.enableRotation();

		map.addControl(
			new mapboxgl.AttributionControl({ compact: true }),
			'bottom-right'
		);

		map.on('moveend', () => {
			const center = map.getCenter();
			setViewport({
				center: { lng: center.lng, lat: center.lat },
				zoom: map.getZoom(),
			});
		});

		// Register flyTo so other components can trigger it via store
		setMapFlyTo((lng: number, lat: number, zoom: number) => {
			map.flyTo({ center: [lng, lat], zoom, duration: 1200 });
		});

		// Apply retro colors when style loads
		const handleStyleLoad = () => {
			if (cancelled) return;
			applyRetroColors(map);
		};
		map.on('style.load', handleStyleLoad);
		if (map.isStyleLoaded()) handleStyleLoad();

		// Enable 3D buildings when style is ready
		const add3DBuildings = () => {
			if (cancelled) return;
			if (map.getLayer('3d-buildings')) return;
			const layers = map.getStyle().layers;
			// Find the first symbol layer to insert 3D buildings below labels
			let labelLayerId: string | undefined;
			if (layers) {
				for (const layer of layers) {
					if (
						layer.type === 'symbol' &&
						layer.layout &&
						'text-field' in layer.layout
					) {
						labelLayerId = layer.id;
						break;
					}
				}
			}
			map.addLayer(
				{
					id: '3d-buildings',
					source: 'composite',
					'source-layer': 'building',
					filter: ['==', 'extrude', 'true'],
					type: 'fill-extrusion',
					minzoom: 12,
					layout: {
						visibility: initial3D ? 'visible' : 'none',
					},
					paint: {
						'fill-extrusion-color': '#FDF6EC',
						'fill-extrusion-height': [
							'interpolate',
							['linear'],
							['zoom'],
							12,
							0,
							14,
							['get', 'height'],
						],
						'fill-extrusion-base': [
							'interpolate',
							['linear'],
							['zoom'],
							12,
							0,
							14,
							['get', 'min_height'],
						],
						'fill-extrusion-opacity': 0.5,
					},
				},
				labelLayerId
			);
		};
		map.on('style.load', add3DBuildings);
		if (map.isStyleLoaded()) add3DBuildings();

		mapRef.current = map;

		return () => {
			cancelled = true;
			map.off('style.load', handleStyleLoad);
			map.off('style.load', add3DBuildings);
			map.remove();
			mapRef.current = null;
		};
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	return mapRef;
}
