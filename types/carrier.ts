export interface CarrierBase {
  name: string;
  company_document: string;
  email: string;
  phone: string | null;
  active: boolean;
}

export interface CarrierCreate extends CarrierBase {}

export interface CarrierUpdate {
  name?: string;
  company_document?: string;
  email?: string;
  phone?: string | null;
  active?: boolean;
}

export interface CarrierResponse extends CarrierBase {
  id: string;
  created_at: string;
  updated_at: string;
}
