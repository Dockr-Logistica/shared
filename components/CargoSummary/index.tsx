'use client'

import { formatCurrency, formatWeight, formatVolume } from '../../utils/quote/formatters'

export interface CargoSummaryProps {
  totalWeight: number
  totalValue: number
  totalVolume: number
  additionalContainerClasses?: string
}

export function CargoSummary({
  totalWeight,
  totalValue,
  totalVolume,
  additionalContainerClasses = '',
}: CargoSummaryProps) {
  return (
    <div
      className={`bg-gray-50 rounded-lg border border-[#ECECEC] p-4 ${additionalContainerClasses}`}
    >
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Resumo da carga</h4>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 uppercase mb-1">Peso total</p>
          <p className="text-sm font-medium text-gray-900">{formatWeight(totalWeight)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase mb-1">Valor total</p>
          <p className="text-sm font-medium text-gray-900">{formatCurrency(totalValue)}</p>
        </div>

        <div>
          <p className="text-xs text-gray-500 uppercase mb-1">Volume total</p>
          <p className="text-sm font-medium text-gray-900">{formatVolume(totalVolume)}</p>
        </div>
      </div>
    </div>
  )
}
