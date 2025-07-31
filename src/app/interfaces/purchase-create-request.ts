export interface PurchaseCreateRequest {
  providerId: number;
  adminId: string;
  purchaseDate: string;
  total: number;
  status: number;
  details: PurchaseDetailInCreate[];
}

export interface PurchaseDetailInCreate {
  rawMaterialId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status: number;
}