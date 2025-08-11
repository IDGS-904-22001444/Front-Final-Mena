export interface QuotationRequest {
  productId: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  region: string;
  company: string;
  animalType: string;
  comments: string;
  needHabitatSystem: boolean;
  needBiologyResearch: boolean;
  needZoosAquariums: boolean;
  needNaturalReserves: boolean;
  needOther: boolean;
  acceptsInfo: boolean;
}