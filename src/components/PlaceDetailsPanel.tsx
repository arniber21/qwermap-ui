import { useState, useEffect } from 'react';
import {
	X,
	ThumbsUp,
	Navigation,
	Clock,
	MapPin,
	Users,
	ExternalLink,
	Award,
	Building2,
	ChevronDown,
	ChevronUp,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePlacesStore } from '@/store/places-store';
import { useUpvote } from '@/hooks/useUpvote';
import { CATEGORY_CONFIG } from '@/data/categories';
import Badge from '@/components/ui/Badge';
import SafetyGauge from '@/components/ui/SafetyGauge';
import TxLink from '@/components/ui/TxLink';
import { cn, formatDate } from '@/lib/utils';
import { slideRight } from '@/lib/motion';

function humanizeTag(tag: string): string {
	return tag
		.replace(/_/g, ' ')
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

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
	const [eventsExpanded, setEventsExpanded] = useState(false);

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

	// Reset expanded states when place changes
	useEffect(() => {
		setExpanded(false);
		setEventsExpanded(false);
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
								{(place.year_opened || place.era) && (
									<p className="text-sm italic text-text-muted mt-1 flex items-center gap-1">
										<Clock size={13} />
										{place.year_opened
											? `${place.year_opened}–${place.year_closed ?? (place.still_exists === 'yes' ? 'present' : '?')}`
											: place.era}
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
							{place.significance && (
								<Badge color="text-indigo-800" bgColor="bg-indigo-100">
									<Award size={12} />
									{humanizeTag(place.significance)} Significance
								</Badge>
							)}
							{place.still_exists && place.still_exists !== 'unknown' && (
								<Badge
									color={
										place.still_exists === 'yes'
											? 'text-emerald-800'
											: place.still_exists === 'partial'
												? 'text-amber-800'
												: 'text-red-800'
									}
									bgColor={
										place.still_exists === 'yes'
											? 'bg-emerald-100'
											: place.still_exists === 'partial'
												? 'bg-amber-100'
												: 'bg-red-100'
									}
								>
									<Building2 size={12} />
									{place.still_exists === 'yes'
										? 'Still Standing'
										: place.still_exists === 'partial'
											? 'Partially Remains'
											: 'No Longer Exists'}
								</Badge>
							)}
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

						{/* Events Timeline */}
						{place.events && place.events.length > 0 && (
							<div className="border-t border-border pt-4">
								<p className="text-xs uppercase tracking-wide text-text-muted mb-3">
									Key Events
								</p>
								<div className="relative pl-4 border-l-2 border-lavender/40 flex flex-col gap-3">
									{(eventsExpanded
										? place.events
										: place.events.slice(0, 3)
									).map((event, i) => (
										<div key={i} className="relative">
											<div className="absolute -left-[1.3rem] top-1 w-2.5 h-2.5 rounded-full bg-mauve border-2 border-surface-elevated" />
											<p className="text-sm font-medium text-text-primary">
												{event.title}
											</p>
											{event.date && (
												<p className="text-xs text-text-muted">
													{event.date}
												</p>
											)}
											{event.description && (
												<p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
													{event.description}
												</p>
											)}
											{event.source_url && (
												<a
													href={event.source_url}
													target="_blank"
													rel="noopener noreferrer"
													className="inline-flex items-center gap-1 text-xs text-mauve hover:text-mauve-dark mt-0.5"
												>
													<ExternalLink size={10} />
													Source
												</a>
											)}
										</div>
									))}
								</div>
								{place.events.length > 3 && (
									<button
										onClick={() =>
											setEventsExpanded(!eventsExpanded)
										}
										className="flex items-center gap-1 text-xs text-mauve hover:text-mauve-dark mt-2 cursor-pointer"
									>
										{eventsExpanded ? (
											<>
												<ChevronUp size={12} /> Show
												fewer
											</>
										) : (
											<>
												<ChevronDown size={12} /> Show
												all {place.events.length} events
											</>
										)}
									</button>
								)}
							</div>
						)}

						{/* Related Figures */}
						{place.related_figures &&
							place.related_figures.length > 0 && (
								<div className="border-t border-border pt-4">
									<p className="text-xs uppercase tracking-wide text-text-muted mb-3">
										<Users
											size={12}
											className="inline mr-1"
										/>
										Related Figures
									</p>
									<div className="flex flex-col gap-2">
										{place.related_figures.map(
											(figure, i) => (
												<div
													key={i}
													className="rounded-xl bg-cream-light/60 border border-border px-3 py-2"
												>
													<div className="flex items-center gap-2">
														<span className="text-sm font-medium text-text-primary">
															{figure.name}
														</span>
														{figure.role && (
															<Badge
																color="text-mauve"
																bgColor="bg-lavender-light"
															>
																{figure.role}
															</Badge>
														)}
													</div>
													{figure.description && (
														<p className="text-xs text-text-secondary mt-1 leading-relaxed">
															{figure.description}
														</p>
													)}
												</div>
											)
										)}
									</div>
								</div>
							)}

						{/* Movement & Community Tags */}
						{((place.movements && place.movements.length > 0) ||
							(place.community_tags &&
								place.community_tags.length > 0)) && (
							<div className="border-t border-border pt-4 flex flex-col gap-3">
								{place.movements &&
									place.movements.length > 0 && (
										<div>
											<p className="text-xs uppercase tracking-wide text-text-muted mb-2">
												Movements
											</p>
											<div className="flex flex-wrap gap-1.5">
												{place.movements.map((m) => (
													<Badge
														key={m}
														color="text-rose-800"
														bgColor="bg-rose-100"
													>
														{humanizeTag(m)}
													</Badge>
												))}
											</div>
										</div>
									)}
								{place.community_tags &&
									place.community_tags.length > 0 && (
										<div>
											<p className="text-xs uppercase tracking-wide text-text-muted mb-2">
												Communities
											</p>
											<div className="flex flex-wrap gap-1.5">
												{place.community_tags.map(
													(t) => (
														<Badge
															key={t}
															color="text-violet-800"
															bgColor="bg-violet-100"
														>
															{humanizeTag(t)}
														</Badge>
													)
												)}
											</div>
										</div>
									)}
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
