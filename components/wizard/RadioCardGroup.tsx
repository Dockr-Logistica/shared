import React from 'react';

export interface RadioCardOption {
  value: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface RadioCardGroupProps {
  options: RadioCardOption[];
  value: string | undefined;
  onChange: (value: string) => void;
  name: string;
}

export function RadioCardGroup({ options, value, onChange, name }: RadioCardGroupProps) {
  return (
    <div className="grid gap-4">
      {options.map((option) => {
        const isSelected = value === option.value;
        return (
          <label
            key={option.value}
            className={`
              relative flex items-start gap-4 p-4 rounded-lg border-2 cursor-pointer
              transition-all duration-200 ease-in-out
              ${isSelected
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={isSelected}
              onChange={() => onChange(option.value)}
              className="sr-only"
            />

            <div className={`
              flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center
              ${isSelected ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'}
              transition-colors duration-200
            `}>
              {option.icon}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={`font-semibold ${isSelected ? 'text-primary' : 'text-gray-900'}`}>
                  {option.label}
                </span>
                {isSelected && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                {option.description}
              </p>
            </div>
          </label>
        );
      })}
    </div>
  );
}
