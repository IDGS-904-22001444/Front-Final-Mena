export interface PurchaseDetailCreateRequest {
  purchaseId: number;
  rawMaterialId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status: number;
}

// Alias para compatibilidad si es necesario
export interface PurchaseDetailRequest extends PurchaseDetailCreateRequest {}