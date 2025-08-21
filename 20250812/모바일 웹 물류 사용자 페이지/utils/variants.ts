import { cn } from './index';

/**
 * 버튼 variant 정의
 */
export const buttonVariants = {
  base: 'inline-flex items-center justify-center gap-2 rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  
  variants: {
    variant: {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md',
      secondary: 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 hover:border-blue-300',
      outline: 'border border-blue-300 text-blue-700 hover:bg-blue-50',
      ghost: 'text-blue-700 hover:bg-blue-50',
      destructive: 'bg-red-600 text-white hover:bg-red-700',
      success: 'bg-green-600 text-white hover:bg-green-700',
      gradient: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-blue',
    },
    
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6',
      xl: 'h-14 px-8 text-lg',
      icon: 'h-10 w-10',
    },
    
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  
  defaultVariants: {
    variant: 'primary',
    size: 'md',
    fullWidth: false,
  },
};

/**
 * 입력 필드 variant 정의
 */
export const inputVariants = {
  base: 'w-full rounded-lg border border-blue-200 bg-blue-50/30 px-4 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-50',
  
  variants: {
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-4',
    },
    
    state: {
      default: '',
      error: 'border-red-300 focus:border-red-500 focus:ring-red-200',
      success: 'border-green-300 focus:border-green-500 focus:ring-green-200',
    },
  },
  
  defaultVariants: {
    size: 'md',
    state: 'default',
  },
};

/**
 * 카드 variant 정의
 */
export const cardVariants = {
  base: 'rounded-lg border bg-white shadow-sm',
  
  variants: {
    variant: {
      default: 'border-blue-100 shadow-blue',
      elevated: 'border-blue-200 shadow-blue-lg',
      flat: 'border-blue-100 shadow-none',
      glass: 'backdrop-blur-sm bg-white/80 border-blue-200',
    },
    
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  
  defaultVariants: {
    variant: 'default',
    padding: 'md',
  },
};

/**
 * 배지 variant 정의
 */
export const badgeVariants = {
  base: 'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
  
  variants: {
    variant: {
      default: 'bg-blue-50 text-blue-700 border border-blue-200',
      success: 'bg-green-50 text-green-700 border border-green-200',
      warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
      error: 'bg-red-50 text-red-700 border border-red-200',
      info: 'bg-purple-50 text-purple-700 border border-purple-200',
      outline: 'border border-blue-300 text-blue-700',
    },
  },
  
  defaultVariants: {
    variant: 'default',
  },
};

/**
 * 알림 variant 정의
 */
export const alertVariants = {
  base: 'rounded-lg border p-4',
  
  variants: {
    variant: {
      default: 'bg-blue-50 border-blue-200 text-blue-800',
      success: 'bg-green-50 border-green-200 text-green-800',
      warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
      error: 'bg-red-50 border-red-200 text-red-800',
      info: 'bg-purple-50 border-purple-200 text-purple-800',
    },
  },
  
  defaultVariants: {
    variant: 'default',
  },
};

/**
 * 버튼 Props 타입 정의
 */
export interface ButtonVariantProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'icon';
  fullWidth?: boolean;
  className?: string;
}

/**
 * 입력 필드 Props 타입 정의
 */
export interface InputVariantProps {
  size?: 'sm' | 'md' | 'lg';
  state?: 'default' | 'error' | 'success';
  className?: string;
}

/**
 * 카드 Props 타입 정의
 */
export interface CardVariantProps {
  variant?: 'default' | 'elevated' | 'flat' | 'glass';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 배지 Props 타입 정의
 */
export interface BadgeVariantProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
  className?: string;
}

/**
 * 알림 Props 타입 정의
 */
export interface AlertVariantProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

/**
 * Variant를 조합하여 클래스 생성하는 헬퍼 함수
 */
export function createVariantClasses(
  config: {
    base: string;
    variants: Record<string, Record<string, string>>;
    defaultVariants: Record<string, string>;
  },
  props: Record<string, any> & { className?: string }
): string {
  const { base, variants, defaultVariants } = config;
  const { className, ...variantProps } = props;
  
  const variantClasses = Object.entries(variants).map(([key, values]) => {
    const variantKey = variantProps[key] || defaultVariants[key];
    return values[variantKey] || '';
  });
  
  return cn(base, ...variantClasses, className);
}

/**
 * 버튼 클래스 생성 헬퍼
 */
export function getButtonClasses(props: ButtonVariantProps = {}): string {
  return createVariantClasses(buttonVariants, {
    variant: props.variant || buttonVariants.defaultVariants.variant,
    size: props.size || buttonVariants.defaultVariants.size,
    fullWidth: props.fullWidth || buttonVariants.defaultVariants.fullWidth,
    className: props.className,
  });
}

/**
 * 입력 필드 클래스 생성 헬퍼
 */
export function getInputClasses(props: InputVariantProps = {}): string {
  return createVariantClasses(inputVariants, {
    size: props.size || inputVariants.defaultVariants.size,
    state: props.state || inputVariants.defaultVariants.state,
    className: props.className,
  });
}

/**
 * 카드 클래스 생성 헬퍼
 */
export function getCardClasses(props: CardVariantProps = {}): string {
  return createVariantClasses(cardVariants, {
    variant: props.variant || cardVariants.defaultVariants.variant,
    padding: props.padding || cardVariants.defaultVariants.padding,
    className: props.className,
  });
}

/**
 * 배지 클래스 생성 헬퍼
 */
export function getBadgeClasses(props: BadgeVariantProps = {}): string {
  return createVariantClasses(badgeVariants, {
    variant: props.variant || badgeVariants.defaultVariants.variant,
    className: props.className,
  });
}

/**
 * 알림 클래스 생성 헬퍼
 */
export function getAlertClasses(props: AlertVariantProps = {}): string {
  return createVariantClasses(alertVariants, {
    variant: props.variant || alertVariants.defaultVariants.variant,
    className: props.className,
  });
}