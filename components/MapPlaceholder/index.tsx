'use client'

import { MapPin } from 'lucide-react'
import type { Location } from '../../types/location'

export interface MapPlaceholderProps {
  origin: Location | null
  destination: Location | null
  variant?: 'empty' | 'filled'
  additionalContainerClasses?: string
}

export function MapPlaceholder({
  origin,
  destination,
  variant,
  additionalContainerClasses = '',
}: MapPlaceholderProps) {
  const isFilled = variant === 'filled' || (origin && destination)

  return (
    <div
      className={`
        w-full max-w-[373px] h-[593px]
        bg-[#1A1A2E]/80 backdrop-blur-sm
        rounded-[20px]
        relative overflow-hidden
        hidden lg:block
        ${additionalContainerClasses}
      `}
    >
      {!isFilled ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4">
          <div className="w-[45px] h-[45px] flex items-center justify-center rounded-[11.19px] bg-white/10 border border-[#D5D7DA]">
            <MapPin className="w-6 h-6 text-white/60" />
          </div>
          <p className="text-white text-base font-medium text-center">
            Selecione origem e destino
          </p>
          <p className="text-white/60 text-sm text-center max-w-[250px]">
            para visualizar a rota no mapa
          </p>
        </div>
      ) : (
        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FFCE12] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-[#1A1A2E]" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Origem</p>
              <p className="text-white/80 text-xs">
                {origin?.city}/{origin?.state}
              </p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <svg width="2" height="100%" className="mx-4">
              <line
                x1="1"
                y1="0"
                x2="1"
                y2="100%"
                stroke="#FFCE12"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
            </svg>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-[#262626] border-2 border-[#FFCE12] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-white text-sm font-semibold">Destino</p>
              <p className="text-white/80 text-xs">
                {destination?.city}/{destination?.state}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
