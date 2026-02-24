import { create } from 'zustand'
import { api } from '@/lib/api'

export interface Module {
  _id: string
  moduleCode: string
  title: string
  department: string
  credits: number
  semester: number
  year: number
  createdAt?: string
  updatedAt?: string
}

interface CreateModuleData {
  moduleCode: string
  title: string
  department: string
  credits: number
  semester: number
  year: number
}

interface ModuleState {
  modules: Module[]
  isLoading: boolean
  error: string | null
  
  // Actions
  fetchModules: (semester?: number) => Promise<void>
  createModule: (data: CreateModuleData) => Promise<void>
  getModuleById: (id: string) => Promise<Module | null>
  setError: (error: string | null) => void
}

export const useModuleStore = create<ModuleState>((set, get) => ({
  modules: [],
  isLoading: false,
  error: null,

  fetchModules: async (semester?: number) => {
    try {
      set({ isLoading: true, error: null })
      const params = semester ? `?semester=${semester}` : ''
      const response = await api.get(`/modules${params}`)
      set({ modules: response.data.data || [], isLoading: false })
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || 'Failed to fetch modules' 
      })
    }
  },

  createModule: async (data: CreateModuleData) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.post('/modules', data)
      const newModule = response.data.data
      set((state) => ({ 
        modules: [...state.modules, newModule].sort((a, b) => {
          if (a.semester !== b.semester) return a.semester - b.semester
          return a.moduleCode.localeCompare(b.moduleCode)
        }),
        isLoading: false 
      }))
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      set({ 
        isLoading: false, 
        error: err.response?.data?.message || 'Failed to create module' 
      })
      throw error
    }
  },

  getModuleById: async (id: string) => {
    try {
      // First check if we have it in the store
      const existing = get().modules.find(m => m._id === id)
      if (existing) return existing
      
      // Otherwise fetch from API
      const response = await api.get(`/modules/${id}`)
      return response.data.data || null
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      set({ error: err.response?.data?.message || 'Failed to fetch module' })
      return null
    }
  },

  setError: (error) => set({ error }),
}))
