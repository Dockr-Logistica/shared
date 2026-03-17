export interface QuoteCalculationRequest {
  origin: string
  destination: string
  weight: number
  volume?: number
  cargo_type?: string
}

export interface QuoteResponse {
  id: string
  price: number
  carrier: string
  estimated_days: number
}

export interface QuoteCalculationResponse {
  quotes: QuoteResponse[]
}
