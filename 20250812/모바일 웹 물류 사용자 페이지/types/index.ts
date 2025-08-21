export type UserType = 'general' | 'corporate' | 'partner' | 'admin';

export interface User {
  id: string;
  type: UserType;
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  businessNumber?: string;
  contactPerson?: string;
  contactPhone?: string;
}

export interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string, options?: NavigationOptions) => void;
  onLogout: () => void;
}

export interface NavigationOptions {
  userType?: 'general' | 'corporate' | 'partner';
  orderId?: string;
}

export interface PageProps {
  user?: User | null;
  onNavigate: (page: string, options?: NavigationOptions) => void;
  onLogin?: (userData: User) => void;
  onLogout?: () => void;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  declaredValue: number;
  currency: 'THB' | 'USD' | 'KRW';
  category: string;
  hsCode?: string;
  weight: number; // 그램 단위
  dimensions?: {
    width: number;  // cm
    height: number; // cm
    depth: number;  // cm
    cbm?: number;   // 자동계산됨
  };
  trackingNumber?: string;
  shippingType: 'air' | 'sea';
  recipient?: {
    name: string;
    phone: string;
    address: string;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: string;
  expectedDate: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipping' | 'delivered' | 'rejected';
  deliveryType: string;
  customer: Customer;
  items: OrderItem[];
  requirements?: string;
  billing?: BillingInfo;
}

export interface Customer {
  type: 'individual' | 'corporate';
  id: string;
  email: string;
  phone: string;
  name?: string;
  companyName?: string;
  businessNumber?: string;
  contactName?: string;
  contactPhone?: string;
}

export interface BillingInfo {
  totalAmount: number;
  currency: 'KRW' | 'USD' | 'THB';
  invoiceType: 'proforma' | 'final';
  paymentMethod: 'manual_deposit'; // 수기 입금만 지원
  paymentStatus: 'pending' | 'confirmed' | 'completed';
  paymentDate?: string;
  depositorName?: string;
  depositAmount?: number;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'file' | 'select' | 'textarea';
  placeholder?: string;
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  validation?: (value: string) => string | null;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

export interface AlertMessage {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface HSCodeResult {
  code: string;
  description: string;
  category: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface CBMCalculation {
  volume: number; // cm³
  cbm: number;    // m³ (소수점 셋째 자리 반올림)
}

export interface ShippingValidation {
  canProceed: boolean;
  requiresRecipient: boolean;
  errors: string[];
  warnings: string[];
}