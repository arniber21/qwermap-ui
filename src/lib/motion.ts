import type { Variants, Transition } from 'framer-motion';

export const springConfig: Transition = {
	type: 'spring',
	stiffness: 300,
	damping: 30,
};

export const slideRight: Variants = {
	hidden: { x: '100%' },
	visible: { x: 0, transition: springConfig },
	exit: { x: '100%', transition: { ...springConfig, damping: 40 } },
};

export const slideLeft: Variants = {
	hidden: { x: '-100%' },
	visible: { x: 0, transition: springConfig },
	exit: { x: '-100%', transition: { ...springConfig, damping: 40 } },
};

export const fadeScale: Variants = {
	hidden: { opacity: 0, scale: 0.95 },
	visible: { opacity: 1, scale: 1, transition: springConfig },
	exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
};

export const slideUp: Variants = {
	hidden: { opacity: 0, y: 16 },
	visible: { opacity: 1, y: 0, transition: springConfig },
	exit: { opacity: 0, y: 16, transition: { duration: 0.15 } },
};

export const staggerContainer: Variants = {
	hidden: {},
	visible: {
		transition: {
			staggerChildren: 0.05,
		},
	},
};

export const staggerItem: Variants = {
	hidden: { opacity: 0, y: 8 },
	visible: { opacity: 1, y: 0, transition: springConfig },
};
