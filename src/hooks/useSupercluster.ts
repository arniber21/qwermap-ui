import { useMemo } from 'react';
import Supercluster from 'supercluster';
import type { PlaceSummary } from '@/types/places';
import { CLUSTER_RADIUS, CLUSTER_MAX_ZOOM } from '@/lib/constants';

interface ClusterProperties {
	cluster: boolean;
	point_count: number;
	point_count_abbreviated: string;
}

interface PointProperties {
	cluster: false;
	placeId: string;
	name: string;
	category: string;
	place_type: string;
	safety_score: number;
}

export type ClusterFeature = Supercluster.ClusterFeature<ClusterProperties>;
export type PointFeature = Supercluster.PointFeature<PointProperties>;

export function useSupercluster(
	places: PlaceSummary[],
	bounds: [number, number, number, number] | null,
	zoom: number
) {
	const points: GeoJSON.Feature<GeoJSON.Point, PointProperties>[] = useMemo(
		() =>
			places.map((p) => ({
				type: 'Feature' as const,
				properties: {
					cluster: false as const,
					placeId: p.id,
					name: p.name,
					category: p.category,
					place_type: p.place_type,
					safety_score: p.safety_score,
				},
				geometry: {
					type: 'Point' as const,
					coordinates: p.location.coordinates,
				},
			})),
		[places]
	);

	const index = useMemo(() => {
		const sc = new Supercluster<PointProperties, ClusterProperties>({
			radius: CLUSTER_RADIUS,
			maxZoom: CLUSTER_MAX_ZOOM,
		});
		sc.load(points);
		return sc;
	}, [points]);

	const clusters = useMemo(() => {
		if (!bounds) return [];
		return index.getClusters(bounds, Math.floor(zoom));
	}, [index, bounds, zoom]);

	return { clusters, index };
}
