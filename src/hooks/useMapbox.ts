import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_TOKEN, DEFAULT_CENTER, DEFAULT_ZOOM } from '@/lib/constants'
import { useMapStore } from '@/store/map-store'

export function useMapbox(containerRef: React.RefObject<HTMLDivElement | null>) {
  const mapRef = useRef<mapboxgl.Map | null>(null)
  const { setViewport, setMapFlyTo } = useMapStore()

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    mapboxgl.accessToken = MAPBOX_TOKEN

    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [DEFAULT_CENTER.lng, DEFAULT_CENTER.lat],
      zoom: DEFAULT_ZOOM,
      attributionControl: false,
    })

    map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    map.addControl(
      new mapboxgl.AttributionControl({ compact: true }),
      'bottom-right',
    )

    map.on('moveend', () => {
      const center = map.getCenter()
      setViewport({
        center: { lng: center.lng, lat: center.lat },
        zoom: map.getZoom(),
      })
    })

    // Register flyTo so other components can trigger it via store
    setMapFlyTo((lng: number, lat: number, zoom: number) => {
      map.flyTo({ center: [lng, lat], zoom, duration: 1200 })
    })

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return mapRef
}
