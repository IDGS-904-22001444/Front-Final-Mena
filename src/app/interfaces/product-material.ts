export interface Product {
  productId: number;
  name: string;
  description: string;
  salePrice: number;
  stock: number;
  status: number;
  imageUrl: string | null;
}

export interface RawMaterial {
  id: number;
  name: string;
  description: string;
  unitOfMeasure: string;
  unitCost: number;
  stock: number;
  status: number;
}

export interface ProductMaterial {
  id: number;
  productId: number;
  rawMaterialId: number;
  requiredQuantity: number;
  status: number;
  product?: Product;
  rawMaterial?: RawMaterial;
}

export interface ProductMaterialCreateRequest {
  productId: number;
  rawMaterialId: number;
  requiredQuantity: number;
  status: number;
}