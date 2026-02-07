import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  color?: string
  bgColor?: string
  className?: string
}

export default function Badge({
  children,
  color = 'text-text-secondary',
  bgColor = 'bg-cream-dark',
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
        color,
        bgColor,
        className,
      )}
    >
      {children}
    </span>
  )
}
