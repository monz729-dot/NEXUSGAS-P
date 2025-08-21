import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  ArrowLeft,
  Package,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Truck,
  Building,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  DollarSign,
  Hash,
  ShoppingBag,
  Eye,
  CreditCard,
  Receipt
} from 'lucide-react';

interface AdminOrderDetailPageProps {
  orderId: string;
  onNavigate: (page: string) => void;
}

export function AdminOrderDetailPage({ orderId, onNavigate }: AdminOrderDetailPageProps) {
  const [orderData, setOrderData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 모의 주문 데이터
  const mockOrderData = {
    'ORD-2024-001': {
      // 주문 기본 정보
      orderNumber: 'ORD-2024-001',
      orderDate: '2024-01-10',
      expectedDate: '2024-01-15',
      status: 'pending',
      deliveryType: '일반배송',
      schedule: [
        { date: '2024-01-10', status: 'ordered', label: '주문접수', completed: true },
        { date: '2024-01-12', status: 'processing', label: '상품준비중', completed: true },
        { date: '2024-01-14', status: 'shipping', label: '배송중', completed: false },
        { date: '2024-01-15', status: 'delivered', label: '배송완료', completed: false }
      ],
      
      // 고객 정보
      customer: {
        type: 'corporate',
        id: 'CUST-123456',
        email: 'company@example.com',
        phone: '02-1234-5678',
        companyName: '(주)테스트기업',
        businessNumber: '123-45-67890',
        contactName: '김담당',
        contactPhone: '010-1234-5678'
      },
      
      // 요청사항
      requirements: '깨지기 쉬운 상품이므로 포장에 주의해주세요.',
      
      // 이용내역 (결제 정보)
      billing: {
        totalAmount: 1250000,
        currency: 'KRW',
        paymentMethod: '법인카드',
        paymentStatus: '결제완료',
        paymentDate: '2024-01-10'
      },
      
      // 내품정보
      items: [
        {
          id: 'ITEM-001',
          name: '노트북 컴퓨터',
          quantity: 2,
          declaredValue: 800, // USD
          category: '전자제품',
          weight: '2.5kg',
          trackingNumber: 'TRK-001-2024',
          shippingType: '항공'
        },
        {
          id: 'ITEM-002',
          name: '무선마우스',
          quantity: 5,
          declaredValue: 25, // USD
          category: '전자제품',
          weight: '0.1kg',
          trackingNumber: 'TRK-002-2024',
          shippingType: '항공'
        }
      ]
    },
    'ORD-2024-002': {
      orderNumber: 'ORD-2024-002',
      orderDate: '2024-01-12',
      expectedDate: '2024-01-17',
      status: 'confirmed',
      deliveryType: '특급배송',
      schedule: [
        { date: '2024-01-12', status: 'ordered', label: '주문접수', completed: true },
        { date: '2024-01-13', status: 'processing', label: '상품준비중', completed: true },
        { date: '2024-01-15', status: 'shipping', label: '배송중', completed: true },
        { date: '2024-01-17', status: 'delivered', label: '배송완료', completed: false }
      ],
      
      customer: {
        type: 'individual',
        id: 'CUST-789012',
        email: 'individual@example.com',
        phone: '010-9876-5432',
        name: '이영희'
      },
      
      requirements: '부재 시 경비실에 맡겨주세요.',
      
      billing: {
        totalAmount: 350000,
        currency: 'KRW',
        paymentMethod: '신용카드',
        paymentStatus: '결제완료',
        paymentDate: '2024-01-12'
      },
      
      items: [
        {
          id: 'ITEM-003',
          name: '무선 이어폰',
          quantity: 1,
          declaredValue: 150, // USD
          category: '전자제품',
          weight: '0.2kg',
          trackingNumber: 'TRK-003-2024',
          shippingType: '항공'
        }
      ]
    },
    'ORD-2024-003': {
      orderNumber: 'ORD-2024-003',
      orderDate: '2024-01-14',
      expectedDate: '2024-01-19',
      status: 'pending',
      deliveryType: '일반배송',
      schedule: [
        { date: '2024-01-14', status: 'ordered', label: '주문접수', completed: true },
        { date: '2024-01-16', status: 'processing', label: '상품준비중', completed: false },
        { date: '2024-01-18', status: 'shipping', label: '배송중', completed: false },
        { date: '2024-01-19', status: 'delivered', label: '배송완료', completed: false }
      ],
      
      customer: {
        type: 'individual',
        id: 'CUST-345678',
        email: 'park@example.com',
        phone: '010-5555-6666',
        name: '박민수'
      },
      
      requirements: '직장으로 배송 부탁드립니다.',
      
      billing: {
        totalAmount: 850000,
        currency: 'KRW',
        paymentMethod: '계좌이체',
        paymentStatus: '결제완료',
        paymentDate: '2024-01-14'
      },
      
      items: [
        {
          id: 'ITEM-004',
          name: '스마트폰 케이스',
          quantity: 10,
          declaredValue: 15, // USD
          category: '액세서리',
          weight: '0.1kg',
          trackingNumber: 'TRK-004-2024',
          shippingType: '선박'
        },
        {
          id: 'ITEM-005',
          name: '블루투스 스피커',
          quantity: 3,
          declaredValue: 80, // USD
          category: '전자제품',
          weight: '1.2kg',
          trackingNumber: 'TRK-005-2024',
          shippingType: '항공'
        }
      ]
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // 모의 데이터 로딩
    setTimeout(() => {
      const data = mockOrderData[orderId as keyof typeof mockOrderData];
      setOrderData(data);
      setIsLoading(false);
    }, 1000);
  }, [orderId]);

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-50 text-green-700 border-green-200">확인됨</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">대기중</Badge>;
      case 'rejected':
        return <Badge className="bg-red-50 text-red-700 border-red-200">거부됨</Badge>;
      case 'delivered':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">배송완료</Badge>;
      case 'shipping':
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">배송중</Badge>;
      case 'processing':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">처리중</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // 스케줄 단계별 아이콘
  const getScheduleIcon = (status: string, completed: boolean) => {
    const iconClass = completed ? 'text-green-600' : 'text-blue-300';
    
    switch (status) {
      case 'ordered':
        return <FileText className={`h-5 w-5 ${iconClass}`} />;
      case 'processing':
        return <Package className={`h-5 w-5 ${iconClass}`} />;
      case 'shipping':
        return <Truck className={`h-5 w-5 ${iconClass}`} />;
      case 'delivered':
        return <CheckCircle className={`h-5 w-5 ${iconClass}`} />;
      default:
        return <Clock className={`h-5 w-5 ${iconClass}`} />;
    }
  };

  // USD to KRW 환율 (예시)
  const exchangeRate = 1350;

  // TAX 계산 (7%)
  const calculateTax = (usdAmount: number) => {
    return Math.round(usdAmount * 0.07 * 100) / 100;
  };

  // 총 신고가 계산
  const calculateTotalDeclaredValue = () => {
    if (!orderData?.items) return 0;
    return orderData.items.reduce((total: number, item: any) => {
      return total + (item.declaredValue * item.quantity);
    }, 0);
  };

  // 총 TAX 계산
  const calculateTotalTax = () => {
    const totalDeclared = calculateTotalDeclaredValue();
    return calculateTax(totalDeclared);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-600 font-medium">주문 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-blue-900 mb-4">주문을 찾을 수 없습니다</h2>
          <p className="text-blue-600 mb-6">요청하신 주문 정보를 찾을 수 없습니다.</p>
          <Button
            onClick={() => onNavigate('admin-orders')}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            주문 관리로 돌아가기
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin-orders')}
              className="p-2 text-blue-600/60 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all opacity-60 hover:opacity-100"
              aria-label="주문 관리로 돌아가기"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-blue">
              <Eye className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-blue-900">주문 상세정보</h1>
              <p className="text-xs text-blue-600">{orderData.orderNumber}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(orderData.status)}
          </div>
        </div>
      </header>

      <div className="p-4 max-w-6xl mx-auto space-y-6">
        {/* 주문 기본 정보 */}
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Package className="h-5 w-5" />
              주문 정보
            </CardTitle>
            <CardDescription>주문 기본 정보 및 배송 현황</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Hash className="h-4 w-4" />
                  <span>주문번호</span>
                </div>
                <p className="font-medium text-blue-900">{orderData.orderNumber}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Calendar className="h-4 w-4" />
                  <span>주문일자</span>
                </div>
                <p className="font-medium text-blue-900">{orderData.orderDate}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span>도착예정일</span>
                </div>
                <p className="font-medium text-blue-900">{orderData.expectedDate}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Truck className="h-4 w-4" />
                  <span>배송유형</span>
                </div>
                <p className="font-medium text-blue-900">{orderData.deliveryType}</p>
              </div>
            </div>

            <Separator />

            {/* 배송 스케줄 */}
            <div>
              <h4 className="font-medium text-blue-900 mb-4">배송 스케줄</h4>
              <div className="space-y-4">
                {orderData.schedule.map((step: any, index: number) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100 border-2 border-green-300' : 'bg-blue-50 border-2 border-blue-200'
                    }`}>
                      {getScheduleIcon(step.status, step.completed)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className={`font-medium ${step.completed ? 'text-green-800' : 'text-blue-700'}`}>
                          {step.label}
                        </h5>
                        <span className="text-sm text-blue-600">{step.date}</span>
                      </div>
                      {step.completed && (
                        <p className="text-sm text-green-600 mt-1">완료됨</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 고객 정보 */}
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <User className="h-5 w-5" />
              고객 정보
            </CardTitle>
            <CardDescription>주문자 정보</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Hash className="h-4 w-4" />
                    <span>고객 ID</span>
                  </div>
                  <p className="font-medium text-blue-900">{orderData.customer.id}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Mail className="h-4 w-4" />
                    <span>이메일</span>
                  </div>
                  <p className="font-medium text-blue-900">{orderData.customer.email}</p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Phone className="h-4 w-4" />
                    <span>연락처</span>
                  </div>
                  <p className="font-medium text-blue-900">{orderData.customer.phone}</p>
                </div>
              </div>

              {/* 기업 정보 (기업 고객인 경우만 표시) */}
              {orderData.customer.type === 'corporate' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Building className="h-4 w-4" />
                      <span>회사명</span>
                    </div>
                    <p className="font-medium text-blue-900">{orderData.customer.companyName}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <FileText className="h-4 w-4" />
                      <span>사업자등록번호</span>
                    </div>
                    <p className="font-medium text-blue-900">{orderData.customer.businessNumber}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <User className="h-4 w-4" />
                      <span>담당자명</span>
                    </div>
                    <p className="font-medium text-blue-900">{orderData.customer.contactName}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Phone className="h-4 w-4" />
                      <span>담당자 연락처</span>
                    </div>
                    <p className="font-medium text-blue-900">{orderData.customer.contactPhone}</p>
                  </div>
                </div>
              )}

              {/* 개인 정보 (개인 고객인 경우만 표시) */}
              {orderData.customer.type === 'individual' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <User className="h-4 w-4" />
                      <span>고객명</span>
                    </div>
                    <p className="font-medium text-blue-900">{orderData.customer.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 요청사항 */}
            {orderData.requirements && (
              <>
                <Separator className="my-6" />
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <FileText className="h-4 w-4" />
                    <span>요청사항</span>
                  </div>
                  <div className="p-3 bg-blue-50/30 border border-blue-200 rounded-lg">
                    <p className="text-blue-900">{orderData.requirements}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* 이용내역 (결제 정보) */}
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <CreditCard className="h-5 w-5" />
              이용내역
            </CardTitle>
            <CardDescription>결제 정보 및 총 금액</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <DollarSign className="h-4 w-4" />
                  <span>총 결제금액</span>
                </div>
                <p className="font-semibold text-lg text-blue-900">
                  ₩{orderData.billing.totalAmount.toLocaleString()}
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <CreditCard className="h-4 w-4" />
                  <span>결제수단</span>
                </div>
                <p className="font-medium text-blue-900">{orderData.billing.paymentMethod}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <CheckCircle className="h-4 w-4" />
                  <span>결제상태</span>
                </div>
                <Badge className="bg-green-50 text-green-700 border-green-200">
                  {orderData.billing.paymentStatus}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Calendar className="h-4 w-4" />
                  <span>결제일</span>
                </div>
                <p className="font-medium text-blue-900">{orderData.billing.paymentDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 내품정보 테이블 */}
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <ShoppingBag className="h-5 w-5" />
              내품정보
            </CardTitle>
            <CardDescription>상품별 상세정보 및 세금 계산</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-blue-200">
                    <th className="text-left py-3 px-2 text-sm font-medium text-blue-900">내품명</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-blue-900">수량</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-blue-900">신고가(USD)</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-blue-900">발송구분</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-blue-900">송장번호</th>
                    <th className="text-center py-3 px-2 text-sm font-medium text-blue-900">TAX 7%</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.items.map((item: any, index: number) => (
                    <tr key={index} className="border-b border-blue-100 hover:bg-blue-50/30">
                      <td className="py-3 px-2">
                        <div>
                          <p className="font-medium text-blue-900">{item.name}</p>
                          <p className="text-sm text-blue-600">{item.category} | {item.weight}</p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center font-medium text-blue-900">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div>
                          <p className="font-medium text-blue-900">${item.declaredValue}</p>
                          <p className="text-xs text-blue-600">
                            (₩{(item.declaredValue * exchangeRate).toLocaleString()})
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant="outline" className="text-blue-700 border-blue-300">
                          {item.shippingType}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-center font-mono text-sm text-blue-900">
                        {item.trackingNumber}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <div>
                          <p className="font-medium text-blue-900">
                            ${calculateTax(item.declaredValue * item.quantity)}
                          </p>
                          <p className="text-xs text-blue-600">
                            (₩{(calculateTax(item.declaredValue * item.quantity) * exchangeRate).toLocaleString()})
                          </p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-blue-300 bg-blue-50/50">
                    <td className="py-3 px-2 font-semibold text-blue-900">합계</td>
                    <td className="py-3 px-2 text-center font-medium text-blue-900">
                      {orderData.items.reduce((total: number, item: any) => total + item.quantity, 0)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <div>
                        <p className="font-semibold text-blue-900">${calculateTotalDeclaredValue()}</p>
                        <p className="text-xs text-blue-600">
                          (₩{(calculateTotalDeclaredValue() * exchangeRate).toLocaleString()})
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-2"></td>
                    <td className="py-3 px-2"></td>
                    <td className="py-3 px-2 text-center">
                      <div>
                        <p className="font-semibold text-blue-900">${calculateTotalTax()}</p>
                        <p className="text-xs text-blue-600">
                          (₩{(calculateTotalTax() * exchangeRate).toLocaleString()})
                        </p>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* 환율 정보 */}
            <div className="mt-4 p-3 bg-blue-50/30 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-blue-600 mb-1">
                <DollarSign className="h-4 w-4" />
                <span>환율 정보</span>
              </div>
              <p className="text-sm text-blue-700">
                USD 1 = KRW {exchangeRate.toLocaleString()} (참고용)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 하단 액션 버튼 */}
        <div className="flex gap-4 justify-center pb-8">
          <Button
            onClick={() => onNavigate('admin-orders')}
            variant="outline"
            className="border-blue-300 text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            주문 관리로 돌아가기
          </Button>
        </div>
      </div>
    </div>
  );
}