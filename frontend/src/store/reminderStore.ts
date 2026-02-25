import { create } from 'zustand'
import { api, handleApiError } from '@/lib/api'

interface Reminder {
    _id: string
    title: string
    course: string
    dueDate: string
    type: string
    is_completed: boolean
}

interface RemindersState {
    reminders: Reminder[]
    isLoading: boolean
    error: string | null
    fetchReminders: () => Promise<void>
}

export const useRemindersStore = create<RemindersState>((set) => ({
    reminders: [],
    isLoading: false,
    error: null,
    fetchReminders: async () => {
        set({ isLoading: true, error: null })
        try {
            const response = await api.get('/reminders')
            set({ reminders: response.data.data, isLoading: false })
        } catch (error) {
            set({ error: handleApiError(error), isLoading: false })
        }
    },
}))
