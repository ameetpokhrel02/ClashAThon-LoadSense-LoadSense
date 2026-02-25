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
}

const mapDeadline = (d: BackendDeadline): Deadline => ({
  id: d._id,
  title: d.title,
  course: d.course,
  type: d.type,
  dueDate: d.dueDate,
  estimatedHours: d.estimatedHours,
  risk: d.risk,
})

export interface CreateDeadlinePayload {
  title: string
  course: string
  type: string
  dueDate: string
  estimatedHours: number
  risk: RiskLevel
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
