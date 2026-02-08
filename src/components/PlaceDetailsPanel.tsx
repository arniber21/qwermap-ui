import { useState, useEffect } from 'react';
import { X, ThumbsUp, Navigation, Clock, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlacesStore } from '@/store/places-store';
import { useUpvote } from '@/hooks/useUpvote';
import { CATEGORY_CONFIG } from '@/data/categories';
import Badge from '@/components/ui/Badge';
import SafetyGauge from '@/components/ui/SafetyGauge';
import TxLink from '@/components/ui/TxLink';
import { cn, formatDate } from '@/lib/utils';
import { slideRight } from '@/lib/motion';

interface PlaceDetailsPanelProps {
	embedded?: boolean;
	className?: string;
	showPlaceholder?: boolean;
}

export default function PlaceDetailsPanel({
	embedded = false,
	className,
	showPlaceholder = true,
}: PlaceDetailsPanelProps) {
	const { selectedPlace, detailLoading, setSelectedPlace } = usePlacesStore();
	const { handleUpvote, isUpvoted } = useUpvote();
	const [expanded, setExpanded] = useState(false);

	const isOpen = embedded
		? selectedPlace !== null || detailLoading || showPlaceholder
		: true;

	// Close on Escape
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isOpen) setSelectedPlace(null);
		};
		document.addEventListener('keydown', handler);
		return () => document.removeEventListener('keydown', handler);
	}, [isOpen, setSelectedPlace]);

	// Reset expanded when place changes
	useEffect(() => {
		setExpanded(false);
	}, [selectedPlace?.id]);

	const place = selectedPlace;
	const category = place ? CATEGORY_CONFIG[place.category] : null;
	const CategoryIcon = category?.icon;

	const Content = (
		<div
			className={cn(
				embedded
					? 'bg-transparent relative'
					: 'bg-surface-elevated/90 backdrop-blur-md shadow-xl border border-border rounded-3xl relative',
				embedded ? undefined : className
			)}
			role="complementary"
			aria-label="Place details"
		>
			{detailLoading && !place && (
				<div className="flex items-center justify-center h-64">
					<div className="w-8 h-8 border-2 border-mauve border-t-transparent rounded-full animate-spin" />
				</div>
			)}

			{!place && !detailLoading && showPlaceholder && !embedded && (
				<div className="h-full flex flex-col">
					<div className="px-6 pt-6 pb-4 border-b border-border">
						<h2 className="font-serif text-2xl font-semibold text-text-primary">
							Place Details
						</h2>
						<p className="text-sm text-text-muted mt-1">
							Select a place on the map to see its story, safety score, and
							on-chain record.
						</p>
					</div>
					<div className="flex-1 px-6 py-6">
						<div className="rounded-2xl border border-dashed border-border p-4 bg-cream-light/60">
							<p className="text-sm text-text-secondary">
								Tip: Use Search to filter categories or click a cluster to
								zoom in.
							</p>
						</div>
					</div>
				</div>
			)}

			{place && category && CategoryIcon && (
				<div className="flex flex-col">
					{/* Photo or placeholder */}
					{place.photos?.[0] ? (
						<div className="relative h-48 overflow-hidden">
							<img
								src={place.photos[0]}
								alt={place.name}
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-text-primary/30 to-transparent" />
						</div>
					) : (
						<div className="h-32 bg-gradient-to-br from-cream-dark to-lavender-light flex items-center justify-center">
							<CategoryIcon size={40} className="text-text-muted opacity-50" />
						</div>
					)}

					<div className="p-6 flex flex-col gap-4">
						{/* Close button */}
						<button
							onClick={() => setSelectedPlace(null)}
							className="absolute top-3 right-3 p-1.5 rounded-lg bg-surface-elevated/80 backdrop-blur-sm hover:bg-cream-dark transition-colors text-text-muted hover:text-text-primary z-10"
							aria-label={`Close ${place.name} details`}
						>
							<X size={18} />
						</button>

						{/* Prominent header */}
						<div className="flex items-start justify-between gap-4">
							<div>
								<h2 className="font-serif text-2xl font-semibold text-text-primary leading-tight">
									{place.name}
								</h2>
								{place.era && (
									<p className="text-sm italic text-text-muted mt-1 flex items-center gap-1">
										<Clock size={13} />
										{place.era}
									</p>
								)}
							</div>
						</div>

						{/* Badges */}
						<div className="flex items-center gap-2 flex-wrap">
							<Badge color={category.color} bgColor={category.bgColor}>
								<CategoryIcon size={12} />
								{category.label}
							</Badge>
							<Badge
								color={
									place.place_type === 'historical'
										? 'text-amber-800'
										: 'text-text-secondary'
								}
								bgColor={
									place.place_type === 'historical'
										? 'bg-amber-100'
										: 'bg-cream-dark'
								}
							>
								{place.place_type === 'historical'
									? 'Historical'
									: 'Active'}
							</Badge>
						</div>

						{/* Description */}
						{place.description && (
							<div>
								<p
									className={cn(
										'text-sm text-text-secondary leading-relaxed',
										!expanded && 'line-clamp-3'
									)}
								>
									{place.description}
								</p>
								{place.description.length > 150 && (
									<button
										onClick={() => setExpanded(!expanded)}
										className="text-xs text-mauve hover:text-mauve-dark mt-1 cursor-pointer"
									>
										{expanded ? 'Show less' : 'Read more'}
									</button>
								)}
							</div>
						)}

						{/* Address */}
						{place.address && (
							<div className="flex items-start gap-2 text-sm text-text-secondary">
								<MapPin size={15} className="shrink-0 mt-0.5" />
								<div>
									<p>{place.address}</p>
									<a
										href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 text-xs text-mauve hover:text-mauve-dark mt-0.5"
									>
										<Navigation size={11} />
										Get directions
									</a>
								</div>
							</div>
						)}

						{/* Safety gauge */}
						<SafetyGauge score={place.safety_score} />

						{/* Upvote button */}
						<button
							onClick={() => handleUpvote(place.id)}
							disabled={isUpvoted(place.id)}
							className={cn(
								'flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium',
								'transition-all duration-[var(--transition-fast)] cursor-pointer',
								isUpvoted(place.id)
									? 'bg-sage-light text-sage-dark cursor-default'
									: 'bg-mauve text-white hover:bg-mauve-dark active:bg-mauve-dark shadow-sm hover:shadow-md',
								'disabled:opacity-70'
							)}
							aria-label={`Upvote ${place.name}`}
						>
							<ThumbsUp size={15} />
							{isUpvoted(place.id) ? 'Verified' : 'Verify this place'}
							<span className="font-mono text-xs opacity-80">
								({place.upvote_count})
							</span>
						</button>

						{/* Transaction link */}
						<div className="pt-2 border-t border-border">
							<p className="text-xs uppercase tracking-wide text-text-muted mb-2">
								On-chain record
							</p>
							<div className="flex items-center justify-between gap-3">
								<span className="text-[11px] font-mono text-text-primary bg-cream-dark px-2 py-1 rounded-lg break-all">
									{place.transaction_id}
								</span>
								<TxLink txId={place.transaction_id} />
							</div>
						</div>

						{/* Created date */}
						<p className="text-xs text-text-muted">
							Added {formatDate(place.created_at)}
						</p>
					</div>
				</div>
			)}
		</div>
	);

	if (embedded) {
		if (!isOpen) return null;
		return <div className={cn('overflow-y-auto', className)}>{Content}</div>;
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.div
					variants={slideRight}
					initial="hidden"
					animate="visible"
					exit="exit"
					className={cn(
						'fixed top-20 right-6 bottom-6 w-[28rem] max-w-full z-30',
						'overflow-y-auto'
					)}
				>
					{Content}
				</motion.div>
			)}
		</AnimatePresence>
	);
}
