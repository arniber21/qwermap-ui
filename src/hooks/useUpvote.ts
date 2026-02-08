import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { usePlacesStore } from '@/store/places-store';
import { upvotePlace } from '@/api/places';
import { getFingerprint } from '@/lib/fingerprint';

export function useUpvote() {
	const { upvotedIds, optimisticUpvote, rollbackUpvote, selectedPlace } =
		usePlacesStore();

	const handleUpvote = useCallback(
		async (placeId: string) => {
			if (upvotedIds.has(placeId)) return;

			const previousCount =
				selectedPlace?.id === placeId ? selectedPlace.upvote_count : 0;

			optimisticUpvote(placeId);

			try {
				const fingerprint = await getFingerprint();
				const result = await upvotePlace(placeId, fingerprint);
				toast.success(
					`Verified! Tx: ${result.transaction_id.slice(0, 8)}...`
				);
			} catch {
				rollbackUpvote(placeId, previousCount);
				toast.error('Already upvoted from this device');
			}
		},
		[upvotedIds, optimisticUpvote, rollbackUpvote, selectedPlace]
	);

	return { handleUpvote, isUpvoted: (id: string) => upvotedIds.has(id) };
}
