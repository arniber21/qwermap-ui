import { createFileRoute } from '@tanstack/react-router'
import Header from '@/components/Header'
import MapCanvas from '@/components/MapCanvas'
import PlaceDetailsPanel from '@/components/PlaceDetailsPanel'
import FAB from '@/components/FAB'
import SubmitPlaceModal from '@/components/SubmitPlaceModal'
import SafetyLegend from '@/components/SafetyLegend'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <Header />
      <MapCanvas />
      <PlaceDetailsPanel />
      <FAB />
      <SubmitPlaceModal />
      <SafetyLegend />
    </div>
  )
}
