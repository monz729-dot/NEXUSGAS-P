import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  FileText,
  DollarSign,
  Users,
  BarChart3,
  Search,
  Filter
} from 'lucide-react';
import { User } from '../App';

interface AdminDashboardProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ user, onNavigate }: AdminDashboardProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 운송 의뢰 접수 대기 목록
  const pendingRequests = [
    {
      id: 'YCS-2024-004',
      customerName: '홍길동',
      customerType: '일반',
      submitDate: '2024-01-22',
      items: [
        { name: '전자제품', quantity: 1, weight: 2.5, dimensions: '30x20x10' }
      ],
      shippingType: '해상',
      destination: '태국 방콕',
      status: '접수대기',
      estimatedCost: 85000,
      repacking: true
    },
    {
      id: 'YCS-2024-005',
      customerName: '(주)ABC무역',
      customerType: '기업',
      submitDate: '2024-01-22',
      items: [
        { name: '의류', quantity: 50, weight: 25.0, dimensions: '40x30x20' },
        { name: '액세서리', quantity: 30, weight: 5.0, dimensions: '20x15x10' }
      ],
      shippingType: '항공',
      destination: '태국 치앙마이',
      status: '접수대기',
      estimatedCost: 450000,
      repacking: false
    }
  ];

  // 진행 중인 주문 목록
  const activeOrders = [
    {
      id: 'YCS-2024-001',
      customerName: '김철수',
      status: '입고완료',
      statusColor: 'bg-green-100 text-green-800',
      shippingType: '해상',
      trackingNumber: 'KR123456789',
      destination: '태국 방콕',
      estimatedDelivery: '2024-01-25',
      actualCost: 87500,
      paymentStatus: '결제완료'
    },
    {
      id: 'YCS-2024-002',
      customerName: '이영희',
      status: '배송중',
      statusColor: 'bg-blue-100 text-blue-800',
      shippingType: '항공',
      trackingNumber: 'KR987654321',
      destination: '태국 치앙마이',
      estimatedDelivery: '2024-01-24',
      actualCost: 125000,
      paymentStatus: '결제대기'
    }
  ];

  const stats = [
    {
      title: '접수 대기',
      value: pendingRequests.length,
      icon: <Clock className="h-5 w-5 text-orange-500" />,
      color: 'bg-orange-50'
    },
    {
      title: '진행 중',
      value: activeOrders.length,
      icon: <Truck className="h-5 w-5 text-blue-500" />,
      color: 'bg-blue-50'
    },
    {
      title: '결제 대기',
      value: activeOrders.filter(o => o.paymentStatus === '결제대기').length,
      icon: <DollarSign className="h-5 w-5 text-red-500" />,
      color: 'bg-red-50'
    },
    {
      title: '오늘 완료',
      value: 8,
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      color: 'bg-green-50'
    }
  ];

  const handleApproveRequest = (requestId: string) => {
    // 실제 앱에서는 API 호출
    alert(`주문 ${requestId}이 승인되었습니다. 송장번호가 생성되었습니다.`);
  };

  const handleRejectRequest = (requestId: string) => {
    // 실제 앱에서는 API 호출
    alert(`주문 ${requestId}이 반려되었습니다. 고객에게 알림이 전송됩니다.`);
  };

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    // 실제 앱에서는 API 호출
    alert(`주문 ${orderId}의 상태가 ${newStatus}로 업데이트되었습니다.`);
  };

  const generateInvoice = (orderId: string) => {
    // 실제 앱에서는 결제서 생성 API 호출
    alert(`주문 ${orderId}의 결제서가 생성되어 고객에게 발송되었습니다.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 space-y-6 pb-20">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">관리자 대시보드</h1>
          <p className="text-muted-foreground">운송 의뢰 접수 및 관리</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            통계
          </Button>
          <Button variant="outline" size="sm">
            <Users className="h-4 w-4 mr-2" />
            고객 관리
          </Button>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 메인 컨텐츠 */}
      <Tabs defaultValue="pending" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">접수 대기</TabsTrigger>
          <TabsTrigger value="active">진행 중</TabsTrigger>
          <TabsTrigger value="completed">완료</TabsTrigger>
        </TabsList>

        {/* 접수 대기 탭 */}
        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                운송 의뢰 접수 대기
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{request.id}</span>
                          <Badge variant="outline">{request.customerType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          고객: {request.customerName} | 접수일: {request.submitDate}
                        </p>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">
                        {request.status}
                      </Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <strong>배송 정보:</strong> {request.shippingType} | {request.destination}
                      </div>
                      <div className="text-sm">
                        <strong>품목:</strong>
                        {request.items.map((item, idx) => (
                          <span key={idx} className="ml-2">
                            {item.name} ({item.quantity}개, {item.weight}kg, {item.dimensions}cm)
                          </span>
                        ))}
                      </div>
                      <div className="text-sm">
                        <strong>예상 비용:</strong> {request.estimatedCost.toLocaleString()} THB
                      </div>
                      <div className="text-sm">
                        <strong>리패킹:</strong> {request.repacking ? '요청' : '미요청'}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => handleApproveRequest(request.id)}
                        className="flex-1"
                      >
                        승인
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1"
                      >
                        반려
                      </Button>
                      <Button variant="ghost" size="sm">
                        상세보기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 진행 중 탭 */}
        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-blue-500" />
                  진행 중인 주문
                </CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="주문번호 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-48"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">전체</SelectItem>
                      <SelectItem value="입고완료">입고완료</SelectItem>
                      <SelectItem value="배송중">배송중</SelectItem>
                      <SelectItem value="결제대기">결제대기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{order.id}</span>
                          <Badge className={order.statusColor}>
                            {order.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          고객: {order.customerName} | 송장: {order.trackingNumber}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {order.actualCost.toLocaleString()} THB
                        </p>
                        <Badge 
                          variant={order.paymentStatus === '결제완료' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {order.paymentStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="text-sm">
                        <strong>배송 정보:</strong> {order.shippingType} | {order.destination}
                      </div>
                      <div className="text-sm">
                        <strong>예상 도착:</strong> {order.estimatedDelivery}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Select 
                        defaultValue={order.status}
                        onValueChange={(value) => updateOrderStatus(order.id, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="입고완료">입고완료</SelectItem>
                          <SelectItem value="배송중">배송중</SelectItem>
                          <SelectItem value="배송완료">배송완료</SelectItem>
                          <SelectItem value="보류">보류</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {order.paymentStatus === '결제대기' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => generateInvoice(order.id)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          결제서 발송
                        </Button>
                      )}
                      
                      <Button variant="ghost" size="sm">
                        상세보기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 완료 탭 */}
        <TabsContent value="completed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                완료된 주문
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  오늘 완료된 주문 8건
                </p>
                <Button variant="outline" className="mt-4">
                  완료 내역 전체보기
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}