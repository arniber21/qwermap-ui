import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export default function Input({
  label,
  error,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'px-3 py-2 rounded-xl border border-border bg-surface-elevated',
          'text-sm text-text-primary placeholder:text-text-muted',
          'transition-colors duration-[var(--transition-fast)]',
          'focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20',
          error && 'border-safety-low focus:border-safety-low focus:ring-safety-low/20',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-safety-low">{error}</p>}
    </div>
  )
}
