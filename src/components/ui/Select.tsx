import { cn } from '@/lib/utils'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: { value: string; label: string }[]
  placeholder?: string
}

export default function Select({
  label,
  error,
  options,
  placeholder,
  className,
  id,
  ...props
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={selectId}
          className="text-sm font-medium text-text-secondary"
        >
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          'px-3 py-2 rounded-xl border border-border bg-surface-elevated',
          'text-sm text-text-primary',
          'transition-colors duration-[var(--transition-fast)]',
          'focus:outline-none focus:border-mauve focus:ring-2 focus:ring-mauve/20',
          'appearance-none cursor-pointer',
          error && 'border-safety-low',
          className,
        )}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-safety-low">{error}</p>}
    </div>
  )
}
