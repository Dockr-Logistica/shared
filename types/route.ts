export interface LineStringCoordinates {
  coordinates: [number, number][];
}

export interface PolygonCoordinates {
  coordinates: [number, number][][];
}

export interface RouteBase {
  carrier_id: string;
  geometry: LineStringCoordinates;
  simplified_geometry: LineStringCoordinates | null;
  buffer_zone: PolygonCoordinates | null;
  distance_km: number;
  bbox_min_lon: number;
  bbox_min_lat: number;
  bbox_max_lon: number;
  bbox_max_lat: number;
  origin_warehouse_id: string;
  destination_warehouse_id: string;
  origin_city: string;
  origin_state: string;
  destination_city: string;
  destination_state: string;
  min_weight_kg: number;
  max_weight_kg: number;
  min_volume_m3: number;
  max_volume_m3: number;
  price_per_kg: number;
  price_per_m3: number;
  estimated_time_hours: number;
  active: boolean;
}

export interface RouteCreate extends RouteBase {}

export interface RouteUpdate {
  carrier_id?: string;
  geometry?: LineStringCoordinates;
  simplified_geometry?: LineStringCoordinates | null;
  buffer_zone?: PolygonCoordinates | null;
  distance_km?: number;
  bbox_min_lon?: number;
  bbox_min_lat?: number;
  bbox_max_lon?: number;
  bbox_max_lat?: number;
  origin_warehouse_id?: string;
  destination_warehouse_id?: string;
  origin_city?: string;
  origin_state?: string;
  destination_city?: string;
  destination_state?: string;
  min_weight_kg?: number;
  max_weight_kg?: number;
  min_volume_m3?: number;
  max_volume_m3?: number;
  price_per_kg?: number;
  price_per_m3?: number;
  estimated_time_hours?: number;
  active?: boolean;
}

export interface RouteResponse extends RouteBase {
  id: string;
  created_at: string;
  updated_at: string;
}
