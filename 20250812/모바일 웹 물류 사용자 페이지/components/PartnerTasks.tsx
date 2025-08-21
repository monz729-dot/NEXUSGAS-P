import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { 
  Search, 
  MapPin, 
  Clock, 
  Package, 
  Camera,
  Phone,
  Calendar,
  Truck,
  CheckCircle,
  AlertCircle,
  FileText,
  Scale,
  Wrench,
  Upload,
  Eye,
  Calculator,
  CreditCard,
  Mail
} from 'lucide-react';
import { User as UserType } from '../types';

interface PartnerTasksProps {
  user: UserType | null;
  onNavigate: (page: string) => void;
}

interface TaskItem {
  id: string;
  type: 'warehouse_arrival' | 'repacking' | 'billing' | 'photo_upload';
  status: 'pending' | 'inprogress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  trackingNumber: string;
  expectedWeight: number;
  actualWeight?: number;
  items: Array<{
    name: string;
    quantity: number;
    weight: number;
    cbm: number;
  }>;
  destination: string;
  shippingType: 'air' | 'sea';
  repackingRequested: boolean;
  repackingCompleted: boolean;
  photosUploaded: string[];
  arrivalDate?: string;
  notes?: string;
  billing?: {
    proformaIssued: boolean;
    finalIssued: boolean;
    shippingFee?: number;
    localDeliveryFee?: number;
    total?: number;
  };
}

