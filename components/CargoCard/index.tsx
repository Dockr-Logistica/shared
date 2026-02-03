'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Minus, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';

export interface CargoData {
  id: string;
  name: string;
  weight: number;
  value: number;
  volume: number;
}

interface CargoCardProps {
  cargo: CargoData;
  quantity: number;
  selected: boolean;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onSelectionChange: (id: string, selected: boolean) => void;
  className?: string;
}

export default function CargoCard({
  cargo,
  quantity,
  selected,
  onQuantityChange,
  onSelectionChange,
  className
}: CargoCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleIncrement = () => {
    onQuantityChange(cargo.id, quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onQuantityChange(cargo.id, quantity - 1);
    }
  };

  return (
    <div
      className={cn(
        'border border-[#ECECEC] rounded-lg bg-white transition-colors',
        selected && 'border-[#FFCE12] bg-[#FFFDF0]',
        className
      )}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={selected}
            onChange={(e) => onSelectionChange(cargo.id, e.target.checked)}
            className="mt-1 w-6 h-6 rounded border-[#CCCCCC] text-[#FFCE12] focus:ring-[#FFCE12] focus:ring-offset-0 cursor-pointer"
            aria-label={`Selecionar ${cargo.name}`}
          />
          <div className="flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between text-left group"
              aria-expanded={isExpanded}
              aria-controls={`cargo-details-${cargo.id}`}
            >
              <h3 className="text-base font-medium text-[#262626] group-hover:text-[#000000] transition-colors">
                {cargo.name}
              </h3>
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-[#7A7A7A] flex-shrink-0" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#7A7A7A] flex-shrink-0" aria-hidden="true" />
              )}
            </button>

            {isExpanded && (
              <div
                id={`cargo-details-${cargo.id}`}
                className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm"
              >
                <div>
                  <p className="text-[#7A7A7A] mb-1">Peso</p>
                  <p className="font-medium text-[#262626]">{cargo.weight}kg</p>
                </div>
                <div>
                  <p className="text-[#7A7A7A] mb-1">Valor</p>
                  <p className="font-medium text-[#262626]">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL'
                    }).format(cargo.value)}
                  </p>
                </div>
                <div>
                  <p className="text-[#7A7A7A] mb-1">Volume</p>
                  <p className="font-medium text-[#262626]">{cargo.volume}m³</p>
                </div>
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <span className="text-sm text-[#7A7A7A]">Quantidade:</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className={cn(
                    'w-11 h-11 flex items-center justify-center rounded border transition-colors',
                    quantity <= 1
                      ? 'border-[#ECECEC] text-[#CCCCCC] cursor-not-allowed'
                      : 'border-[#CCCCCC] text-[#262626] hover:border-[#262626] hover:bg-[#F2F2F2]'
                  )}
                  aria-label="Diminuir quantidade"
                >
                  <Minus className="w-4 h-4" aria-hidden="true" />
                </button>
                <span className="w-12 text-center font-medium text-[#262626]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-11 h-11 flex items-center justify-center rounded border border-[#CCCCCC] text-[#262626] hover:border-[#262626] hover:bg-[#F2F2F2] transition-colors"
                  aria-label="Aumentar quantidade"
                >
                  <Plus className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
