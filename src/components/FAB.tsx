import { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSubmissionStore } from '@/store/submission-store';
import { cn } from '@/lib/utils';

export default function FAB() {
	const openModal = useSubmissionStore((s) => s.openModal);
	const [isHovered, setIsHovered] = useState(false);

	return (
		<div
			className={cn(
				'fixed bottom-6 z-30 flex items-center',
				'right-6 lg:right-[calc(28rem+1.5rem)]'
			)}
			style={{ transition: 'right 0.3s ease' }}
		>
			{/* Hover label */}
			<AnimatePresence>
				{isHovered && (
					<motion.span
						initial={{ opacity: 0, x: 8 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: 8 }}
						transition={{ duration: 0.15 }}
						className="absolute right-full mr-3 whitespace-nowrap px-3 py-1.5 rounded-full bg-surface-elevated shadow-md border border-border text-sm font-medium text-text-primary"
					>
						Add Place
					</motion.span>
				)}
			</AnimatePresence>

			{/* Pulse ring */}
			<motion.div
				className="absolute inset-0 rounded-full"
				style={{
					background:
						'linear-gradient(135deg, #957DAD, #C3AED6)',
				}}
				animate={{
					scale: [1, 1.3, 1],
					opacity: [0.4, 0, 0.4],
				}}
				transition={{
					duration: 2,
					repeat: Infinity,
					ease: 'easeInOut',
				}}
			/>

			{/* Main button */}
			<motion.button
				onClick={() => openModal()}
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				initial={{ scale: 0 }}
				animate={{ scale: 1 }}
				whileHover={{ scale: 1.1 }}
				whileTap={{ scale: 0.95 }}
				transition={{ type: 'spring', stiffness: 300, damping: 20 }}
				className={cn(
					'relative w-16 h-16 rounded-full',
					'text-white shadow-lg hover:shadow-xl',
					'flex items-center justify-center',
					'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-mauve',
					'cursor-pointer'
				)}
				style={{
					background: 'linear-gradient(135deg, #957DAD, #C3AED6)',
				}}
				aria-label="Submit a new place"
			>
				<Plus size={28} strokeWidth={2.5} />
			</motion.button>
		</div>
	);
}
