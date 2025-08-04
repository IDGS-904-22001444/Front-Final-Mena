export interface Purchase {
  id: number;  // Definir explícitamente como number
  providerId: number;
  adminId: string;
  purchaseDate: string;
  total: number;
  status: number;
  provider?: {
    providerId: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    contactPerson: string;
    status: number;
  };
  admin?: {
    id: string;
    userName: string;
    email: string;
    fullName: string;
    [key: string]: any;
  };
}