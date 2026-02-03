import { ArrowRight } from 'lucide-react';

interface RouteCardProps {
  origin: string;
  destination: string;
  service?: string;
  className?: string;
}

export default function RouteCard({
  origin,
  destination,
  service,
  className = ''
}: RouteCardProps) {
  return (
    <div
      className={`
        flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4
        p-4 sm:p-6
        bg-white rounded-xl border-2 border-[#E6E6E6]
        shadow-sm hover:shadow-md transition-all
        ${className}
      `}
    >
      <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs text-[#7A7A7A] font-medium uppercase">
            Origem
          </span>
          <span className="text-sm sm:text-lg font-semibold text-[#262626] truncate">
            {origin || 'Não informado'}
          </span>
        </div>

        <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-[#FFCE12] flex-shrink-0" />

        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-xs text-[#7A7A7A] font-medium uppercase">
            Destino
          </span>
          <span className="text-sm sm:text-lg font-semibold text-[#262626] truncate">
            {destination || 'Não informado'}
          </span>
        </div>
      </div>

      {service && (
        <div className="flex flex-col gap-1 items-start sm:items-end">
          <span className="text-xs text-[#7A7A7A] font-medium uppercase">
            Serviço
          </span>
          <span className="text-sm font-semibold text-[#262626]">
            {service}
          </span>
        </div>
      )}
    </div>
  );
}
