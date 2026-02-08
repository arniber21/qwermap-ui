export function formatDistance(meters: number): string {
	if (meters < 1000) {
		return `${Math.round(meters)}m`;
	}
	const km = meters / 1000;
	return `${km.toFixed(1)}km`;
}

export function formatDate(iso: string): string {
	return new Date(iso).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});
}

export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength).trimEnd() + '…';
}

export function cn(...classes: (string | false | null | undefined)[]): string {
	return classes.filter(Boolean).join(' ');
}
