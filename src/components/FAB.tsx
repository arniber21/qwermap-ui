import { Plus } from 'lucide-react'
import { usePlacesStore } from '@/store/places-store'
import { useSubmissionStore } from '@/store/submission-store'
import { cn } from '@/lib/utils'

export default function FAB() {
  const selectedPlace = usePlacesStore((s) => s.selectedPlace)
  const openModal = useSubmissionStore((s) => s.openModal)

  return (
    <button
      onClick={() => openModal()}
      className={cn(
        'fixed bottom-6 z-30 w-14 h-14 rounded-full',
        'bg-mauve text-white shadow-lg hover:shadow-xl',
        'hover:bg-mauve-dark active:bg-mauve-dark',
        'transition-all duration-[var(--transition-base)] cursor-pointer',
        'flex items-center justify-center',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mauve',
        selectedPlace ? 'right-[calc(24rem+1.5rem)]' : 'right-6',
      )}
      aria-label="Submit a new place"
    >
      <Plus size={24} />
    </button>
  )
}
