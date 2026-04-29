'use client'

import { useAtom } from 'jotai'
import { Calendar } from 'lucide-react'
import {
  shipmentStepAtom,
  isShipmentStepValidAtom,
  shipmentValidationErrorAtom,
} from '../../store/atoms'
import { additionalServicesOptions } from '../../utils/quote/constants'
import { Input } from '../Input'
import { TextArea } from '../TextArea'
import { MultiSelect } from '../MultiSelect'
import { Toggle } from '../Toggle'
import { TextButton } from '../TextButton'

export interface ShipmentStepFormProps {
  onSubmit: () => void
  onBack: () => void
  additionalContainerClasses?: string
}

export function ShipmentStepForm({
  onSubmit,
  onBack,
  additionalContainerClasses = '',
}: ShipmentStepFormProps) {
  const [shipmentStep, setShipmentStep] = useAtom(shipmentStepAtom)
  const [isValid] = useAtom(isShipmentStepValidAtom)
  const [validationError] = useAtom(shipmentValidationErrorAtom)

  const handleChange = (field: string, value: string | string[] | boolean) => {
    setShipmentStep({ [field]: value })
  }

  return (
    <div className={`flex flex-col gap-8 ${additionalContainerClasses}`}>
      <div className="flex-1 space-y-[35px]">
        <MultiSelect
          label="Serviços adicionais"
          sublabel="Selecione os serviços que você precisa"
          placeholder="Selecione os serviços adicionais"
          options={additionalServicesOptions as unknown as string[]}
          value={shipmentStep.additionalServices}
          onChange={(value) => handleChange('additionalServices', value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <Input
              label="Embarcar até"
              placeholder="dd/mm/aaaa"
              value={shipmentStep.shipByDate}
              onChange={(e) => handleChange('shipByDate', e.target.value)}
              mask="date"
              required
            />
            <Calendar className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Input
              label="Entregar até"
              placeholder="dd/mm/aaaa"
              value={shipmentStep.deliverByDate}
              onChange={(e) => handleChange('deliverByDate', e.target.value)}
              mask="date"
              required
            />
            <Calendar className="absolute right-3 top-9 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Toggle
            label="Coletar na origem"
            checked={shipmentStep.pickupAtOrigin}
            onChange={(e) => {
              const target = e.target as HTMLInputElement
              handleChange('pickupAtOrigin', target.checked)
            }}
          />
          <Toggle
            label="Entrega no destino"
            checked={shipmentStep.deliverAtDestination}
            onChange={(e) => {
              const target = e.target as HTMLInputElement
              handleChange('deliverAtDestination', target.checked)
            }}
          />
          <Toggle
            label="Carga urgente"
            checked={shipmentStep.urgentCargo}
            onChange={(e) => {
              const target = e.target as HTMLInputElement
              handleChange('urgentCargo', target.checked)
            }}
          />
        </div>

        <TextArea
          label="Observações gerais"
          placeholder="Escreva sua mensagem"
          value={shipmentStep.observations}
          onChange={(e) => handleChange('observations', e.target.value)}
          rows={5}
        />

        {validationError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{validationError}</p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <TextButton variant="ghost" size="md" onClick={onBack}>
            Voltar
          </TextButton>
          <TextButton
            variant="primary"
            size="md"
            onClick={onSubmit}
            disabled={!isValid}
            additionalContainerClasses="w-full sm:w-auto"
          >
            Buscar transportadoras
          </TextButton>
        </div>
      </div>
    </div>
  )
}
