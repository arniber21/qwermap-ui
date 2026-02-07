import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_TOKEN, DEFAULT_CENTER } from '@/lib/constants'

interface SubmitPlaceMiniMapProps {
  location: { lng: number; lat: number } | null
  onLocationChange: (location: { lng: number; lat: number }) => void
}

export default function SubmitPlaceMiniMap({
  location,
  onLocationChange,
}: SubmitPlaceMiniMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const markerRef = useRef<mapboxgl.Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    const center: [number, number] = location
      ? [location.lng, location.lat]
      : [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat]

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center,
      zoom: 14,
      attributionControl: false,
    })

    const marker = new mapboxgl.Marker({
      draggable: true,
      color: '#957DAD',
    })
      .setLngLat(center)
      .addTo(map)

    marker.on('dragend', () => {
      const lngLat = marker.getLngLat()
      onLocationChange({ lng: lngLat.lng, lat: lngLat.lat })
    })

    map.on('click', (e) => {
      marker.setLngLat(e.lngLat)
      onLocationChange({ lng: e.lngLat.lng, lat: e.lngLat.lat })
    })

    // Set initial location
    onLocationChange({ lng: center[0], lat: center[1] })

    markerRef.current = marker
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text-secondary">
        Location <span className="text-safety-low">*</span>
      </label>
      <div
        ref={containerRef}
        className="h-48 rounded-xl overflow-hidden border border-border"
      />
      <p className="text-xs text-text-muted">
        Click or drag the marker to set the location
      </p>
    </div>
  )
}
