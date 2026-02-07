export const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string || 'http://localhost:8000/v1'

// West Hollywood — heart of LGBTQ+ LA
export const DEFAULT_CENTER = {
  lng: -118.3617,
  lat: 34.0900,
} as const

export const DEFAULT_ZOOM = 13

export const CLUSTER_RADIUS = 60
export const CLUSTER_MAX_ZOOM = 16
