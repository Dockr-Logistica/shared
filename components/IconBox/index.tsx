import { cn } from '../../utils/cn';

interface IconBoxProps {
  variant: 'yellow' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

const sizeMap = {
  sm: 'w-12 h-12',
  md: 'w-[54px] h-[54px]',
  lg: 'w-14 h-14',
};

const iconSizeMap = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-7 h-7',
};

const variantMap = {
  yellow: 'bg-primary',
  dark: 'bg-[#333333]',
};

const iconColorMap = {
  yellow: 'text-[#262626]',
  dark: 'text-[#F2F2F2]',
};

export function IconBox({
  variant,
  size = 'md',
  children,
  className
}: IconBoxProps) {
  return (
    <div className={cn(
      'rounded-full flex items-center justify-center flex-shrink-0',
      sizeMap[size],
      variantMap[variant],
      className
    )}>
      <div className={cn(iconSizeMap[size], iconColorMap[variant])}>
        {children}
      </div>
    </div>
  );
}
