import { api } from "./api"
import type { Deadline, RiskLevel } from "@/store/deadlineStore"

// Shape returned by the backend (Mongoose document)
interface BackendDeadline {
  _id: string
  title: string
  course: string
  type: string
  dueDate: string
  estimatedHours: number
  risk: RiskLevel
  notes?: string
  is_completed?: boolean
  impact_level?: 'low' | 'medium' | 'high' | 'critical'
  weight?: number
}

const mapDeadline = (d: BackendDeadline): Deadline => ({
  id: d._id,
  title: d.title,
  course: d.course,
  type: d.type,
  dueDate: d.dueDate,
  estimatedHours: d.estimatedHours,
  risk: d.risk,
  isCompleted: Boolean(d.is_completed),
  impactLevel: d.impact_level,
  weight: d.weight,
})

export interface CreateDeadlinePayload {
  title: string
  course: string
  type: string
  dueDate: string
  estimatedHours: number
  risk?: RiskLevel
  notes?: string
}

export const fetchDeadlines = async (): Promise<Deadline[]> => {
  const response = await api.get<BackendDeadline[]>("/deadlines")
  return response.data.map(mapDeadline)
}

export const createDeadline = async (
  payload: CreateDeadlinePayload
): Promise<Deadline> => {
  const response = await api.post<BackendDeadline>("/deadlines", payload)
  return mapDeadline(response.data)
}

export const deleteDeadline = async (id: string): Promise<void> => {
  await api.delete(`/deadlines/${id}`)
}

export const setDeadlineCompleted = async (
  id: string,
  isCompleted: boolean
): Promise<Deadline> => {
  const response = await api.patch<BackendDeadline>(`/deadlines/${id}`, {
    is_completed: isCompleted,
  })
  return mapDeadline(response.data)
}
