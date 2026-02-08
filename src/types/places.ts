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

export type Significance = 'local' | 'regional' | 'national' | 'international';
export type StillExists = 'yes' | 'no' | 'partial' | 'unknown';

export interface HistoricalEvent {
	title: string;
	date?: string;
	description?: string;
	source_url?: string;
}

export interface RelatedFigure {
	name: string;
	role?: string;
	description?: string;
}

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
	movements?: string[];
	significance?: Significance;
	still_exists?: StillExists;
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
	events?: HistoricalEvent[];
	related_figures?: RelatedFigure[];
	community_tags?: string[];
	site_types?: string[];
	year_opened?: number;
	year_closed?: number;
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
	year_opened?: number;
	year_closed?: number;
	still_exists?: StillExists;
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
