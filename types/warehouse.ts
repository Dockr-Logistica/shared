export interface PointCoordinates {
  longitude: number;
  latitude: number;
}

export interface WarehouseBase {
  name: string;
  code: string;
  location: PointCoordinates;
  address: string | null;
  city: string;
  state: string;
  zip_code: string | null;
  max_weight_capacity_kg: number;
  max_volume_capacity_m3: number;
  current_weight_kg: number;
  current_volume_m3: number;
  operating_hours_start: string | null;
  operating_hours_end: string | null;
  active: boolean;
}

export interface WarehouseCreate extends WarehouseBase {}

export interface WarehouseUpdate {
  name?: string;
  code?: string;
  location?: PointCoordinates;
  address?: string | null;
  city?: string;
  state?: string;
  zip_code?: string | null;
  max_weight_capacity_kg?: number;
  max_volume_capacity_m3?: number;
  current_weight_kg?: number;
  current_volume_m3?: number;
  operating_hours_start?: string | null;
  operating_hours_end?: string | null;
  active?: boolean;
}

export interface WarehouseResponse extends WarehouseBase {
  id: string;
  created_at: string;
  updated_at: string;
}
