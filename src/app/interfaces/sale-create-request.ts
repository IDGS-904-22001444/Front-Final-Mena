export interface SaleCreateRequest {
  clientId: string;
  productId: number;
  quantity: number;
  saleDate: string;
  total: number;
  status: number;
}