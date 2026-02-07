import { MOCK_SAFETY_SCORES } from '@/data/mock-safety'
import { haversineDistance } from '@/lib/geo'
import { delay } from './client'

export async function getSafetyScores(params: {
  lat: number
  lon: number
  radius?: number
}): Promise<[number, number, number][]> {
  await delay(200, 600)

  const { lat, lon, radius = 50000 } = params

  return MOCK_SAFETY_SCORES.filter(([sLon, sLat]) => {
    return haversineDistance(lat, lon, sLat, sLon) <= radius
  })
}