export function PartnerTasks({ user, onNavigate }: PartnerTasksProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<'arrival' | 'repacking' | 'billing' | 'completed'>('arrival');
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);
  const [modalType, setModalType] = useState<'arrival' | 'repacking' | 'billing' | 'photo' | null>(null);
  const [modalData, setModalData] = useState<any>({});

  // 데모 데이터 - 실제 파트너 업무
  const tasks: TaskItem[] = [
    {
      id: 'TASK-2024-001',
      type: 'warehouse_arrival',
      status: 'pending',
      priority: 'high',
      orderNumber: 'YCS-240115-001',
      customerName: '김철수',
      customerPhone: '010-1234-5678',
      trackingNumber: 'EE123456789KR',
      expectedWeight: 2.0,
      items: [
        { name: '빼빼로 초콜릿', quantity: 10, weight: 1.5, cbm: 0.003 },
        { name: '초콜릿 과자', quantity: 5, weight: 0.5, cbm: 0.001 }
      ],
      destination: '태국 방콕',
      shippingType: 'sea',
      repackingRequested: true,
      repackingCompleted: false,
      photosUploaded: []
    },
    {
      id: 'TASK-2024-002',
      type: 'repacking',
      status: 'inprogress',
      priority: 'medium',
      orderNumber: 'YCS-240114-002',
      customerName: '이영희',
      customerPhone: '010-9876-5432',
      trackingNumber: 'EE987654321KR',
      expectedWeight: 3.0,
      actualWeight: 3.2,
      items: [
        { name: '전자제품', quantity: 2, weight: 2.0, cbm: 0.032 },
        { name: '액세서리', quantity: 5, weight: 1.2, cbm: 0.008 }
      ],
      destination: '태국 치앙마이',
      shippingType: 'air',
      repackingRequested: true,
      repackingCompleted: false,
      photosUploaded: ['arrival_240114.jpg'],
      arrivalDate: '2024-01-14',
      notes: '전자제품 포장 상태 양호'
    },
    {
      id: 'TASK-2024-003',
      type: 'billing',
      status: 'pending',
      priority: 'high',
      orderNumber: 'YCS-240113-003',
      customerName: '박민수',
      customerPhone: '010-5555-6666',
      trackingNumber: 'EE456789123KR',
      expectedWeight: 1.5,
      actualWeight: 1.8,
      items: [
        { name: '건강식품', quantity: 1, weight: 1.8, cbm: 0.012 }
      ],
      destination: '태국 파타야',
      shippingType: 'sea',
      repackingRequested: false,
      repackingCompleted: false,
      photosUploaded: ['arrival_240113.jpg'],
      arrivalDate: '2024-01-13',
      notes: '무게 차이 있음, 재계량 완료'
    },
    {
      id: 'TASK-2024-004',
      type: 'warehouse_arrival',
      status: 'completed',
      priority: 'low',
      orderNumber: 'YCS-240112-004',
      customerName: '최지현',
      customerPhone: '010-7777-8888',
      trackingNumber: 'EE789123456KR',
      expectedWeight: 2.5,
      actualWeight: 2.5,
      items: [
        { name: '의류', quantity: 8, weight: 2.5, cbm: 0.025 }
      ],
      destination: '태국 푸켓',
      shippingType: 'sea',
      repackingRequested: true,
      repackingCompleted: true,
      photosUploaded: ['arrival_240112.jpg', 'repacking_240112_1.jpg', 'repacking_240112_2.jpg'],
      arrivalDate: '2024-01-12',
      notes: '리패킹 완료, 4개씩 2개 포장으로 분할',
      billing: {
        proformaIssued: true,
        finalIssued: false,
        shippingFee: 75000,
        localDeliveryFee: 20000,
        total: 105700
      }
    }
  ];

  const getFilteredTasks = () => {
    let filtered = tasks;
    
    // 탭 필터
    switch (selectedTab) {
      case 'arrival':
        filtered = filtered.filter(task => task.type === 'warehouse_arrival' && task.status !== 'completed');
        break;
      case 'repacking':
        filtered = filtered.filter(task => 
          (task.type === 'repacking' || (task.arrivalDate && task.repackingRequested)) && 
          task.status !== 'completed'
        );
        break;
      case 'billing':
        filtered = filtered.filter(task => 
          (task.type === 'billing' || (task.actualWeight && (!task.repackingRequested || task.repackingCompleted))) && 
          task.status !== 'completed'
        );
        break;
      case 'completed':
        filtered = filtered.filter(task => task.status === 'completed');
        break;
    }

    // 검색 필터
    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  };

  const getStatusBadge = (task: TaskItem) => {
    const configs = {
      pending: { label: '대기중', className: 'bg-orange-100 text-orange-800 border-orange-300' },
      inprogress: { label: '진행중', className: 'bg-blue-100 text-blue-800 border-blue-300' },
      completed: { label: '완료', className: 'bg-green-100 text-green-800 border-green-300' }
    };

    return (
      <Badge variant="outline" className={configs[task.status].className}>
        {configs[task.status].label}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const configs = {
      high: { label: '긴급', className: 'bg-red-100 text-red-800 border-red-300' },
      medium: { label: '보통', className: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      low: { label: '낮음', className: 'bg-green-100 text-green-800 border-green-300' }
    };

    return (
      <Badge variant="outline" className={configs[priority as keyof typeof configs].className}>
        {configs[priority as keyof typeof configs].label}
      </Badge>
    );
  };

  const handleArrivalConfirm = (task: TaskItem) => {
    const actualWeight = parseFloat(modalData.actualWeight || '0');
    const notes = modalData.notes || '';
    
    if (!actualWeight) {
      alert('실제 무게를 입력해주세요.');
      return;
    }

    alert(`창고 도착 확인: ${task.orderNumber}\n실제 무게: ${actualWeight}kg\n메모: ${notes}`);
    setModalType(null);
    setModalData({});
  };

  const handleRepackingComplete = (task: TaskItem) => {
    const notes = modalData.repackingNotes || '';
    const photoCount = parseInt(modalData.photoCount || '0');
    
    if (photoCount === 0) {
      alert('리패킹 사진을 업로드해주세요.');
      return;
    }

    alert(`리패킹 완료: ${task.orderNumber}\n사진 수: ${photoCount}장\n메모: ${notes}`);
    setModalType(null);
    setModalData({});
  };

  const handleBillingCreate = (task: TaskItem) => {
    const shippingFee = parseFloat(modalData.shippingFee || '0');
    const localFee = parseFloat(modalData.localFee || '0');
    const repackingFee = parseFloat(modalData.repackingFee || '0');
    
    if (!shippingFee) {
      alert('배송비를 입력해주세요.');
      return;
    }

    const total = shippingFee + localFee + repackingFee;
    const tax = Math.round(total * 0.07);
    const finalTotal = total + tax;

    alert(`청구서 발행: ${task.orderNumber}\n총 금액: ${finalTotal.toLocaleString()} THB\n(TAX 7% 포함)`);
    setModalType(null);
    setModalData({});
  };

  const tabConfig = [
    { id: 'arrival', label: '창고도착', icon: <Package className="h-4 w-4" />, count: tasks.filter(t => t.type === 'warehouse_arrival' && t.status !== 'completed').length },
    { id: 'repacking', label: '리패킹', icon: <Wrench className="h-4 w-4" />, count: tasks.filter(t => (t.type === 'repacking' || (t.arrivalDate && t.repackingRequested)) && t.status !== 'completed').length },
    { id: 'billing', label: '청구서발행', icon: <FileText className="h-4 w-4" />, count: tasks.filter(t => (t.type === 'billing' || (t.actualWeight && (!t.repackingRequested || t.repackingCompleted))) && t.status !== 'completed').length },
    { id: 'completed', label: '완료', icon: <CheckCircle className="h-4 w-4" />, count: tasks.filter(t => t.status === 'completed').length }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-20">
      {/* 헤더 */}
      <header className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-blue-900">파트너 업무 관리</h1>
              <p className="text-sm text-blue-600">{user.companyName} - 창고 및 청구서 업무</p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-blue">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600/60" />
            <Input
              type="text"
              placeholder="주문번호, 고객명, 송장번호로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
            />
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* 탭 네비게이션 */}
        <div className="flex space-x-1 mb-6 bg-blue-50/50 p-1 rounded-lg overflow-x-auto">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id as any)}
              className={`flex-shrink-0 py-3 px-4 rounded-md transition-all duration-300 ${
                selectedTab === tab.id
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-blue-600 hover:text-blue-700 hover:bg-white/50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                {tab.icon}
                <span className="font-medium">{tab.label}</span>
                <Badge variant="outline" className="text-xs">
                  {tab.count}
                </Badge>
              </div>
            </button>
          ))}
        </div>

        {/* 작업 목록 */}
        <div className="space-y-4">
          {getFilteredTasks().length === 0 ? (
            <Card className="shadow-blue border-blue-100">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-blue-300 mb-4" />
                <h3 className="text-lg font-medium text-blue-900 mb-2">작업이 없습니다</h3>
                <p className="text-blue-600 text-center">
                  {searchQuery ? '검색 조건에 맞는 작업이 없습니다.' : '현재 해당 단계의 작업이 없습니다.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            getFilteredTasks().map((task) => (
              <Card key={task.id} className="shadow-blue border-blue-100">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-blue-900 flex items-center gap-2">
                        {task.type === 'warehouse_arrival' && <Package className="h-5 w-5 text-blue-600" />}
                        {task.type === 'repacking' && <Wrench className="h-5 w-5 text-orange-600" />}
                        {task.type === 'billing' && <FileText className="h-5 w-5 text-purple-600" />}
                        {task.orderNumber}
                      </CardTitle>
                      <CardDescription className="mt-1 flex items-center gap-2">
                        <span>{task.customerName}</span>
                        <span>•</span>
                        <span>{task.destination}</span>
                        <span>•</span>
                        <Badge variant="outline" className="text-xs">
                          {task.shippingType === 'air' ? '항공' : '해상'}
                        </Badge>
                      </CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      {getStatusBadge(task)}
                      {getPriorityBadge(task.priority)}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-mono">{task.trackingNumber}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Scale className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">
                        예상: {task.expectedWeight}kg
                        {task.actualWeight && ` → 실제: ${task.actualWeight}kg`}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">{task.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-gray-600" />
                      <span className="text-sm">
                        CBM: {task.items.reduce((sum, item) => sum + item.cbm, 0).toFixed(3)}m³
                      </span>
                    </div>
                  </div>

                  {/* 품목 정보 */}
                  <div className="p-3 bg-blue-50/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">품목 정보</span>
                    </div>
                    <div className="space-y-1">
                      {task.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm text-blue-800">
                          <span>{item.name} × {item.quantity}개</span>
                          <span>{item.weight}kg</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 진행 상태 */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2 rounded text-center text-sm ${
                      task.arrivalDate ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                    }`}>
                      창고도착: {task.arrivalDate ? '완료' : '대기'}
                    </div>
                    {task.repackingRequested && (
                      <div className={`p-2 rounded text-center text-sm ${
                        task.repackingCompleted ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        리패킹: {task.repackingCompleted ? '완료' : '진행중'}
                      </div>
                    )}
                  </div>

                  {/* 업로드된 사진 */}
                  {task.photosUploaded.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Camera className="h-4 w-4" />
                      <span>사진 {task.photosUploaded.length}장 업로드됨</span>
                    </div>
                  )}

                  {/* 청구서 정보 */}
                  {task.billing && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-purple-900">청구서</span>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-purple-900">{task.billing.total?.toLocaleString()} THB</p>
                          <div className="flex gap-1">
                            {task.billing.proformaIssued && <Badge variant="outline" className="text-xs">Proforma</Badge>}
                            {task.billing.finalIssued && <Badge variant="outline" className="text-xs">Final</Badge>}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 메모 */}
                  {task.notes && (
                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <div>
                          <p className="font-medium text-yellow-900 text-sm">메모</p>
                          <p className="text-sm text-yellow-800">{task.notes}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 작업 버튼들 */}
                  <div className="flex gap-2 pt-2">
                    {/* 창고 도착 확인 */}
                    {task.type === 'warehouse_arrival' && task.status === 'pending' && (
                      <Button 
                        onClick={() => {
                          setSelectedTask(task);
                          setModalType('arrival');
                          setModalData({});
                        }}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Package className="h-4 w-4 mr-2" />
                        창고도착 확인
                      </Button>
                    )}

                    {/* 리패킹 작업 */}
                    {task.arrivalDate && task.repackingRequested && !task.repackingCompleted && (
                      <Button 
                        onClick={() => {
                          setSelectedTask(task);
                          setModalType('repacking');
                          setModalData({});
                        }}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        <Wrench className="h-4 w-4 mr-2" />
                        리패킹 완료
                      </Button>
                    )}

                    {/* 청구서 발행 */}
                    {task.actualWeight && (!task.repackingRequested || task.repackingCompleted) && !task.billing?.proformaIssued && (
                      <Button 
                        onClick={() => {
                          setSelectedTask(task);
                          setModalType('billing');
                          setModalData({});
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        청구서 발행
                      </Button>
                    )}

                    {/* 고객 연락 */}
                    <Button 
                      variant="outline"
                      onClick={() => window.open(`tel:${task.customerPhone}`)}
                      className="border-blue-300 text-blue-600 hover:bg-blue-50"
                    >
                      <Phone className="h-4 w-4" />
                    </Button>

                    {/* 상세 보기 */}
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedTask(task)}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 창고 도착 확인 모달 */}
      <Dialog open={modalType === 'arrival'} onOpenChange={() => setModalType(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>창고 도착 확인</DialogTitle>
            <DialogDescription>
              {selectedTask?.orderNumber} - 실제 무게를 측정하고 상품 상태를 확인해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">실제 무게 (kg) *</label>
              <Input
                type="number"
                step="0.1"
                placeholder="예: 2.5"
                value={modalData.actualWeight || ''}
                onChange={(e) => setModalData({...modalData, actualWeight: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">상품 상태 메모</label>
              <Textarea
                placeholder="상품 상태, 포장 상태 등을 기록해주세요..."
                value={modalData.notes || ''}
                onChange={(e) => setModalData({...modalData, notes: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setModalType(null)} className="flex-1">
                취소
              </Button>
              <Button onClick={() => handleArrivalConfirm(selectedTask!)} className="flex-1">
                확인 완료
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 리패킹 완료 모달 */}
      <Dialog open={modalType === 'repacking'} onOpenChange={() => setModalType(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>리패킹 작업 완료</DialogTitle>
            <DialogDescription>
              {selectedTask?.orderNumber} - 리패킹 작업을 완료하고 사진을 업로드해주세요.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">업로드할 사진 수 *</label>
              <Input
                type="number"
                min="1"
                placeholder="예: 3"
                value={modalData.photoCount || ''}
                onChange={(e) => setModalData({...modalData, photoCount: e.target.value})}
              />
              <p className="text-xs text-gray-500 mt-1">리패킹 전후 사진을 업로드해주세요</p>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">리패킹 내용</label>
              <Textarea
                placeholder="분할 포장 내용, 특이사항 등을 기록해주세요..."
                value={modalData.repackingNotes || ''}
                onChange={(e) => setModalData({...modalData, repackingNotes: e.target.value})}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setModalType(null)} className="flex-1">
                취소
              </Button>
              <Button onClick={() => handleRepackingComplete(selectedTask!)} className="flex-1">
                작업 완료
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 청구서 발행 모달 */}
      <Dialog open={modalType === 'billing'} onOpenChange={() => setModalType(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>청구서 발행</DialogTitle>
            <DialogDescription>
              {selectedTask?.orderNumber} - 최종 비용을 산정하여 청구서를 발행합니다.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">기본 배송비 (THB) *</label>
              <Input
                type="number"
                placeholder="예: 85000"
                value={modalData.shippingFee || ''}
                onChange={(e) => setModalData({...modalData, shippingFee: e.target.value})}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">현지 배송비 (THB)</label>
              <Input
                type="number"
                placeholder="예: 25000"
                value={modalData.localFee || ''}
                onChange={(e) => setModalData({...modalData, localFee: e.target.value})}
              />
            </div>
            {selectedTask?.repackingCompleted && (
              <div>
                <label className="text-sm font-medium mb-2 block">리패킹 비용 (THB)</label>
                <Input
                  type="number"
                  placeholder="예: 15000"
                  value={modalData.repackingFee || ''}
                  onChange={(e) => setModalData({...modalData, repackingFee: e.target.value})}
                />
              </div>
            )}
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                * TAX 7%가 자동으로 계산되어 최종 금액에 포함됩니다.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setModalType(null)} className="flex-1">
                취소
              </Button>
              <Button onClick={() => handleBillingCreate(selectedTask!)} className="flex-1">
                청구서 발행
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}