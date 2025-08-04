export interface PurchaseCreateRequest {
  providerId: number | null;
  adminId: string;
  purchaseDate: string;
  total: number;
  status: number;
  details: PurchaseDetailInCreate[];
}

interface PurchaseDetailInCreate {
  rawMaterialId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status: number;
}