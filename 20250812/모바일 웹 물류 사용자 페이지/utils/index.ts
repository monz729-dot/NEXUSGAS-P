import { AlertMessage, User, UserType, HSCodeResult, CBMCalculation, ShippingValidation, ValidationResult, OrderItem } from '../types';

/**
 * 사용자 타입별 대시보드 경로 반환
 */
export const getDashboardPath = (userType: UserType): string => {
  switch (userType) {
    case 'admin':
      return 'admin-dashboard';
    case 'operator':
      return 'operator-dashboard';
    default:
      return 'dashboard';
  }
};

/**
 * 페이지 접근 권한 확인
 */
export const hasPageAccess = (page: string, userType?: UserType): boolean => {
  if (!userType) return true;
  
  switch (page) {
    case 'order-form':
      return userType === 'general' || userType === 'corporate';
    case 'admin-orders':
    case 'admin-order-detail':
      return userType === 'admin';
    case 'operator-logistics':
    case 'operator-repacking':
      return userType === 'operator' || userType === 'admin';
    default:
      return true;
  }
};

/**
 * 금액 포매팅 (한국 원화)
 */
export const formatCurrency = (amount: number, currency: 'KRW' | 'USD' | 'THB' = 'KRW'): string => {
  const localeMap = {
    'KRW': 'ko-KR',
    'USD': 'en-US',
    'THB': 'th-TH'
  };
  
  const formatter = new Intl.NumberFormat(localeMap[currency], {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'KRW' ? 0 : 2,
  });
  return formatter.format(amount);
};

/**
 * 날짜 포매팅
 */
export const formatDate = (date: string | Date, format: 'short' | 'long' = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  }
  
  return dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * 전화번호 포매팅
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
  }
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
  }
  
  return phone;
};

/**
 * 사업자등록번호 포매팅
 */
export const formatBusinessNumber = (businessNumber: string): string => {
  const cleaned = businessNumber.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
  }
  
  return businessNumber;
};

/**
 * 이메일 유효성 검사
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 비밀번호 유효성 검사
 */
export const validatePassword = (password: string): { isValid: boolean; message?: string } => {
  if (password.length < 8) {
    return { isValid: false, message: '비밀번호는 8자 이상이어야 합니다.' };
  }
  
  if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    return { isValid: false, message: '비밀번호는 영문과 숫자를 포함해야 합니다.' };
  }
  
  return { isValid: true };
};

/**
 * 디바운스 함수
 */
export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * 로컬 스토리지 유틸리티
 */
export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },
  
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

/**
 * 주문 상태별 배지 정보 반환
 */
export const getOrderStatusBadge = (status: string) => {
  const statusMap = {
    confirmed: { className: 'bg-green-50 text-green-700 border-green-200', text: '확인됨' },
    pending: { className: 'bg-yellow-50 text-yellow-700 border-yellow-200', text: '대기중' },
    rejected: { className: 'bg-red-50 text-red-700 border-red-200', text: '거부됨' },
    delivered: { className: 'bg-blue-50 text-blue-700 border-blue-200', text: '배송완료' },
    shipping: { className: 'bg-purple-50 text-purple-700 border-purple-200', text: '배송중' },
    processing: { className: 'bg-orange-50 text-orange-700 border-orange-200', text: '처리중' },
  };
  
  return statusMap[status as keyof typeof statusMap] || {
    className: 'bg-gray-50 text-gray-700 border-gray-200',
    text: status,
  };
};

/**
 * 에러 메시지 생성
 */
export const createErrorMessage = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return '알 수 없는 오류가 발생했습니다.';
};

/**
 * CSS 클래스 조합 유틸리티
 */
export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * 자동 채번 ID 생성
 */
export const generateId = (prefix: string): string => {
  const timestamp = Date.now().toString().slice(-6);
  return `${prefix}-${timestamp}`;
};

/**
 * TAX 계산 (7%)
 */
export const calculateTax = (amount: number, rate: number = 0.07): number => {
  return Math.round(amount * rate * 100) / 100;
};

/**
 * 환율 적용 금액 계산
 */
