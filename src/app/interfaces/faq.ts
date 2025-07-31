export interface Faq {
  id: number;
  question: string;
  answer: string;
  status: number; // 0 = Inactivo, 1 = Activo
  createdDate: string;
  updatedDate?: string;
}