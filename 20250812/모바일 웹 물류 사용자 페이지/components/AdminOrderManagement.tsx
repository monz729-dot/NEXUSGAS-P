import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  ArrowLeft,
  Package,
  QrCode,
  ClipboardList,
  Search,
  CheckCircle,
  Clock,
  AlertTriangle,
  Camera,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Truck,
  Box,
  ShoppingBag,
  Eye,
  Check,
  X,
  Building,
  FileText,
  Upload,
  Plus,
  Minus,
  Save,
  Send
} from 'lucide-react';
import { User as UserType } from '../App';

interface AdminOrderManagementProps {
  user: UserType | null;
  onNavigate: (page: string) => void;
}

export function AdminOrderManagement({ user, onNavigate }: AdminOrderManagementProps) {
  const [activeTab, setActiveTab] = useState('inventory');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [qrInput, setQrInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // 입고 확인용 상태
  const [inventoryItems] = useState([
    {
      id: 'INV-001',
      orderNumber: 'ORD-2024-001',
      customerName: '김철수',
      productName: '노트북 컴퓨터',
      quantity: 2,
      status: 'pending',
      arrivalDate: '2024-01-15',
      location: 'A-01-15'
    },
    {
      id: 'INV-002',
      orderNumber: 'ORD-2024-002',
      customerName: '이영희',
      productName: '무선 이어폰',
      quantity: 5,
      status: 'confirmed',
      arrivalDate: '2024-01-14',
      location: 'B-02-08'
    },
    {
      id: 'INV-003',
      orderNumber: 'ORD-2024-003',
      customerName: '박민수',
      productName: '스마트폰 케이스',
      quantity: 10,
      status: 'pending',
      arrivalDate: '2024-01-16',
      location: 'C-03-22'
    }
  ]);

  // 새로운 입고 접수용 상태
  const [receiveForm, setReceiveForm] = useState({
    // 고객 정보
    customerType: 'individual', // individual, corporate
    customerId: 'CUST-' + Date.now().toString().slice(-6),
    email: '',
    phone: '',
    companyName: '',
    businessNumber: '',
    contactName: '',
    contactPhone: '',
    
    // 품목 정보
    repacking: 'no',
    selectedProducts: [],
    country: '',
    postalCode: '',
    volume: '',
    weight: '',
    
    // 수취인 정보
    recipientName: '',
    recipientPostalCode: '',
    recipientAddress: '',
    recipientPhone: '',
    deliveryMethod: '',
    courierCompany: '',
    trackingNumber: '',
    processor: '',
    requirements: '',
    photoFiles: []
  });

  // QR 코드 확인용 고객 데이터 (모의)
  const [customerInfo, setCustomerInfo] = useState(null as any);

  // 품목 조회 모달
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productSearchQuery, setProductSearchQuery] = useState('');

  // 모의 품목 데이터
  const [availableProducts] = useState([
    { id: 'PROD-001', name: '노트북 컴퓨터', category: '전자제품', weight: '2.5kg', volume: '0.02㎥', origin: '한국' },
    { id: 'PROD-002', name: '무선 이어폰', category: '전자제품', weight: '0.2kg', volume: '0.001㎥', origin: '중국' },
    { id: 'PROD-003', name: '스마트폰 케이스', category: '액세서리', weight: '0.1kg', volume: '0.0005㎥', origin: '베트남' },
    { id: 'PROD-004', name: '블루투스 스피커', category: '전자제품', weight: '1.2kg', volume: '0.005㎥', origin: '한국' },
    { id: 'PROD-005', name: '캐리어 가방', category: '생활용품', weight: '3.5kg', volume: '0.08㎥', origin: '중국' }
  ]);

  const qrInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 입고 상태 변경
  const handleInventoryStatusChange = (itemId: string, newStatus: 'confirmed' | 'rejected') => {
    setIsLoading(true);
    setMessage('');
    
    setTimeout(() => {
      setMessage(`입고 상태가 ${newStatus === 'confirmed' ? '확인됨' : '거부됨'}으로 변경되었습니다.`);
      setIsLoading(false);
    }, 1000);
  };

  // 고객 정보 조회
  const handleCustomerSearch = () => {
    setIsLoading(true);
    setMessage('');
    
    // 모의 고객 데이터
    const mockCustomers = {
      'CUST-123456': {
        type: 'corporate',
        email: 'company@example.com',
        phone: '02-1234-5678',
        companyName: '(주)테스트기업',
        businessNumber: '123-45-67890',
        contactName: '김담당',
        contactPhone: '010-1234-5678'
      },
      'CUST-789012': {
        type: 'individual',
        email: 'individual@example.com',
        phone: '010-9876-5432',
        companyName: '',
        businessNumber: '',
        contactName: '이개인',
        contactPhone: '010-9876-5432'
      }
    };

    setTimeout(() => {
      const customer = mockCustomers[receiveForm.customerId as keyof typeof mockCustomers];
      if (customer) {
        setReceiveForm(prev => ({
          ...prev,
          customerType: customer.type,
          email: customer.email,
          phone: customer.phone,
          companyName: customer.companyName,
          businessNumber: customer.businessNumber,
          contactName: customer.contactName,
          contactPhone: customer.contactPhone
        }));
        setMessage('고객 정보를 성공적으로 조회했습니다.');
      } else {
        setMessage('해당 고객 ID로 등록된 정보를 찾을 수 없습니다.');
      }
      setIsLoading(false);
    }, 1000);
  };

  // 품목 추가
  const handleProductAdd = (product: any) => {
    setReceiveForm(prev => ({
      ...prev,
      selectedProducts: [...prev.selectedProducts, { ...product, quantity: 1 }]
    }));
    setIsProductModalOpen(false);
    setMessage(`${product.name}이(가) 추가되었습니다.`);
  };

  // 품목 제거
  const handleProductRemove = (productId: string) => {
    setReceiveForm(prev => ({
      ...prev,
      selectedProducts: prev.selectedProducts.filter((p: any) => p.id !== productId)
    }));
  };

  // 파일 업로드
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setReceiveForm(prev => ({
      ...prev,
      photoFiles: [...prev.photoFiles, ...files]
    }));
    setMessage(`${files.length}개 파일이 업로드되었습니다.`);
  };

  // 저장/접수 완료 처리
  const handleSubmit = (type: 'save' | 'complete') => {
    setIsLoading(true);
    setMessage('');

    // 유효성 검사
    if (!receiveForm.email || !receiveForm.phone) {
      setMessage('필수 고객 정보를 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (receiveForm.selectedProducts.length === 0) {
      setMessage('최소 1개 이상의 품목을 선택해주세요.');
      setIsLoading(false);
      return;
    }

    if (!receiveForm.recipientName || !receiveForm.recipientAddress) {
      setMessage('수취인 정보를 모두 입력해주세요.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      if (type === 'save') {
        setMessage('입고 정보가 임시 저장되었습니다.');
      } else {
        setMessage('입고 접수가 완료되었습니다.');
        // 폼 초기화
        setReceiveForm({
          customerType: 'individual',
          customerId: 'CUST-' + Date.now().toString().slice(-6),
          email: '',
          phone: '',
          companyName: '',
          businessNumber: '',
          contactName: '',
          contactPhone: '',
          repacking: 'no',
          selectedProducts: [],
          country: '',
          postalCode: '',
          volume: '',
          weight: '',
          recipientName: '',
          recipientPostalCode: '',
          recipientAddress: '',
          recipientPhone: '',
          deliveryMethod: '',
          courierCompany: '',
          trackingNumber: '',
          processor: '',
          requirements: '',
          photoFiles: []
        });
      }
      setIsLoading(false);
    }, 1500);
  };

  // QR 코드 조회
  const handleQRCheck = () => {
    if (!qrInput.trim()) {
      setMessage('QR 코드를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setMessage('');

    // 모의 QR 코드 데이터
    const mockCustomerData = {
      'QR001': {
        id: 'CUST-001',
        name: '김철수',
        phone: '010-1234-5678',
        email: 'kim@example.com',
        address: '서울시 강남구 테헤란로 123',
        orderHistory: [
          { orderNumber: 'ORD-2024-001', productName: '노트북 컴퓨터', status: '배송완료', date: '2024-01-10' },
          { orderNumber: 'ORD-2024-015', productName: '무선마우스', status: '처리중', date: '2024-01-14' }
        ],
        memberSince: '2023-03-15',
        totalOrders: 15,
        membershipLevel: 'VIP'
      },
      'QR002': {
        id: 'CUST-002',
        name: '이영희',
        phone: '010-9876-5432',
        email: 'lee@example.com',
        address: '서울시 서초구 강남대로 456',
        orderHistory: [
          { orderNumber: 'ORD-2024-002', productName: '무선 이어폰', status: '배송중', date: '2024-01-12' }
        ],
        memberSince: '2023-08-20',
        totalOrders: 8,
        membershipLevel: '일반'
      }
    };

    setTimeout(() => {
      const customer = mockCustomerData[qrInput as keyof typeof mockCustomerData];
      if (customer) {
        setCustomerInfo(customer);
        setMessage('고객 정보를 성공적으로 조회했습니다.');
      } else {
        setMessage('해당 QR 코드로 등록된 고객 정보를 찾을 수 없습니다.');
        setCustomerInfo(null);
      }
      setIsLoading(false);
    }, 1000);
  };

  // 상태에 따른 배지 색상
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-50 text-green-700 border-green-200">확인됨</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">대기중</Badge>;
      case 'rejected':
        return <Badge className="bg-red-50 text-red-700 border-red-200">거부됨</Badge>;
      case '배송완료':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">배송완료</Badge>;
      case '배송중':
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">배송중</Badge>;
      case '처리중':
        return <Badge className="bg-orange-50 text-orange-700 border-orange-200">처리중</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="p-2 text-blue-600/60 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all opacity-60 hover:opacity-100"
              aria-label="관리자 대시보드로 돌아가기"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-blue">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-blue-900">주문 관리</h1>
              <p className="text-xs text-blue-600">관리자 | {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              온라인
            </Badge>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-6xl mx-auto">
        {/* 메시지 표시 */}
        {message && (
          <Alert className={`mb-6 animate-scale-in ${
            message.includes('성공') ? 'bg-green-50 border-green-200' : 
            message.includes('오류') || message.includes('찾을 수 없습니다') ? 'bg-red-50 border-red-200' : 
            'bg-blue-50 border-blue-200'
          }`}>
            <AlertDescription className={
              message.includes('성공') ? 'text-green-700' : 
              message.includes('오류') || message.includes('찾을 수 없습니다') ? 'text-red-700' : 
              'text-blue-700'
            }>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-blue-50/50">
            <TabsTrigger value="inventory" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <Package className="h-4 w-4" />
              <span className="hidden sm:inline">입고 확인</span>
            </TabsTrigger>
            <TabsTrigger value="receive" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <ClipboardList className="h-4 w-4" />
              <span className="hidden sm:inline">입고 접수</span>
            </TabsTrigger>
            <TabsTrigger value="qr-check" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR 조회</span>
            </TabsTrigger>
          </TabsList>

          {/* 입고 확인 탭 */}
          <TabsContent value="inventory">
            <Card className="shadow-blue border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Package className="h-5 w-5" />
                  입고 확인 관리
                </CardTitle>
                <CardDescription>상품 입고 상태를 확인하고 처리합니다</CardDescription>
              </CardHeader>
              <CardContent>
                {/* 검색 */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600/60 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="주문번호 또는 고객명으로 검색..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                    />
                  </div>
                </div>

                {/* 입고 목록 */}
                <div className="space-y-4">
                  {inventoryItems
                    .filter(item => 
                      searchQuery === '' || 
                      item.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      item.customerName.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((item) => (
                    <div key={item.id} className="border border-blue-200 rounded-lg p-4 bg-blue-50/30 hover:bg-blue-50/50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <button
                              onClick={() => onNavigate('admin-order-detail', { orderId: item.orderNumber })}
                              className="font-medium text-blue-900 hover:text-blue-700 hover:underline transition-colors"
                            >
                              {item.orderNumber}
                            </button>
                            {getStatusBadge(item.status)}
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm text-blue-600">
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{item.customerName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Box className="h-4 w-4" />
                              <span>{item.productName}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ShoppingBag className="h-4 w-4" />
                              <span>수량: {item.quantity}개</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>입고일: {item.arrivalDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>위치: {item.location}</span>
                            </div>
                          </div>
                        </div>
                        {item.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleInventoryStatusChange(item.id, 'confirmed')}
                              disabled={isLoading}
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              <Check className="h-4 w-4 mr-1" />
                              확인
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleInventoryStatusChange(item.id, 'rejected')}
                              disabled={isLoading}
                              className="border-red-300 text-red-600 hover:bg-red-50"
                            >
                              <X className="h-4 w-4 mr-1" />
                              거부
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 입고 접수 탭 */}
          <TabsContent value="receive">
            <div className="space-y-6">
              {/* 고객 정보 섹션 */}
              <Card className="shadow-blue border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <User className="h-5 w-5" />
                    고객 정보
                  </CardTitle>
                  <CardDescription>입고를 요청한 고객의 정보를 입력합니다</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 고객 유형 */}
                  <div className="space-y-3">
                    <Label className="text-blue-900">고객 유형 *</Label>
                    <RadioGroup
                      value={receiveForm.customerType}
                      onValueChange={(value) => setReceiveForm(prev => ({ ...prev, customerType: value }))}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="individual" id="individual" />
                        <Label htmlFor="individual">개인</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="corporate" id="corporate" />
                        <Label htmlFor="corporate">기업</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 고객 ID */}
                    <div className="space-y-3">
                      <Label htmlFor="customerId" className="text-blue-900">고객 ID *</Label>
                      <div className="flex gap-2">
                        <Input
                          id="customerId"
                          type="text"
                          value={receiveForm.customerId}
                          onChange={(e) => setReceiveForm(prev => ({ ...prev, customerId: e.target.value }))}
                          placeholder="자동 생성된 ID"
                          className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                        />
                        <Button
                          type="button"
                          onClick={handleCustomerSearch}
                          disabled={isLoading}
                          className="h-12 px-4 bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500"
                        >
                          <Search className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* 이메일 */}
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-blue-900">이메일 *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={receiveForm.email}
                        onChange={(e) => setReceiveForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="이메일 주소"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                        required
                      />
                    </div>

                    {/* 연락처 */}
                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-blue-900">연락처 *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={receiveForm.phone}
                        onChange={(e) => setReceiveForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="010-1234-5678"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                        required
                      />
                    </div>

                    {/* 기업 정보 (기업 선택 시만 표시) */}
                    {receiveForm.customerType === 'corporate' && (
                      <>
                        <div className="space-y-3">
                          <Label htmlFor="companyName" className="text-blue-900">회사명 *</Label>
                          <Input
                            id="companyName"
                            type="text"
                            value={receiveForm.companyName}
                            onChange={(e) => setReceiveForm(prev => ({ ...prev, companyName: e.target.value }))}
                            placeholder="회사명"
                            className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="businessNumber" className="text-blue-900">사업자등록번호 *</Label>
                          <Input
                            id="businessNumber"
                            type="text"
                            value={receiveForm.businessNumber}
                            onChange={(e) => setReceiveForm(prev => ({ ...prev, businessNumber: e.target.value }))}
                            placeholder="123-45-67890"
                            className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="contactName" className="text-blue-900">담당자명 *</Label>
                          <Input
                            id="contactName"
                            type="text"
                            value={receiveForm.contactName}
                            onChange={(e) => setReceiveForm(prev => ({ ...prev, contactName: e.target.value }))}
                            placeholder="담당자 이름"
                            className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                          />
                        </div>

                        <div className="space-y-3">
                          <Label htmlFor="contactPhone" className="text-blue-900">담당자 연락처 *</Label>
                          <Input
                            id="contactPhone"
                            type="tel"
                            value={receiveForm.contactPhone}
                            onChange={(e) => setReceiveForm(prev => ({ ...prev, contactPhone: e.target.value }))}
                            placeholder="010-1234-5678"
                            className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 품목 선택 섹션 */}
              <Card className="shadow-blue border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Box className="h-5 w-5" />
                    품목 선택
                  </CardTitle>
                  <CardDescription>입고할 상품의 정보를 입력합니다</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* 리패킹 여부 */}
                  <div className="space-y-3">
                    <Label className="text-blue-900">리패킹 여부 *</Label>
                    <RadioGroup
                      value={receiveForm.repacking}
                      onValueChange={(value) => setReceiveForm(prev => ({ ...prev, repacking: value }))}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="no-repacking" />
                        <Label htmlFor="no-repacking">아니오</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="yes-repacking" />
                        <Label htmlFor="yes-repacking">예</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* 품목 조회 및 선택 */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-blue-900">선택된 품목</Label>
                      <Dialog open={isProductModalOpen} onOpenChange={setIsProductModalOpen}>
                        <DialogTrigger asChild>
                          <Button
                            type="button"
                            className="bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            품목 조회
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>품목 조회</DialogTitle>
                            <DialogDescription>추가할 품목을 선택하세요</DialogDescription>
                          </DialogHeader>
                          
                          <div className="space-y-4">
                            <div className="relative">
                              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-600/60 h-4 w-4" />
                              <Input
                                type="text"
                                placeholder="품목명으로 검색..."
                                value={productSearchQuery}
                                onChange={(e) => setProductSearchQuery(e.target.value)}
                                className="pl-10 h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                              />
                            </div>
                            
                            <div className="max-h-60 overflow-y-auto space-y-2">
                              {availableProducts
                                .filter(product => 
                                  productSearchQuery === '' || 
                                  product.name.toLowerCase().includes(productSearchQuery.toLowerCase())
                                )
                                .map((product) => (
                                <div
                                  key={product.id}
                                  className="p-3 border border-blue-200 rounded-lg hover:bg-blue-50/50 cursor-pointer transition-colors"
                                  onClick={() => handleProductAdd(product)}
                                >
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h4 className="font-medium text-blue-900">{product.name}</h4>
                                      <p className="text-sm text-blue-600">{product.category} | {product.origin}</p>
                                    </div>
                                    <div className="text-right text-sm text-blue-600">
                                      <div>{product.weight}</div>
                                      <div>{product.volume}</div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    {/* 선택된 품목 목록 */}
                    {receiveForm.selectedProducts.length > 0 && (
                      <div className="space-y-2">
                        {receiveForm.selectedProducts.map((product: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-blue-50/30 border border-blue-200 rounded-lg">
                            <div className="flex-1">
                              <h4 className="font-medium text-blue-900">{product.name}</h4>
                              <p className="text-sm text-blue-600">{product.category} | {product.weight} | {product.volume}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={product.quantity}
                                onChange={(e) => {
                                  const newProducts = [...receiveForm.selectedProducts];
                                  newProducts[index].quantity = parseInt(e.target.value) || 1;
                                  setReceiveForm(prev => ({ ...prev, selectedProducts: newProducts }));
                                }}
                                className="w-20 h-8 text-center"
                                min="1"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleProductRemove(product.id)}
                                className="border-red-300 text-red-600 hover:bg-red-50"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="country" className="text-blue-900">국가</Label>
                      <Select
                        value={receiveForm.country}
                        onValueChange={(value) => setReceiveForm(prev => ({ ...prev, country: value }))}
                      >
                        <SelectTrigger className="h-12 border-blue-200 focus:border-blue-500 bg-blue-50/30">
                          <SelectValue placeholder="국가 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="korea">한국</SelectItem>
                          <SelectItem value="china">중국</SelectItem>
                          <SelectItem value="japan">일본</SelectItem>
                          <SelectItem value="vietnam">베트남</SelectItem>
                          <SelectItem value="usa">미국</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="postalCode" className="text-blue-900">우편번호</Label>
                      <Input
                        id="postalCode"
                        type="text"
                        value={receiveForm.postalCode}
                        onChange={(e) => setReceiveForm(prev => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="12345"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="volume" className="text-blue-900">부피 (㎥)</Label>
                      <Input
                        id="volume"
                        type="number"
                        value={receiveForm.volume}
                        onChange={(e) => setReceiveForm(prev => ({ ...prev, volume: e.target.value }))}
                        placeholder="0.001"
                        step="0.001"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="weight" className="text-blue-900">중량 (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={receiveForm.weight}
                        onChange={(e) => setReceiveForm(prev => ({ ...prev, weight: e.target.value }))}
                        placeholder="1.5"
                        step="0.1"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* 수취인 정보 섹션 */}
              <Card className="shadow-blue border-blue-100">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-900">
                    <Truck className="h-5 w-5" />
                    수취인 정보
                  </CardTitle>
                  <CardDescription>배송받을 수취인의 정보를 입력합니다</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="recipientName" className="text-blue-900">수취인 이름 *</Label>
                      <Input
                        id="recipientName"
                        type="text"
                        value={receiveForm.recipientName}
                        onChange={(e) => setReceiveForm(prev => ({ ...prev, recipientName: e.target.value }))}
                        placeholder="수취인 이름"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="recipientPhone" className="text-blue-900">연락처 *</Label>
                      <Input
                        id="recipientPhone"
                        type="tel"
                        value={receiveForm.recipientPhone}
                        onChange={(e) => setReceiveForm(prev => ({ ...prev, recipientPhone: e.target.value }))}
                        placeholder="010-1234-5678"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="recipientPostalCode" className="text-blue-900">우편번호 *</Label>
                      <Input
                        id="recipientPostalCode"
                        type="text"
                        value={receiveForm.recipientPostalCode}
                        onChange={(e) => setReceiveForm(prev => ({ ...prev, recipientPostalCode: e.target.value }))}
                        placeholder="12345"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="deliveryMethod" className="text-blue-900">배송방식</Label>
                      <Select
                        value={receiveForm.deliveryMethod}
                        onValueChange={(value) => setReceiveForm(prev => ({ ...prev, deliveryMethod: value }))}
                      >
                        <SelectTrigger className="h-12 border-blue-200 focus:border-blue-500 bg-blue-50/30">
                          <SelectValue placeholder="배송방식 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="standard">일반배송</SelectItem>
                          <SelectItem value="express">특급배송</SelectItem>
                          <SelectItem value="overnight">익일배송</SelectItem>
                          <SelectItem value="pickup">직접수령</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="courierCompany" className="text-blue-900">택배사</Label>
                      <Select
                        value={receiveForm.courierCompany}
                        onValueChange={(value) => setReceiveForm(prev => ({ ...prev, courierCompany: value }))}
                      >
                        <SelectTrigger className="h-12 border-blue-200 focus:border-blue-500 bg-blue-50/30">
                          <SelectValue placeholder="택배사 선택" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cj">CJ대한통운</SelectItem>
                          <SelectItem value="lotte">롯데택배</SelectItem>
                          <SelectItem value="hanjin">한진택배</SelectItem>
                          <SelectItem value="kdexp">경동택배</SelectItem>
                          <SelectItem value="daesin">대신택배</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="trackingNumber" className="text-blue-900">송장번호</Label>
                      <Input
                        id="trackingNumber"
                        type="text"
                        value={receiveForm.trackingNumber}
                        onChange={(e) => setReceiveForm(prev => ({ ...prev, trackingNumber: e.target.value }))}
                        placeholder="송장번호 (배송 후 입력)"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="processor" className="text-blue-900">접수자</Label>
                      <Input
                        id="processor"
                        type="text"
                        value={receiveForm.processor}
                        onChange={(e) => setReceiveForm(prev => ({ ...prev, processor: e.target.value }))}
                        placeholder="접수 담당자"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="recipientAddress" className="text-blue-900">주소 *</Label>
                    <Input
                      id="recipientAddress"
                      type="text"
                      value={receiveForm.recipientAddress}
                      onChange={(e) => setReceiveForm(prev => ({ ...prev, recipientAddress: e.target.value }))}
                      placeholder="상세 주소를 입력하세요"
                      className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="requirements" className="text-blue-900">요청사항</Label>
                    <textarea
                      id="requirements"
                      value={receiveForm.requirements}
                      onChange={(e) => setReceiveForm(prev => ({ ...prev, requirements: e.target.value }))}
                      placeholder="배송 시 특별 요청사항이 있으면 입력하세요"
                      className="w-full h-20 px-4 py-3 border border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 rounded-md resize-none"
                    />
                  </div>

                  {/* 내품 정보 확인 촬영 */}
                  <div className="space-y-3">
                    <Label className="text-blue-900">내품 정보 확인 촬영</Label>
                    <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="space-y-2">
                        <Camera className="h-8 w-8 text-blue-500 mx-auto" />
                        <p className="text-blue-600">클릭하여 사진을 업로드하거나</p>
                        <p className="text-sm text-blue-500">파일을 드래그하여 놓으세요</p>
                        <Button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="mt-2 bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500"
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          파일 선택
                        </Button>
                      </div>
                    </div>

                    {/* 업로드된 파일 목록 */}
                    {receiveForm.photoFiles.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-blue-700">업로드된 파일 ({receiveForm.photoFiles.length}개):</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {receiveForm.photoFiles.map((file: File, index: number) => (
                            <div key={index} className="p-2 bg-blue-50 border border-blue-200 rounded text-sm text-blue-700 truncate">
                              {file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* 저장/접수 버튼 */}
              <div className="flex gap-4 justify-end">
                <Button
                  type="button"
                  onClick={() => handleSubmit('save')}
                  disabled={isLoading}
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      저장 중...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      임시 저장
                    </div>
                  )}
                </Button>

                <Button
                  type="button"
                  onClick={() => handleSubmit('complete')}
                  disabled={isLoading}
                  className="bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500 opacity-70 hover:opacity-100 hover:shadow-blue"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      접수 중...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      입고 접수 완료
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* QR 조회 탭 */}
          <TabsContent value="qr-check">
            <Card className="shadow-blue border-blue-100">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <QrCode className="h-5 w-5" />
                  QR 코드 고객 조회
                </CardTitle>
                <CardDescription>QR 코드를 스캔하거나 입력하여 고객 정보를 조회합니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR 입력 */}
                <div className="space-y-4">
                  <Label htmlFor="qrInput" className="text-blue-900">QR 코드 입력</Label>
                  <div className="flex gap-3">
                    <Input
                      ref={qrInputRef}
                      id="qrInput"
                      type="text"
                      value={qrInput}
                      onChange={(e) => setQrInput(e.target.value)}
                      placeholder="QR 코드를 입력하거나 스캔하세요 (예: QR001, QR002)"
                      className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30"
                      onKeyPress={(e) => e.key === 'Enter' && handleQRCheck()}
                    />
                    <Button
                      type="button"
                      onClick={handleQRCheck}
                      disabled={isLoading}
                      className="h-12 px-6 bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <Camera className="h-4 w-4" />
                    <span>데모용 QR 코드: QR001, QR002</span>
                  </div>
                </div>

                {/* 고객 정보 표시 */}
                {customerInfo && (
                  <div className="border border-blue-200 rounded-lg p-6 bg-blue-50/30 animate-scale-in">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                        <User className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900">{customerInfo.name}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                            {customerInfo.membershipLevel}
                          </Badge>
                          <span className="text-sm text-blue-600">가입일: {customerInfo.memberSince}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 기본 정보 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-700">{customerInfo.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-700">{customerInfo.email}</span>
                        </div>
                        <div className="flex items-start gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-blue-600 mt-0.5" />
                          <span className="text-blue-700">{customerInfo.address}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <ShoppingBag className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-700">총 주문: {customerInfo.totalOrders}건</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="h-4 w-4 text-blue-600" />
                          <span className="text-blue-700">고객 ID: {customerInfo.id}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* 주문 이력 */}
                    <div>
                      <h4 className="font-medium text-blue-900 mb-3">최근 주문 이력</h4>
                      <div className="space-y-2">
                        {customerInfo.orderHistory.map((order: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-white rounded-md border border-blue-100">
                            <div>
                              <div className="font-medium text-blue-900">{order.orderNumber}</div>
                              <div className="text-sm text-blue-600">{order.productName}</div>
                            </div>
                            <div className="text-right">
                              {getStatusBadge(order.status)}
                              <div className="text-xs text-blue-600 mt-1">{order.date}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}