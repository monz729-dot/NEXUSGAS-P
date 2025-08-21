import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/tooltip';
import { Search, Package, Truck, CheckCircle, Clock, Eye, Filter, BarChart3, Info, Navigation, HelpCircle, AlertTriangle, FileText, CreditCard, Camera, Wrench } from 'lucide-react';
import { User } from '../types';

interface OrderHistoryProps {
  user: User | null;
  onNavigate: (page: string, options?: { orderId?: string }) => void;
}

interface OrderStatus {
  key: string;
  label: string;
  color: string;
  description: string;
}

export function OrderHistory({ user, onNavigate }: OrderHistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  if (!user) return null;

  // 주문 상태 정의 (새로운 플로우 반영)
  const orderStatuses: OrderStatus[] = [
    { key: 'received', label: '접수완료', color: 'bg-blue-100 text-blue-800', description: '우체국 송장번호 등록, 주문 생성됨' },
    { key: 'arrived', label: 'YCS창고도착', color: 'bg-green-100 text-green-800', description: '창고 도착, 무게 확인' },
    { key: 'repacking', label: '리패킹진행', color: 'bg-orange-100 text-orange-800', description: '리패킹 작업 및 사진 업로드' },
    { key: 'billing', label: '청구서발행', color: 'bg-purple-100 text-purple-800', description: '최종 비용 산정 및 청구서 발행' },
    { key: 'payment_pending', label: '입금대기', color: 'bg-yellow-100 text-yellow-800', description: '무통장 입금 대기 중' },
    { key: 'payment_confirmed', label: '입금확인', color: 'bg-indigo-100 text-indigo-800', description: '입금 확인 완료' },
    { key: 'shipping', label: '배송중', color: 'bg-cyan-100 text-cyan-800', description: '태국 현지 배송 진행' },
    { key: 'delivered', label: '배송완료', color: 'bg-emerald-100 text-emerald-800', description: '최종 배송 완료' }
  ];

  const orders = [
    {
      id: 'YCS-2024-001',
      orderNumber: 'YCS-240115-001',
      date: '2024-01-15',
      status: 'payment_pending',
      statusColor: 'bg-yellow-100 text-yellow-800',
      items: [
        { name: '빼빼로 초콜릿', quantity: 10, weight: 1.5, unitPrice: 25, cbm: 0.015 }
      ],
      shippingType: '해상',
      trackingNumber: 'EE123456789KR',
      destination: '태국 방콕',
      recipient: {
        name: '김수취',
        phone: '+66-123-456-789',
        address: '방콕시 중심가 123번지',
        postalCode: '10110'
      },
      warehouse: {
        arrivedDate: '2024-01-18',
        actualWeight: 1.8,
        repackingRequested: true,
        repackingCompleted: true,
        photos: ['arrival_photo.jpg', 'repacking_photo.jpg']
      },
      billing: {
        proformaIssued: true,
        finalIssued: false,
        localDeliveryFee: 25000,
        shippingFee: 85000,
        tax: 7700,
        total: 117700,
        paymentMethod: 'manual_deposit',
        paymentStatus: 'pending'
      }
    },
    {
      id: 'YCS-2024-002',
      orderNumber: 'YCS-240114-002',
      date: '2024-01-14',
      status: 'billing',
      statusColor: 'bg-purple-100 text-purple-800',
      items: [
        { name: '전자제품', quantity: 2, weight: 2.0, unitPrice: 1200, cbm: 0.032 },
        { name: '액세서리', quantity: 5, weight: 0.5, unitPrice: 300, cbm: 0.008 }
      ],
      shippingType: '항공',
      trackingNumber: 'EE987654321KR',
      destination: '태국 치앙마이',
      recipient: {
        name: '이수취',
        phone: '+66-987-654-321',
        address: '치앙마이시 올드타운 456번지',
        postalCode: '50200'
      },
      warehouse: {
        arrivedDate: '2024-01-16',
        actualWeight: 2.3,
        repackingRequested: false,
        repackingCompleted: false,
        photos: ['arrival_photo_2.jpg']
      },
      billing: {
        proformaIssued: true,
        finalIssued: false,
        localDeliveryFee: 30000,
        shippingFee: 125000,
        tax: 10850,
        total: 165850,
        paymentMethod: 'manual_deposit',
        paymentStatus: 'not_ready'
      }
    },
    {
      id: 'YCS-2024-003',
      orderNumber: 'YCS-240113-003',
      date: '2024-01-13',
      status: 'delivered',
      statusColor: 'bg-emerald-100 text-emerald-800',
      items: [
        { name: '건강식품', quantity: 1, weight: 1.0, unitPrice: 150, cbm: 0.012 }
      ],
      shippingType: '해상',
      trackingNumber: 'EE456789123KR',
      destination: '태국 파타야',
      recipient: {
        name: '박수취',
        phone: '+66-456-789-123',
        address: '파타야시 해변로 789번지',
        postalCode: '20150'
      },
      warehouse: {
        arrivedDate: '2024-01-15',
        actualWeight: 1.2,
        repackingRequested: false,
        repackingCompleted: false,
        photos: ['arrival_photo_3.jpg']
      },
      billing: {
        proformaIssued: true,
        finalIssued: true,
        localDeliveryFee: 20000,
        shippingFee: 75000,
        tax: 6650,
        total: 101650,
        paymentMethod: 'manual_deposit',
        paymentStatus: 'completed'
      }
    }
  ];

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusInfo = (status: string) => {
    return orderStatuses.find(s => s.key === status) || orderStatuses[0];
  };

  const OrderDetailModal = ({ order, onClose }: { order: any, onClose: () => void }) => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">주문 상세 정보</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-blue-600 cursor-help hover:text-blue-700 transition-colors" />
              </TooltipTrigger>
              <TooltipContent className="bg-blue-900 text-white border-l-4 border-l-blue-500">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-400" />
                    <span className="font-medium text-blue-400">상세 정보 모달</span>
                  </div>
                  <p className="text-sm">주문의 모든 정보를 확인할 수 있습니다</p>
                  <div className="text-xs bg-gray-700 p-2 rounded">
                    <p>품목, 배송, 창고, 청구서 정보 포함</p>
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>×</Button>
        </div>
        
        <div className="p-4 space-y-6">
          {/* 기본 정보 */}
          <div>
            <h4 className="font-medium mb-3">기본 정보</h4>
            <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded">
              <div>
                <p className="text-sm text-gray-600">주문번호</p>
                <p className="font-medium">{order.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">접수일</p>
                <p>{order.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">상태</p>
                <Badge className={order.statusColor}>{getStatusInfo(order.status).label}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600">송장번호</p>
                <p className="font-mono text-sm">{order.trackingNumber}</p>
              </div>
            </div>
          </div>

          {/* 품목 정보 */}
          <div>
            <h4 className="font-medium mb-3">품목 정보</h4>
            {order.items.map((item: any, index: number) => (
              <div key={index} className="p-3 bg-blue-50 rounded mb-2">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-2">
                      <div>수량: {item.quantity}개</div>
                      <div>중량: {item.weight}kg</div>
                      <div>단가: {item.unitPrice?.toLocaleString()} THB</div>
                      <div>CBM: {item.cbm} m³</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 창고 정보 */}
          {order.warehouse && (
            <div>
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                창고 정보
              </h4>
              <div className="p-3 bg-green-50 rounded space-y-2">
                {order.warehouse.arrivedDate && (
                  <div className="flex justify-between">
                    <span>창고 도착일:</span>
                    <span>{order.warehouse.arrivedDate}</span>
                  </div>
                )}
                {order.warehouse.actualWeight && (
                  <div className="flex justify-between">
                    <span>실제 무게:</span>
                    <span>{order.warehouse.actualWeight}kg</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>리패킹 신청:</span>
                  <span>{order.warehouse.repackingRequested ? '신청함' : '신청안함'}</span>
                </div>
                {order.warehouse.repackingRequested && (
                  <div className="flex justify-between">
                    <span>리패킹 완료:</span>
                    <Badge variant={order.warehouse.repackingCompleted ? "default" : "secondary"}>
                      {order.warehouse.repackingCompleted ? '완료' : '진행중'}
                    </Badge>
                  </div>
                )}
                {order.warehouse.photos && order.warehouse.photos.length > 0 && (
                  <div>
                    <span className="text-sm font-medium">사진:</span>
                    <div className="flex gap-1 mt-1">
                      {order.warehouse.photos.map((photo: string, i: number) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          <Camera className="h-3 w-3 mr-1" />
                          {photo.includes('arrival') ? '도착' : '리패킹'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 수취인 정보 */}
          <div>
            <h4 className="font-medium mb-3">수취인 정보</h4>
            <div className="p-3 bg-blue-50 rounded space-y-2">
              <div className="flex justify-between">
                <span>이름:</span>
                <span>{order.recipient.name}</span>
              </div>
              <div className="flex justify-between">
                <span>연락처:</span>
                <span>{order.recipient.phone}</span>
              </div>
              <div className="flex justify-between">
                <span>우편번호:</span>
                <span>{order.recipient.postalCode}</span>
              </div>
              <div>
                <span>주소:</span>
                <p className="text-sm mt-1">{order.recipient.address}</p>
              </div>
            </div>
          </div>

          {/* 청구서 정보 */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              청구서 정보
            </h4>
            <div className="p-3 bg-purple-50 rounded space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <span>Proforma 청구서:</span>
                  <Badge variant={order.billing.proformaIssued ? "default" : "secondary"}>
                    {order.billing.proformaIssued ? '발행완료' : '미발행'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span>Final 청구서:</span>
                  <Badge variant={order.billing.finalIssued ? "default" : "secondary"}>
                    {order.billing.finalIssued ? '발행완료' : '미발행'}
                  </Badge>
                </div>
              </div>

              {order.billing.total > 0 && (
                <div className="space-y-2 pt-2 border-t">
                  <div className="flex justify-between text-sm">
                    <span>배송비:</span>
                    <span>{order.billing.shippingFee.toLocaleString()} THB</span>
                  </div>
                  {order.billing.localDeliveryFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>현지 배송비:</span>
                      <span>{order.billing.localDeliveryFee.toLocaleString()} THB</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span>TAX 7%:</span>
                    <span>{order.billing.tax.toLocaleString()} THB</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>총 결제금액:</span>
                    <span className="text-lg">{order.billing.total.toLocaleString()} THB</span>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 pt-2">
                <span>결제 방식:</span>
                <Badge variant="outline">무통장 입금</Badge>
              </div>

              <div className="flex items-center gap-2">
                <span>결제 상태:</span>
                <Badge variant={
                  order.billing.paymentStatus === 'completed' ? 'default' :
                  order.billing.paymentStatus === 'pending' ? 'secondary' : 'outline'
                }>
                  {order.billing.paymentStatus === 'completed' ? '입금완료' :
                   order.billing.paymentStatus === 'pending' ? '입금대기' : '미준비'}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onNavigate('order-detail', { orderId: order.id });
              }}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              전체 상세보기
            </Button>
            {order.billing.proformaIssued && (
              <Button
                variant="outline"
                size="sm"
                className="flex-1 border-purple-200 text-purple-600 hover:bg-purple-50"
              >
                <FileText className="h-4 w-4 mr-2" />
                청구서 다운로드
              </Button>
            )}
            {/* 입금하기 버튼 추가 */}
            {order.status === 'payment_pending' && order.billing.paymentStatus === 'pending' && (
              <Button
                size="sm"
                onClick={() => {
                  onClose();
                  onNavigate('payment', { orderId: order.id });
                }}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                입금하기
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <TooltipProvider>
      <div className="p-4 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center gap-2">
          <h1 className="text-xl text-blue-900">주문 내역</h1>
          <Tooltip>
            <TooltipTrigger asChild>
              <BarChart3 className="h-4 w-4 text-orange-600 cursor-help hover:text-orange-700 transition-colors" />
            </TooltipTrigger>
            <TooltipContent className="bg-blue-900 text-white max-w-sm border-l-4 border-l-orange-500">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-orange-400" />
                  <span className="font-medium text-orange-400">주문 내역 관리</span>
                </div>
                <div className="text-sm space-y-2">
                  <p>새로운 워크플로우가 적용되었습니다:</p>
                  <div className="bg-gray-700 p-2 rounded text-xs space-y-1">
                    <p>• 접수완료 → YCS창고도착 → 리패킹진행</p>
                    <p>• 청구서발행 → 입금대기 → 입금확인</p>
                    <p>• 배송중 → 배송완료</p>
                    <p>• 무통장 입금만 지원</p>
                  </div>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* 검색 */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="주문번호 또는 품목명으로 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">검색</Button>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-900 text-white border-l-4 border-l-green-500">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-green-400" />
                      <span className="font-medium text-green-400">실시간 검색</span>
                    </div>
                    <p className="text-sm">입력과 동시에 목록이 필터링됩니다</p>
                    <div className="text-xs bg-gray-700 p-2 rounded">
                      <p>검색 대상: 주문번호, 품목명</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* 주문 현황 탭 */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              <div className="flex items-center gap-2">
                <span>전체</span>
                <Badge variant="secondary" className="text-xs">{orders.length}</Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="processing">
              <div className="flex items-center gap-2">
                <span>진행중</span>
                <Badge variant="secondary" className="text-xs">
                  {orders.filter(order => ['received', 'arrived', 'repacking', 'billing'].includes(order.status)).length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="payment">
              <div className="flex items-center gap-2">
                <span>결제</span>
                <Badge variant="secondary" className="text-xs">
                  {orders.filter(order => ['payment_pending', 'payment_confirmed'].includes(order.status)).length}
                </Badge>
              </div>
            </TabsTrigger>
            <TabsTrigger value="completed">
              <div className="flex items-center gap-2">
                <span>완료</span>
                <Badge variant="secondary" className="text-xs">
                  {orders.filter(order => ['delivered'].includes(order.status)).length}
                </Badge>
              </div>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{order.orderNumber}</span>
                        <Badge className={order.statusColor}>{getStatusInfo(order.status).label}</Badge>
                        {order.billing.proformaIssued && (
                          <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
                            <FileText className="h-3 w-3 mr-1" />
                            청구서
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.date} | {order.shippingType} | {order.trackingNumber}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      {order.warehouse?.photos && order.warehouse.photos.length > 0 && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline" className="text-xs">
                              <Camera className="h-3 w-3 mr-1" />
                              사진
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>창고 도착 및 리패킹 사진 있음</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>주문 상세정보 보기</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {order.items.map(item => `${item.name} (${item.quantity}개)`).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{order.destination}</span>
                    </div>
                  </div>

                  {/* 상태별 추가 정보 */}
                  {order.status === 'billing' && (
                    <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-purple-600" />
                        <p className="text-sm text-purple-800">
                          청구서가 발행되었습니다. 총 결제금액: {order.billing.total.toLocaleString()} THB
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === 'payment_pending' && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4 text-yellow-600" />
                          <p className="text-sm text-yellow-800">
                            무통장 입금 대기 중입니다. 결제금액: {order.billing.total.toLocaleString()} THB
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => onNavigate('payment', { orderId: order.id })}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CreditCard className="h-3 w-3 mr-1" />
                          입금하기
                        </Button>
                      </div>
                    </div>
                  )}

                  {order.status === 'repacking' && (
                    <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-orange-600" />
                        <p className="text-sm text-orange-800">
                          {order.warehouse.repackingRequested 
                            ? '리패킹 작업이 진행 중입니다.'
                            : '창고에서 상품을 검수 중입니다.'
                          }
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === 'shipping' && (
                    <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-blue-800">
                          태국 현지에서 배송이 진행 중입니다.
                        </p>
                      </div>
                    </div>
                  )}

                  {order.status === 'delivered' && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-green-800">
                          배송이 완료되었습니다. 최종 결제금액: {order.billing.total.toLocaleString()} THB
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* 기타 탭들 */}
          <TabsContent value="processing" className="space-y-4">
            {filteredOrders.filter(order => ['received', 'arrived', 'repacking', 'billing'].includes(order.status)).map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{order.orderNumber}</span>
                        <Badge className={order.statusColor}>{getStatusInfo(order.status).label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.date} | {order.shippingType}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {order.items.map(item => item.name).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{order.destination}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {getStatusInfo(order.status).description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            {filteredOrders.filter(order => ['payment_pending', 'payment_confirmed'].includes(order.status)).map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{order.orderNumber}</span>
                        <Badge className={order.statusColor}>{getStatusInfo(order.status).label}</Badge>
                        <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">
                          <FileText className="h-3 w-3 mr-1" />
                          청구서
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.date} | {order.shippingType}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-purple-800">
                        총 결제금액: {order.billing.total.toLocaleString()} THB
                      </span>
                      <div className="flex gap-2">
                        <Badge variant={order.billing.paymentStatus === 'completed' ? 'default' : 'secondary'}>
                          {order.billing.paymentStatus === 'completed' ? '입금완료' : '무통장입금'}
                        </Badge>
                        {order.status === 'payment_pending' && order.billing.paymentStatus === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => onNavigate('payment', { orderId: order.id })}
                            className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1"
                          >
                            입금하기
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {filteredOrders.filter(order => order.status === 'delivered').map((order) => (
              <Card key={order.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{order.orderNumber}</span>
                        <Badge className={order.statusColor}>{getStatusInfo(order.status).label}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {order.date} | {order.shippingType}
                      </p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedOrder(order)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {order.items.map(item => item.name).join(', ')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{order.destination}</span>
                    </div>
                  </div>

                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                      배송이 완료되었습니다. 최종 결제금액: {order.billing.total.toLocaleString()} THB
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {selectedOrder && (
          <OrderDetailModal 
            order={selectedOrder} 
            onClose={() => setSelectedOrder(null)} 
          />
        )}
      </div>
    </TooltipProvider>
  );
}