export interface Sale {
  id: number;
  clientId: string;
  productId: number;
  quantity: number;
  saleDate: string;
  total: number;
  status: number;
  client?: {
    id: string;
    userName: string;
    email: string;
    fullName: string;
  };
  product?: {
    productId: number;
    name: string;
    description: string;
    salePrice: number;
    stock: number;
    status: number;
  };
}