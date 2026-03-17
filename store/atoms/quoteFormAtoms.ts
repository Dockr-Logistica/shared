import { atom } from 'jotai'
import type { Location } from '../../types/location'
import type { Cargo, SelectedCargo } from '../../types/cargo'

export const savedCargosAtom = atom<Cargo[]>([])
export const savedCargosLoadingAtom = atom<boolean>(false)

export interface CargoStepData {
  selectedCargos: SelectedCargo[]
}

export interface ShipmentContact {
  name: string
  phone: string
  email: string
}

export interface ShipmentStepData {
  additionalServices: string[]
  shipByDate: string
  deliverByDate: string
  pickupAtOrigin: boolean
  deliverAtDestination: boolean
  urgentCargo: boolean
  observations: string
}

export interface ShipmentData {
  pickupDate: string
  deliveryDate: string
  urgency: string
  contact: ShipmentContact
  notes: string
}

export interface RouteStepData {
  origin: Location | null
  destination: Location | null
}

export interface QuoteFormDraft {
  route: RouteStepData
  cargo: CargoStepData
  shipment: ShipmentStepData
}

const initialRouteStepData: RouteStepData = {
  origin: null,
  destination: null,
}

const initialCargoStepData: CargoStepData = {
  selectedCargos: [],
}

const initialShipmentStepData: ShipmentStepData = {
  additionalServices: [],
  shipByDate: '',
  deliverByDate: '',
  pickupAtOrigin: true,
  deliverAtDestination: true,
  urgentCargo: false,
  observations: '',
}

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
}

const initialQuoteFormDraft: QuoteFormDraft = {
  route: initialRouteStepData,
  cargo: initialCargoStepData,
  shipment: initialShipmentStepData,
}

export const quoteFormDraftAtom = atom<QuoteFormDraft>(initialQuoteFormDraft)

export const savedLocationsAtom = atom<Location[]>([])
export const savedLocationsLoadingAtom = atom<boolean>(false)

export const routeStepAtom = atom(
  (get) => get(quoteFormDraftAtom).route,
  (get, set, update: Partial<RouteStepData>) => {
    const current = get(quoteFormDraftAtom)
    set(quoteFormDraftAtom, {
      ...current,
      route: { ...current.route, ...update },
    })
  }
)

export const isRouteStepValidAtom = atom((get) => {
  const route = get(quoteFormDraftAtom).route
  return (
    route.origin !== null &&
    route.destination !== null &&
    route.origin.id !== route.destination.id
  )
})

export const routeValidationErrorAtom = atom((get) => {
  const route = get(quoteFormDraftAtom).route
  if (!route.origin || !route.destination) return null
  if (route.origin.id === route.destination.id) {
    return 'Origem e destino devem ser diferentes'
  }
  return null
})

export const cargoStepAtom = atom(
  (get) => get(quoteFormDraftAtom).cargo,
  (get, set, update: Partial<CargoStepData>) => {
    const current = get(quoteFormDraftAtom)
    set(quoteFormDraftAtom, {
      ...current,
      cargo: { ...current.cargo, ...update },
    })
  }
)

export const cargoTotalWeightAtom = atom((get) => {
  const cargo = get(quoteFormDraftAtom).cargo
  return cargo.selectedCargos.reduce(
    (sum, sc) => sum + sc.cargo.weight * sc.quantity,
    0
  )
})

export const cargoTotalValueAtom = atom((get) => {
  const cargo = get(quoteFormDraftAtom).cargo
  return cargo.selectedCargos.reduce(
    (sum, sc) => sum + sc.cargo.value * sc.quantity,
    0
  )
})

export const cargoTotalVolumeAtom = atom((get) => {
  const cargo = get(quoteFormDraftAtom).cargo
  return cargo.selectedCargos.reduce(
    (sum, sc) => sum + sc.cargo.volume * sc.quantity,
    0
  )
})

export const isCargoStepValidAtom = atom((get) => {
  const cargo = get(quoteFormDraftAtom).cargo
  return cargo.selectedCargos.length > 0
})

export const shipmentStepAtom = atom(
  (get) => get(quoteFormDraftAtom).shipment,
  (get, set, update: Partial<ShipmentStepData>) => {
    const current = get(quoteFormDraftAtom)
    set(quoteFormDraftAtom, {
      ...current,
      shipment: { ...current.shipment, ...update },
    })
  }
)

export const isShipmentStepValidAtom = atom((get) => {
  const shipment = get(quoteFormDraftAtom).shipment

  if (!shipment.shipByDate || !shipment.deliverByDate) return false

  const [shipDay, shipMonth, shipYear] = shipment.shipByDate.split('/').map(Number)
  const [deliverDay, deliverMonth, deliverYear] = shipment.deliverByDate.split('/').map(Number)

  const shipDate = new Date(shipYear, shipMonth - 1, shipDay)
  const deliverDate = new Date(deliverYear, deliverMonth - 1, deliverDay)

  return deliverDate >= shipDate
})

export const shipmentValidationErrorAtom = atom((get) => {
  const shipment = get(quoteFormDraftAtom).shipment

  if (!shipment.shipByDate) return 'Data de embarque é obrigatória'
  if (!shipment.deliverByDate) return 'Data de entrega é obrigatória'

  const [shipDay, shipMonth, shipYear] = shipment.shipByDate.split('/').map(Number)
  const [deliverDay, deliverMonth, deliverYear] = shipment.deliverByDate.split('/').map(Number)

  const shipDate = new Date(shipYear, shipMonth - 1, shipDay)
  const deliverDate = new Date(deliverYear, deliverMonth - 1, deliverDay)

  if (deliverDate < shipDate) {
    return 'Data de entrega deve ser maior ou igual à data de embarque'
  }

  return null
})

export const resetQuoteFormAtom = atom(null, (get, set) => {
  set(quoteFormDraftAtom, initialQuoteFormDraft)
})