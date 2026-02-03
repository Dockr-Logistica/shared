import api from './api';

export enum CargoType {
  FRACTIONAL = 'fractional',
  FULL = 'full',
  FILL = 'fill',
}

export interface QuoteCalculationRequest {
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  weight_kg: number;
  volume_m3: number;
  cargo_value: number;
  cargo_type: CargoType;
}

export interface QuoteResponse {
  carrier_name: string;
  carrier_id: string;
  route_id: string;
  total_price: number;
  estimated_days: number;
  distance_km: number;
}

export interface QuoteCalculationResponse {
  shipment_id: string;
  quotes: QuoteResponse[];
  total_quotes: number;
}

const quoteService = {
  async calculatePublicQuote(data: QuoteCalculationRequest): Promise<QuoteCalculationResponse> {
    const response = await api.post<QuoteCalculationResponse>('/public/calculate-quote', null, {
      params: data,
    });
    return response.data;
  },

  async getQuotes(shipmentId: string): Promise<QuoteCalculationResponse> {
    const response = await api.get<QuoteCalculationResponse>(`/public/quotes/${shipmentId}`);
    return response.data;
  },
};

export default quoteService;
