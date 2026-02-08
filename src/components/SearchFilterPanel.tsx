import { Search, X, ThumbsUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchStore } from '@/store/search-store';
import { useFilteredPlaces } from '@/hooks/useFilteredPlaces';
import { useMapStore } from '@/store/map-store';
import { usePlacesStore } from '@/store/places-store';
import { getPlaceDetail } from '@/api/places';
import { CATEGORY_CONFIG } from '@/data/categories';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { slideLeft } from '@/lib/motion';
import type { Category, PlaceType } from '@/types/places';

const TYPE_OPTIONS: { value: 'all' | PlaceType; label: string }[] = [
	{ value: 'all', label: 'All' },
	{ value: 'current', label: 'Current' },
	{ value: 'historical', label: 'Historical' },
];

const SORT_OPTIONS: {
	value: 'distance' | 'safety_score' | 'upvotes';
	label: string;
}[] = [
	{ value: 'upvotes', label: 'Upvotes' },
	{ value: 'safety_score', label: 'Safety' },
	{ value: 'distance', label: 'Distance' },
];

export default function SearchFilterPanel() {
	const isOpen = useSearchStore((s) => s.isOpen);
	const query = useSearchStore((s) => s.query);
	const selectedCategories = useSearchStore((s) => s.selectedCategories);
	const placeTypeFilter = useSearchStore((s) => s.placeTypeFilter);
	const sortBy = useSearchStore((s) => s.sortBy);
	const {
		togglePanel,
		setQuery,
		toggleCategory,
		setPlaceTypeFilter,
		setSortBy,
	} = useSearchStore();

	const { filteredPlaces, resultCount } = useFilteredPlaces();
	const flyTo = useMapStore((s) => s.flyTo);
	const { setSelectedPlace, setDetailLoading } = usePlacesStore();

	const handlePlaceClick = async (placeId: string, coords: [number, number]) => {
		flyTo(coords[0], coords[1], 16);
		setDetailLoading(true);
		const detail = await getPlaceDetail(placeId);
		setSelectedPlace(detail);
		setDetailLoading(false);
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.aside
					variants={slideLeft}
					initial="hidden"
					animate="visible"
					exit="exit"
					className="fixed top-14 left-0 bottom-0 w-80 z-30 bg-surface-elevated shadow-xl border-r border-border flex flex-col overflow-hidden"
					aria-label="Search and filter places"
				>
					{/* Header */}
					<div className="px-4 pt-4 pb-2 flex items-center justify-between">
						<h2 className="font-serif text-lg font-semibold text-text-primary">
							Find Places
						</h2>
						<button
							onClick={togglePanel}
							className="p-1.5 rounded-lg hover:bg-cream-dark transition-colors text-text-muted hover:text-text-primary cursor-pointer"
							aria-label="Close search panel"
						>
							<X size={18} />
						</button>
					</div>

					{/* Search input */}
					<div className="px-4 pb-3">
						<div className="relative">
							<Search
								size={16}
								className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted"
							/>
							<input
								type="text"
								placeholder="Search places..."
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								className="w-full pl-9 pr-3 py-2 rounded-xl bg-cream-dark border border-border text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-mauve/40"
							/>
						</div>
						<p className="text-xs text-text-muted mt-2">
							{resultCount} place{resultCount !== 1 ? 's' : ''}
						</p>
					</div>

					{/* Category chips */}
					<div className="px-4 pb-3">
						<p className="text-xs font-medium text-text-secondary mb-2">
							Categories
						</p>
						<div className="flex flex-wrap gap-1.5">
							{(
								Object.entries(CATEGORY_CONFIG) as [
									Category,
									(typeof CATEGORY_CONFIG)[Category],
								][]
							).map(([key, cfg]) => {
								const Icon = cfg.icon;
								const active = selectedCategories.has(key);
								return (
									<button
										key={key}
										onClick={() => toggleCategory(key)}
										className={cn(
											'inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all',
											active
												? `${cfg.bgColor} ${cfg.color} ring-1 ring-current`
												: 'bg-cream-dark text-text-muted hover:bg-border'
										)}
									>
										<Icon size={12} />
										{cfg.label}
									</button>
								);
							})}
						</div>
					</div>

					{/* Type toggle */}
					<div className="px-4 pb-3">
						<p className="text-xs font-medium text-text-secondary mb-2">
							Type
						</p>
						<div className="flex bg-cream-dark rounded-xl p-0.5">
							{TYPE_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									onClick={() =>
										setPlaceTypeFilter(opt.value)
									}
									className={cn(
										'flex-1 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer',
										placeTypeFilter === opt.value
											? 'bg-surface-elevated shadow-sm text-text-primary'
											: 'text-text-muted hover:text-text-secondary'
									)}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					{/* Sort */}
					<div className="px-4 pb-3">
						<p className="text-xs font-medium text-text-secondary mb-2">
							Sort by
						</p>
						<div className="flex gap-1.5">
							{SORT_OPTIONS.map((opt) => (
								<button
									key={opt.value}
									onClick={() => setSortBy(opt.value)}
									className={cn(
										'px-3 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer',
										sortBy === opt.value
											? 'bg-mauve text-white shadow-sm'
											: 'bg-cream-dark text-text-muted hover:bg-border'
									)}
								>
									{opt.label}
								</button>
							))}
						</div>
					</div>

					{/* Results list */}
					<div className="flex-1 overflow-y-auto px-4 pb-4">
						<div className="flex flex-col gap-2">
							{filteredPlaces.map((place) => {
								const cfg = CATEGORY_CONFIG[place.category];
								const Icon = cfg.icon;
								return (
									<button
										key={place.id}
										onClick={() =>
											handlePlaceClick(
												place.id,
												place.location.coordinates
											)
										}
										className="flex items-center gap-3 p-3 rounded-xl hover:bg-cream-dark transition-colors text-left cursor-pointer group"
									>
										<div
											className={cn(
												'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
												cfg.bgColor
											)}
										>
											<Icon
												size={16}
												className={cfg.color}
											/>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-text-primary truncate group-hover:text-mauve transition-colors">
												{place.name}
											</p>
											<div className="flex items-center gap-2 mt-0.5">
												<Badge
													color={cfg.color}
													bgColor={cfg.bgColor}
													className="text-[10px] px-1.5 py-0"
												>
													{cfg.label}
												</Badge>
											</div>
										</div>
										<div className="flex items-center gap-1 text-text-muted text-xs shrink-0">
											<ThumbsUp size={11} />
											{place.upvote_count}
										</div>
									</button>
								);
							})}
							{filteredPlaces.length === 0 && (
								<p className="text-sm text-text-muted text-center py-8">
									No places match your filters.
								</p>
							)}
						</div>
					</div>
				</motion.aside>
			)}
		</AnimatePresence>
	);
}
