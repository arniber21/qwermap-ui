import {
  Beer,
  Coffee,
  BookOpen,
  Users,
  Book,
  Trees,
  Palette,
  MapPin,
} from 'lucide-react'
import type { Category } from '@/types/places'
import type { LucideIcon } from 'lucide-react'

export interface CategoryConfig {
  label: string
  icon: LucideIcon
  color: string
  bgColor: string
  mapColor: string
}

export const CATEGORY_CONFIG: Record<Category, CategoryConfig> = {
  bar: {
    label: 'Bar',
    icon: Beer,
    color: 'text-rose-dark',
    bgColor: 'bg-rose-light',
    mapColor: '#E8A0BF',
  },
  cafe: {
    label: 'Café',
    icon: Coffee,
    color: 'text-peach-dark',
    bgColor: 'bg-peach-light',
    mapColor: '#F7C59F',
  },
  library: {
    label: 'Library',
    icon: BookOpen,
    color: 'text-sky-dark',
    bgColor: 'bg-sky-light',
    mapColor: '#A8D8EA',
  },
  community_center: {
    label: 'Community Center',
    icon: Users,
    color: 'text-lavender-dark',
    bgColor: 'bg-lavender-light',
    mapColor: '#C3AED6',
  },
  bookstore: {
    label: 'Bookstore',
    icon: Book,
    color: 'text-sage-dark',
    bgColor: 'bg-sage-light',
    mapColor: '#B5CFB7',
  },
  park: {
    label: 'Park',
    icon: Trees,
    color: 'text-sage-dark',
    bgColor: 'bg-sage-light',
    mapColor: '#8FB892',
  },
  art_space: {
    label: 'Art Space',
    icon: Palette,
    color: 'text-mauve-dark',
    bgColor: 'bg-mauve-light',
    mapColor: '#957DAD',
  },
  other: {
    label: 'Other',
    icon: MapPin,
    color: 'text-text-secondary',
    bgColor: 'bg-cream-dark',
    mapColor: '#9490A0',
  },
}
