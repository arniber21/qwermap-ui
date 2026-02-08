import { Shield } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import SubmitPlaceMiniMap from '@/components/SubmitPlaceMiniMap';
import { useSubmissionStore } from '@/store/submission-store';
import { useSubmitPlace } from '@/hooks/useSubmitPlace';
import { CATEGORY_CONFIG } from '@/data/categories';
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

export default function SubmitPlaceModal() {
	const { isOpen, closeModal, submitting } = useSubmissionStore();
	const { form, errors, updateField, submit } = useSubmitPlace();

	return (
		<Modal
			isOpen={isOpen}
			onClose={closeModal}
			title="Submit a Place"
			className="max-w-md"
		>
			<div className="flex flex-col gap-4">
				{/* Blockchain banner */}
				<div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-lavender-light/50 border border-lavender/30">
					<Shield size={15} className="text-mauve shrink-0" />
					<p className="text-xs text-text-secondary">
						Submissions are recorded anonymously via Solana
						blockchain for transparency and verification.
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
							updateField(
								'place_type',
								e.target.value as PlaceType
							)
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
					<p className="text-xs text-safety-low -mt-3">
						{errors.location}
					</p>
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
		</Modal>
	);
}
