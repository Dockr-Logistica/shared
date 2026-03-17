'use client'

import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import {
  routeStepAtom,
  savedLocationsAtom,
  isRouteStepValidAtom,
  routeValidationErrorAtom,
} from '../../store/atoms'
import { MOCK_SAVED_LOCATIONS } from '../../mocks/locations'
import type { Location } from '../../types/location'
import { LocationDropdown } from '../LocationDropdown'
import { LocationDetails } from '../LocationDetails'
import { MapPlaceholder } from '../MapPlaceholder'
import { NewLocationForm } from '../NewLocationForm'
import { TextButton } from '../TextButton'

interface RouteStepFormProps {
  onNext: () => void
  additionalContainerClasses?: string
}

export function RouteStepForm({
  onNext,
  additionalContainerClasses = '',
}: RouteStepFormProps) {
  const [routeStep, setRouteStep] = useAtom(routeStepAtom)
  const [savedLocations, setSavedLocations] = useAtom(savedLocationsAtom)
  const [isValid] = useAtom(isRouteStepValidAtom)
  const [validationError] = useAtom(routeValidationErrorAtom)

  const [showNewLocationModal, setShowNewLocationModal] = useState(false)
  const [pendingSelectType, setPendingSelectType] = useState<
    'origin' | 'destination' | null
  >(null)

  useEffect(() => {
    if (savedLocations.length === 0) {
      setSavedLocations(MOCK_SAVED_LOCATIONS)
    }
  }, [savedLocations.length, setSavedLocations])

  const handleSelectOrigin = (location: Location) => {
    setRouteStep({ origin: location })
  }

  const handleSelectDestination = (location: Location) => {
    setRouteStep({ destination: location })
  }

  const handleOpenNewLocationModal = (type: 'origin' | 'destination') => {
    setPendingSelectType(type)
    setShowNewLocationModal(true)
  }

  const handleSaveNewLocation = (
    locationData: Omit<Location, 'id' | 'lat' | 'lng'>
  ) => {
    const newLocation: Location = {
      ...locationData,
      id: `loc-${Date.now()}`,
      lat: -23.5 + Math.random() * 10,
      lng: -46.6 + Math.random() * 10,
    }

    setSavedLocations((prev) => [...prev, newLocation])

    if (pendingSelectType === 'origin') {
      setRouteStep({ origin: newLocation })
    } else if (pendingSelectType === 'destination') {
      setRouteStep({ destination: newLocation })
    }

    setShowNewLocationModal(false)
    setPendingSelectType(null)
  }

  const handleCloseModal = () => {
    setShowNewLocationModal(false)
    setPendingSelectType(null)
  }

  return (
    <>
      <div
        className={`flex flex-col lg:flex-row gap-8 ${additionalContainerClasses}`}
      >
        <MapPlaceholder
          origin={routeStep.origin}
          destination={routeStep.destination}
        />

        <div className="flex-1 space-y-[35px]">
          <div>
            <LocationDropdown
              label="Origem"
              sublabel="Selecione um local de origem"
              locations={savedLocations}
              selectedLocation={routeStep.origin}
              onSelect={handleSelectOrigin}
              onNewLocation={() => handleOpenNewLocationModal('origin')}
            />
            {routeStep.origin && (
              <LocationDetails location={routeStep.origin} />
            )}
          </div>

          <div>
            <LocationDropdown
              label="Destino"
              sublabel="Selecione um local de destino"
              locations={savedLocations}
              selectedLocation={routeStep.destination}
              onSelect={handleSelectDestination}
              onNewLocation={() => handleOpenNewLocationModal('destination')}
            />
            {routeStep.destination && (
              <LocationDetails location={routeStep.destination} />
            )}
          </div>

          {validationError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{validationError}</p>
            </div>
          )}

          <div className="flex justify-end">
            <TextButton
              variant="primary"
              size="lg"
              onClick={onNext}
              disabled={!isValid}
              additionalContainerClasses="w-full sm:w-auto"
            >
              Próximo passo
            </TextButton>
          </div>
        </div>
      </div>

      <NewLocationForm
        isOpen={showNewLocationModal}
        onClose={handleCloseModal}
        onSave={handleSaveNewLocation}
      />
    </>
  )
}
