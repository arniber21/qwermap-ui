import { Link } from '@tanstack/react-router';
import { MapPin, Shield, Info, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMapStore } from '@/store/map-store';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';

export default function Header() {
	const { layers, toggleLayer } = useMapStore();
	const leftPanelTab = useUIStore((s) => s.leftPanelTab);
	const setLeftPanelTab = useUIStore((s) => s.setLeftPanelTab);
	const openAbout = useUIStore((s) => s.openAbout);

	return (
		<motion.header
			initial={{ opacity: 0, y: -10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ type: 'spring', stiffness: 300, damping: 30 }}
			className="fixed top-0 left-0 right-0 z-40 h-14 bg-surface-elevated/90 backdrop-blur-md border-b border-border"
		>
			<div className="h-full flex items-center justify-between px-4">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-2 no-underline">
					<MapPin size={22} className="text-mauve" />
					<span className="font-serif text-xl font-bold text-text-primary tracking-tight">
						QWERMap
					</span>
				</Link>

				{/* Actions */}
				<div className="flex items-center gap-2">
					<button
						onClick={() => setLeftPanelTab('search')}
						className={cn(
							'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium',
							'transition-all duration-[var(--transition-fast)] cursor-pointer',
							leftPanelTab === 'search'
								? 'bg-mauve text-white shadow-sm'
								: 'bg-cream-dark text-text-secondary hover:bg-border'
						)}
						aria-label="Toggle search panel"
						aria-pressed={leftPanelTab === 'search'}
					>
						<Search size={15} />
						<span className="hidden sm:inline">Search</span>
					</button>
					<button
						onClick={() => toggleLayer('safetyHeatmap')}
						className={cn(
							'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium',
							'transition-all duration-[var(--transition-fast)] cursor-pointer',
							layers.safetyHeatmap
								? 'bg-mauve text-white shadow-sm'
								: 'bg-cream-dark text-text-secondary hover:bg-border'
						)}
						aria-label="Toggle safety heatmap"
						aria-pressed={layers.safetyHeatmap}
					>
						<Shield size={15} />
						<span className="hidden sm:inline">Safety Map</span>
					</button>
					<button
						onClick={openAbout}
						className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-text-secondary hover:bg-cream-dark transition-colors cursor-pointer"
						aria-label="About QWERMap"
					>
						<Info size={15} />
						<span className="hidden sm:inline">About</span>
					</button>
				</div>
			</div>
		</motion.header>
	);
}
