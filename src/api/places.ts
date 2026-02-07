import { MOCK_PLACES } from '@/data/mock-places'
import { haversineDistance } from '@/lib/geo'
import type { PlaceDetail, PlaceSubmission, PlaceSummary, UpvoteResponse } from '@/types/places'
import type { PlacesListResponse } from '@/types/api'
import { delay, fakeTxId, nextPlaceId } from './client'

// In-memory store so new submissions persist during session
const places: PlaceDetail[] = [...MOCK_PLACES]
const upvoteFingerprints = new Map<string, Set<string>>()

export async function getPlaces(params: {
  lat: number
  lon: number
  radius?: number
  type?: 'current' | 'historical' | 'all'
  category?: string
  limit?: number
  offset?: number
}): Promise<PlacesListResponse> {
  await delay()

  const {
    lat,
    lon,
    radius = 50000,
    type = 'all',
    limit = 50,
    offset = 0,
  } = params

  let filtered = places.filter((p) => {
    const [pLon, pLat] = p.location.coordinates
    const dist = haversineDistance(lat, lon, pLat, pLon)
    if (dist > radius) return false
    if (type !== 'all' && p.place_type !== type) return false
    return true
  })

  // Add distance
  const withDistance: PlaceSummary[] = filtered.map((p) => {
    const [pLon, pLat] = p.location.coordinates
    return {
      id: p.id,
      transaction_id: p.transaction_id,
      name: p.name,
      location: p.location,
      place_type: p.place_type,
      category: p.category,
      safety_score: p.safety_score,
      upvote_count: p.upvote_count,
      distance_meters: haversineDistance(lat, lon, pLat, pLon),
      status: p.status,
      created_at: p.created_at,
    }
  })

  // Sort by distance
  withDistance.sort((a, b) => (a.distance_meters ?? 0) - (b.distance_meters ?? 0))

  return {
    places: withDistance.slice(offset, offset + limit),
    total: withDistance.length,
    offset,
    limit,
  }
}

export async function getPlaceDetail(id: string): Promise<PlaceDetail | null> {
  await delay(200, 500)
  return places.find((p) => p.id === id) ?? null
}

export async function submitPlace(
  submission: PlaceSubmission,
  _fingerprint: string,
): Promise<{ transaction_id: string; place_id: string; status: 'approved' }> {
  await delay(800, 1500) // Simulate blockchain latency

  const placeId = nextPlaceId()
  const txId = fakeTxId()

  const newPlace: PlaceDetail = {
    id: placeId,
    transaction_id: txId,
    name: submission.name,
    location: submission.location,
    place_type: submission.place_type,
    category: submission.category,
    safety_score: 50,
    upvote_count: 0,
    status: 'approved',
    created_at: new Date().toISOString(),
    description: submission.description,
    era: submission.era,
    photos: submission.photos,
    address: submission.address,
    additional_info: submission.additional_info,
  }

  places.push(newPlace)

  return {
    transaction_id: txId,
    place_id: placeId,
    status: 'approved',
  }
}

export async function upvotePlace(
  id: string,
  fingerprint: string,
): Promise<UpvoteResponse> {
  await delay(400, 900)

  // Check for duplicate upvote
  const placeFingerprints = upvoteFingerprints.get(id) ?? new Set()
  if (placeFingerprints.has(fingerprint)) {
    throw { error: 'Conflict', message: 'Already upvoted', code: 'ALREADY_UPVOTED' }
  }

  placeFingerprints.add(fingerprint)
  upvoteFingerprints.set(id, placeFingerprints)

  const place = places.find((p) => p.id === id)
  if (!place) {
    throw { error: 'Not Found', message: 'Place not found', code: 'PLACE_NOT_FOUND' }
  }

  place.upvote_count += 1
  place.safety_score = Math.min(100, place.safety_score + 0.5)

  return {
    transaction_id: fakeTxId(),
    new_upvote_count: place.upvote_count,
    new_safety_score: place.safety_score,
  }
}
