import { useMapStore } from '@/store/map-store'
import { cn } from '@/lib/utils'

export default function SafetyLegend() {
  const showHeatmap = useMapStore((s) => s.layers.safetyHeatmap)

  return (
    <div
      className={cn(
        'fixed bottom-6 left-4 z-30 bg-surface-elevated/90 backdrop-blur-sm',
        'rounded-xl shadow-md border border-border px-4 py-3',
        'transition-all duration-[var(--transition-base)]',
        showHeatmap
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-4 pointer-events-none',
      )}
      aria-hidden={!showHeatmap}
    >
      <p className="text-xs font-medium text-text-secondary mb-2">
        Safety Heatmap
      </p>
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-muted">Low</span>
        <div
          className="w-32 h-2.5 rounded-full"
          style={{
            background:
              'linear-gradient(90deg, #E07A5F, #F2CC8F, #81B29A)',
          }}
        />
        <span className="text-xs text-text-muted">High</span>
      </div>
    </div>
  )
}
