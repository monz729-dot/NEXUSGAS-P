import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Progress } from './ui/progress';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, User, Mail, Phone, FileText, CreditCard, Building2, AlertCircle, Calendar, Hash, Globe, Camera, Wrench, Calculator, Download, Eye } from 'lucide-react';

interface OrderDetailPageProps {
  onNavigate: (page: string, options?: { orderId?: string }) => void;
  orderId: string;
}

interface OrderItem {
  id: string;
  hscode: string;
  description: string;
  quantity: number;
  weight: number;
  width: number;
  height: number;
  depth: number;
  unitPrice: number;
  cbm: number;
}

interface WorkflowStatus {
  key: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  completed: boolean;
  active: boolean;
  date?: string;
}

interface OrderDetail {
  orderId: string;
  orderNumber: string;
  customerId: string;
  orderDate: string;
  status: string;
  shippingType: 'sea' | 'air';
  country: string;
  postalCode: string;
  
  // 고객 정보
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerType: 'general' | 'corporate';
  companyName?: string;
  
  // 수취인 정보
  recipientName: string;
  recipientPhone: string;
  recipientAddress: string;
  recipientPostalCode: string;
  
  // 주문 품목
  items: OrderItem[];
  
  // 송장 정보
  trackingNumber: string;
  
  // 창고 정보
  warehouse: {
    arrivedDate?: string;
    actualWeight?: number;
    repackingRequested: boolean;
    repackingCompleted: boolean;
    photos: string[];
    notes?: string;
  };
  
  // 청구서 정보
  billing: {
    proformaIssued: boolean;
    proformaDate?: string;
    finalIssued: boolean;
    finalDate?: string;
    shippingFee: number;
    localDeliveryFee: number;
    repackingFee: number;
    handlingFee: number;
    insuranceFee: number;
    customsFee: number;
    tax: number;
    total: number;
    paymentMethod: 'manual_deposit';
    paymentStatus: 'not_ready' | 'pending' | 'confirmed' | 'completed';
    paymentDate?: string;
    depositorName?: string;
  };
  
  // 특별 요청사항
  specialRequests?: string;
}

