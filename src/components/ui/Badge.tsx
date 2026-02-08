import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BadgeProps {
	children: React.ReactNode;
	color?: string;
	bgColor?: string;
	className?: string;
}

export default function Badge({
	children,
	color = 'text-text-secondary',
	bgColor = 'bg-cream-dark',
	className,
}: BadgeProps) {
	return (
		<motion.span
			whileHover={{ scale: 1.05 }}
			transition={{ type: 'spring', stiffness: 400, damping: 25 }}
			className={cn(
				'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
				color,
				bgColor,
				className
			)}
		>
			{children}
		</motion.span>
	);
}
