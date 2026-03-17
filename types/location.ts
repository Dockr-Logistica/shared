export interface Location {
  id: string
  name: string
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  cep: string
  lat: number
  lng: number
}

export function formatLocationLabel(loc: Location): string {
  return `${loc.name} - ${loc.street}, ${loc.number}, ${loc.neighborhood}, ${loc.city}/${loc.state}`
}

export function formatLocationShort(loc: Location): string {
  return loc.name
}
