import { useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { submitPlace } from '@/api/places'
import { getFingerprint } from '@/lib/fingerprint'
import { usePlacesStore } from '@/store/places-store'
import { useSubmissionStore } from '@/store/submission-store'
import type { PlaceSubmission, Category, PlaceType } from '@/types/places'

interface FormData {
  name: string
  category: Category | ''
  place_type: PlaceType | ''
  era: string
  description: string
  address: string
  photoUrl: string
  location: { lng: number; lat: number } | null
}

const INITIAL_FORM: FormData = {
  name: '',
  category: '',
  place_type: '',
  era: '',
  description: '',
  address: '',
  photoUrl: '',
  location: null,
}

interface FormErrors {
  name?: string
  category?: string
  place_type?: string
  location?: string
}

export function useSubmitPlace() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const { closeModal, setSubmitting, submitting } = useSubmissionStore()
  const addPlace = usePlacesStore((s) => s.addPlace)

  const updateField = useCallback(
    <K extends keyof FormData>(field: K, value: FormData[K]) => {
      setForm((prev) => ({ ...prev, [field]: value }))
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    },
    [],
  )

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.category) newErrors.category = 'Category is required'
    if (!form.place_type) newErrors.place_type = 'Type is required'
    if (!form.location) newErrors.location = 'Select a location on the map'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [form])

  const submit = useCallback(async () => {
    if (!validate()) return
    if (!form.location) return

    setSubmitting(true)

    try {
      const fingerprint = await getFingerprint()
      const submission: PlaceSubmission = {
        name: form.name.trim(),
        category: form.category as Category,
        place_type: form.place_type as PlaceType,
        location: {
          type: 'Point',
          coordinates: [form.location.lng, form.location.lat],
        },
        description: form.description.trim() || undefined,
        era: form.era.trim() || undefined,
        address: form.address.trim() || undefined,
        photos: form.photoUrl.trim() ? [form.photoUrl.trim()] : undefined,
      }

      const result = await submitPlace(submission, fingerprint)

      // Add to local store
      addPlace({
        id: result.place_id,
        transaction_id: result.transaction_id,
        name: submission.name,
        location: submission.location,
        place_type: submission.place_type,
        category: submission.category,
        safety_score: 50,
        upvote_count: 0,
        status: 'approved',
        created_at: new Date().toISOString(),
      })

      toast.success(
        `Place submitted! Tx: ${result.transaction_id.slice(0, 8)}...`,
      )
      setForm(INITIAL_FORM)
      closeModal()
    } catch {
      toast.error('Failed to submit place. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }, [form, validate, setSubmitting, addPlace, closeModal])

  return { form, errors, updateField, submit, submitting, reset: () => setForm(INITIAL_FORM) }
}
