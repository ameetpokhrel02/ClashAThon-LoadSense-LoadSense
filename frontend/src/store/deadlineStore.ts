import { create } from 'zustand'
import { fetchDeadlines, createDeadline, deleteDeadline as apiDeleteDeadline, setDeadlineCompleted, type CreateDeadlinePayload } from '@/lib/deadlineApi'

export type RiskLevel = 'low' | 'medium' | 'high'

export interface Deadline {
  id: string
  title: string
  course: string
  type: string
  dueDate: string
  estimatedHours: number
  risk: RiskLevel
  isCompleted: boolean
  notes?: string
  impactLevel?: 'low' | 'medium' | 'high' | 'critical'
  weight?: number
}

interface DeadlineState {
  deadlines: Deadline[]
  workloadScore: number // 0 to 100
  isLoading: boolean
  error: string | null
  
  // Actions
  setDeadlines: (deadlines: Deadline[]) => void
  addDeadlineLocal: (deadline: Deadline) => void
  removeDeadlineLocal: (id: string) => void
  updateWorkloadScore: (score: number) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void

  // Async actions that talk to the API
  loadDeadlines: () => Promise<void>
  createDeadline: (payload: CreateDeadlinePayload) => Promise<Deadline | null>
  deleteDeadline: (id: string) => Promise<boolean>
  setDeadlineCompleted: (id: string, isCompleted: boolean) => Promise<Deadline | null>
}

export const useDeadlineStore = create<DeadlineState>((set, get) => ({
  deadlines: [],
  workloadScore: 0,
  isLoading: false,
  error: null,

  setDeadlines: (deadlines) => set({ deadlines }),
  addDeadlineLocal: (deadline) => set((state) => ({ deadlines: [...state.deadlines, deadline] })),
  removeDeadlineLocal: (id) => set((state) => ({ deadlines: state.deadlines.filter(d => d.id !== id) })),
  updateWorkloadScore: (score) => set({ workloadScore: score }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  loadDeadlines: async () => {
    try {
      set({ isLoading: true, error: null })
      const deadlines = await fetchDeadlines()
      set({ deadlines, isLoading: false })
    } catch (error: any) {
      set({ error: error?.message || 'Failed to load deadlines', isLoading: false })
    }
  },

  createDeadline: async (payload) => {
    try {
      set({ isLoading: true, error: null })
      const deadline = await createDeadline(payload)
      const { deadlines } = get()
      set({ deadlines: [...deadlines, deadline], isLoading: false })
      return deadline
    } catch (error: any) {
      set({ error: error?.message || 'Failed to create deadline', isLoading: false })
      return null
    }
  },

  deleteDeadline: async (id) => {
    try {
      set({ isLoading: true, error: null })
      await apiDeleteDeadline(id)
      const { deadlines } = get()
      set({ deadlines: deadlines.filter(d => d.id !== id), isLoading: false })
      return true
    } catch (error: any) {
      set({ error: error?.message || 'Failed to delete deadline', isLoading: false })
      return false
    }
  },

  setDeadlineCompleted: async (id, isCompleted) => {
    try {
      set({ isLoading: true, error: null })
      const updated = await setDeadlineCompleted(id, isCompleted)
      const { deadlines } = get()
      set({
        deadlines: deadlines.map(d => (d.id === id ? updated : d)),
        isLoading: false,
      })
      return updated
    } catch (error: any) {
      set({ error: error?.message || 'Failed to update deadline', isLoading: false })
      return null
    }
  },
}))
