import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { DollarSign, TrendingUp, Calendar, Download, Info, BarChart3, Clock, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';
import { User } from '../App';

interface PartnerSettlementProps {
  user: User | null;
  onNavigate: (page: string) => void;
}

interface SettlementSummary {
  currentMonth: number;
  lastMonth: number;
  totalEarned: number;
  pendingAmount: number;
}

interface SettlementRecord {
  id: string;
  period: string;
  orderCount: number;
  totalRevenue: number;
  commission: number;
  commissionRate: number;
  status: 'paid' | 'pending' | 'processing';
  paidDate?: string;
  dueDate?: string;
}

interface OrderCommission {
  orderId: string;
  date: string;
  customer: string;
  items: string;
  orderAmount: number;
  commissionRate: number;
  commission: number;
  status: 'paid' | 'pending';
}

export function PartnerSettlement({ user, onNavigate }: PartnerSettlementProps) {
  const [settlementSummary] = useState<SettlementSummary>({
    currentMonth: 245000,
    lastMonth: 198000,
    totalEarned: 2480000,
    pendingAmount: 87000
  });

  const [settlementRecords] = useState<SettlementRecord[]>([
    {
      id: 'SET-2024-12',
      period: '2024년 12월',
      orderCount: 89,
      totalRevenue: 8900000,
      commission: 245000,
      commissionRate: 2.75,
      status: 'pending',
      dueDate: '2025-01-05'
    },
    {
      id: 'SET-2024-11',
      period: '2024년 11월',
      orderCount: 76,
      totalRevenue: 7200000,
      commission: 198000,
      commissionRate: 2.75,
      status: 'paid',
      paidDate: '2024-12-05'
    },
    {
      id: 'SET-2024-10',
      period: '2024년 10월',
      orderCount: 82,
      totalRevenue: 8100000,
      commission: 222750,
      commissionRate: 2.75,
      status: 'paid',
      paidDate: '2024-11-05'
    },
    {
      id: 'SET-2024-09',
      period: '2024년 9월',
      orderCount: 67,
      totalRevenue: 6300000,
      commission: 173250,
      commissionRate: 2.75,
      status: 'paid',
      paidDate: '2024-10-05'
    }
  ]);

  const [orderCommissions] = useState<OrderCommission[]>([
    {
      orderId: 'YCS-2024-156',
      date: '2024-12-10',
      customer: '김○○',
      items: '의류 5개',
      orderAmount: 250000,
      commissionRate: 2.75,
      commission: 6875,
      status: 'pending'
    },
    {
      orderId: 'YCS-2024-155',
      date: '2024-12-10',
      customer: '이○○',
      items: '전자제품 2개',
      orderAmount: 420000,
      commissionRate: 2.75,
      commission: 11550,
      status: 'pending'
    },
    {
      orderId: 'YCS-2024-154',
      date: '2024-12-09',
      customer: '박○○',
      items: '건강식품 10개',
      orderAmount: 180000,
      commissionRate: 2.75,
      commission: 4950,
      status: 'pending'
    },
    {
      orderId: 'YCS-2024-153',
      date: '2024-12-09',
      customer: '최○○',
      items: '화장품 8개',
      orderAmount: 320000,
      commissionRate: 2.75,
      commission: 8800,
      status: 'pending'
    }
  ]);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return '지급완료';
      case 'pending':
        return '지급대기';
      case 'processing':
        return '처리중';
      default:
        return '알 수 없음';
    }
  };

  const downloadSettlementReport = (settlementId: string) => {
    // 정산 내역서 다운로드 시뮬레이션
    const csvContent = `정산 ID,정산 기간,주문 건수,총 매출,수수료율,수수료 금액,지급 상태
${settlementId},2024년 12월,89건,₩8900000,2.75%,₩245000,지급대기`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${settlementId}_정산내역서.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const growthRate = ((settlementSummary.currentMonth - settlementSummary.lastMonth) / settlementSummary.lastMonth * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl text-blue-900">정산 관리</h1>
        <Tooltip>
          <TooltipTrigger asChild>
            <DollarSign className="h-4 w-4 text-green-600 cursor-help hover:text-green-700 transition-colors" />
          </TooltipTrigger>
          <TooltipContent className="bg-blue-900 text-white max-w-sm border-l-4 border-l-green-500">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-400" />
                <span className="font-medium text-green-400">파트너 수수료 정산</span>
              </div>
              <div className="text-sm space-y-2">
                <p>제휴 마케팅을 통한 수수료 정산 관리:</p>
                <div className="bg-gray-700 p-2 rounded text-xs">
                  <p>• 월별 정산: 매월 말일 마감</p>
                  <p>• 지급일: 익월 5일 계좌 입금</p>
                  <p>• 수수료율: 주문금액의 2.75%</p>
                  <p>• 정산 내역서 다운로드 가능</p>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* 정산 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-blue border-blue-100">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-green-600">₩{settlementSummary.currentMonth.toLocaleString()}</p>
            <p className="text-sm text-green-700">이번 달 수수료</p>
          </CardContent>
        </Card>

        <Card className="shadow-blue border-blue-100">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">{growthRate}%</p>
            <p className="text-sm text-blue-700">전월 대비 증가</p>
          </CardContent>
        </Card>

        <Card className="shadow-blue border-blue-100">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-orange-600">₩{settlementSummary.pendingAmount.toLocaleString()}</p>
            <p className="text-sm text-orange-700">지급 대기</p>
          </CardContent>
        </Card>

        <Card className="shadow-blue border-blue-100">
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-purple-600">₩{settlementSummary.totalEarned.toLocaleString()}</p>
            <p className="text-sm text-purple-700">누적 수익</p>
          </CardContent>
        </Card>
      </div>

      {/* 정산 상세 탭 */}
      <Tabs defaultValue="monthly" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-blue-50/50">
          <TabsTrigger value="monthly" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              월별 정산
            </div>
          </TabsTrigger>
          <TabsTrigger value="commission" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            <div className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              주문별 수수료
            </div>
          </TabsTrigger>
        </TabsList>

        {/* 월별 정산 탭 */}
        <TabsContent value="monthly" className="space-y-4">
          <Card className="shadow-blue border-blue-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-blue-900">월별 정산 내역</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-blue-600 cursor-help hover:text-blue-700 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-blue-900 text-white max-w-sm border-l-4 border-l-blue-500">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-400" />
                        <span className="font-medium text-blue-400">월별 정산 프로세스</span>
                      </div>
                      <div className="text-sm space-y-2">
                        <p>매월 정산 처리 과정:</p>
                        <div className="bg-gray-700 p-2 rounded text-xs">
                          <p>1. 매월 말일: 해당월 주문 마감</p>
                          <p>2. 익월 1-3일: 정산 계산 및 검토</p>
                          <p>3. 익월 5일: 파트너 계좌로 입금</p>
                          <p>4. 정산 내역서 이메일 발송</p>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {settlementRecords.map((record) => (
                  <div key={record.id} className="p-4 border border-blue-100 rounded-lg bg-blue-50/30">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-medium text-blue-900">{record.period}</h3>
                        <p className="text-sm text-blue-600">정산 ID: {record.id}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(record.status)}>
                          {getStatusText(record.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">주문 건수</p>
                        <p className="font-medium text-blue-900">{record.orderCount}건</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">총 매출</p>
                        <p className="font-medium text-blue-900">₩{record.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">수수료율</p>
                        <p className="font-medium text-blue-900">{record.commissionRate}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">수수료 금액</p>
                        <p className="font-medium text-green-600">₩{record.commission.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                      <div className="text-sm text-blue-600">
                        {record.status === 'paid' && record.paidDate && (
                          <span>지급일: {record.paidDate}</span>
                        )}
                        {record.status === 'pending' && record.dueDate && (
                          <span>예정일: {record.dueDate}</span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadSettlementReport(record.id)}
                              className="border-blue-200 text-blue-600 hover:bg-blue-50"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              내역서
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="bg-blue-900 text-white border-l-4 border-l-cyan-500">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Download className="h-4 w-4 text-cyan-400" />
                                <span className="font-medium text-cyan-400">정산 내역서 다운로드</span>
                              </div>
                              <p className="text-sm">CSV 파일로 정산 내역을 다운로드</p>
                              <p className="text-xs">세무신고 및 장부 관리용</p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 주문별 수수료 탭 */}
        <TabsContent value="commission" className="space-y-4">
          <Card className="shadow-blue border-blue-100">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CardTitle className="text-blue-900">이번 달 주문별 수수료</CardTitle>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CreditCard className="h-4 w-4 text-purple-600 cursor-help hover:text-purple-700 transition-colors" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-blue-900 text-white max-w-sm border-l-4 border-l-purple-500">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-purple-400" />
                        <span className="font-medium text-purple-400">주문별 수수료 계산</span>
                      </div>
                      <div className="text-sm space-y-2">
                        <p>각 주문별 수수료 계산 방식:</p>
                        <div className="bg-gray-700 p-2 rounded text-xs">
                          <p>• 기본 수수료율: 2.75%</p>
                          <p>• 계산식: 주문금액 × 수수료율</p>
                          <p>• 실시간 반영: 주문 완료 시 적용</p>
                          <p>• 월말 정산: 해당월 전체 합계</p>
                        </div>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orderCommissions.map((order) => (
                  <div key={order.orderId} className="p-3 border border-blue-100 rounded-lg bg-blue-50/30">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-blue-900">{order.orderId}</p>
                        <p className="text-sm text-blue-600">{order.date} | {order.customer}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">₩{order.commission.toLocaleString()}</p>
                        <p className="text-xs text-gray-600">{order.commissionRate}%</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="text-gray-600">{order.items}</p>
                        <p className="text-blue-700">주문금액: ₩{order.orderAmount.toLocaleString()}</p>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-800">이번 달 예상 수수료</p>
                    <p className="text-sm text-green-600">총 {orderCommissions.length}건의 주문</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-700">
                      ₩{orderCommissions.reduce((sum, order) => sum + order.commission, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-green-600">지급 예정</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* 정산 안내 */}
      <Card className="shadow-blue border-blue-100">
        <CardHeader>
          <CardTitle className="text-blue-900">정산 안내</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800">정산 기준 안내</p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• 매월 말일 23:59까지 완료된 주문에 대해 정산</li>
                    <li>• 기본 수수료율 2.75% (주문금액 기준)</li>
                    <li>• 익월 5일 등록된 계좌로 자동 입금</li>
                    <li>• 최소 정산 금액: 10,000원 이상</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800">주의사항</p>
                  <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                    <li>• 계좌 정보 변경은 정산일 3일 전까지 요청</li>
                    <li>• 세금계산서는 별도 신청 필요</li>
                    <li>• 정산 내역 문의는 고객센터로 연락</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 하단 여백 */}
      <div className="pb-20"></div>
    </div>
  );
}