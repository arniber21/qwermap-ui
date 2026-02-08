export interface GeoJSONPoint {
	type: 'Point';
	coordinates: [number, number]; // [longitude, latitude]
}

export type PlaceType = 'current' | 'historical';

export type Category =
	| 'bar'
	| 'cafe'
	| 'library'
	| 'community_center'
	| 'bookstore'
	| 'park'
	| 'art_space'
	| 'other';

export type ModerationStatus = 'pending' | 'approved' | 'rejected';

export interface PlaceSummary {
	id: string;
	transaction_id: string;
	name: string;
	location: GeoJSONPoint;
	place_type: PlaceType;
	category: Category;
	safety_score: number;
	upvote_count: number;
	distance_meters?: number;
	status: ModerationStatus;
	created_at: string;
}

export interface PlaceDetail extends PlaceSummary {
	description?: string;
	era?: string;
	photos?: string[];
	address?: string;
	additional_info?: Record<string, unknown>;
	on_chain_data?: {
		account_address: string;
		raw_data: Record<string, unknown>;
	};
	indexed_at?: string;
}

export interface PlaceSubmission {
	name: string;
	description?: string;
	location: GeoJSONPoint;
	place_type: PlaceType;
	category: Category;
	era?: string;
	photos?: string[];
	address?: string;
	additional_info?: Record<string, unknown>;
}

export interface SubmitPlaceResponse {
	transaction_id: string;
	place_id: string;
	status: ModerationStatus;
}

export interface UpvoteResponse {
	transaction_id: string;
	new_upvote_count: number;
	new_safety_score: number;
}
