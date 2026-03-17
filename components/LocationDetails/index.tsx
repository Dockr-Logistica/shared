'use client'

import type { Location } from '../../types/location'

export interface LocationDetailsProps {
  location: Location
  showMapLink?: boolean
  onViewMap?: () => void
  additionalContainerClasses?: string
}

export function LocationDetails({
  location,
  showMapLink = true,
  onViewMap,
  additionalContainerClasses = '',
}: LocationDetailsProps) {
  return (
    <div
      className={`
        mt-3 p-4
        bg-gray-50
        rounded-lg
        border border-[#ECECEC]
        transition-all duration-300 ease-in-out
        ${additionalContainerClasses}
      `}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase mb-1">
            Nome
          </p>
          <p className="text-sm text-gray-900 font-medium">{location.name}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase mb-1">
            Rua
          </p>
          <p className="text-sm text-gray-900 font-medium">
            {location.street}, {location.number}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase mb-1">
            Bairro
          </p>
          <p className="text-sm text-gray-900 font-medium">
            {location.neighborhood}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase mb-1">
            Cidade/UF
          </p>
          <p className="text-sm text-gray-900 font-medium">
            {location.city}/{location.state}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium uppercase mb-1">
            CEP
          </p>
          <p className="text-sm text-gray-900 font-medium">{location.cep}</p>
        </div>
        {location.complement && (
          <div>
            <p className="text-xs text-gray-500 font-medium uppercase mb-1">
              Complemento
            </p>
            <p className="text-sm text-gray-900 font-medium">
              {location.complement}
            </p>
          </div>
        )}
      </div>

      {showMapLink && (
        <button
          type="button"
          onClick={onViewMap}
          className="mt-3 text-sm text-[#FFCE12] hover:underline cursor-pointer transition-all duration-200"
        >
          Ver localização no mapa
        </button>
      )}
    </div>
  )
}
