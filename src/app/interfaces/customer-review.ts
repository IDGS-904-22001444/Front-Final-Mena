export interface CustomerReview {
  id: number;
  clientId: number;
  comment: string;
  rating: number;
  createdAt: string;
  reply?: string; // Respuesta del admin
  repliedAt?: string;
}