import { api } from "./api"

export interface FeedbackRating {
  _id: string
  user_id: string
  rating: number
  feedback: string
  context: string
  createdAt: string
  updatedAt: string
}

export interface CreateFeedbackRatingPayload {
  rating: number
  feedback?: string
  context?: string
}

export const createFeedbackRating = async (
  payload: CreateFeedbackRatingPayload
): Promise<FeedbackRating> => {
  const response = await api.post<FeedbackRating>("/feedback-ratings", payload)
  return response.data
}

export const fetchFeedbackRatings = async (): Promise<{
  ratings: FeedbackRating[]
  scope: "all" | "mine"
}> => {
  const response = await api.get<{ ratings: FeedbackRating[]; scope: "all" | "mine" }>(
    "/feedback-ratings"
  )
  return response.data
}