export const convertCurrency = (usdAmount: number, exchangeRate: number = 1350): number => {
  return Math.round(usdAmount * exchangeRate);
};

/**
 * CBM (Cubic Meter) 계산
 * 공식: (Width × Height × Depth) / 1,000,000 (cm → m³)
 * 소수점 셋째 자리에서 반올림
 */
export const calculateCBM = (width: number, height: number, depth: number): CBMCalculation => {
  const volume = width * height * depth; // cm³
  const cbm = Math.round((volume / 1000000) * 1000) / 1000; // m³, 소수점 셋째 자리 반올림
  
  return {
    volume,
    cbm
  };
};

/**
 * HS코드 API 조회 (Mock 구현)
 */
export const searchHSCode = async (keyword: string): Promise<HSCodeResult[]> => {
  // Mock API 응답 - 실제 구현 시 무료 HS코드 API 연결
  const mockResults: HSCodeResult[] = [
    { code: '6110.30', description: '면제 스웨터/풀오버', category: '의류' },
    { code: '9503.00', description: '장난감', category: '완구' },
    { code: '8517.12', description: '휴대폰', category: '전자제품' },
    { code: '3004.90', description: '의약품', category: '의료용품' },
  ].filter(item => 
    item.description.toLowerCase().includes(keyword.toLowerCase()) ||
    item.category.includes(keyword)
  );
  
  // API 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return mockResults;
};

/**
 * 항공 운송 THB 1,500 초과 시 수취인 정보 필수 검증
 */
export const validateAirShippingRecipient = (item: OrderItem): ShippingValidation => {
  const validation: ShippingValidation = {
    canProceed: true,
    requiresRecipient: false,
    errors: [],
    warnings: []
  };

  if (item.shippingType === 'air' && item.currency === 'THB' && item.declaredValue > 1500) {
    validation.requiresRecipient = true;
    
    if (!item.recipient || !item.recipient.name || !item.recipient.phone || !item.recipient.address) {
      validation.canProceed = false;
      validation.errors.push('항공 운송 시 단가 THB 1,500 초과 상품은 수취인 정보가 필수입니다.');
    }
  }

  return validation;
};

/**
 * 송장번호 필수 검증
 */
export const validateTrackingNumber = (items: OrderItem[]): ValidationResult => {
  const validation: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  const missingTracking = items.filter(item => !item.trackingNumber?.trim());
  
  if (missingTracking.length > 0) {
    validation.isValid = false;
    validation.errors.push('모든 상품에 송장번호가 필요합니다.');
  }

  return validation;
};

/**
 * 전체 주문 검증
 */
export const validateOrder = (items: OrderItem[]): ValidationResult => {
  const validation: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // 송장번호 검증
  const trackingValidation = validateTrackingNumber(items);
  if (!trackingValidation.isValid) {
    validation.isValid = false;
    validation.errors.push(...trackingValidation.errors);
  }

  // 항공 운송 수취인 검증
  const airShippingItems = items.filter(item => item.shippingType === 'air');
  for (const item of airShippingItems) {
    const recipientValidation = validateAirShippingRecipient(item);
    if (!recipientValidation.canProceed) {
      validation.isValid = false;
      validation.errors.push(...recipientValidation.errors);
    }
  }

  return validation;
};

/**
 * 중량 단위 변환 (그램 기준)
 */
export const convertWeight = (weight: number, from: 'g' | 'kg' | 'lb', to: 'g' | 'kg' | 'lb' = 'g'): number => {
  const toGrams = {
    'g': weight,
    'kg': weight * 1000,
    'lb': weight * 453.592
  };

  const grams = toGrams[from];
  
  const fromGrams = {
    'g': grams,
    'kg': grams / 1000,
    'lb': grams / 453.592
  };

  return Math.round(fromGrams[to] * 100) / 100;
};

/**
 * 오퍼레이터 메뉴 접근 권한 확인
 */
export const getOperatorMenuAccess = (userType: UserType, isOperatorView: boolean = false): string[] => {
  if (userType === 'admin' && isOperatorView) {
    return ['logistics', 'repacking', 'inventory'];
  }
  
  if (userType === 'operator') {
    return ['logistics', 'repacking'];
  }
  
  return [];
};