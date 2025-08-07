export interface ProductCreateRequest {
  name: string;
  description: string;
  salePrice: number;
  stock: number;
  status: number;
  imageUrl?: string | null;
}