import { ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TxLinkProps {
	txId: string;
	className?: string;
}

export default function TxLink({ txId, className }: TxLinkProps) {
	const truncated = `${txId.slice(0, 6)}...${txId.slice(-4)}`;
	const explorerUrl = `https://explorer.solana.com/tx/${txId}?cluster=devnet`;

	return (
		<a
			href={explorerUrl}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				'inline-flex items-center gap-1.5 text-xs font-mono',
				'text-mauve hover:text-mauve-dark transition-colors',
				className
			)}
			aria-label={`View transaction ${truncated} on Solana Explorer`}
		>
			<span>{truncated}</span>
			<ExternalLink size={12} />
		</a>
	);
}
