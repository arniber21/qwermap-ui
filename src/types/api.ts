import type { PlaceSummary } from './places'

export interface ApiError {
  error: string
  message: string
  code: string
}

export interface PlacesListResponse {
  places: PlaceSummary[]
  total: number
  offset: number
  limit: number
}

export interface SafetyScoreResponse {
  location: { lat: number; lon: number }
  radius_meters: number
  safety_score: number
  place_count: number
  total_upvotes: number
}
