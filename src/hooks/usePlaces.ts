import { useEffect, useRef } from 'react'
import { useMapStore } from '@/store/map-store'
import { usePlacesStore } from '@/store/places-store'
import { getPlaces } from '@/api/places'

export function usePlaces() {
  const viewport = useMapStore((s) => s.viewport)
  const { setPlaces, setLoading } = usePlacesStore()
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const result = await getPlaces({
          lat: viewport.center.lat,
          lon: viewport.center.lng,
        })
        setPlaces(result.places)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(timerRef.current)
  }, [viewport.center.lat, viewport.center.lng]) // eslint-disable-line react-hooks/exhaustive-deps
}
