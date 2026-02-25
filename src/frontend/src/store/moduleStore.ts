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

interface UpdateModuleData extends Partial<CreateModuleData> {
  _id: string
}

interface ModuleState {
  modules: Module[]
  isLoading: boolean
  error: string | null

  // Actions
  fetchModules: (semester?: number) => Promise<void>
  createModule: (data: CreateModuleData) => Promise<void>
  getModuleById: (id: string) => Promise<Module | null>
  updateModule: (id: string, data: UpdateModuleData) => Promise<void>
  deleteModule: (id: string) => Promise<void>
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

  updateModule: async (id: string, data: UpdateModuleData) => {
    try {
      set({ isLoading: true, error: null })
      const response = await api.patch(`/modules/${id}`, data)
      const updatedModule = response.data.data
      set((state) => ({
        modules: state.modules.map(m => m._id === id ? updatedModule : m),
        isLoading: false
      }))
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to update module' })
      throw error
    }
  },

  deleteModule: async (id: string) => {
    try {
      set({ isLoading: true, error: null })
      await api.delete(`/modules/${id}`)
      set((state) => ({
        modules: state.modules.filter(m => m._id !== id),
        isLoading: false
      }))
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      set({ isLoading: false, error: err.response?.data?.message || 'Failed to delete module' })
      throw error
    }
  },

  setError: (error) => set({ error }),
}))
