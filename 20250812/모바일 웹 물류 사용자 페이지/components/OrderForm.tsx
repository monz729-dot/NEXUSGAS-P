import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Plus, Trash2, Search, ArrowLeft, AlertCircle, CheckCircle, Info, FileSpreadsheet, Download, Package, Navigation, HelpCircle, AlertTriangle, Clock, Shield } from 'lucide-react';
import { User } from '../types';

interface OrderFormProps {
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
  cbm?: number; // 자동계산된 CBM
}

interface HSCodeItem {
  code: string;
  description: string;
  category: string;
}

interface ValidationMessage {
  type: 'error' | 'warning' | 'info';
  message: string;
}

export function OrderForm({ user, onNavigate }: OrderFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationMessages, setValidationMessages] = useState<ValidationMessage[]>([]);

  // 자동 채번된 아이디 생성
  const [customerId] = useState(() => {
    const prefix = user?.type === 'corporate' ? 'KYC' : 'KYP';
    const number = String(Math.floor(Math.random() * 9000) + 1000).padStart(3, '0');
    return `${prefix}${number}`;
  });

  const [orderData, setOrderData] = useState({
    shippingType: 'sea',
    repacking: false,
    country: 'thailand',
    postalCode: '',
    deliveryMethod: 'courier', // 택배, 퀵, 기타
    deliveryMethodOther: '',
    recipientName: '',
    recipientPhone: '',
    recipientAddress: '',
    recipientPostalCode: '',
    specialRequests: ''
  });

  // 송장 정보
  const [shippingInfo, setShippingInfo] = useState({
    courierCompany: '',
    trackingNumber: '', // 우체국 송장번호 (필수)
    pickupLocation: '',
    courierRequests: '',
    quickCompany: '',
    quickContact: '',
    quickPickupLocation: '',
    quickRequests: ''
  });

  const [orderItems, setOrderItems] = useState<OrderItem[]>([{
    id: '1',
    hscode: '',
    description: '',
    quantity: 1,
    weight: 0,
    width: 0,
    height: 0,
    depth: 0,
    unitPrice: 0,
    cbm: 0
  }]);

  // HSCODE 관련 상태
  const [hsCodeDialog, setHsCodeDialog] = useState(false);
  const [currentItemId, setCurrentItemId] = useState('');
  const [hsCodeSearch, setHsCodeSearch] = useState('');
  const [hsCodeLoading, setHsCodeLoading] = useState(false);

  // 기업고객 전용 상태
  const [bulkUploadDialog, setBulkUploadDialog] = useState(false);
  const [bulkFile, setBulkFile] = useState<File | null>(null);
  const bulkFileRef = useRef<HTMLInputElement>(null);

  if (!user) return null;

  // CBM 자동계산 함수 (소수점 셋째 자리 반올림)
  const calculateCBM = (width: number, height: number, depth: number): number => {
    if (width > 0 && height > 0 && depth > 0) {
      const cbmValue = (width * height * depth) / 1000000; // cm → m³
      return Math.round(cbmValue * 1000) / 1000; // 소수점 셋째 자리 반올림
    }
    return 0;
  };

  // 항공 운송 검증 로직
  const validateAirShipping = (items: OrderItem[], trackingNumber: string): ValidationMessage[] => {
    const messages: ValidationMessage[] = [];
    
    // 송장번호 미입력 시 접수 불가
    if (!trackingNumber.trim()) {
      messages.push({
        type: 'error',
        message: '항공 운송의 경우 우체국 송장번호가 필수입니다.'
      });
    }

    // 아이템 단가 THB 1,500 초과 시 수취인 추가 강제
    items.forEach((item, index) => {
      if (item.unitPrice && item.unitPrice > 1500) {
        if (!orderData.recipientName || !orderData.recipientPhone || !orderData.recipientAddress) {
          messages.push({
            type: 'error',
            message: `품목 ${index + 1}: 단가 THB 1,500 초과 시 수취인 정보가 필수입니다.`
          });
        } else {
          messages.push({
            type: 'warning',
            message: `품목 ${index + 1}: 단가가 THB 1,500을 초과하여 추가 서류가 필요할 수 있습니다.`
          });
        }
      }
    });

    return messages;
  };

  // 무료 HS코드 API 조회 시뮬레이션
  const searchHSCodeAPI = async (query: string): Promise<HSCodeItem[]> => {
    setHsCodeLoading(true);
    
    // API 호출 시뮬레이션
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 실제로는 무료 API를 호출하지만, 여기서는 mock 데이터 사용
      const mockApiData: HSCodeItem[] = [
        { code: '1905.31', description: '빼빼로, 웨이퍼 과자', category: '제과류' },
        { code: '1806.32', description: '초콜릿 과자', category: '제과류' },
        { code: '1905.90', description: '기타 과자류', category: '제과류' },
        { code: '6203.42', description: '면제 남성용 바지', category: '의류' },
        { code: '6204.62', description: '면제 여성용 바지', category: '의류' },
        { code: '6109.10', description: '면제 티셔츠', category: '의류' },
        { code: '8517.12', description: '휴대폰', category: '전자제품' },
        { code: '8471.30', description: '휴대용 컴퓨터', category: '전자제품' },
        { code: '3304.99', description: '화장품', category: '화장품' },
        { code: '2106.90', description: '건강식품', category: '식품' },
        { code: '9503.00', description: '장난감', category: '완구' },
        { code: '4202.92', description: '가방', category: '가죽제품' },
        { code: '6403.51', description: '신발', category: '신발류' }
      ];

      const filtered = mockApiData.filter(item => 
        item.code.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );

      setHsCodeLoading(false);
      return filtered;
      
    } catch (error) {
      setHsCodeLoading(false);
      // API 실패 시 로컬 데이터 사용
      return [];
    }
  };

  const [filteredHSCodes, setFilteredHSCodes] = useState<HSCodeItem[]>([]);

  // HS코드 검색
  useEffect(() => {
    if (hsCodeSearch.trim()) {
      searchHSCodeAPI(hsCodeSearch).then(setFilteredHSCodes);
    } else {
      setFilteredHSCodes([]);
    }
  }, [hsCodeSearch]);

  const addOrderItem = () => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      hscode: '',
      description: '',
      quantity: 1,
      weight: 0,
      width: 0,
      height: 0,
      depth: 0,
      unitPrice: 0,
      cbm: 0
    };
    setOrderItems([...orderItems, newItem]);
  };

  const removeOrderItem = (id: string) => {
    setOrderItems(orderItems.filter(item => item.id !== id));
  };

  const updateOrderItem = (id: string, field: string, value: any) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // CBM 자동계산
        if (['width', 'height', 'depth'].includes(field)) {
          updatedItem.cbm = calculateCBM(
            field === 'width' ? value : item.width,
            field === 'height' ? value : item.height,
            field === 'depth' ? value : item.depth
          );
        }
        
        return updatedItem;
      }
      return item;
    }));
  };

  // HSCODE 조회 및 적용
  const handleHSCodeSelect = (hsCode: HSCodeItem) => {
    updateOrderItem(currentItemId, 'hscode', hsCode.code);
    updateOrderItem(currentItemId, 'description', hsCode.description);
    setHsCodeDialog(false);
    setHsCodeSearch('');
  };

  // 실시간 검증
  useEffect(() => {
    const messages: ValidationMessage[] = [];
    
    if (orderData.shippingType === 'air') {
      const airValidation = validateAirShipping(orderItems, shippingInfo.trackingNumber);
      messages.push(...airValidation);
    }

    // 송장번호 미입력 시 접수 불가 (모든 운송 방식)
    if (!shippingInfo.trackingNumber.trim()) {
      messages.push({
        type: 'error',
        message: '우체국 송장번호는 필수 입력 항목입니다.'
      });
    }

    setValidationMessages(messages);
  }, [orderData, shippingInfo, orderItems]);

  // EMS 부피무게 계산 (가로*세로*높이/6000)
  const calculateVolumetricWeight = (item: OrderItem) => {
    if (item.width > 0 && item.height > 0 && item.depth > 0) {
      return (item.width * item.height * item.depth) / 6000;
    }
    return 0;
  };

  // 부피무게 점수 계산
  const getVolumetricWeightScore = (actualWeight: number, volumetricWeight: number) => {
    const ratio = volumetricWeight / Math.max(actualWeight, 0.1);
    if (ratio > 2) return '높음';
    if (ratio > 1.5) return '보통';
    return '낮음';
  };

  // 국가별 우편번호 패턴
  const getPostalCodePattern = (country: string) => {
    switch (country) {
      case 'thailand': return /^\d{5}$/;
      case 'vietnam': return /^\d{6}$/;
      case 'philippines': return /^\d{4}$/;
      case 'indonesia': return /^\d{5}$/;
      default: return /^\d{4,6}$/;
    }
  };

  const getPostalCodeGuide = (country: string) => {
    switch (country) {
      case 'thailand': return '5자리 숫자 (예: 10110)';
      case 'vietnam': return '6자리 숫자 (예: 100000)';
      case 'philippines': return '4자리 숫자 (예: 1000)';
      case 'indonesia': return '5자리 숫자 (예: 10110)';
      default: return '4-6자리 숫자';
    }
  };

  // 일괄등록 양식 다운로드 (기업고객만)
  const downloadBulkTemplate = () => {
    const csvContent = `HSCODE,품목명,수량,중량(kg),가로(cm),세로(cm),높이(cm),단가(THB)
1905.31,빼빼로,10,5.0,30,20,5,25.00
8517.12,휴대폰,5,1.0,15,8,1,1200.00
3304.99,화장품,20,0.5,10,10,5,800.00`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'YCS_품목일괄등록_양식.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 일괄등록 파일 처리 (기업고객만)
  const handleBulkFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) {
        setError('CSV 또는 Excel 파일만 업로드 가능합니다.');
        return;
      }
      setBulkFile(file);
      setError('');
    }
  };

  const processBulkUpload = () => {
    if (!bulkFile) {
      setError('파일을 선택해주세요.');
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const newItems: OrderItem[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',');
          if (values.length >= 8 && values[0].trim()) {
            const width = parseFloat(values[4]) || 0;
            const height = parseFloat(values[5]) || 0;
            const depth = parseFloat(values[6]) || 0;
            
            newItems.push({
              id: Date.now().toString() + i,
              hscode: values[0].trim(),
              description: values[1].trim(),
              quantity: parseInt(values[2]) || 1,
              weight: parseFloat(values[3]) || 0,
              width,
              height,
              depth,
              unitPrice: parseFloat(values[7]) || 0,
              cbm: calculateCBM(width, height, depth)
            });
          }
        }
        
        if (newItems.length > 0) {
          setOrderItems(newItems);
          setBulkUploadDialog(false);
          setBulkFile(null);
          setSuccess(`${newItems.length}개의 품목이 성공적으로 등록되었습니다.`);
          setTimeout(() => setSuccess(''), 3000);
        } else {
          setError('유효한 데이터가 없습니다.');
        }
        setIsLoading(false);
      } catch (err) {
        setError('파일 처리 중 오류가 발생했습니다.');
        setIsLoading(false);
      }
    };
    
    reader.readAsText(bulkFile);
  };

  // 저장 기능
  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setSuccess('주문서가 임시저장되었습니다.');
      setIsLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  // 접수완료 기능
  const handleSubmit = () => {
    setError('');
    
    // 검증 메시지 확인
    const errorMessages = validationMessages.filter(msg => msg.type === 'error');
    if (errorMessages.length > 0) {
      setError(errorMessages[0].message);
      return;
    }

    // 필수 항목 검증
    if (!orderData.recipientName || !orderData.recipientAddress || !orderData.recipientPostalCode) {
      setError('수취인 정보를 모두 입력해주세요.');
      return;
    }

    const hasValidItems = orderItems.some(item => item.description && item.quantity > 0);
    if (!hasValidItems) {
      setError('최소 하나의 유효한 품목을 입력해주세요.');
      return;
    }

    // 송장번호 검증
    if (!shippingInfo.trackingNumber.trim()) {
      setError('우체국 송장번호를 입력해주세요.');
      return;
    }

    if (orderData.deliveryMethod === 'quick' && !shippingInfo.quickContact) {
      setError('퀵 연락처를 입력해주세요.');
      return;
    }

    setIsLoading(true);
    
    setTimeout(() => {
      const receiptNumber = `YCS-${Date.now().toString().slice(-8)}`;
      setSuccess(`접수완료! 접수번호: ${receiptNumber} - YCS 창고 도착 후 청구서를 발행해드립니다.`);
      setIsLoading(false);
      
      // 3초 후 대시보드로 이동
      setTimeout(() => {
        onNavigate('dashboard');
      }, 3000);
    }, 2000);
  };

  // 취소 기능
  const handleCancel = () => {
    if (window.confirm('저장되지 않은 정보는 사라집니다. 취소하시겠습니까?')) {
      onNavigate('dashboard');
    }
  };

  // HSCODE 조회 모달
  const HSCodeSearchModal = () => (
    <Dialog open={hsCodeDialog} onOpenChange={setHsCodeDialog}>
      <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>HS CODE 품목 조회</DialogTitle>
          <DialogDescription>
            HS CODE 또는 품목명으로 검색하여 해당 품목을 선택할 수 있습니다.
            API 조회에 실패한 경우 수동으로 입력해주세요.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="HS CODE 또는 품목명 검색"
              value={hsCodeSearch}
              onChange={(e) => setHsCodeSearch(e.target.value)}
              className="pl-10"
            />
            {hsCodeLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredHSCodes.map((item, index) => (
              <div
                key={index}
                onClick={() => handleHSCodeSelect(item)}
                className="p-3 border border-blue-100 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium text-blue-900">{item.code}</p>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">{item.category}</Badge>
                </div>
              </div>
            ))}
          </div>
          
          {filteredHSCodes.length === 0 && hsCodeSearch && !hsCodeLoading && (
            <div className="p-4 text-center">
              <p className="text-gray-500 mb-3">API 조회 결과가 없습니다.</p>
              <p className="text-sm text-blue-600">수동으로 입력하여 사용해주세요.</p>
            </div>
          )}

          {filteredHSCodes.length === 0 && !hsCodeSearch && (
            <p className="text-center text-gray-500 py-4">검색어를 입력해주세요.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  // 일괄등록 모달 (기업고객만)
  const BulkUploadModal = () => (
    <Dialog open={bulkUploadDialog} onOpenChange={setBulkUploadDialog}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>품목 일괄등록</DialogTitle>
          <DialogDescription>
            양식을 다운로드하여 작성한 후 파일을 업로드하면 여러 품목을 한 번에 등록할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* 양식 다운로드 */}
          <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100/50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-blue-900">1. 양식 다운로드</h3>
                <p className="text-sm text-blue-600">먼저 양식을 다운로드하여 작성해주세요.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadBulkTemplate}
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                <Download className="h-4 w-4 mr-2" />
                양식 다운로드
              </Button>
            </div>
          </div>

          {/* 파일 업로드 */}
          <div className="space-y-3">
            <h3 className="font-medium text-blue-900">2. 작성된 파일 업로드</h3>
            <div className="relative">
              <input
                ref={bulkFileRef}
                type="file"
                accept=".csv,.xlsx"
                onChange={handleBulkFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="h-20 px-4 border-2 border-dashed border-blue-200 hover:border-blue-300 bg-blue-50/30 hover:bg-blue-50/50 transition-all duration-300 rounded-lg flex items-center gap-3 cursor-pointer">
                <Package className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-700">
                    {bulkFile ? bulkFile.name : '파일을 선택하세요'}
                  </p>
                  <p className="text-sm text-blue-600">CSV 또는 Excel 파일 (최대 10MB)</p>
                </div>
              </div>
            </div>
          </div>

          {/* 업로드 버튼 */}
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setBulkUploadDialog(false)}
              className="flex-1"
            >
              취소
            </Button>
            <Button
              onClick={processBulkUpload}
              disabled={!bulkFile || isLoading}
              className="flex-1"
            >
              {isLoading ? '처리 중...' : '일괄등록'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 space-y-6">
      {/* 성공/에러 메시지 */}
      {(success || error) && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
          <Alert variant={error ? "destructive" : "default"} className="shadow-blue-lg">
            <AlertDescription>{success || error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* 검증 메시지 */}
      {validationMessages.length > 0 && (
        <div className="space-y-2">
          {validationMessages.map((msg, index) => (
            <Alert key={index} variant={msg.type === 'error' ? 'destructive' : 'default'}>
              {msg.type === 'error' && <AlertCircle className="h-4 w-4" />}
              {msg.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
              {msg.type === 'info' && <Info className="h-4 w-4" />}
              <AlertDescription>{msg.message}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onNavigate('dashboard')}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          뒤로가기
        </Button>
        <div>
          <h1 className="text-xl text-blue-900">배송 접수</h1>
          <p className="text-sm text-blue-600">새로운 배송을 접수해보세요 - 창고 도착 후 청구서 발행</p>
        </div>
      </div>

      {/* 주문자 정보 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">주문자 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-blue-900">고객 아이디</Label>
              <Input value={customerId} disabled className="h-12 bg-gray-50 border-gray-200 font-mono" />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-900">이름</Label>
              <Input value={user.name} disabled className="h-12 bg-gray-50 border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-900">이메일</Label>
              <Input value={user.email} disabled className="h-12 bg-gray-50 border-gray-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-blue-900">연락처</Label>
              <Input value={user.phone} disabled className="h-12 bg-gray-50 border-gray-200" />
            </div>
            {user.type !== 'general' && (
              <div className="space-y-2">
                <Label className="text-blue-900">회사명</Label>
                <Input value={user.companyName} disabled className="h-12 bg-gray-50 border-gray-200" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 송장 정보 (필수) */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            우체국 송장번호
            <Badge variant="destructive" className="text-xs">필수</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-blue-900">송장번호 *</Label>
            <Input
              value={shippingInfo.trackingNumber}
              onChange={(e) => setShippingInfo({...shippingInfo, trackingNumber: e.target.value})}
              placeholder="우체국 송장번호를 입력해주세요"
              className="h-12"
              required
            />
            <p className="text-xs text-blue-600">
              우체국 송장번호가 없으면 주문을 접수할 수 없습니다.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 배송 정보 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">배송 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label className="text-blue-900">배송 유형</Label>
            <RadioGroup 
              value={orderData.shippingType} 
              onValueChange={(value) => setOrderData({...orderData, shippingType: value})}
              className="grid grid-cols-2 gap-4"
            >
              <div className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
                orderData.shippingType === 'sea' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <RadioGroupItem value="sea" id="sea" />
                <div>
                  <Label htmlFor="sea" className="font-medium">해상운송</Label>
                  <p className="text-sm text-gray-600">경제적, 15-30일</p>
                </div>
              </div>
              <div className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-all ${
                orderData.shippingType === 'air' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
              }`}>
                <RadioGroupItem value="air" id="air" />
                <div>
                  <Label htmlFor="air" className="font-medium">항공운송</Label>
                  <p className="text-sm text-gray-600">신속, 3-7일 (추가 검증 필요)</p>
                </div>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label className="text-blue-900">도착 국가</Label>
            <Select value={orderData.country} onValueChange={(value) => setOrderData({...orderData, country: value})}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="thailand">🇹🇭 태국</SelectItem>
                <SelectItem value="vietnam">🇻🇳 베트남</SelectItem>
                <SelectItem value="philippines">🇵🇭 필리핀</SelectItem>
                <SelectItem value="indonesia">🇮🇩 인도네시아</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-blue-900">우편번호</Label>
            <Input 
              value={orderData.postalCode}
              onChange={(e) => setOrderData({...orderData, postalCode: e.target.value})}
              placeholder={getPostalCodeGuide(orderData.country)}
              className="h-12"
            />
            <p className="text-xs text-blue-600">
              {getPostalCodeGuide(orderData.country)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 수취인 정보 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">
            수취인 정보
            {orderData.shippingType === 'air' && orderItems.some(item => item.unitPrice && item.unitPrice > 1500) && (
              <Badge variant="destructive" className="ml-2 text-xs">필수</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label className="text-blue-900">수취인 이름</Label>
            <Input
              value={orderData.recipientName}
              onChange={(e) => setOrderData({...orderData, recipientName: e.target.value})}
              placeholder="수취인 이름을 입력해주세요"
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-blue-900">수취인 연락처</Label>
            <Input
              value={orderData.recipientPhone}
              onChange={(e) => setOrderData({...orderData, recipientPhone: e.target.value})}
              placeholder="수취인 연락처를 입력해주세요"
              className="h-12"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-blue-900">수취인 주소</Label>
            <Textarea
              value={orderData.recipientAddress}
              onChange={(e) => setOrderData({...orderData, recipientAddress: e.target.value})}
              placeholder="수취인 주소를 입력해주세요"
              className="min-h-24"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-blue-900">수취인 우편번호</Label>
            <Input
              value={orderData.recipientPostalCode}
              onChange={(e) => setOrderData({...orderData, recipientPostalCode: e.target.value})}
              placeholder={getPostalCodeGuide(orderData.country)}
              className="h-12"
            />
          </div>
        </CardContent>
      </Card>

      {/* 품목 정보 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-900">품목 정보</CardTitle>
            <div className="flex gap-2">
              {/* 기업고객 전용 일괄등록 버튼 */}
              {user.type === 'corporate' && (
                <>
                  <Button
                    onClick={() => setBulkUploadDialog(true)}
                    size="sm"
                    variant="outline"
                    className="border-green-200 text-green-600 hover:bg-green-50 hover:text-green-700 hover:border-green-300"
                  >
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    일괄등록
                  </Button>
                  <Button
                    onClick={downloadBulkTemplate}
                    size="sm"
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 hover:border-orange-300"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    양식받기
                  </Button>
                </>
              )}
              <Button 
                onClick={addOrderItem} 
                size="sm"
                className="bg-blue-600/20 hover:bg-blue-600 border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-300"
              >
                <Plus className="h-4 w-4 mr-2" />
                품목 추가
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {orderItems.map((item, index) => (
            <div key={item.id} className="p-4 border-2 border-blue-100/50 rounded-lg space-y-4 bg-blue-50/30">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-blue-900">품목 {index + 1}</h4>
                {orderItems.length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeOrderItem(item.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* HSCODE 필드 */}
                <div className="space-y-2">
                  <Label className="text-blue-900">HS CODE</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={item.hscode} 
                      onChange={(e) => updateOrderItem(item.id, 'hscode', e.target.value)}
                      placeholder="HS CODE 입력"
                      className="flex-1 h-12"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentItemId(item.id);
                        setHsCodeDialog(true);
                      }}
                      className="h-12 px-3 border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* 품목명 */}
                <div className="space-y-2">
                  <Label className="text-blue-900">품목명</Label>
                  <Input 
                    value={item.description} 
                    onChange={(e) => updateOrderItem(item.id, 'description', e.target.value)}
                    placeholder="품목명 입력"
                    className="h-12"
                  />
                </div>

                {/* 수량, 중량 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-blue-900">수량</Label>
                    <Input 
                      type="number" 
                      value={item.quantity} 
                      onChange={(e) => updateOrderItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      placeholder="수량"
                      min="1"
                      className="h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-blue-900">중량 (kg)</Label>
                    <Input 
                      type="number" 
                      step="0.1"
                      value={item.weight} 
                      onChange={(e) => updateOrderItem(item.id, 'weight', parseFloat(e.target.value) || 0)}
                      placeholder="중량"
                      className="h-12"
                    />
                  </div>
                </div>

                {/* 단가 (항공 운송 검증용) */}
                <div className="space-y-2">
                  <Label className="text-blue-900 flex items-center gap-2">
                    단가 (THB)
                    {orderData.shippingType === 'air' && (
                      <Badge variant="outline" className="text-xs">항공운송 검증</Badge>
                    )}
                  </Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={item.unitPrice} 
                    onChange={(e) => updateOrderItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    placeholder="단가 (태국 바트)"
                    className="h-12"
                  />
                  {orderData.shippingType === 'air' && item.unitPrice && item.unitPrice > 1500 && (
                    <p className="text-xs text-orange-600">
                      ⚠️ THB 1,500 초과 시 수취인 정보 및 추가 서류가 필요합니다.
                    </p>
                  )}
                </div>

                {/* 치수 및 CBM */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label className="text-blue-900">가로 (cm)</Label>
                      <Input 
                        type="number" 
                        step="0.1"
                        value={item.width} 
                        onChange={(e) => updateOrderItem(item.id, 'width', parseFloat(e.target.value) || 0)}
                        placeholder="가로"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-blue-900">세로 (cm)</Label>
                      <Input 
                        type="number" 
                        step="0.1"
                        value={item.height} 
                        onChange={(e) => updateOrderItem(item.id, 'height', parseFloat(e.target.value) || 0)}
                        placeholder="세로"
                        className="h-12"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-blue-900">높이 (cm)</Label>
                      <Input 
                        type="number" 
                        step="0.1"
                        value={item.depth} 
                        onChange={(e) => updateOrderItem(item.id, 'depth', parseFloat(e.target.value) || 0)}
                        placeholder="높이"
                        className="h-12"
                      />
                    </div>
                  </div>

                  {/* CBM 자동계산 결과 */}
                  {item.cbm > 0 && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-green-900">CBM 자동계산</p>
                          <p className="text-sm text-green-700">
                            {item.width} × {item.height} × {item.depth} = {item.cbm} m³
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-900">{item.cbm} m³</p>
                          <p className="text-xs text-green-600">소수점 3째자리 반올림</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* EMS 부피무게 계산 */}
                  {item.width > 0 && item.height > 0 && item.depth > 0 && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-900">EMS 부피무게</p>
                          <p className="text-sm text-blue-700">
                            {item.width} × {item.height} × {item.depth} ÷ 6000 = {calculateVolumetricWeight(item).toFixed(2)}kg
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={
                              getVolumetricWeightScore(item.weight, calculateVolumetricWeight(item)) === '높음' 
                                ? 'destructive' 
                                : getVolumetricWeightScore(item.weight, calculateVolumetricWeight(item)) === '보통' 
                                  ? 'default' 
                                  : 'secondary'
                            }
                            className="text-xs"
                          >
                            {getVolumetricWeightScore(item.weight, calculateVolumetricWeight(item))}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 특별 요청사항 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">특별 요청사항</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={orderData.specialRequests}
            onChange={(e) => setOrderData({...orderData, specialRequests: e.target.value})}
            placeholder="특별한 요청사항이 있으시면 입력해주세요..."
            className="min-h-24"
          />
        </CardContent>
      </Card>

      {/* 리패킹 옵션 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">리패킹 서비스</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="repacking"
              checked={orderData.repacking}
              onCheckedChange={(checked) => setOrderData({...orderData, repacking: !!checked})}
            />
            <div>
              <Label htmlFor="repacking" className="font-medium">리패킹 서비스 신청</Label>
              <p className="text-sm text-gray-600">
                창고 도착 후 상품 상태에 따라 리패킹 작업을 진행합니다.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 하단 버튼 */}
      <div className="flex gap-4 pb-20">
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleCancel}
          className="flex-1 h-12"
        >
          취소
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          onClick={handleSave}
          disabled={isLoading}
          className="flex-1 h-12 border-blue-200 text-blue-600 hover:bg-blue-50"
        >
          {isLoading ? '저장 중...' : '임시저장'}
        </Button>
        <Button 
          size="lg" 
          onClick={handleSubmit}
          disabled={isLoading || validationMessages.some(msg => msg.type === 'error')}
          className="flex-1 h-12"
        >
          {isLoading ? '처리 중...' : '접수완료'}
        </Button>
      </div>

      {/* 모달들 */}
      <HSCodeSearchModal />
      {user.type === 'corporate' && <BulkUploadModal />}
    </div>
  );
}