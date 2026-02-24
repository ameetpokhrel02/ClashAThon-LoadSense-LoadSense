import { create } from 'zustand'
import { api, handleApiError } from '@/lib/api'

// Types based on backend responses
interface Deadline {
  _id: string
  title: string
  type: string
  due_date: string
  weight: number
  impact_level: string
  course_id?: {
    _id: string
    course_name: string
    course_code: string
  }
}

interface WorkloadWeek {
  _id: string
  user_id: string
  week_start: string
  week_end: string
  load_score: number
  risk_level: 'low' | 'moderate' | 'high' | 'critical'
  deadline_count: number
  deadlines: Deadline[]
}

interface Alert {
  week_start: string
  week_end: string
  risk_level: 'high' | 'critical'
  load_score: number
  deadline_count: number
  tasks_causing_overload: Deadline[]
  message: string
}

interface WorkloadSummary {
  current_week: WorkloadWeek | null
  peak_week: WorkloadWeek | null
  upcoming_weeks: WorkloadWeek[]
  total_overload_weeks: number
}

interface WorkloadState {
  // Data
  weeks: WorkloadWeek[]
  alerts: Alert[]
  summary: WorkloadSummary | null
  
  // Loading states
  isLoading: boolean
  isCalculating: boolean
  error: string | null
  
  // Actions
  calculateWorkload: () => Promise<void>
  fetchWorkload: () => Promise<void>
  fetchAlerts: () => Promise<void>
  fetchSummary: () => Promise<void>
  clearError: () => void
}

export const useWorkloadStore = create<WorkloadState>((set, get) => ({
  // Initial state
  weeks: [],
  alerts: [],
  summary: null,
  isLoading: false,
  isCalculating: false,
  error: null,

  // Recalculate workload scores for all weeks
  calculateWorkload: async () => {
    set({ isCalculating: true, error: null })
    try {
      const response = await api.post('/workload/calculate')
      set({ weeks: response.data.weeks, isCalculating: false })
      // Also refresh summary and alerts after recalculation
      await get().fetchSummary()
      await get().fetchAlerts()
    } catch (error) {
      set({ error: handleApiError(error), isCalculating: false })
    }
  },

  // Get all weekly load data for charts
  fetchWorkload: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/workload')
      set({ weeks: response.data.weeks, isLoading: false })
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false })
    }
  },

  // Get only High/Critical risk alerts
  fetchAlerts: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/workload/alert')
      set({ alerts: response.data.alerts || [], isLoading: false })
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false })
    }
  },

  // Main dashboard view (Current status + peak weeks)
  fetchSummary: async () => {
    set({ isLoading: true, error: null })
    try {
      const response = await api.get('/workload/summary')
      set({ summary: response.data, isLoading: false })
    } catch (error) {
      set({ error: handleApiError(error), isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
}))
