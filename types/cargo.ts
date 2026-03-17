export interface Cargo {
  id: string
  name: string
  image?: string
  length: number
  width: number
  height: number
  volume: number
  weight: number
  value: number
}

export interface SelectedCargo {
  cargo: Cargo
  quantity: number
}

export function formatCargoDimensions(cargo: Cargo): string {
  return `${cargo.length.toFixed(2)}m x ${cargo.width.toFixed(2)}m x ${cargo.height.toFixed(2)}m`
}

export function calculateVolume(length: number, width: number, height: number): number {
  return parseFloat((length * width * height).toFixed(3))
}

export function formatCargoLabel(cargo: Cargo): string {
  return cargo.name
}
