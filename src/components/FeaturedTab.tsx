import { useState, useMemo } from 'react';
import { ChevronDown, ThumbsUp, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlacesStore } from '@/store/places-store';
import { useMapStore } from '@/store/map-store';
import { getPlaceDetail } from '@/api/places';
import { CATEGORY_CONFIG } from '@/data/categories';
import Badge from '@/components/ui/Badge';
import { truncate } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/motion';

export default function FeaturedTab() {
	const places = usePlacesStore((s) => s.places);
	const selectedPlace = usePlacesStore((s) => s.selectedPlace);
	const { setSelectedPlace, setDetailLoading } = usePlacesStore();
	const flyTo = useMapStore((s) => s.flyTo);
	const [isExpanded, setIsExpanded] = useState(true);

	// Pick 5 random featured places (stable across re-renders via useMemo)
	const topPlaces = useMemo(() => {
		if (places.length <= 5) return places;
		const shuffled = [...places];
		for (let i = shuffled.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
		}
		return shuffled.slice(0, 5);
	}, [places]);

	// Hide when detail panel is open to avoid overlap
	if (selectedPlace !== null) return null;
	if (topPlaces.length === 0) return null;

	const handleClick = async (
		placeId: string,
		coords: [number, number]
	) => {
		flyTo(coords[0], coords[1], 16);
		setDetailLoading(true);
		const detail = await getPlaceDetail(placeId);
		setSelectedPlace(detail);
		setDetailLoading(false);
	};

	return (
		<div className="fixed top-20 right-6 lg:right-[30rem] z-20 w-72">
			<div className="bg-surface-elevated/90 backdrop-blur-md rounded-3xl shadow-lg border border-border overflow-hidden">
				{/* Header */}
				<button
					onClick={() => setIsExpanded(!isExpanded)}
					className="w-full flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-cream-dark/50 transition-colors"
				>
					<div className="flex items-center gap-2">
						<Star
							size={14}
							className="text-mauve"
							fill="currentColor"
						/>
						<span className="text-sm font-semibold text-text-primary font-serif">
							Featured
						</span>
					</div>
					<motion.div
						animate={{ rotate: isExpanded ? 180 : 0 }}
						transition={{ duration: 0.2 }}
					>
						<ChevronDown
							size={16}
							className="text-text-muted"
						/>
					</motion.div>
				</button>

				{/* List */}
				<AnimatePresence>
					{isExpanded && (
						<motion.div
							variants={staggerContainer}
							initial="hidden"
							animate="visible"
							exit="hidden"
							className="px-2 pb-2"
						>
							{topPlaces.map((place, i) => {
								const cfg =
									CATEGORY_CONFIG[place.category];
								const Icon = cfg.icon;
								return (
									<motion.button
										key={place.id}
										variants={staggerItem}
										onClick={() =>
											handleClick(
												place.id,
												place.location.coordinates
											)
										}
										className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-cream-dark transition-colors text-left cursor-pointer group"
									>
										<span className="text-xs font-mono text-text-muted w-4 shrink-0">
											{i + 1}
										</span>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-text-primary truncate group-hover:text-mauve transition-colors">
												{truncate(place.name, 24)}
											</p>
											<Badge
												color={cfg.color}
												bgColor={cfg.bgColor}
												className="text-[10px] px-1.5 py-0 mt-0.5"
											>
												<Icon size={10} />
												{cfg.label}
											</Badge>
										</div>
										<div className="flex items-center gap-1 text-text-muted text-xs shrink-0">
											<ThumbsUp size={11} />
											{place.upvote_count}
										</div>
									</motion.button>
								);
							})}
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
