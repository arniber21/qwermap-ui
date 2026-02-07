const EARTH_RADIUS_M = 6371000

export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
  return EARTH_RADIUS_M * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function zoomToRadius(zoom: number): number {
  // Approximate visible radius in meters based on zoom level
  return (40075016.686 * Math.cos(34.09 * (Math.PI / 180))) / (2 ** zoom * 2)
}

export function getBoundsFromCenter(
  lng: number,
  lat: number,
  radiusM: number,
): [number, number, number, number] {
  const latDelta = (radiusM / EARTH_RADIUS_M) * (180 / Math.PI)
  const lngDelta = latDelta / Math.cos(lat * (Math.PI / 180))
  return [lng - lngDelta, lat - latDelta, lng + lngDelta, lat + latDelta]
}
