import { create } from 'zustand'
import { api } from '@/lib/api'

export type RiskLevel = 'low' | 'medium' | 'high'

export interface Deadline {
  _id?: string
  id?: string
  title: string
  course: string
  type: string
  dueDate: string
  estimatedHours: number
  risk: RiskLevel
  notes?: string
  createdAt?: string
  updatedAt?: string
}

interface DeadlineState {
  deadlines: Deadline[]
  workloadScore: number
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchDeadlines: () => Promise<void>
  createDeadline: (deadline: Omit<Deadline, '_id' | 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>
  deleteDeadline: (id: string) => Promise<void>
  setDeadlines: (deadlines: Deadline[]) => void
  updateWorkloadScore: (score: number) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useDeadlineStore = create<DeadlineState>((set, get) => ({
  deadlines: [],
  workloadScore: 0,
  isLoading: false,
  error: null,

  fetchDeadlines: async () => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.get('/deadlines')
      const deadlines = response.data.map((d: Deadline) => ({
        ...d,
        id: d._id || d.id, // Normalize id field
      }))
      set({ deadlines, isLoading: false })
      
      // Calculate workload score based on deadlines
      const totalHours = deadlines.reduce((sum: number, d: Deadline) => sum + d.estimatedHours, 0)
      const score = Math.min(100, Math.round((totalHours / 40) * 100)) // 40 hours = 100%
      set({ workloadScore: score })
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || 'Failed to fetch deadlines' 
      })
    }
  },

  createDeadline: async (deadlineData) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.post('/deadlines', deadlineData)
      const newDeadline = { ...response.data, id: response.data._id }
      set((state) => ({ 
        deadlines: [...state.deadlines, newDeadline].sort(
          (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        ),
        isLoading: false 
      }))
      
      // Recalculate workload score
      const { deadlines } = get()
      const totalHours = deadlines.reduce((sum, d) => sum + d.estimatedHours, 0)
      const score = Math.min(100, Math.round((totalHours / 40) * 100))
      set({ workloadScore: score })
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || 'Failed to create deadline' 
      })
      throw error
    }
  },

  deleteDeadline: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      await api.delete(`/deadlines/${id}`)
      set((state) => ({ 
        deadlines: state.deadlines.filter(d => (d._id || d.id) !== id),
        isLoading: false 
      }))
      
      // Recalculate workload score
      const { deadlines } = get()
      const totalHours = deadlines.reduce((sum, d) => sum + d.estimatedHours, 0)
      const score = Math.min(100, Math.round((totalHours / 40) * 100))
      set({ workloadScore: score })
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || 'Failed to delete deadline' 
      })
      throw error
    }
  },

  setDeadlines: (deadlines) => set({ deadlines }),
  updateWorkloadScore: (score) => set({ workloadScore: score }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
