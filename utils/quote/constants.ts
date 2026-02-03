export const cargoTypes = [
  'Geral',
  'Frágil',
  'Perecível',
  'Químico',
  'Eletrônico',
  'Automotivo',
  'Têxtil',
  'Farmacêutico',
  'Outro',
] as const;

export const packagingTypes = [
  'Caixa',
  'Palete',
  'Saco',
  'Tambor',
  'Container',
  'Granel',
  'Outro',
] as const;

export const urgencyOptions = [
  { value: 'normal', label: 'Normal (5-7 dias úteis)' },
  { value: 'express', label: 'Expresso (2-3 dias úteis)' },
  { value: 'urgent', label: 'Urgente (1 dia útil)' },
] as const;

export const brazilianStates = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI',
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
] as const;

export type CargoType = typeof cargoTypes[number];
export type PackagingType = typeof packagingTypes[number];
export type UrgencyOption = typeof urgencyOptions[number];
export type BrazilianState = typeof brazilianStates[number];
