import { atom } from 'jotai';

export interface RouteData {
  originCep: string;
  originAddress: string;
  originCity: string;
  originState: string;
  destinationCep: string;
  destinationAddress: string;
  destinationCity: string;
  destinationState: string;
}

export interface CargoData {
  cargoType: string;
  weight: number | string;
  volume: number | string;
  packagingType: string;
  value: number | string;
}

export interface ShipmentContact {
  name: string;
  phone: string;
  email: string;
}

export interface ShipmentData {
  pickupDate: string;
  deliveryDate: string;
  urgency: string;
  contact: ShipmentContact;
  notes: string;
}

export interface QuoteFormDraft {
  route: RouteData;
  cargo: CargoData;
  shipment: ShipmentData;
}

const initialRouteData: RouteData = {
  originCep: '',
  originAddress: '',
  originCity: '',
  originState: '',
  destinationCep: '',
  destinationAddress: '',
  destinationCity: '',
  destinationState: '',
};

const initialCargoData: CargoData = {
  cargoType: '',
  weight: '',
  volume: '',
  packagingType: '',
  value: '',
};

const initialShipmentData: ShipmentData = {
  pickupDate: '',
  deliveryDate: '',
  urgency: '',
  contact: {
    name: '',
    phone: '',
    email: '',
  },
  notes: '',
};

const initialQuoteFormDraft: QuoteFormDraft = {
  route: initialRouteData,
  cargo: initialCargoData,
  shipment: initialShipmentData,
};

export const quoteFormDraftAtom = atom<QuoteFormDraft>(initialQuoteFormDraft);

export const resetQuoteFormAtom = atom(null, (get, set) => {
  set(quoteFormDraftAtom, initialQuoteFormDraft);
});