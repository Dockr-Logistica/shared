type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: unknown) => string | null;
};

const fieldRules: Record<string, ValidationRule> = {
  'route.originCep': {
    required: true,
    pattern: /^\d{5}-?\d{3}$/,
  },
  'route.destinationCep': {
    required: true,
    pattern: /^\d{5}-?\d{3}$/,
  },
  'route.originCity': { required: true, minLength: 2 },
  'route.destinationCity': { required: true, minLength: 2 },
  'route.originState': { required: true },
  'route.destinationState': { required: true },
  'cargo.cargoType': { required: true },
  'cargo.weight': { required: true, min: 0.1 },
  'cargo.volume': { required: true, min: 0.001 },
  'cargo.packagingType': { required: true },
  'cargo.value': { required: true, min: 1 },
  'shipment.urgency': { required: true },
  'shipment.contact.name': { required: true, minLength: 2 },
  'shipment.contact.phone': {
    required: true,
    pattern: /^\(\d{2}\)\s?\d{4,5}-?\d{4}$/,
  },
  'shipment.contact.email': {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
};

export function validateField(fieldPath: string, value: unknown): string | null {
  const rules = fieldRules[fieldPath];
  if (!rules) return null;

  if (rules.required && (value === undefined || value === null || value === '')) {
    return 'Campo obrigatório';
  }

  if (value === undefined || value === null || value === '') {
    return null;
  }

  const strValue = String(value);

  if (rules.minLength && strValue.length < rules.minLength) {
    return `Mínimo de ${rules.minLength} caracteres`;
  }

  if (rules.maxLength && strValue.length > rules.maxLength) {
    return `Máximo de ${rules.maxLength} caracteres`;
  }

  if (rules.pattern && !rules.pattern.test(strValue)) {
    if (fieldPath.includes('Cep')) return 'CEP inválido';
    if (fieldPath.includes('phone')) return 'Telefone inválido';
    if (fieldPath.includes('email')) return 'E-mail inválido';
    return 'Formato inválido';
  }

  const numValue = Number(value);
  if (rules.min !== undefined && numValue < rules.min) {
    return `Valor mínimo: ${rules.min}`;
  }

  if (rules.max !== undefined && numValue > rules.max) {
    return `Valor máximo: ${rules.max}`;
  }

  if (rules.custom) {
    return rules.custom(value);
  }

  return null;
}

export function validateStep(step: number, formData: Record<string, unknown>): boolean {
  const stepFields: Record<number, string[]> = {
    0: ['route.originCep', 'route.destinationCep'],
    1: ['cargo.cargoType', 'cargo.weight', 'cargo.volume', 'cargo.packagingType', 'cargo.value'],
    2: ['shipment.urgency', 'shipment.contact.name', 'shipment.contact.phone', 'shipment.contact.email'],
  };

  const fields = stepFields[step] || [];
  return fields.every((field) => {
    const value = field.split('.').reduce((obj: any, key) => obj?.[key], formData);
    return validateField(field, value) === null;
  });
}
