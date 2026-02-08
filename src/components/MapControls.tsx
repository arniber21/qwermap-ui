import { Box, Minus, Plus, Compass } from 'lucide-react';
import type mapboxgl from 'mapbox-gl';
import { useMapStore } from '@/store/map-store';
import { useUIStore } from '@/store/ui-store';
import { cn } from '@/lib/utils';

interface MapControlsProps {
	mapRef: React.RefObject<mapboxgl.Map | null>;
}

export default function MapControls({ mapRef }: MapControlsProps) {
	const is3D = useMapStore((s) => s.is3D);
	const toggle3D = useMapStore((s) => s.toggle3D);
	const mobileDrawerOpen = useUIStore((s) => s.mobileDrawerOpen);

	const handleZoomIn = () => {
		mapRef.current?.zoomIn();
	};

	const handleZoomOut = () => {
		mapRef.current?.zoomOut();
	};

	const handleResetNorth = () => {
		mapRef.current?.resetNorth({ duration: 300 });
	};

	return (
		<div
			className={cn(
				'fixed z-30 flex flex-col gap-2',
				mobileDrawerOpen
					? 'bottom-[calc(60vh+5rem)]'
					: 'bottom-24',
				'right-6 lg:right-[calc(28rem+1.5rem)] lg:bottom-24'
			)}
		>
			<div className="bg-surface-elevated/90 backdrop-blur-md border border-border shadow-lg rounded-2xl overflow-hidden">
				<button
					onClick={handleZoomIn}
					className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-cream-dark transition-colors cursor-pointer"
					aria-label="Zoom in"
				>
					<Plus size={16} />
				</button>
				<button
					onClick={handleZoomOut}
					className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-cream-dark transition-colors cursor-pointer"
					aria-label="Zoom out"
				>
					<Minus size={16} />
				</button>
				<button
					onClick={handleResetNorth}
					className="w-10 h-10 flex items-center justify-center text-text-primary hover:bg-cream-dark transition-colors cursor-pointer"
					aria-label="Reset map rotation"
				>
					<Compass size={16} />
				</button>
			</div>

			<button
				onClick={toggle3D}
				className={cn(
					'px-3 py-2 rounded-2xl border shadow-md text-xs font-medium flex items-center gap-2 cursor-pointer',
					'bg-surface-elevated/90 backdrop-blur-md border-border',
					is3D
						? 'text-mauve border-mauve/40'
						: 'text-text-secondary'
				)}
				aria-pressed={is3D}
				aria-label="Toggle 3D mode"
			>
				<Box size={14} />
				<span>{is3D ? '3D On' : '3D Off'}</span>
			</button>
		</div>
	);
}
