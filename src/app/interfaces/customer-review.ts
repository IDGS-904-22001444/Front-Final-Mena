export interface CustomerReview {
  id: number;
  clientId: string;
  comment: string;
  rating: number;
  createdAt: string;
  reply?: string;
  repliedAt?: string;
  // Agregar información del cliente
  client?: {
    id: string;
    fullName: string;
    email: string;
    userName: string;
  };
}

export interface CustomerReviewCreateRequest {
  clientId: string;
  comment: string;
  rating: number;
  createdAt?: string;
}