export function OrderDetailPage({ onNavigate, orderId }: OrderDetailPageProps) {
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 데모용 주문 상세 데이터 로드
    setTimeout(() => {
      const mockOrderDetail: OrderDetail = {
        orderId: orderId || 'YCS-2024-001',
        orderNumber: 'YCS-240115-001',
        customerId: 'KYP001',
        orderDate: '2024-01-15',
        status: 'payment_pending',
        shippingType: 'sea',
        country: 'thailand',
        postalCode: '10110',
        
        customerName: '김철수',
        customerEmail: 'kimcs@email.com',
        customerPhone: '010-1234-5678',
        customerType: 'general',
        
        recipientName: 'Somchai Jaidee',
        recipientPhone: '+66-81-234-5678',
        recipientAddress: '123 Sukhumvit Road, Watthana District, Bangkok',
        recipientPostalCode: '10110',
        
        items: [
          {
            id: '1',
            hscode: '1905.31',
            description: '빼빼로 초콜릿',
            quantity: 10,
            weight: 1.5,
            width: 30,
            height: 20,
            depth: 5,
            unitPrice: 25.00,
            cbm: 0.003
          },
          {
            id: '2',
            hscode: '1806.32',
            description: '초콜릿 과자',
            quantity: 5,
            weight: 0.8,
            width: 20,
            height: 15,
            depth: 3,
            unitPrice: 15.00,
            cbm: 0.0009
          }
        ],
        
        trackingNumber: 'EE123456789KR',
        
        warehouse: {
          arrivedDate: '2024-01-18',
          actualWeight: 2.5,
          repackingRequested: true,
          repackingCompleted: true,
          photos: ['arrival_240118.jpg', 'repacking_240118_1.jpg', 'repacking_240118_2.jpg'],
          notes: '상품 상태 양호, 1kg씩 3개 포장으로 분할 완료'
        },
        
        billing: {
          proformaIssued: true,
          proformaDate: '2024-01-19',
          finalIssued: false,
          shippingFee: 85000,
          localDeliveryFee: 25000,
          repackingFee: 15000,
          handlingFee: 10000,
          insuranceFee: 2000,
          customsFee: 5000,
          tax: 9975,
          total: 151975,
          paymentMethod: 'manual_deposit',
          paymentStatus: 'pending',
          depositorName: '김철수'
        },
        
        specialRequests: '깨지기 쉬운 상품이므로 신중히 포장 부탁드립니다.'
      };
      
      setOrderDetail(mockOrderDetail);
      setIsLoading(false);
    }, 1000);
  }, [orderId]);

  if (isLoading || !orderDetail) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-600">주문 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 워크플로우 상태 정의
  const getWorkflowStatuses = (): WorkflowStatus[] => {
    const statuses = [
      {
        key: 'received',
        label: '접수완료',
        icon: <CheckCircle className="h-4 w-4" />,
        description: '우체국 송장번호 등록',
        completed: true,
        active: false,
        date: orderDetail.orderDate
      },
      {
        key: 'arrived',
        label: 'YCS창고도착',
        icon: <Package className="h-4 w-4" />,
        description: '창고 도착, 무게 확인',
        completed: !!orderDetail.warehouse.arrivedDate,
        active: orderDetail.status === 'arrived',
        date: orderDetail.warehouse.arrivedDate
      },
      {
        key: 'repacking',
        label: '리패킹진행',
        icon: <Wrench className="h-4 w-4" />,
        description: '리패킹 작업 및 사진 업로드',
        completed: orderDetail.warehouse.repackingCompleted,
        active: orderDetail.status === 'repacking'
      },
      {
        key: 'billing',
        label: '청구서발행',
        icon: <FileText className="h-4 w-4" />,
        description: '최종 비용 산정',
        completed: orderDetail.billing.proformaIssued,
        active: orderDetail.status === 'billing',
        date: orderDetail.billing.proformaDate
      },
      {
        key: 'payment_pending',
        label: '입금대기',
        icon: <Clock className="h-4 w-4" />,
        description: '무통장 입금 대기',
        completed: orderDetail.billing.paymentStatus === 'confirmed' || orderDetail.billing.paymentStatus === 'completed',
        active: orderDetail.status === 'payment_pending'
      },
      {
        key: 'payment_confirmed',
        label: '입금확인',
        icon: <CreditCard className="h-4 w-4" />,
        description: '입금 확인 완료',
        completed: orderDetail.billing.paymentStatus === 'completed',
        active: orderDetail.status === 'payment_confirmed',
        date: orderDetail.billing.paymentDate
      },
      {
        key: 'shipping',
        label: '배송중',
        icon: <Truck className="h-4 w-4" />,
        description: '태국 현지 배송',
        completed: orderDetail.status === 'delivered',
        active: orderDetail.status === 'shipping'
      },
      {
        key: 'delivered',
        label: '배송완료',
        icon: <CheckCircle className="h-4 w-4" />,
        description: '최종 배송 완료',
        completed: orderDetail.status === 'delivered',
        active: false
      }
    ];

    return statuses;
  };

  const workflowStatuses = getWorkflowStatuses();
  const completedSteps = workflowStatuses.filter(s => s.completed).length;
  const progressValue = (completedSteps / workflowStatuses.length) * 100;

  const getCountryName = (country: string) => {
    switch (country) {
      case 'thailand': return '태국';
      case 'vietnam': return '베트남';
      case 'philippines': return '필리핀';
      case 'indonesia': return '인도네시아';
      default: return country;
    }
  };

  const calculateVolumetricWeight = (item: OrderItem) => {
    return (item.width * item.height * item.depth) / 6000;
  };

  const formatCurrency = (amount: number, currency: 'KRW' | 'THB' = 'THB') => {
    if (currency === 'KRW') {
      return new Intl.NumberFormat('ko-KR').format(amount) + '원';
    }
    return new Intl.NumberFormat('ko-KR').format(amount) + ' THB';
  };

  const formatUSD = (amount: number) => {
    return '$' + amount.toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('order-history')}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          주문내역으로
        </Button>
        <div>
          <h1 className="text-xl text-blue-900">주문 상세</h1>
          <p className="text-sm text-blue-600">{orderDetail.orderNumber} - 청구서 및 배송 정보</p>
        </div>
      </div>

      {/* 워크플로우 현황 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              배송 워크플로우
            </div>
            <Badge variant="outline" className="text-sm">
              {completedSteps}/{workflowStatuses.length} 단계 완료
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>진행률</span>
              <span>{Math.round(progressValue)}%</span>
            </div>
            <Progress value={progressValue} className="h-3" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {workflowStatuses.map((status, index) => (
              <div 
                key={status.key} 
                className={`p-3 rounded-lg border transition-all ${
                  status.completed 
                    ? 'bg-green-50 border-green-200' 
                    : status.active 
                      ? 'bg-blue-50 border-blue-200' 
                      : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`${
                    status.completed 
                      ? 'text-green-600' 
                      : status.active 
                        ? 'text-blue-600' 
                        : 'text-gray-400'
                  }`}>
                    {status.icon}
                  </div>
                  <span className={`font-medium text-sm ${
                    status.completed 
                      ? 'text-green-800' 
                      : status.active 
                        ? 'text-blue-800' 
                        : 'text-gray-600'
                  }`}>
                    {status.label}
                  </span>
                </div>
                <p className="text-xs text-gray-600 mb-1">{status.description}</p>
                {status.date && (
                  <p className="text-xs text-gray-500">{status.date}</p>
                )}
                {status.active && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="text-xs">진행중</Badge>
                  </div>
                )}
                {status.completed && !status.active && (
                  <div className="mt-2">
                    <Badge variant="default" className="text-xs bg-green-600">완료</Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 기본 정보 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 주문 정보 */}
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Hash className="h-5 w-5" />
              주문 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">주문번호</span>
              <span className="font-medium font-mono">{orderDetail.orderNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">고객 아이디</span>
              <span className="font-medium font-mono">{orderDetail.customerId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">접수일</span>
              <span className="font-medium">{orderDetail.orderDate}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">송장번호</span>
              <span className="font-medium font-mono">{orderDetail.trackingNumber}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">배송유형</span>
              <Badge variant="outline">
                {orderDetail.shippingType === 'air' ? '항공운송' : '해상운송'}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">목적지</span>
              <span className="font-medium">{getCountryName(orderDetail.country)} ({orderDetail.postalCode})</span>
            </div>
          </CardContent>
        </Card>

        {/* 고객 정보 */}
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              고객 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">이름</span>
              <span className="font-medium">{orderDetail.customerName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">이메일</span>
              <span className="font-medium text-sm">{orderDetail.customerEmail}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">연락처</span>
              <span className="font-medium">{orderDetail.customerPhone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">회원유형</span>
              <Badge variant="outline">
                {orderDetail.customerType === 'corporate' ? '기업회원' : '일반회원'}
              </Badge>
            </div>
            {orderDetail.companyName && (
              <div className="flex justify-between items-center">
                <span className="text-blue-700">회사명</span>
                <span className="font-medium">{orderDetail.companyName}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* 창고 정보 */}
      {orderDetail.warehouse.arrivedDate && (
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Package className="h-5 w-5" />
              YCS 창고 정보
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">창고도착일</span>
                <span className="font-medium">{orderDetail.warehouse.arrivedDate}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">실제무게</span>
                <span className="font-medium">{orderDetail.warehouse.actualWeight}kg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">리패킹</span>
                <div className="flex items-center gap-2">
                  <Badge variant={orderDetail.warehouse.repackingRequested ? "default" : "secondary"}>
                    {orderDetail.warehouse.repackingRequested ? '신청함' : '신청안함'}
                  </Badge>
                  {orderDetail.warehouse.repackingRequested && (
                    <Badge variant={orderDetail.warehouse.repackingCompleted ? "default" : "outline"} className="text-xs">
                      {orderDetail.warehouse.repackingCompleted ? '완료' : '진행중'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {orderDetail.warehouse.photos.length > 0 && (
              <div className="space-y-2">
                <span className="text-blue-700 font-medium">업로드된 사진</span>
                <div className="flex flex-wrap gap-2">
                  {orderDetail.warehouse.photos.map((photo, index) => (
                    <Badge key={index} variant="outline" className="text-xs flex items-center gap-1">
                      <Camera className="h-3 w-3" />
                      {photo.includes('arrival') ? '도착사진' : 
                       photo.includes('repacking') ? '리패킹사진' : '사진'}
                      {index + 1}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {orderDetail.warehouse.notes && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>창고 메모:</strong> {orderDetail.warehouse.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 청구서 정보 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              청구서 (Invoice)
            </div>
            <div className="flex items-center gap-2">
              {orderDetail.billing.proformaIssued && (
                <Badge variant="default" className="text-xs">Proforma 발행</Badge>
              )}
              {orderDetail.billing.finalIssued && (
                <Badge variant="default" className="text-xs">Final 발행</Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 청구서 발행 현황 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-purple-700">Proforma 청구서</span>
                <Badge variant={orderDetail.billing.proformaIssued ? "default" : "secondary"}>
                  {orderDetail.billing.proformaIssued ? '발행완료' : '미발행'}
                </Badge>
              </div>
              {orderDetail.billing.proformaIssued && orderDetail.billing.proformaDate && (
                <p className="text-sm text-gray-600">발행일: {orderDetail.billing.proformaDate}</p>
              )}
            </div>
            
            <div className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-purple-700">Final 청구서</span>
                <Badge variant={orderDetail.billing.finalIssued ? "default" : "secondary"}>
                  {orderDetail.billing.finalIssued ? '발행완료' : '미발행'}
                </Badge>
              </div>
              {orderDetail.billing.finalIssued && orderDetail.billing.finalDate && (
                <p className="text-sm text-gray-600">발행일: {orderDetail.billing.finalDate}</p>
              )}
            </div>
          </div>

          {/* 비용 상세 */}
          {orderDetail.billing.proformaIssued && (
            <div className="space-y-4">
              <h4 className="font-medium text-blue-900">비용 상세</h4>
              <div className="space-y-3">
                {[
                  { label: '기본 배송비', amount: orderDetail.billing.shippingFee },
                  { label: '현지 배송비', amount: orderDetail.billing.localDeliveryFee },
                  ...(orderDetail.billing.repackingFee > 0 ? [{ label: '리패킹 비용', amount: orderDetail.billing.repackingFee }] : []),
                  { label: '취급 수수료', amount: orderDetail.billing.handlingFee },
                  { label: '보험료', amount: orderDetail.billing.insuranceFee },
                  { label: '통관 수수료', amount: orderDetail.billing.customsFee }
                ].map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-700">{item.label}</span>
                    <span className="font-medium">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-700">TAX 7%</span>
                  <span className="font-medium">{formatCurrency(orderDetail.billing.tax)}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-lg">
                  <span className="font-bold text-blue-900 text-lg">총 결제금액</span>
                  <span className="font-bold text-blue-900 text-xl">{formatCurrency(orderDetail.billing.total)}</span>
                </div>
              </div>
            </div>
          )}

          {/* 결제 정보 */}
          <div className="space-y-4">
            <h4 className="font-medium text-blue-900">결제 정보</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">결제 방식</span>
                <Badge variant="outline">무통장 입금</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">결제 상태</span>
                <Badge variant={
                  orderDetail.billing.paymentStatus === 'completed' ? 'default' :
                  orderDetail.billing.paymentStatus === 'confirmed' ? 'default' :
                  orderDetail.billing.paymentStatus === 'pending' ? 'secondary' : 'outline'
                }>
                  {orderDetail.billing.paymentStatus === 'completed' ? '입금완료' :
                   orderDetail.billing.paymentStatus === 'confirmed' ? '입금확인' :
                   orderDetail.billing.paymentStatus === 'pending' ? '입금대기' : '미준비'}
                </Badge>
              </div>
              {orderDetail.billing.depositorName && (
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">입금자명</span>
                  <span className="font-medium">{orderDetail.billing.depositorName}</span>
                </div>
              )}
              {orderDetail.billing.paymentDate && (
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">입금일</span>
                  <span className="font-medium">{orderDetail.billing.paymentDate}</span>
                </div>
              )}
            </div>

            {/* 입금 대기 알림 */}
            {orderDetail.status === 'payment_pending' && orderDetail.billing.paymentStatus === 'pending' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    <div>
                      <p className="font-medium text-yellow-900">무통장 입금 대기 중</p>
                      <p className="text-sm text-yellow-700">
                        결제금액: {formatCurrency(orderDetail.billing.total)}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate('payment', { orderId: orderDetail.orderId })}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    입금하기
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 품목 정보 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <Package className="h-5 w-5" />
            품목 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50/50">
                  <TableHead className="text-blue-800">품목</TableHead>
                  <TableHead className="text-blue-800 text-center">수량</TableHead>
                  <TableHead className="text-blue-800 text-center">중량</TableHead>
                  <TableHead className="text-blue-800 text-center">크기(cm)</TableHead>
                  <TableHead className="text-blue-800 text-center">CBM</TableHead>
                  <TableHead className="text-blue-800 text-center">부피무게</TableHead>
                  {orderDetail.customerType === 'corporate' && (
                    <TableHead className="text-blue-800 text-right">단가</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetail.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        {orderDetail.customerType === 'corporate' && (
                          <p className="text-xs text-gray-500 mb-1 font-mono">{item.hscode}</p>
                        )}
                        <p className="font-medium">{item.description}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{item.quantity}개</TableCell>
                    <TableCell className="text-center">{item.weight}kg</TableCell>
                    <TableCell className="text-center">
                      {item.width}×{item.height}×{item.depth}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline" className="text-xs">
                        <Calculator className="h-3 w-3 mr-1" />
                        {item.cbm}m³
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {calculateVolumetricWeight(item).toFixed(2)}kg
                    </TableCell>
                    {orderDetail.customerType === 'corporate' && (
                      <TableCell className="text-right">{formatUSD(item.unitPrice)}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* 수취인 정보 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            수취인 정보
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-blue-700">수취인 이름</span>
              <span className="font-medium">{orderDetail.recipientName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">연락처</span>
              <span className="font-medium">{orderDetail.recipientPhone}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">우편번호</span>
              <span className="font-medium">{orderDetail.recipientPostalCode}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-blue-700">국가</span>
              <span className="font-medium">{getCountryName(orderDetail.country)}</span>
            </div>
          </div>
          <div>
            <p className="text-blue-700 mb-1">배송지 주소</p>
            <p className="font-medium bg-gray-50 p-3 rounded-lg">{orderDetail.recipientAddress}</p>
          </div>
        </CardContent>
      </Card>

      {/* 특별 요청사항 */}
      {orderDetail.specialRequests && (
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              특별 요청사항
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              {orderDetail.specialRequests}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 하단 버튼 */}
      <div className="flex gap-4 pb-20">
        <Button 
          variant="outline" 
          onClick={() => onNavigate('order-history')}
          className="flex-1 h-14"
        >
          주문내역으로
        </Button>
        {orderDetail.billing.proformaIssued && (
          <Button 
            variant="outline" 
            className="flex-1 h-14"
            onClick={() => window.print()}
          >
            <Download className="h-4 w-4 mr-2" />
            청구서 다운로드
          </Button>
        )}
        {/* 입금하기 버튼 추가 */}
        {orderDetail.status === 'payment_pending' && orderDetail.billing.paymentStatus === 'pending' && (
          <Button 
            onClick={() => onNavigate('payment', { orderId: orderDetail.orderId })}
            className="flex-1 h-14 bg-green-600 hover:bg-green-700"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            입금하기
          </Button>
        )}
      </div>
    </div>
  );
}