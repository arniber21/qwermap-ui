import { useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui-store';
import { usePlacesStore } from '@/store/places-store';
import PlaceDetailsPanel from '@/components/PlaceDetailsPanel';
import SearchFilterPanel from '@/components/SearchFilterPanel';
import SubmitPlacePanel from '@/components/SubmitPlacePanel';

export default function LeftDockPanel() {
	const leftPanelTab = useUIStore((s) => s.leftPanelTab);
	const setLeftPanelTab = useUIStore((s) => s.setLeftPanelTab);
	const selectedPlace = usePlacesStore((s) => s.selectedPlace);
	const detailLoading = usePlacesStore((s) => s.detailLoading);

	const showDetails = useMemo(
		() => Boolean(selectedPlace) || detailLoading,
		[selectedPlace, detailLoading]
	);

	return (
		<aside
			className={cn(
				'hidden lg:flex fixed top-20 left-6 bottom-6 w-[28rem] max-w-full z-30',
				'bg-surface-elevated/90 backdrop-blur-md shadow-xl border border-border rounded-3xl',
				'flex flex-col overflow-hidden'
			)}
			aria-label="Explore and add places"
		>
			<div className="px-6 pt-6 pb-4 border-b border-border">
				<h2 className="font-serif text-2xl font-semibold text-text-primary">
					Explore
				</h2>
				<p className="text-xs text-text-muted mt-1">
					Search, add, and learn about places without leaving the map.
				</p>
			</div>

			<div className="flex-1 overflow-y-auto">
				{showDetails && (
					<div className="px-4 pt-4">
						<PlaceDetailsPanel
							embedded
							showPlaceholder={false}
							className="rounded-2xl border border-border bg-white/80"
						/>
					</div>
				)}

				<div className={cn('px-4', showDetails ? 'pt-4' : 'pt-6')}>
					<div className="inline-flex bg-cream-dark rounded-2xl p-1 border border-border">
						<button
							onClick={() => setLeftPanelTab('search')}
							className={cn(
								'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all',
								leftPanelTab === 'search'
									? 'bg-white text-text-primary shadow-sm'
									: 'text-text-muted hover:text-text-secondary'
							)}
						>
							<Search size={14} />
							Search
						</button>
						<button
							onClick={() => setLeftPanelTab('add')}
							className={cn(
								'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium cursor-pointer transition-all',
								leftPanelTab === 'add'
									? 'bg-white text-text-primary shadow-sm'
									: 'text-text-muted hover:text-text-secondary'
							)}
						>
							<Plus size={14} />
							Add
						</button>
					</div>
				</div>

				<div className="px-4 pb-6">
					{leftPanelTab === 'search' && (
						<SearchFilterPanel embedded className="mt-4" />
					)}
					{leftPanelTab === 'add' && (
						<SubmitPlacePanel embedded className="mt-4" />
					)}
				</div>
			</div>
		</aside>
	);
}
