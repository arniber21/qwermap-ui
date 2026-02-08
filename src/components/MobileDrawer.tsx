import { useMemo } from 'react';
import { ChevronDown, MapPin, Search, Plus, MessageCircle, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/store/ui-store';
import { usePlacesStore } from '@/store/places-store';
import PlaceDetailsPanel from '@/components/PlaceDetailsPanel';
import SearchFilterPanel from '@/components/SearchFilterPanel';
import SubmitPlacePanel from '@/components/SubmitPlacePanel';
import ChatWidget from '@/components/ChatWidget';
import FeaturedTab from '@/components/FeaturedTab';

const TABS = [
	{ id: 'details', label: 'Details', icon: MapPin },
	{ id: 'search', label: 'Search', icon: Search },
	{ id: 'add', label: 'Add', icon: Plus },
	{ id: 'chat', label: 'Chat', icon: MessageCircle },
	{ id: 'featured', label: 'Featured', icon: Star },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function MobileDrawer() {
	const mobileDrawerOpen = useUIStore((s) => s.mobileDrawerOpen);
	const setMobileDrawerOpen = useUIStore((s) => s.setMobileDrawerOpen);
	const mobileDrawerTab = useUIStore((s) => s.mobileDrawerTab);
	const setMobileDrawerTab = useUIStore((s) => s.setMobileDrawerTab);
	const selectedPlace = usePlacesStore((s) => s.selectedPlace);
	const detailLoading = usePlacesStore((s) => s.detailLoading);

	const showDetails = useMemo(
		() => Boolean(selectedPlace) || detailLoading,
		[selectedPlace, detailLoading]
	);

	return (
		<AnimatePresence>
			<motion.aside
				initial={false}
				animate={{
					y: mobileDrawerOpen ? 0 : 240,
				}}
				transition={{ type: 'spring', stiffness: 260, damping: 26 }}
				className={cn(
					'lg:hidden fixed left-4 right-4 bottom-4 z-40',
					'bg-surface-elevated/95 backdrop-blur-md rounded-3xl shadow-xl border border-border',
					'overflow-hidden'
				)}
				aria-label="Mobile drawer"
			>
				<div className="flex items-center justify-between px-4 py-3 border-b border-border">
					<div className="flex items-center gap-2">
						<div className="w-2.5 h-2.5 rounded-full bg-mauve" />
						<span className="text-sm font-semibold text-text-primary">
							Explore
						</span>
					</div>
					<button
						onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
						className="p-2 rounded-xl hover:bg-cream-dark transition-colors"
						aria-label={mobileDrawerOpen ? 'Collapse panel' : 'Expand panel'}
					>
						<motion.div
							animate={{ rotate: mobileDrawerOpen ? 0 : 180 }}
							transition={{ duration: 0.2 }}
						>
							<ChevronDown size={18} />
						</motion.div>
					</button>
				</div>

				<div className="px-2 pt-2">
					<div className="grid grid-cols-5 gap-1 bg-cream-dark rounded-2xl p-1 border border-border">
						{TABS.map((tab) => {
							const Icon = tab.icon;
							const active = mobileDrawerTab === tab.id;
							return (
								<button
									key={tab.id}
									onClick={() => setMobileDrawerTab(tab.id as TabId)}
									className={cn(
										'flex flex-col items-center justify-center gap-1 py-2 rounded-xl text-[10px] font-medium transition-all',
										active
											? 'bg-white text-text-primary shadow-sm'
											: 'text-text-muted'
									)}
								>
									<Icon size={14} />
									{tab.label}
								</button>
							);
						})}
					</div>
				</div>

				<div className="px-4 pb-4 pt-3 max-h-[60vh] overflow-y-auto">
					{mobileDrawerTab === 'details' && (
						<PlaceDetailsPanel embedded showPlaceholder className="rounded-2xl" />
					)}
					{mobileDrawerTab === 'search' && (
						<SearchFilterPanel embedded className="mt-1" />
					)}
					{mobileDrawerTab === 'add' && (
						<SubmitPlacePanel embedded className="mt-1" />
					)}
					{mobileDrawerTab === 'chat' && (
						<ChatWidget embedded variant="bare" className="h-[360px]" />
					)}
					{mobileDrawerTab === 'featured' && (
						<FeaturedTab embedded hideWhenSelected={false} variant="bare" />
					)}

					{mobileDrawerTab === 'details' && !showDetails && (
						<div className="mt-3 rounded-2xl border border-dashed border-border p-4 bg-cream-light/60">
							<p className="text-sm text-text-secondary">
								Pick a place to see its details.
							</p>
						</div>
					)}
				</div>
			</motion.aside>
		</AnimatePresence>
	);
}
