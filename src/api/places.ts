import type {
	PlaceDetail,
	PlaceSubmission,
	UpvoteResponse,
} from '@/types/places';
import type { PlacesListResponse } from '@/types/api';
import { api } from './client';

export async function getPlaces(params: {
	lat: number;
	lon: number;
	radius?: number;
	type?: 'current' | 'historical' | 'all';
	category?: string;
	limit?: number;
	offset?: number;
}): Promise<PlacesListResponse> {
	return api.get<PlacesListResponse>('/places', params);
}

export async function getPlaceDetail(
	id: string,
): Promise<PlaceDetail | null> {
	try {
		return await api.get<PlaceDetail>('/places/' + id);
	} catch {
		return null;
	}
}

export async function submitPlace(
	submission: PlaceSubmission,
	fingerprint: string,
): Promise<{ transaction_id: string; place_id: string; status: 'approved' }> {
	return api.post('/places', submission, {
		'X-Client-Fingerprint': fingerprint,
	});
}

export async function upvotePlace(
	id: string,
	fingerprint: string,
): Promise<UpvoteResponse> {
	return api.post('/places/' + id + '/upvote', {}, {
		'X-Client-Fingerprint': fingerprint,
	});
}
