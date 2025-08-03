export interface ProviderCreateRequest {
    id?: number; // Hacerlo opcional con el signo de interrogación
  
    name: string;
    phone: string;
    email: string;
    address: string;
    contactPerson: string;
    status: number;
}