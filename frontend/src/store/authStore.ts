import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { api } from '@/lib/api'

export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  ward?: string
  role?: string
  avatar?: string | null
}

interface AuthState {
  user: User | null
  token: string | null
  isLoggedIn: boolean
  isLoadingProfile: boolean
  profileError: string | null
  setAuth: (user: User, token: string) => void
  logout: () => void
  fetchProfile: () => Promise<void>
  updateProfile: (data: FormData) => Promise<void>
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoggedIn: false,
      isLoadingProfile: false,
      profileError: null,
      setAuth: (user, token) => set({ user, token, isLoggedIn: true }),
      logout: () => set({ user: null, token: null, isLoggedIn: false }),
      updateUser: (user) => set({ user }),

      fetchProfile: async () => {
        const { user } = get()
        if (!user?.id) {
          set({ profileError: 'No user logged in' })
          return
        }
        try {
          set({ isLoadingProfile: true, profileError: null })
          const response = await api.get('/users/profile')
          set({ user: response.data.user, isLoadingProfile: false })
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } } }
          set({
            isLoadingProfile: false,
            profileError: err.response?.data?.message || 'Failed to fetch profile'
          })
        }
      },

      updateProfile: async (data: FormData) => {
        const { user } = get()
        if (!user?.id) {
          set({ profileError: 'No user logged in' })
          throw new Error('No user logged in')
        }
        try {
          set({ isLoadingProfile: true, profileError: null })
          const response = await api.patch('/users/profile', data)
          set({ user: response.data.user, isLoadingProfile: false })
        } catch (error: unknown) {
          const err = error as { response?: { data?: { message?: string } }, message: string }
          console.error("DEBUG FRONTEND PROFILE UPDATE ERROR:", err.response?.data || err.message);
          set({
            isLoadingProfile: false,
            profileError: err.response?.data?.message || 'Failed to update profile'
          })
          throw error
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isLoggedIn: state.isLoggedIn
      }),
    }
  )
)
