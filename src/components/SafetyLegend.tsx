import { motion, AnimatePresence } from 'framer-motion';
import { useMapStore } from '@/store/map-store';
import { slideUp } from '@/lib/motion';

export default function SafetyLegend() {
	const showHeatmap = useMapStore((s) => s.layers.safetyHeatmap);

	return (
		<AnimatePresence>
			{showHeatmap && (
				<motion.div
					variants={slideUp}
					initial="hidden"
					animate="visible"
					exit="exit"
					className="fixed bottom-[26rem] left-6 z-30 bg-surface-elevated/90 backdrop-blur-md rounded-2xl shadow-md border border-border px-4 py-3"
				>
					<p className="text-xs font-medium text-text-secondary mb-2">
						Safety Heatmap
					</p>
					<div className="flex items-center gap-2">
						<span className="text-xs text-text-muted">Low</span>
						<div
							className="w-32 h-2.5 rounded-full"
							style={{
								background:
									'linear-gradient(90deg, #E07A5F, #F2CC8F, #81B29A)',
							}}
						/>
						<span className="text-xs text-text-muted">High</span>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
