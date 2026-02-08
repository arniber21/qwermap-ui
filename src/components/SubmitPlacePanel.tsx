import { Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import SubmitPlaceMiniMap from '@/components/SubmitPlaceMiniMap';
import { useSubmissionStore } from '@/store/submission-store';
import { useSubmitPlace } from '@/hooks/useSubmitPlace';
import { CATEGORY_CONFIG } from '@/data/categories';
import { cn } from '@/lib/utils';
import { slideRight } from '@/lib/motion';
import type { Category, PlaceType } from '@/types/places';

const CATEGORY_OPTIONS = Object.entries(CATEGORY_CONFIG).map(
	([value, cfg]) => ({
		value,
		label: cfg.label,
	})
);

const TYPE_OPTIONS = [
	{ value: 'current', label: 'Currently Active' },
	{ value: 'historical', label: 'Historical Site' },
];

interface SubmitPlacePanelProps {
	embedded?: boolean;
	className?: string;
}

export default function SubmitPlacePanel({
	embedded = false,
	className,
}: SubmitPlacePanelProps) {
	const { isOpen, closeModal, submitting } = useSubmissionStore();
	const { form, errors, updateField, submit } = useSubmitPlace();

	const Content = (
		<div
			className={cn(
				embedded
					? 'bg-transparent'
					: 'bg-surface-elevated/90 backdrop-blur-md shadow-xl border border-border rounded-3xl',
				embedded ? undefined : className
			)}
			aria-label="Submit a place"
		>
			<div className="px-6 pt-6 pb-4 border-b border-border flex items-center justify-between">
				<div>
					<h2 className="font-serif text-2xl font-semibold text-text-primary">
						Submit a Place
					</h2>
					<p className="text-xs text-text-muted mt-1">
						Add a place without leaving the map.
					</p>
				</div>
				{!embedded && (
					<button
						onClick={closeModal}
						className="p-1.5 rounded-lg hover:bg-cream-dark transition-colors text-text-muted hover:text-text-primary"
						aria-label="Close submit panel"
					>
						<X size={18} />
					</button>
				)}
			</div>

			<div className="px-6 pb-6 pt-4 flex flex-col gap-4">
				{/* Blockchain banner */}
				<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-lavender-light/50 border border-lavender/30">
					<Shield size={15} className="text-mauve shrink-0" />
					<p className="text-xs text-text-secondary">
						Submissions are recorded anonymously via Solana blockchain for
						transparency and verification.
					</p>
				</div>

				<Input
					label="Place Name"
					placeholder="e.g., The Abbey Food & Bar"
					value={form.name}
					onChange={(e) => updateField('name', e.target.value)}
					error={errors.name}
					required
				/>

				<div className="grid grid-cols-2 gap-3">
					<Select
						label="Category"
						options={CATEGORY_OPTIONS}
						placeholder="Select..."
						value={form.category}
						onChange={(e) =>
							updateField('category', e.target.value as Category)
						}
						error={errors.category}
						required
					/>

					<Select
						label="Type"
						options={TYPE_OPTIONS}
						placeholder="Select..."
						value={form.place_type}
						onChange={(e) =>
							updateField('place_type', e.target.value as PlaceType)
						}
						error={errors.place_type}
						required
					/>
				</div>

				{form.place_type === 'historical' && (
					<Input
						label="Era"
						placeholder="e.g., 1960s-1980s"
						value={form.era}
						onChange={(e) => updateField('era', e.target.value)}
					/>
				)}

				<Textarea
					label="Description"
					placeholder="Tell us about this place and its significance to the LGBTQ+ community..."
					value={form.description}
					onChange={(e) => updateField('description', e.target.value)}
					maxLength={2000}
					charCount
				/>

				<Input
					label="Address"
					placeholder="e.g., 692 N Robertson Blvd, West Hollywood, CA"
					value={form.address}
					onChange={(e) => updateField('address', e.target.value)}
				/>

				<Input
					label="Photo URL"
					placeholder="https://..."
					value={form.photoUrl}
					onChange={(e) => updateField('photoUrl', e.target.value)}
				/>

				<SubmitPlaceMiniMap
					location={form.location}
					onLocationChange={(loc) => updateField('location', loc)}
				/>
				{errors.location && (
					<p className="text-xs text-safety-low -mt-3">{errors.location}</p>
				)}

				<Button
					onClick={submit}
					disabled={submitting}
					size="lg"
					className="w-full"
				>
					{submitting ? 'Submitting to Solana...' : 'Submit Place'}
				</Button>
			</div>
		</div>
	);

	if (embedded) {
		return <div className={cn('overflow-y-auto', className)}>{Content}</div>;
	}

	return (
		<AnimatePresence>
			{isOpen && (
				<motion.aside
					variants={slideRight}
					initial="hidden"
					animate="visible"
					exit="exit"
					className={cn(
						'fixed top-24 bottom-6 w-[26rem] max-w-full z-40',
						'right-6 lg:right-[calc(28rem+1.5rem)]',
						'overflow-y-auto'
					)}
				>
					{Content}
				</motion.aside>
			)}
		</AnimatePresence>
	);
}
