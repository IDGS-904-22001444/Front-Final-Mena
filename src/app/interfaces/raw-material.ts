export interface RawMaterial {
  id: number;
  name: string;
  description: string;
  unitOfMeasure: string;
  unitCost: number;
  stock: number;
  status: number;
}

export interface RawMaterialCreateRequest {
  name: string;
  description: string;
  unitOfMeasure: string;
  unitCost: number;
  stock: number;
  status: number;
}

export interface RawMaterialUpdateRequest {
  name?: string;
  description?: string;
  unitOfMeasure?: string;
  unitCost?: number;
  stock?: number;
  status?: number;
}