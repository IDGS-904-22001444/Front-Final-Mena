export interface Quotation {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  region: string;
  company: string;
  animalType: string;
  needHabitatSystem: boolean;
  needBiologyResearch: boolean;
  needZoosAquariums: boolean;
  needNaturalReserves: boolean;
  needOther: boolean;
  comments: string;
  acceptsInfo: boolean;
  status: number; // 1: Pendiente, 2: Aprobada, 3: Rechazada
  createdAt?: string;
}