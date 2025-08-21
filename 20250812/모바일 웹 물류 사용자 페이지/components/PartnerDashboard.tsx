import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from './ui/tooltip';
import { Package, Calculator, TrendingUp, Clock, CheckCircle, AlertCircle, DollarSign, BarChart3, Info, Bell, Navigation, HelpCircle } from 'lucide-react';
import { User } from '../App';

interface PartnerDashboardProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

interface OrderSummary {
  pending: number;
  processing: number;
  completed: number;
  total: number;
}

interface RecentOrder {
  id: string;
  type: 'new' | 'processing' | 'completed';
  description: string;
  time: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed';
}

export function PartnerDashboard({ user, onNavigate }: PartnerDashboardProps) {
  const [orderSummary] = useState<OrderSummary>({
    pending: 8,
    processing: 12,
    completed: 156,
    total: 176
  });

  const [recentOrders] = useState<RecentOrder[]>([
    {
      id: 'YCS-2024-001',
      type: 'new',
      description: '의류 5개 - 태국 방콕',
      time: '10분 전',
      amount: 2500,
      status: 'pending'
    },
    {
      id: 'YCS-2024-002',
      type: 'processing',
      description: '전자제품 2개 - 태국 치앙마이',
      time: '30분 전',
      amount: 4200,
      status: 'processing'
    },
    {
      id: 'YCS-2024-003',
      type: 'completed',
      description: '건강식품 10개 - 태국 파타야',
      time: '1시간 전',
      amount: 3800,
      status: 'completed'
    },
    {
      id: 'YCS-2024-004',
      type: 'completed',
      description: '화장품 8개 - 베트남 호치민',
      time: '2시간 전',
      amount: 1900,
      status: 'completed'
    }
  ]);

  const [monthlyStats] = useState({
    thisMonth: 89,
    lastMonth: 76,
    growth: 17.1,
    revenue: 245000
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-blue-900 mb-4">인증이 필요합니다</h2>
          <p className="text-blue-600">파트너 계정으로 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  const getOrderIcon = (type: string) => {
    switch (type) {
      case 'new':
        return <Package className="h-4 w-4" />;
      case 'processing':
        return <Clock className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'processing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '완료';
      case 'processing':
        return '처리중';
      case 'pending':
        return '대기';
      default:
        return '알 수 없음';
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 space-y-6">
        {/* 헤더 */}
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="space-y-2 cursor-help">
              <h1 className="text-2xl text-blue-900">
                안녕하세요, <span className="font-semibold">{user.name}</span>님!
              </h1>
              <p className="text-blue-600">제휴 마케팅을 통한 주문을 관리하고 정산을 확인하세요.</p>
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-blue-900 text-white max-w-sm border-l-4 border-l-blue-500">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-400" />
                <span className="font-medium text-blue-400">파트너 대시보드</span>
              </div>
              <div className="text-sm space-y-1">
                <p>제휴 마케팅을 통해 생성된 주문을 관리합니다:</p>
                <div className="bg-gray-700 p-2 rounded text-xs">
                  <p>• 폐쇄몰에서 자동 생성된 주문 처리</p>
                  <p>• 주문별 수수료 정산 관리</p>
                  <p>• 월별 성과 및 수익 확인</p>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>

        {/* 주요 통계 카드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="shadow-blue border-blue-100">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-orange-600">{orderSummary.pending}</p>
              <p className="text-sm text-orange-700">대기 중</p>
            </CardContent>
          </Card>

          <Card className="shadow-blue border-blue-100">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{orderSummary.processing}</p>
              <p className="text-sm text-blue-700">처리 중</p>
            </CardContent>
          </Card>

          <Card className="shadow-blue border-blue-100">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-600">{orderSummary.completed}</p>
              <p className="text-sm text-green-700">완료</p>
            </CardContent>
          </Card>

          <Card className="shadow-blue border-blue-100">
            <CardContent className="p-4 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-purple-600">{orderSummary.total}</p>
              <p className="text-sm text-purple-700">전체</p>
            </CardContent>
          </Card>
        </div>

        {/* 월별 성과 */}
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                월별 성과
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <BarChart3 className="h-4 w-4 text-green-600 cursor-help hover:text-green-700 transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="bg-blue-900 text-white max-w-sm border-l-4 border-l-green-500">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-400" />
                      <span className="font-medium text-green-400">월별 성과 지표</span>
                    </div>
                    <div className="text-sm space-y-2">
                      <p>파트너의 월별 활동 성과를 보여줍니다:</p>
                      <div className="bg-gray-700 p-2 rounded text-xs">
                        <p>• 처리 주문 수: 전월 대비 증감</p>
                        <p>• 수수료 수익: 정산 예정 금액</p>
                        <p>• 성장률: 지속적인 성장 추이</p>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-lg">
                <div>
                  <p className="text-sm text-blue-600">이번 달 처리 주문</p>
                  <p className="text-2xl font-bold text-blue-700">{monthlyStats.thisMonth}건</p>
                  <p className="text-sm text-blue-600">지난 달: {monthlyStats.lastMonth}건</p>
                </div>
                <div className="mt-2">
                  <Badge className="bg-green-100 text-green-700 border-green-200">
                    +{monthlyStats.growth}%
                  </Badge>
                </div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-lg">
                <div>
                  <p className="text-sm text-green-600">이번 달 수수료</p>
                  <p className="text-2xl font-bold text-green-700">₩{monthlyStats.revenue.toLocaleString()}</p>
                  <p className="text-sm text-green-600">정산 예정</p>
                </div>
                <div className="mt-2">
                  <Button
                    onClick={() => onNavigate('partner-settlement')}
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white text-xs"
                  >
                    정산 보기
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 빠른 작업 */}
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-blue-900">빠른 작업</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Navigation className="h-4 w-4 text-purple-600 cursor-help hover:text-purple-700 transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="bg-blue-900 text-white max-w-sm border-l-4 border-l-purple-500">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-purple-400" />
                      <span className="font-medium text-purple-400">핵심 기능 바로가기</span>
                    </div>
                    <div className="text-sm space-y-2">
                      <p>파트너가 자주 사용하는 기능들:</p>
                      <div className="bg-gray-700 p-2 rounded text-xs">
                        <p>• 주문 관리: 할당된 주문 확인 및 처리</p>
                        <p>• 정산 관리: 수수료 정산 및 수익 확인</p>
                      </div>
                      <p className="text-purple-300">간소화된 파트너 전용 메뉴</p>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => onNavigate('partner-orders')}
                    className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-none shadow-blue"
                  >
                    <div className="flex items-center gap-3">
                      <Package className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-medium">주문 관리</div>
                        <div className="text-sm opacity-90">제휴 마케팅 주문 처리</div>
                      </div>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-900 text-white border-l-4 border-l-blue-500">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-400" />
                      <span className="font-medium text-blue-400">주문 관리</span>
                    </div>
                    <p className="text-sm">폐쇄몰에서 생성된 주문을 확인하고 처리</p>
                    <p className="text-xs">PartnerOrderManagement.tsx로 이동</p>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={() => onNavigate('partner-settlement')}
                    className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-none shadow-blue"
                  >
                    <div className="flex items-center gap-3">
                      <Calculator className="h-6 w-6" />
                      <div className="text-left">
                        <div className="font-medium">정산 관리</div>
                        <div className="text-sm opacity-90">수수료 및 정산 내역</div>
                      </div>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-blue-900 text-white border-l-4 border-l-green-500">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-green-400" />
                      <span className="font-medium text-green-400">정산 관리</span>
                    </div>
                    <p className="text-sm">파트너 수수료 정산 및 수익 현황</p>
                    <p className="text-xs">PartnerSettlement.tsx로 이동</p>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardContent>
        </Card>

        {/* 최근 주문 */}
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                최근 주문
              </CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-4 w-4 text-cyan-600 cursor-help hover:text-cyan-700 transition-colors" />
                </TooltipTrigger>
                <TooltipContent className="bg-blue-900 text-white max-w-sm border-l-4 border-l-cyan-500">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-cyan-400" />
                      <span className="font-medium text-cyan-400">최근 주문 현황</span>
                    </div>
                    <div className="text-sm space-y-2">
                      <p>제휴 마케팅을 통해 생성된 최근 주문들:</p>
                      <div className="bg-gray-700 p-2 rounded text-xs">
                        <p>• 자동 생성: 폐쇄몰에서 템플릿 적용</p>
                        <p>• 수수료 포함: 각 주문별 예상 수익</p>
                        <p>• 실시간 업데이트: 주문 상태 변경 반영</p>
                      </div>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 p-3 bg-blue-50/30 rounded-lg border border-blue-100/50">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(order.status)}`}>
                    {getOrderIcon(order.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-blue-900">{order.id}</p>
                      <p className="text-sm font-medium text-green-600">₩{order.amount.toLocaleString()}</p>
                    </div>
                    <p className="text-sm text-blue-700">{order.description}</p>
                    <p className="text-xs text-blue-600">{order.time}</p>
                  </div>
                  <Badge variant="outline" className={`border ${getStatusColor(order.status)}`}>
                    {getStatusText(order.status)}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => onNavigate('partner-orders')}
            >
              전체 주문 보기
            </Button>
          </CardContent>
        </Card>

        {/* 중요 공지사항 */}
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900">파트너 공지사항</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-yellow-50/50 rounded-lg border border-yellow-100/50">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">정산 일정 안내</p>
                  <p className="text-sm text-yellow-700">매월 말일 정산 처리되며, 익월 5일 지급됩니다.</p>
                  <p className="text-xs text-yellow-600 mt-1">2024.12.10</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-lg border border-blue-100/50">
                <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">수수료율 변경 안내</p>
                  <p className="text-sm text-blue-700">2025년 1월부터 파트너 수수료율이 조정됩니다.</p>
                  <p className="text-xs text-blue-600 mt-1">2024.12.08</p>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4 border-blue-200 text-blue-600 hover:bg-blue-50"
              onClick={() => onNavigate('notices')}
            >
              전체 공지사항 보기
            </Button>
          </CardContent>
        </Card>

        {/* 하단 여백 */}
        <div className="pb-20"></div>
      </div>
    </TooltipProvider>
  );
}