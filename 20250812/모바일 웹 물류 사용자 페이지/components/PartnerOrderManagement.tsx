import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Progress } from './ui/progress';
import { ArrowLeft, Package, QrCode, Camera, Upload, Search, Calendar as CalendarIcon, Eye, CheckCircle, XCircle, Clock, Truck, AlertCircle, X, Download, FileImage, MapPin, User as UserIcon, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

// User interface definition
interface User {
  id: string;
  type: 'general' | 'corporate' | 'partner' | 'admin';
  name: string;
  email: string;
  phone: string;
  companyName?: string;
  businessNumber?: string;
  contactPerson?: string;
  contactPhone?: string;
}

interface PartnerOrderManagementProps {
  user: User | null;
  onNavigate: (page: string) => void;
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
  unitPrice?: number;
}

interface OrderData {
  managementNumber: string;
  managementCode: string;
  orderId: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerType: 'general' | 'corporate';
  companyName?: string;
  shippingType: 'sea' | 'air';
  country: string;
  recipientName: string;
  recipientAddress: string;
  recipientPhone: string;
  boxCount: number;
  totalWeight: number;
  totalVolume: number;
  items: OrderItem[];
  orderDate: string;
  shippingDate?: string;
  isShipped: boolean;
  status: 'pending' | 'received' | 'processing' | 'ready' | 'shipped' | 'hold';
  photos: string[];
  notes?: string;
}

export function PartnerOrderManagement({ user, onNavigate }: PartnerOrderManagementProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'sea' | 'air'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);
  const [orderDetailDialog, setOrderDetailDialog] = useState(false);
  const [qrScanDialog, setQrScanDialog] = useState(false);
  const [photoUpload, setPhotoUpload] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const qrInputRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  // 데모 주문 데이터
  const [orders, setOrders] = useState<OrderData[]>([
    {
      managementNumber: 'YCS-2024120001',
      managementCode: 'MNG001',
      orderId: 'YCS-20241202001',
      customerId: 'KYP001',
      customerName: '김철수',
      customerEmail: 'kimcs@email.com',
      customerPhone: '010-1234-5678',
      customerType: 'general',
      shippingType: 'sea',
      country: 'thailand',
      recipientName: 'Somchai Jaidee',
      recipientAddress: '123 Sukhumvit Road, Watthana District, Bangkok',
      recipientPhone: '+66-81-234-5678',
      boxCount: 2,
      totalWeight: 3.5,
      totalVolume: 0.012,
      items: [
        {
          id: '1',
          hscode: '6203.42',
          description: '면제 남성용 바지',
          quantity: 5,
          weight: 2.5,
          width: 30,
          height: 20,
          depth: 5,
          unitPrice: 25.00
        },
        {
          id: '2',
          hscode: '8517.12',
          description: '휴대폰',
          quantity: 2,
          weight: 1.0,
          width: 15,
          height: 8,
          depth: 1,
          unitPrice: 300.00
        }
      ],
      orderDate: '2024-12-02',
      shippingDate: '2024-12-05',
      isShipped: false,
      status: 'received',
      photos: [],
      notes: ''
    },
    {
      managementNumber: 'YCS-2024120002',
      managementCode: 'MNG002',
      orderId: 'YCS-20241201003',
      customerId: 'KYC002',
      customerName: '박영희',
      customerEmail: 'park@company.com',
      customerPhone: '010-9876-5432',
      customerType: 'corporate',
      companyName: '(주)글로벌무역',
      shippingType: 'air',
      country: 'vietnam',
      recipientName: 'Nguyen Van A',
      recipientAddress: 'Ho Chi Minh City, Vietnam',
      recipientPhone: '+84-90-123-4567',
      boxCount: 1,
      totalWeight: 0.8,
      totalVolume: 0.005,
      items: [
        {
          id: '3',
          hscode: '3304.99',
          description: '화장품',
          quantity: 20,
          weight: 0.8,
          width: 10,
          height: 10,
          depth: 5,
          unitPrice: 15.00
        }
      ],
      orderDate: '2024-12-01',
      isShipped: true,
      status: 'shipped',
      photos: [],
      notes: '우선 처리 완료'
    },
    {
      managementNumber: 'YCS-2024120003',
      managementCode: 'MNG003',
      orderId: 'YCS-20241130005',
      customerId: 'KYP003',
      customerName: '이민수',
      customerEmail: 'lee@email.com',
      customerPhone: '010-5555-6666',
      customerType: 'general',
      shippingType: 'sea',
      country: 'philippines',
      recipientName: 'Maria Santos',
      recipientAddress: 'Manila, Philippines',
      recipientPhone: '+63-917-123-4567',
      boxCount: 3,
      totalWeight: 5.2,
      totalVolume: 0.025,
      items: [
        {
          id: '4',
          hscode: '9503.00',
          description: '장난감',
          quantity: 15,
          weight: 5.2,
          width: 25,
          height: 15,
          depth: 10
        }
      ],
      orderDate: '2024-11-30',
      isShipped: false,
      status: 'hold',
      photos: [],
      notes: '통관 서류 확인 중'
    }
  ]);

  // 필터된 주문 목록
  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.shippingType === activeTab;
    const matchesSearch = searchTerm === '' || 
      order.managementNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.managementCode.toLowerCase().includes(searchTerm.toLowerCase());
    
    const orderDate = new Date(order.orderDate);
    const matchesDateFrom = !dateFrom || orderDate >= dateFrom;
    const matchesDateTo = !dateTo || orderDate <= dateTo;
    
    return matchesTab && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">접수 대기</Badge>;
      case 'received':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">입고 완료</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">처리 중</Badge>;
      case 'ready':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">출고 준비</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">출고 완료</Badge>;
      case 'hold':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">출고 보류</Badge>;
      default:
        return <Badge variant="outline">알 수 없음</Badge>;
    }
  };

  const getShippingTypeBadge = (type: string) => {
    return type === 'air' ? 
      <Badge className="bg-sky-100 text-sky-700 border-sky-200">항공</Badge> :
      <Badge className="bg-blue-100 text-blue-700 border-blue-200">해상</Badge>;
  };

  const getCountryName = (country: string) => {
    switch (country) {
      case 'thailand': return '태국';
      case 'vietnam': return '베트남';
      case 'philippines': return '필리핀';
      case 'indonesia': return '인도네시아';
      default: return country;
    }
  };

  const handleOrderClick = (order: OrderData) => {
    setSelectedOrder(order);
    setOrderDetailDialog(true);
  };

  const handleQRScan = () => {
    // QR 코드 스캔 시뮬레이션
    const qrValue = qrInputRef.current?.value;
    if (qrValue) {
      const foundOrder = orders.find(order => 
        order.managementNumber === qrValue || 
        order.managementCode === qrValue ||
        order.orderId === qrValue
      );
      
      if (foundOrder) {
        setSelectedOrder(foundOrder);
        setQrScanDialog(false);
        setOrderDetailDialog(true);
        setSuccess('QR 코드 스캔 성공!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('해당하는 주문을 찾을 수 없습니다.');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setPhotoUpload(prev => [...prev, ...files]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotoUpload(prev => prev.filter((_, i) => i !== index));
  };

  const handleSavePhotos = async () => {
    if (!selectedOrder || photoUpload.length === 0) return;
    
    setIsUploading(true);
    
    // 사진 업로드 시뮬레이션
    setTimeout(() => {
      const photoUrls = photoUpload.map((_, index) => `photo_${Date.now()}_${index}.jpg`);
      
      setOrders(prev => prev.map(order => 
        order.managementNumber === selectedOrder.managementNumber
          ? { ...order, photos: [...order.photos, ...photoUrls] }
          : order
      ));
      
      setSelectedOrder(prev => prev ? { ...prev, photos: [...prev.photos, ...photoUrls] } : null);
      setPhotoUpload([]);
      setIsUploading(false);
      setSuccess('사진이 성공적으로 업로드되었습니다.');
      setTimeout(() => setSuccess(''), 3000);
    }, 2000);
  };

  const handleStatusChange = (newStatus: string) => {
    if (!selectedOrder) return;
    
    setOrders(prev => prev.map(order => 
      order.managementNumber === selectedOrder.managementNumber
        ? { ...order, status: newStatus as any }
        : order
    ));
    
    setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
    setSuccess('상태가 업데이트되었습니다.');
    setTimeout(() => setSuccess(''), 3000);
  };

  const calculateVolumetricWeight = (item: OrderItem) => {
    return (item.width * item.height * item.depth) / 6000;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 space-y-6">
      {/* 성공/에러 메시지 */}
      {(success || error) && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
          <div className={`px-4 py-2 rounded-lg shadow-lg ${success ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'}`}>
            {success || error}
          </div>
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('partner-dashboard')}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          대시보드로
        </Button>
        <div className="flex-1">
          <h1 className="text-xl text-blue-900">주문서 관리</h1>
          <p className="text-sm text-blue-600">입출고 관리 및 상태 업데이트</p>
        </div>
        <Button
          onClick={() => setQrScanDialog(true)}
          className="bg-gradient-primary text-white hover:opacity-90 transition-opacity"
        >
          <QrCode className="h-4 w-4 mr-2" />
          QR 스캔
        </Button>
      </div>

      {/* 필터 및 검색 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">필터 및 검색</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 탭 메뉴 */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="sea">해상</TabsTrigger>
              <TabsTrigger value="air">항공</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* 검색 및 날짜 필터 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>검색</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="관리번호, 고객명, 관리코드..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>시작 날짜</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFrom ? format(dateFrom, 'yyyy-MM-dd', { locale: ko }) : '선택하세요'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateFrom}
                    onSelect={setDateFrom}
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <Label>종료 날짜</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateTo ? format(dateTo, 'yyyy-MM-dd', { locale: ko }) : '선택하세요'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateTo}
                    onSelect={setDateTo}
                    locale={ko}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주문 목록 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">
            주문 목록 ({filteredOrders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-50/50">
                  <TableHead className="text-blue-800">관리번호</TableHead>
                  <TableHead className="text-blue-800">관리코드</TableHead>
                  <TableHead className="text-blue-800">박스정보</TableHead>
                  <TableHead className="text-blue-800">내품정보</TableHead>
                  <TableHead className="text-blue-800">고객정보</TableHead>
                  <TableHead className="text-blue-800">출고일자</TableHead>
                  <TableHead className="text-blue-800">상태</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.managementNumber} className="hover:bg-blue-50/30">
                    <TableCell>
                      <button
                        onClick={() => handleOrderClick(order)}
                        className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                      >
                        {order.managementNumber}
                      </button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{order.managementCode}</span>
                        {getShippingTypeBadge(order.shippingType)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{order.boxCount}박스</p>
                        <p className="text-gray-500">{order.totalWeight}kg</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{order.items.length}종류</p>
                        <p className="text-gray-500">{getCountryName(order.country)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-gray-500">{order.customerId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {order.shippingDate ? order.shippingDate : '-'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">조건에 맞는 주문이 없습니다.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR 스캔 다이얼로그 */}
      <Dialog open={qrScanDialog} onOpenChange={setQrScanDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>QR 코드 스캔</DialogTitle>
            <DialogDescription>
              박스의 QR 코드를 스캔하거나 직접 입력하세요.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="text-center p-8 border-2 border-dashed border-blue-200 rounded-lg bg-blue-50/30">
              <QrCode className="h-16 w-16 text-blue-400 mx-auto mb-4" />
              <p className="text-blue-600">QR 코드를 여기에 스캔하세요</p>
            </div>
            
            <div className="space-y-2">
              <Label>또는 직접 입력</Label>
              <Input
                ref={qrInputRef}
                placeholder="관리번호, 관리코드, 주문번호..."
                className="h-12"
              />
            </div>
            
            <Button onClick={handleQRScan} className="w-full h-12">
              확인
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 주문 상세 다이얼로그 */}
      <Dialog open={orderDetailDialog} onOpenChange={setOrderDetailDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              주문 상세 정보
            </DialogTitle>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">주문 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-blue-700">관리번호:</span>
                      <span className="font-medium font-mono">{selectedOrder.managementNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">관리코드:</span>
                      <span className="font-medium font-mono">{selectedOrder.managementCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">주문번호:</span>
                      <span className="font-medium font-mono">{selectedOrder.orderId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">배송유형:</span>
                      {getShippingTypeBadge(selectedOrder.shippingType)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">주문일자:</span>
                      <span className="font-medium">{selectedOrder.orderDate}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-blue-900">고객 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <UserIcon className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium">{selectedOrder.customerName}</p>
                        <p className="text-sm text-gray-500">{selectedOrder.customerId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{selectedOrder.customerEmail}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{selectedOrder.customerPhone}</span>
                    </div>
                    {selectedOrder.companyName && (
                      <div className="flex items-center gap-3">
                        <Package className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{selectedOrder.companyName}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* 수취인 정보 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    수취인 정보
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-blue-700 mb-1">수취인 이름</p>
                      <p className="font-medium">{selectedOrder.recipientName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 mb-1">연락처</p>
                      <p className="font-medium">{selectedOrder.recipientPhone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-blue-700 mb-1">배송지 주소</p>
                      <p className="font-medium">{selectedOrder.recipientAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 상품 목록 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">상품 목록</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-blue-50/50">
                          <TableHead className="text-blue-800">품목</TableHead>
                          <TableHead className="text-blue-800 text-center">수량</TableHead>
                          <TableHead className="text-blue-800 text-center">중량</TableHead>
                          <TableHead className="text-blue-800 text-center">크기</TableHead>
                          <TableHead className="text-blue-800 text-center">부피무게</TableHead>
                          {selectedOrder.customerType === 'corporate' && (
                            <TableHead className="text-blue-800 text-right">단가</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedOrder.items.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div>
                                {selectedOrder.customerType === 'corporate' && (
                                  <p className="text-xs text-gray-500 mb-1">{item.hscode}</p>
                                )}
                                <p className="font-medium">{item.description}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-center">{item.quantity}</TableCell>
                            <TableCell className="text-center">{item.weight}kg</TableCell>
                            <TableCell className="text-center">
                              {item.width}×{item.height}×{item.depth}cm
                            </TableCell>
                            <TableCell className="text-center">
                              {calculateVolumetricWeight(item).toFixed(2)}kg
                            </TableCell>
                            {selectedOrder.customerType === 'corporate' && (
                              <TableCell className="text-right">${item.unitPrice?.toFixed(2)}</TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>

              {/* 상태 관리 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">상태 관리</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-blue-700">현재 상태:</span>
                    {getStatusBadge(selectedOrder.status)}
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange('received')}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      입고 완료
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange('processing')}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      처리 중
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange('ready')}
                      className="border-green-200 text-green-600 hover:bg-green-50"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      출고 준비
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange('shipped')}
                      className="border-purple-200 text-purple-600 hover:bg-purple-50"
                    >
                      <Truck className="h-4 w-4 mr-2" />
                      출고 완료
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleStatusChange('hold')}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      출고 보류
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 내품 정보 확인 촬영 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">내품 정보 확인</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* 기존 사진들 */}
                  {selectedOrder.photos.length > 0 && (
                    <div>
                      <h4 className="font-medium text-blue-800 mb-3">업로드된 사진</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {selectedOrder.photos.map((photo, index) => (
                          <div key={index} className="relative aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <FileImage className="h-8 w-8 text-gray-400" />
                            <span className="absolute bottom-1 left-1 text-xs text-gray-500 bg-white px-1 rounded">
                              사진 {index + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 새 사진 업로드 */}
                  <div>
                    <h4 className="font-medium text-blue-800 mb-3">새 사진 촬영/업로드</h4>
                    <div className="space-y-3">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                          <Camera className="h-4 w-4 mr-2" />
                          사진 촬영
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          className="border-green-200 text-green-600 hover:bg-green-50"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          파일 선택
                        </Button>
                      </div>
                      
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        capture="environment"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />

                      {/* 업로드 예정 사진 미리보기 */}
                      {photoUpload.length > 0 && (
                        <div>
                          <h5 className="font-medium text-gray-700 mb-2">업로드 예정 사진</h5>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {photoUpload.map((file, index) => (
                              <div key={index} className="relative aspect-square bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`업로드 예정 ${index + 1}`}
                                  className="w-full h-full object-cover rounded-lg"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePhoto(index)}
                                  className="absolute top-1 right-1 h-6 w-6 p-0 bg-red-500 text-white hover:bg-red-600"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                          
                          <Button
                            onClick={handleSavePhotos}
                            disabled={isUploading}
                            className="w-full mt-3 bg-blue-600 text-white hover:bg-blue-700"
                          >
                            {isUploading ? (
                              <div className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                업로드 중...
                              </div>
                            ) : (
                              '사진 저장'
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 메모 */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-blue-900">메모</CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={selectedOrder.notes || ''}
                    onChange={(e) => {
                      const updatedOrder = { ...selectedOrder, notes: e.target.value };
                      setSelectedOrder(updatedOrder);
                      setOrders(prev => prev.map(order => 
                        order.managementNumber === selectedOrder.managementNumber
                          ? updatedOrder
                          : order
                      ));
                    }}
                    placeholder="처리 관련 메모를 입력하세요..."
                    className="min-h-20"
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* 하단 여백 */}
      <div className="pb-20" />
    </div>
  );
}