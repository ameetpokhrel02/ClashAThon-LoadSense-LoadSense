import { create } from 'zustand'

export type RiskLevel = 'low' | 'medium' | 'high'

export interface Deadline {
  id: string
  title: string
  course: string
  type: string
  dueDate: string
  estimatedHours: number
  risk: RiskLevel
}

interface DeadlineState {
  deadlines: Deadline[]
  workloadScore: number // 0 to 100
  isLoading: boolean
  error: string | null
  
  // Actions
  setDeadlines: (deadlines: Deadline[]) => void
  addDeadline: (deadline: Deadline) => void
  removeDeadline: (id: string) => void
  updateWorkloadScore: (score: number) => void
  setLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export const useDeadlineStore = create<DeadlineState>((set) => ({
  deadlines: [
    // Initial mock data for the hackathon MVP
    { id: '1', title: "CS301 Midterm Project", course: "Computer Science", dueDate: new Date(Date.now() + 86400000).toISOString(), estimatedHours: 15, risk: "high", type: "Project" },
    { id: '2', title: "ENG205 Essay Draft", course: "Literature", dueDate: new Date(Date.now() + 86400000 * 3).toISOString(), estimatedHours: 8, risk: "medium", type: "Essay" },
    { id: '3', title: "MATH210 Problem Set 4", course: "Mathematics", dueDate: new Date(Date.now() + 86400000 * 4).toISOString(), estimatedHours: 5, risk: "low", type: "Homework" },
  ],
  workloadScore: 65,
  isLoading: false,
  error: null,

  setDeadlines: (deadlines) => set({ deadlines }),
  addDeadline: (deadline) => set((state) => ({ deadlines: [...state.deadlines, deadline] })),
  removeDeadline: (id) => set((state) => ({ deadlines: state.deadlines.filter(d => d.id !== id) })),
  updateWorkloadScore: (score) => set({ workloadScore: score }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}))
