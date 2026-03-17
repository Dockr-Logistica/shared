'use client'

import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import {
  cargoStepAtom,
  savedCargosAtom,
  isCargoStepValidAtom,
  cargoTotalWeightAtom,
  cargoTotalValueAtom,
  cargoTotalVolumeAtom,
} from '../../store/atoms'
import { MOCK_SAVED_CARGOS } from '../../mocks/cargos'
import type { Cargo } from '../../types/cargo'
import { CargoDropdown } from '../CargoDropdown'
import { CargoCard } from '../CargoCard'
import { CargoSummary } from '../CargoSummary'
import { NewCargoForm } from '../NewCargoForm'
import { TextButton } from '../TextButton'

export interface CargoStepFormProps {
  onNext: () => void
  onBack: () => void
  additionalContainerClasses?: string
}

export function CargoStepForm({
  onNext,
  onBack,
  additionalContainerClasses = '',
}: CargoStepFormProps) {
  const [cargoStep, setCargoStep] = useAtom(cargoStepAtom)
  const [savedCargos, setSavedCargos] = useAtom(savedCargosAtom)
  const [isValid] = useAtom(isCargoStepValidAtom)
  const [totalWeight] = useAtom(cargoTotalWeightAtom)
  const [totalValue] = useAtom(cargoTotalValueAtom)
  const [totalVolume] = useAtom(cargoTotalVolumeAtom)

  const [showNewCargoModal, setShowNewCargoModal] = useState(false)

  useEffect(() => {
    if (savedCargos.length === 0) {
      setSavedCargos(MOCK_SAVED_CARGOS)
    }
  }, [savedCargos.length, setSavedCargos])

  const handleSelectCargo = (cargo: Cargo) => {
    const alreadySelected = cargoStep.selectedCargos.find((sc) => sc.cargo.id === cargo.id)
    if (alreadySelected) return

    setCargoStep({
      selectedCargos: [...cargoStep.selectedCargos, { cargo, quantity: 1 }],
    })
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCargoStep({
      selectedCargos: cargoStep.selectedCargos.map((sc) =>
        sc.cargo.id === id ? { ...sc, quantity: newQuantity } : sc
      ),
    })
  }

  const handleRemoveCargo = (id: string) => {
    setCargoStep({
      selectedCargos: cargoStep.selectedCargos.filter((sc) => sc.cargo.id !== id),
    })
  }

  const handleOpenNewCargoModal = () => {
    setShowNewCargoModal(true)
  }

  const handleSaveNewCargo = (cargoData: Omit<Cargo, 'id'>) => {
    const newCargo: Cargo = {
      ...cargoData,
      id: `cargo-${Date.now()}`,
    }

    setSavedCargos((prev) => [...prev, newCargo])
    handleSelectCargo(newCargo)
    setShowNewCargoModal(false)
  }

  const handleCloseModal = () => {
    setShowNewCargoModal(false)
  }

  return (
    <>
      <div className={`flex flex-col gap-8 ${additionalContainerClasses}`}>
        <div className="flex-1 space-y-6">
          <CargoDropdown
            label="Carga"
            sublabel="Selecione uma carga cadastrada"
            cargos={savedCargos}
            selectedCargos={cargoStep.selectedCargos}
            onSelect={handleSelectCargo}
            onNewCargo={handleOpenNewCargoModal}
          />

          {cargoStep.selectedCargos.length > 0 ? (
            <div className="space-y-4">
              {cargoStep.selectedCargos.map((sc) => (
                <CargoCard
                  key={sc.cargo.id}
                  cargo={sc.cargo}
                  quantity={sc.quantity}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveCargo}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              Nenhuma carga selecionada ainda.
            </div>
          )}

          {cargoStep.selectedCargos.length > 0 && (
            <CargoSummary
              totalWeight={totalWeight}
              totalValue={totalValue}
              totalVolume={totalVolume}
            />
          )}

          <div className="flex justify-between items-center">
            <TextButton variant="ghost" size="md" onClick={onBack}>
              Voltar
            </TextButton>
            <TextButton
              variant="primary"
              size="md"
              onClick={onNext}
              disabled={!isValid}
              additionalContainerClasses="w-full sm:w-auto"
            >
              Próximo passo
            </TextButton>
          </div>
        </div>
      </div>

      <NewCargoForm
        isOpen={showNewCargoModal}
        onClose={handleCloseModal}
        onSave={handleSaveNewCargo}
      />
    </>
  )
}
