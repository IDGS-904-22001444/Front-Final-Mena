export interface PurchaseCreateRequest {
  providerId: number;
  adminId: string;
  purchaseDate: string;
  total: number;
  status: number;
  details: PurchaseDetailInCreate[];
}