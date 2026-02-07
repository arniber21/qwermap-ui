import { create } from 'zustand'

interface SubmissionState {
  isOpen: boolean
  prefillLocation: { lng: number; lat: number } | null
  submitting: boolean

  openModal: (location?: { lng: number; lat: number }) => void
  closeModal: () => void
  setSubmitting: (submitting: boolean) => void
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  isOpen: false,
  prefillLocation: null,
  submitting: false,

  openModal: (location) =>
    set({ isOpen: true, prefillLocation: location ?? null }),
  closeModal: () =>
    set({ isOpen: false, prefillLocation: null, submitting: false }),
  setSubmitting: (submitting) => set({ submitting }),
}))
