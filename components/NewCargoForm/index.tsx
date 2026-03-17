'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalFooter } from '../Modal'
import { Input } from '../Input'
import { Button } from '../Button'
import type { Cargo } from '../../types/cargo'
import { calculateVolume } from '../../types/cargo'
import { formatVolume } from '../../utils/quote/formatters'

export interface NewCargoFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (cargo: Omit<Cargo, 'id'>) => void
  loading?: boolean
  className?: string
}

export function NewCargoForm({
  isOpen,
  onClose,
  onSave,
  loading = false,
  className = '',
}: NewCargoFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    length: '',
    width: '',
    height: '',
    weight: '',
    value: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [calculatedVolume, setCalculatedVolume] = useState(0)

  useEffect(() => {
    const length = parseFloat(formData.length)
    const width = parseFloat(formData.width)
    const height = parseFloat(formData.height)

    if (!isNaN(length) && !isNaN(width) && !isNaN(height) && length > 0 && width > 0 && height > 0) {
      setCalculatedVolume(calculateVolume(length, width, height))
    } else {
      setCalculatedVolume(0)
    }
  }, [formData.length, formData.width, formData.height])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Campo obrigatório'
    if (!formData.length || parseFloat(formData.length) <= 0) newErrors.length = 'Deve ser maior que 0'
    if (!formData.width || parseFloat(formData.width) <= 0) newErrors.width = 'Deve ser maior que 0'
    if (!formData.height || parseFloat(formData.height) <= 0) newErrors.height = 'Deve ser maior que 0'
    if (!formData.weight || parseFloat(formData.weight) <= 0) newErrors.weight = 'Deve ser maior que 0'
    if (!formData.value || parseFloat(formData.value) <= 0) newErrors.value = 'Deve ser maior que 0'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSave({
      name: formData.name,
      image: undefined,
      length: parseFloat(formData.length),
      width: parseFloat(formData.width),
      height: parseFloat(formData.height),
      volume: calculatedVolume,
      weight: parseFloat(formData.weight),
      value: parseFloat(formData.value),
    })

    setFormData({
      name: '',
      length: '',
      width: '',
      height: '',
      weight: '',
      value: '',
    })
    setCalculatedVolume(0)
  }

  const handleCancel = () => {
    onClose()
    setErrors({})
    setFormData({
      name: '',
      length: '',
      width: '',
      height: '',
      weight: '',
      value: '',
    })
    setCalculatedVolume(0)
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCancel} size="lg" title="Nova Carga" className={className}>
      <div className="space-y-4">
        <Input
          label="Nome da carga"
          placeholder="Ex: Geladeira Electrolux"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          required
        />

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
          <p className="text-sm text-gray-500">
            Arraste uma imagem ou clique para enviar
          </p>
          <p className="text-xs text-gray-400 mt-1">(Funcionalidade em desenvolvimento)</p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input
            label="Comprimento (m)"
            type="number"
            step="0.01"
            placeholder="1.60"
            value={formData.length}
            onChange={(e) => handleChange('length', e.target.value)}
            error={errors.length}
            required
          />
          <Input
            label="Largura (m)"
            type="number"
            step="0.01"
            placeholder="0.55"
            value={formData.width}
            onChange={(e) => handleChange('width', e.target.value)}
            error={errors.width}
            required
          />
          <Input
            label="Altura (m)"
            type="number"
            step="0.01"
            placeholder="0.50"
            value={formData.height}
            onChange={(e) => handleChange('height', e.target.value)}
            error={errors.height}
            required
          />
        </div>

        {calculatedVolume > 0 && (
          <div className="bg-gray-50 rounded p-3 text-sm">
            <span className="text-gray-600">Volume calculado: </span>
            <span className="font-medium text-gray-900">{formatVolume(calculatedVolume)}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Peso (kg)"
            type="number"
            step="0.1"
            placeholder="65"
            value={formData.weight}
            onChange={(e) => handleChange('weight', e.target.value)}
            error={errors.weight}
            required
          />
          <Input
            label="Valor (R$)"
            type="number"
            step="0.01"
            placeholder="2500.00"
            value={formData.value}
            onChange={(e) => handleChange('value', e.target.value)}
            error={errors.value}
            required
          />
        </div>
      </div>

      <ModalFooter>
        <Button variant="ghost" onClick={handleCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSubmit} loading={loading} disabled={loading}>
          Salvar Carga
        </Button>
      </ModalFooter>
    </Modal>
  )
}
