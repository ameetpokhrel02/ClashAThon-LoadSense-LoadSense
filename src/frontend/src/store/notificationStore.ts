import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface NotificationState {
    readIds: string[]
    markAsRead: (id: string) => void
    markAllAsRead: (ids: string[]) => void
    isRead: (id: string) => boolean
    clearAll: () => void
}

export const useNotificationStore = create<NotificationState>()(
    persist(
        (set, get) => ({
            readIds: [],
            markAsRead: (id: string) => {
                if (!get().readIds.includes(id)) {
                    set({ readIds: [...get().readIds, id] })
                }
            },
            markAllAsRead: (ids: string[]) => {
                set({ readIds: Array.from(new Set([...get().readIds, ...ids])) })
            },
            isRead: (id: string) => get().readIds.includes(id),
            clearAll: () => set({ readIds: [] }),
        }),
        {
            name: 'notification-storage',
        }
    )
)
