import { useCallback } from 'react';
import { useAPI } from './useAPI';
import api from './api';

interface QuoteCalculationRequest {
  origin_latitude: number;
  origin_longitude: number;
  destination_latitude: number;
  destination_longitude: number;
  weight_kg: number;
  volume_m3: number;
  cargo_value: number;
  cargo_type: 'FRACTIONAL' | 'FULL' | 'FILL';
}

interface QuoteResponse {
  carrier_name: string;
  carrier_id: string;
  route_id: string;
  total_price: number;
  estimated_days: number;
  distance_km: number;
}

interface QuoteCalculationResponse {
  shipment_id: string;
  quotes: QuoteResponse[];
  total_quotes: number;
}

export function useCalculateQuote() {
  const { execute, data, error, loading, reset } = useAPI<QuoteCalculationResponse>();

  const calculateQuote = useCallback(
    async (request: QuoteCalculationRequest) => {
      return execute(async () => {
        const response = await api.post<QuoteCalculationResponse>(
          '/public/calculate-quote',
          null,
          { params: request }
        );
        return response.data;
      });
    },
    [execute]
  );

  return {
    calculateQuote,
    quotes: data?.quotes,
    shipmentId: data?.shipment_id,
    error,
    loading,
    reset,
  };
}
