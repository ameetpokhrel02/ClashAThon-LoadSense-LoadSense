import { create } from 'zustand'
import { api, handleApiError } from '@/lib/api'

interface Insight {
    type: 'info' | 'warning' | 'success'
    title: string
    message: string
    color: 'blue' | 'red' | 'yellow' | 'green'
}

interface InsightsState {
    insights: Insight[]
    isLoading: boolean
    error: string | null
    fetchInsights: () => Promise<void>
}

export const useInsightsStore = create<InsightsState>((set) => ({
    insights: [],
    isLoading: false,
    error: null,
    fetchInsights: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await api.get('/insights')
            set({ insights: response.data.data, isLoading: false })
        } catch (error) {
            set({ error: handleApiError(error), isLoading: false })
        }
    },
}))
