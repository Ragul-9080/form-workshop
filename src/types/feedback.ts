export interface WorkshopFeedback {
  id?: string;
  name: string;
  department: string;
  feedback: string;
  rating?: number;
  rating_ragul?: number;
  rating_ashvini?: number;
  speaker_ratings?: Record<string, number>;
  created_at?: string;
}
