import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	error?: string;
	charCount?: boolean;
}

export default function Textarea({
	label,
	error,
	charCount,
	maxLength,
	value,
	className,
	id,
	...props
}: TextareaProps) {
	const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');
	const currentLength = typeof value === 'string' ? value.length : 0;
	return (
		<div className="flex flex-col gap-1">
			{label && (
				<label
					htmlFor={textareaId}
					className="text-sm font-medium text-text-secondary"
				>
					{label}
				</label>
			)}
			<textarea
				id={textareaId}
				value={value}
				maxLength={maxLength}
				className={cn(
					'px-3 py-2 rounded-xl border border-border bg-surface-elevated resize-y',
					'text-sm text-text-primary placeholder:text-text-muted',
					'transition-colors duration-[var(--transition-fast)]',
					'focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20',
					'min-h-[80px]',
					error && 'border-safety-low',
					className
				)}
				{...props}
			/>
			<div className="flex justify-between">
				{error && <p className="text-xs text-safety-low">{error}</p>}
				{charCount && maxLength && (
					<p className="text-xs text-text-muted ml-auto">
						{currentLength}/{maxLength}
					</p>
				)}
			</div>
		</div>
	);
}
