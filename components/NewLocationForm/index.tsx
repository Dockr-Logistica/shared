'use client'

import { useState } from 'react'
import { Modal, ModalFooter } from '../Modal'
import { Input } from '../Input'
import { Button } from '../Button'
import type { Location } from '../../types/location'

export interface NewLocationFormProps {
  isOpen: boolean
  onClose: () => void
  onSave: (location: Omit<Location, 'id' | 'lat' | 'lng'>) => void
  loading?: boolean
  additionalContainerClasses?: string
}

export function NewLocationForm({
  isOpen,
  onClose,
  onSave,
  loading = false,
  additionalContainerClasses = '',
}: NewLocationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleCepChange = async (value: string) => {
    handleChange('cep', value)
    if (errors.cep) setErrors((prev) => ({ ...prev, cep: '' }))

    const cepDigits = value.replace(/\D/g, '')
    if (cepDigits.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepDigits}/json/`
        )
        const data = await response.json()

        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }))
        }
      } catch (error) {
        console.error('Erro ao buscar CEP:', error)
      }
    }
  }

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = 'Campo obrigatório'
    if (!formData.cep.trim()) newErrors.cep = 'Campo obrigatório'
    if (!formData.street.trim()) newErrors.street = 'Campo obrigatório'
    if (!formData.number.trim()) newErrors.number = 'Campo obrigatório'
    if (!formData.neighborhood.trim()) newErrors.neighborhood = 'Campo obrigatório'
    if (!formData.city.trim()) newErrors.city = 'Campo obrigatório'
    if (!formData.state.trim()) newErrors.state = 'Campo obrigatório'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    onSave(formData)

    setFormData({
      name: '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    })
  }

  const handleCancel = () => {
    onClose()
    setErrors({})
    setFormData({
      name: '',
      cep: '',
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
    })
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCancel}
      size="lg"
      title="Novo Local"
      className={additionalContainerClasses}
    >
      <div className="space-y-4">
        <Input
          label="Nome do local"
          placeholder="Ex: Matriz Curitiba"
          value={formData.name}
          onChange={(e) => {
            handleChange('name', e.target.value)
            if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
          }}
          error={errors.name}
          required
        />

        <Input
          label="CEP"
          placeholder="00000-000"
          value={formData.cep}
          onChange={(e) => handleCepChange(e.target.value)}
          error={errors.cep}
          mask="cep"
          required
        />

        <Input
          label="Rua"
          placeholder="Rua das Flores"
          value={formData.street}
          onChange={(e) => {
            handleChange('street', e.target.value)
            if (errors.street) setErrors((prev) => ({ ...prev, street: '' }))
          }}
          error={errors.street}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Número"
            placeholder="123"
            value={formData.number}
            onChange={(e) => {
              handleChange('number', e.target.value)
              if (errors.number) setErrors((prev) => ({ ...prev, number: '' }))
            }}
            error={errors.number}
            required
          />

          <Input
            label="Complemento"
            placeholder="Sala 4"
            value={formData.complement}
            onChange={(e) => handleChange('complement', e.target.value)}
          />
        </div>

        <Input
          label="Bairro"
          placeholder="Centro"
          value={formData.neighborhood}
          onChange={(e) => {
            handleChange('neighborhood', e.target.value)
            if (errors.neighborhood) setErrors((prev) => ({ ...prev, neighborhood: '' }))
          }}
          error={errors.neighborhood}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Cidade"
            placeholder="Curitiba"
            value={formData.city}
            onChange={(e) => {
              handleChange('city', e.target.value)
              if (errors.city) setErrors((prev) => ({ ...prev, city: '' }))
            }}
            error={errors.city}
            required
          />

          <Input
            label="Estado/UF"
            placeholder="PR"
            value={formData.state}
            onChange={(e) => {
              handleChange('state', e.target.value.toUpperCase())
              if (errors.state) setErrors((prev) => ({ ...prev, state: '' }))
            }}
            error={errors.state}
            maxLength={2}
            required
          />
        </div>
      </div>

      <ModalFooter>
        <Button
          variant="ghost"
          onClick={handleCancel}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          Salvar Local
        </Button>
      </ModalFooter>
    </Modal>
  )
}
