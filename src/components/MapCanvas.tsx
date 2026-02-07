import { useRef, useEffect, useCallback, useState } from 'react'
import { useMapbox } from '@/hooks/useMapbox'
import { useSupercluster } from '@/hooks/useSupercluster'
import { usePlaces } from '@/hooks/usePlaces'
import { useMapStore } from '@/store/map-store'
import { usePlacesStore } from '@/store/places-store'
import { getPlaceDetail } from '@/api/places'
import { getSafetyScores } from '@/api/safety'
import { CATEGORY_CONFIG } from '@/data/categories'

export default function MapCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useMapbox(containerRef)
  const sourcesAdded = useRef(false)
  const [mapBounds, setMapBounds] = useState<
    [number, number, number, number] | null
  >(null)

  const viewport = useMapStore((s) => s.viewport)
  const showHeatmap = useMapStore((s) => s.layers.safetyHeatmap)
  const places = usePlacesStore((s) => s.places)
  const { setSelectedPlace, setDetailLoading } = usePlacesStore()

  // Fetch places on viewport change
  usePlaces()

  // Cluster the places
  const { clusters, index } = useSupercluster(
    places,
    mapBounds,
    viewport.zoom,
  )

  // Sync bounds from map
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const updateBounds = () => {
      const b = map.getBounds()
      if (b) {
        setMapBounds([
          b.getWest(),
          b.getSouth(),
          b.getEast(),
          b.getNorth(),
        ])
      }
    }

    map.on('load', updateBounds)
    map.on('moveend', updateBounds)

    if (map.loaded()) updateBounds()

    return () => {
      map.off('load', updateBounds)
      map.off('moveend', updateBounds)
    }
  }, [mapRef])

  // Build the GeoJSON from clusters and render as sources/layers
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.loaded()) return

    const geojson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: clusters.map((c) => ({
        type: 'Feature',
        geometry: c.geometry,
        properties: c.properties,
      })),
    }

    if (!sourcesAdded.current) {
      // Add places source + layers
      map.addSource('places', {
        type: 'geojson',
        data: geojson,
      })

      // Cluster circles
      map.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'places',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': '#957DAD',
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            18,
            10,
            24,
            30,
            32,
          ],
          'circle-stroke-width': 2,
          'circle-stroke-color': '#FFFFFF',
          'circle-opacity': 0.9,
        },
      })

      // Cluster count labels
      map.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'places',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 13,
        },
        paint: {
          'text-color': '#FFFFFF',
        },
      })

      // Unclustered points
      const categoryColors = Object.entries(CATEGORY_CONFIG).flatMap(
        ([cat, cfg]) => [cat, cfg.mapColor],
      )

      map.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'places',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': [
            'match',
            ['get', 'category'],
            ...categoryColors,
            '#9490A0', // fallback
          ],
          'circle-radius': 8,
          'circle-stroke-width': [
            'case',
            ['==', ['get', 'place_type'], 'historical'],
            3,
            2,
          ],
          'circle-stroke-color': [
            'case',
            ['==', ['get', 'place_type'], 'historical'],
            '#8B7355',
            '#FFFFFF',
          ],
        },
      })

      sourcesAdded.current = true
    } else {
      const source = map.getSource('places') as mapboxgl.GeoJSONSource
      if (source) source.setData(geojson)
    }
  }, [clusters, mapRef])

  // Safety heatmap toggle
  useEffect(() => {
    const map = mapRef.current
    if (!map || !map.loaded()) return

    if (showHeatmap) {
      // Fetch and add safety data
      getSafetyScores({
        lat: viewport.center.lat,
        lon: viewport.center.lng,
      }).then((scores) => {
        const heatGeoJSON: GeoJSON.FeatureCollection = {
          type: 'FeatureCollection',
          features: scores.map(([lon, lat, score]) => ({
            type: 'Feature' as const,
            geometry: {
              type: 'Point' as const,
              coordinates: [lon, lat],
            },
            properties: { score },
          })),
        }

        if (map.getSource('safety')) {
          ;(map.getSource('safety') as mapboxgl.GeoJSONSource).setData(heatGeoJSON)
        } else {
          map.addSource('safety', { type: 'geojson', data: heatGeoJSON })
        }

        if (!map.getLayer('safety-heatmap')) {
          // Add heatmap below cluster layers
          const firstClusterLayer = 'clusters'
          map.addLayer(
            {
              id: 'safety-heatmap',
              type: 'heatmap',
              source: 'safety',
              paint: {
                'heatmap-weight': [
                  'interpolate',
                  ['linear'],
                  ['get', 'score'],
                  0, 0,
                  100, 1,
                ],
                'heatmap-intensity': 0.6,
                'heatmap-radius': 40,
                'heatmap-opacity': 0.5,
                'heatmap-color': [
                  'interpolate',
                  ['linear'],
                  ['heatmap-density'],
                  0, 'rgba(0,0,0,0)',
                  0.2, '#E07A5F',
                  0.5, '#F2CC8F',
                  0.8, '#81B29A',
                  1, '#81B29A',
                ],
              },
            },
            firstClusterLayer,
          )
        } else {
          map.setLayoutProperty('safety-heatmap', 'visibility', 'visible')
        }
      })
    } else {
      if (map.getLayer('safety-heatmap')) {
        map.setLayoutProperty('safety-heatmap', 'visibility', 'none')
      }
    }
  }, [showHeatmap, mapRef]) // eslint-disable-line react-hooks/exhaustive-deps

  // Click handlers
  const handleClick = useCallback(
    async (e: mapboxgl.MapMouseEvent) => {
      const map = mapRef.current
      if (!map) return

      // Check for unclustered point click
      const pointFeatures = map.queryRenderedFeatures(e.point, {
        layers: sourcesAdded.current
          ? ['unclustered-point']
          : [],
      })

      if (pointFeatures.length > 0) {
        const props = pointFeatures[0].properties
        if (props?.placeId) {
          setDetailLoading(true)
          const detail = await getPlaceDetail(props.placeId)
          setSelectedPlace(detail)
          setDetailLoading(false)
          return
        }
      }

      // Check for cluster click
      const clusterFeatures = map.queryRenderedFeatures(e.point, {
        layers: sourcesAdded.current ? ['clusters'] : [],
      })

      if (clusterFeatures.length > 0) {
        const clusterId = clusterFeatures[0].properties?.cluster_id
        if (clusterId !== undefined) {
          const expansionZoom = index.getClusterExpansionZoom(Number(clusterId))
          const coords = (clusterFeatures[0].geometry as GeoJSON.Point)
            .coordinates as [number, number]
          map.flyTo({
            center: coords,
            zoom: Math.min(expansionZoom, 18),
            duration: 800,
          })
        }
      }
    },
    [mapRef, index, setSelectedPlace, setDetailLoading],
  )

  // Register click + cursor handlers
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    map.on('click', handleClick)

    const setCursorPointer = () => {
      map.getCanvas().style.cursor = 'pointer'
    }
    const setCursorDefault = () => {
      map.getCanvas().style.cursor = ''
    }

    const interactiveLayers = ['unclustered-point', 'clusters']

    const addHandlers = () => {
      interactiveLayers.forEach((layer) => {
        if (map.getLayer(layer)) {
          map.on('mouseenter', layer, setCursorPointer)
          map.on('mouseleave', layer, setCursorDefault)
        }
      })
    }

    // If layers exist already, add now; otherwise wait for data
    if (sourcesAdded.current) {
      addHandlers()
    } else {
      map.once('sourcedata', addHandlers)
    }

    return () => {
      map.off('click', handleClick)
      interactiveLayers.forEach((layer) => {
        if (map.getLayer(layer)) {
          map.off('mouseenter', layer, setCursorPointer)
          map.off('mouseleave', layer, setCursorDefault)
        }
      })
    }
  }, [mapRef, handleClick])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 top-14"
      aria-label="Interactive map showing LGBTQ+ places"
    />
  )
}
