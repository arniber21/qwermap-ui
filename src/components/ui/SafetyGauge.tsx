import { cn } from '@/lib/utils';

interface SafetyGaugeProps {
	score: number; // 0-100
	className?: string;
}

export default function SafetyGauge({ score, className }: SafetyGaugeProps) {
	const label =
		score >= 80
			? 'Very Safe'
			: score >= 60
				? 'Safe'
				: score >= 40
					? 'Moderate'
					: 'Low';

	return (
		<div className={cn('flex flex-col gap-1.5', className)}>
			<div className="flex justify-between items-center">
				<span className="text-xs font-medium text-text-secondary">
					Safety Score
				</span>
				<span className="text-xs font-mono font-medium text-text-primary">
					{score}/100 — {label}
				</span>
			</div>
			<div className="h-2 rounded-full bg-cream-dark overflow-hidden">
				<div
					className="h-full rounded-full transition-all duration-[var(--transition-slow)]"
					style={{
						width: `${score}%`,
						background: `linear-gradient(90deg, var(--color-safety-low), var(--color-safety-mid), var(--color-safety-high))`,
						backgroundSize: '300% 100%',
						backgroundPosition: `${score}% 0%`,
					}}
				/>
			</div>
		</div>
	);
}
