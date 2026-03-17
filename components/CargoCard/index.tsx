'use client'

import { X, Minus, Plus, Package } from 'lucide-react'
import type { Cargo } from '../../types/cargo'
import { formatCargoDimensions } from '../../types/cargo'
import { formatCurrency, formatWeight, formatVolume } from '../../utils/quote/formatters'
import { cn } from '../../utils/cn'

export interface CargoCardProps {
  cargo: Cargo
  quantity: number
  onQuantityChange: (id: string, newQuantity: number) => void
  onRemove: (id: string) => void
  additionalContainerClasses?: string
  additionalCardClasses?: string
}

export function CargoCard({
  cargo,
  quantity,
  onQuantityChange,
  onRemove,
  additionalContainerClasses = '',
  additionalCardClasses = '',
}: CargoCardProps) {
  const handleIncrement = () => {
    onQuantityChange(cargo.id, quantity + 1)
  }

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(cargo.id, quantity - 1)
    }
  }

  return (
    <div className={cn('relative', additionalContainerClasses)}>
      <div
        className={cn(
          'bg-white border border-[#ECECEC] rounded-lg p-4 transition-all duration-200',
          additionalCardClasses
        )}
      >
        {/* Remove button */}
        <button
          type="button"
          onClick={() => onRemove(cargo.id)}
          className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 transition-colors duration-200"
          aria-label="Remover carga"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="flex items-start gap-4 pr-8">
          {/* Thumbnail */}
          <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {cargo.image ? (
              <img
                src={cargo.image}
                alt={cargo.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-10 h-10 text-gray-400" />
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium text-[#262626] truncate mb-2">
              {cargo.name}
            </h3>

            {/* Specs grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div>
                <span className="text-gray-500">Dimensões:</span>
                <span className="ml-1 text-gray-900 font-medium">
                  {formatCargoDimensions(cargo)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Volume:</span>
                <span className="ml-1 text-gray-900 font-medium">
                  {formatVolume(cargo.volume)}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Peso:</span>
                <span className="ml-1 text-gray-900 font-medium">
                  {formatWeight(cargo.weight)}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-3">
                <span className="text-gray-500">Valor:</span>
                <span className="ml-1 text-gray-900 font-medium">
                  {formatCurrency(cargo.value)}
                </span>
              </div>
            </div>

            {/* Quantity selector */}
            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-gray-600">Quantidade:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className={cn(
                    'w-9 h-9 flex items-center justify-center rounded border transition-all duration-200',
                    quantity <= 1
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-[#ECECEC] text-gray-700 hover:border-[#262626] hover:bg-gray-50'
                  )}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-medium text-gray-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-9 h-9 flex items-center justify-center rounded border border-[#ECECEC] text-gray-700 hover:border-[#262626] hover:bg-gray-50 transition-all duration-200"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
