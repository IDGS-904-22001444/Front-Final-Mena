// En interfaces/provider.ts
export interface Provider {
  id: number;
  providerId: number; // Ya no es opcional
  name: string;
  phone: string;
  email: string;
  address: string;
  contactPerson: string;
  status: number;
}