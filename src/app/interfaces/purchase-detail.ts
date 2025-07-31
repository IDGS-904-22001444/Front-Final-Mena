export interface PurchaseDetail {
  id: number;
  purchaseId: number;
  rawMaterialId: number;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  status: number;
  purchase: {
    id: number;
    providerId: number;
    adminId: string;
    purchaseDate: string;
    total: number;
    status: number;
    provider: {
      providerId: number;
      name: string;
      phone: string;
      email: string;
      address: string;
      contactPerson: string;
      status: number;
    };
    admin: {
      id: string;
      userName: string;
      email: string;
      fullName: string;
      [key: string]: any;
    };
  };
  rawMaterial: {
    id: number;
    name: string;
    description: string;
    unitOfMeasure: string;
    unitCost: number;
    stock: number;
    status: number;
  };
}