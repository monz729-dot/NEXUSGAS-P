import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  User, 
  Building, 
  Users, 
  Settings, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Package, 
  QrCode, 
  Truck, 
  MapPin,
  ArrowRight,
  FileText,
  CreditCard,
  Warehouse,
  Scan
} from 'lucide-react';

interface WorkflowSimulatorProps {
  onNavigate: (page: string) => void;
}

type UserType = 'general' | 'corporate' | 'partner';
type OrderStatus = 'pending' | 'approved' | 'processing' | 'shipped' | 'delivered';
type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  actor: 'user' | 'admin' | 'partner' | 'ysc';
  status: 'completed' | 'current' | 'pending';
  canProcess: boolean;
};

export function WorkflowSimulator({ onNavigate }: WorkflowSimulatorProps) {
  const [selectedUserType, setSelectedUserType] = useState<UserType>('general');
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');
  const [processingStep, setProcessingStep] = useState(0);

  // 회원가입 워크플로우
  const getSignupWorkflow = (userType: UserType): WorkflowStep[] => {
    const baseSteps = [
      {
        id: 'register',
        title: '회원가입 신청',
        description: '사용자가 회원가입 양식을 작성하고 제출',
        actor: 'user' as const,
        status: 'completed' as const,
        canProcess: true
      }
    ];

    if (userType === 'general') {
      return [
        ...baseSteps,
        {
          id: 'verification',
          title: '이메일 인증',
          description: '이메일 인증을 통한 계정 활성화',
          actor: 'user',
          status: 'current',
          canProcess: true
        },
        {
          id: 'complete',
          title: '가입 완료',
          description: '즉시 서비스 이용 가능',
          actor: 'user',
          status: 'pending',
          canProcess: false
        }
      ];
    } else {
      return [
        ...baseSteps,
        {
          id: 'document_upload',
          title: '서류 제출',
          description: userType === 'corporate' ? '사업자등록증 등 서류 업로드' : '사업자등록증, 계약서 등 서류 업로드',
          actor: 'user',
          status: 'current',
          canProcess: true
        },
        {
          id: 'admin_review',
          title: '관리자 검토',
          description: '제출된 서류 및 신청 내용 검토',
          actor: 'admin',
          status: 'pending',
          canProcess: true
        },
        {
          id: 'approval',
          title: '승인 완료',
          description: '승인 후 서비스 이용 가능',
          actor: 'admin',
          status: 'pending',
          canProcess: false
        }
      ];
    }
  };

  // 주문 처리 워크플로우
  const getOrderWorkflow = (): WorkflowStep[] => {
    const steps = [
      {
        id: 'order_submit',
        title: '주문 접수',
        description: '사용자가 배송 주문을 접수',
        actor: 'user' as const,
        status: processingStep >= 0 ? 'completed' as const : 'current' as const,
        canProcess: true
      },
      {
        id: 'quote_generate',
        title: '견적 생성',
        description: '시스템에서 자동으로 견적 계산',
        actor: 'ysc' as const,
        status: processingStep >= 1 ? 'completed' as const : processingStep === 0 ? 'current' as const : 'pending' as const,
        canProcess: processingStep >= 0
      },
      {
        id: 'order_confirm',
        title: '의뢰 확정',
        description: '사용자가 견적을 확인하고 주문 확정',
        actor: 'user' as const,
        status: processingStep >= 2 ? 'completed' as const : processingStep === 1 ? 'current' as const : 'pending' as const,
        canProcess: processingStep >= 1
      },
      {
        id: 'payment',
        title: '결제 처리',
        description: '선택한 결제 방식으로 결제 완료',
        actor: 'user' as const,
        status: processingStep >= 3 ? 'completed' as const : processingStep === 2 ? 'current' as const : 'pending' as const,
        canProcess: processingStep >= 2
      },
      {
        id: 'qr_generate',
        title: 'QR코드 생성',
        description: '접수용 QR코드 자동 생성',
        actor: 'ysc' as const,
        status: processingStep >= 4 ? 'completed' as const : processingStep === 3 ? 'current' as const : 'pending' as const,
        canProcess: processingStep >= 3
      },
      {
        id: 'warehouse_receive',
        title: '창고 입고',
        description: '물류센터에서 QR코드로 화물 접수',
        actor: 'ysc' as const,
        status: processingStep >= 5 ? 'completed' as const : processingStep === 4 ? 'current' as const : 'pending' as const,
        canProcess: processingStep >= 4
      },
      {
        id: 'partner_assign',
        title: '파트너 배정',
        description: '배송 파트너에게 주문 배정',
        actor: 'admin' as const,
        status: processingStep >= 6 ? 'completed' as const : processingStep === 5 ? 'current' as const : 'pending' as const,
        canProcess: processingStep >= 5
      },
      {
        id: 'partner_process',
        title: '파트너 처리',
        description: '파트너가 QR코드로 화물 픽업 및 배송',
        actor: 'partner' as const,
        status: processingStep >= 7 ? 'completed' as const : processingStep === 6 ? 'current' as const : 'pending' as const,
        canProcess: processingStep >= 6
      },
      {
        id: 'delivery_complete',
        title: '배송 완료',
        description: '최종 목적지 도착 및 배송 완료',
        actor: 'partner' as const,
        status: processingStep >= 8 ? 'completed' as const : processingStep === 7 ? 'current' as const : 'pending' as const,
        canProcess: processingStep >= 7
      }
    ];

    return steps;
  };

  const processNextStep = () => {
    if (processingStep < 8) {
      setProcessingStep(prev => prev + 1);
    }
  };

  const resetWorkflow = () => {
    setProcessingStep(0);
    setCurrentOrderId(null);
    setOrderStatus('pending');
  };

  const startNewOrder = () => {
    const orderId = `YCS-${Date.now().toString().slice(-8)}`;
    setCurrentOrderId(orderId);
    setProcessingStep(0);
    setOrderStatus('pending');
  };

  const getActorInfo = (actor: string) => {
    switch (actor) {
      case 'user':
        return { icon: User, color: 'text-blue-600', bg: 'bg-blue-100', label: '사용자' };
      case 'admin':
        return { icon: Settings, color: 'text-orange-600', bg: 'bg-orange-100', label: '관리자' };
      case 'partner':
        return { icon: Truck, color: 'text-green-600', bg: 'bg-green-100', label: '파트너' };
      case 'ysc':
        return { icon: Building, color: 'text-purple-600', bg: 'bg-purple-100', label: 'YCS' };
      default:
        return { icon: User, color: 'text-gray-600', bg: 'bg-gray-100', label: '시스템' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'current':
        return 'text-blue-600 bg-blue-100';
      case 'pending':
        return 'text-gray-500 bg-gray-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl text-blue-900">워크플로우 시뮬레이터</CardTitle>
                <p className="text-blue-600 mt-2">YCS 물류 시스템의 전체 프로세스를 시뮬레이션합니다</p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => onNavigate('dashboard')}
                className="border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
              >
                대시보드로 돌아가기
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="signup" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-blue-50/50">
            <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
              회원가입 프로세스
            </TabsTrigger>
            <TabsTrigger value="order" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
              주문 처리 프로세스
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
              실시간 모니터링
            </TabsTrigger>
          </TabsList>

          {/* 회원가입 프로세스 탭 */}
          <TabsContent value="signup">
            <div className="space-y-6">
              {/* 사용자 타입 선택 */}
              <Card className="shadow-blue border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900">회원 유형 선택</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { type: 'general' as UserType, label: '일반 회원', icon: User, description: '개인 사용자' },
                      { type: 'corporate' as UserType, label: '기업 회원', icon: Building, description: '기업 담당자' },
                      { type: 'partner' as UserType, label: '파트너', icon: Users, description: '물류 파트너' }
                    ].map(({ type, label, icon: Icon, description }) => (
                      <button
                        key={type}
                        onClick={() => setSelectedUserType(type)}
                        className={`p-4 rounded-lg border-2 flex flex-col items-center gap-3 transition-all duration-300 ${
                          selectedUserType === type
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200/50 hover:border-blue-300 text-gray-600'
                        }`}
                      >
                        <Icon className="h-8 w-8" />
                        <div className="text-center">
                          <div className="font-medium">{label}</div>
                          <div className="text-sm opacity-75">{description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 회원가입 워크플로우 */}
              <Card className="shadow-blue border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900">
                    {selectedUserType === 'general' ? '일반 회원' : 
                     selectedUserType === 'corporate' ? '기업 회원' : '파트너'} 가입 프로세스
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getSignupWorkflow(selectedUserType).map((step, index) => {
                      const actorInfo = getActorInfo(step.actor);
                      const ActorIcon = actorInfo.icon;
                      
                      return (
                        <div 
                          key={step.id}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                            step.status === 'completed' ? 'border-green-200 bg-green-50' :
                            step.status === 'current' ? 'border-blue-200 bg-blue-50' :
                            'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${actorInfo.bg}`}>
                                {step.status === 'completed' ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : step.status === 'current' ? (
                                  <Clock className="h-5 w-5 text-blue-600" />
                                ) : (
                                  <ActorIcon className={`h-5 w-5 ${actorInfo.color}`} />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{step.title}</h4>
                                <p className="text-sm text-gray-600">{step.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={`${getStatusColor(step.status)}`}>
                                {step.status === 'completed' ? '완료' :
                                 step.status === 'current' ? '진행중' : '대기'}
                              </Badge>
                              <Badge variant="outline" className={`${actorInfo.color} border-current`}>
                                {actorInfo.label}
                              </Badge>
                              {step.canProcess && step.status === 'current' && (
                                <Button 
                                  size="sm"
                                  className="bg-blue-600/20 hover:bg-blue-600 border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-300"
                                  onClick={() => onNavigate('signup')}
                                >
                                  처리하기
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 주문 처리 프로세스 탭 */}
          <TabsContent value="order">
            <div className="space-y-6">
              {/* 주문 제어 패널 */}
              <Card className="shadow-blue border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900">주문 시뮬레이션 제어</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <Button 
                      onClick={startNewOrder}
                      className="bg-blue-600/20 hover:bg-blue-600 border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-300"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      새 주문 시작
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={processNextStep}
                      disabled={processingStep >= 8}
                      className="border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      다음 단계
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetWorkflow}
                      className="border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                    >
                      초기화
                    </Button>
                  </div>
                  
                  {currentOrderId && (
                    <Alert className="bg-blue-50 border-blue-200">
                      <Package className="h-4 w-4" />
                      <AlertDescription>
                        <strong>주문번호: {currentOrderId}</strong> | 진행률: {Math.round((processingStep / 8) * 100)}%
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Progress value={(processingStep / 8) * 100} className="mt-4" />
                </CardContent>
              </Card>

              {/* 주문 처리 워크플로우 */}
              <Card className="shadow-blue border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900">주문 처리 워크플로우</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getOrderWorkflow().map((step, index) => {
                      const actorInfo = getActorInfo(step.actor);
                      const ActorIcon = actorInfo.icon;
                      
                      return (
                        <div 
                          key={step.id}
                          className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                            step.status === 'completed' ? 'border-green-200 bg-green-50' :
                            step.status === 'current' ? 'border-blue-200 bg-blue-50' :
                            'border-gray-200 bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${actorInfo.bg}`}>
                                {step.status === 'completed' ? (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                ) : step.status === 'current' ? (
                                  <Clock className="h-5 w-5 text-blue-600 animate-pulse" />
                                ) : (
                                  <ActorIcon className={`h-5 w-5 ${actorInfo.color}`} />
                                )}
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{step.title}</h4>
                                <p className="text-sm text-gray-600">{step.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className={`${getStatusColor(step.status)}`}>
                                {step.status === 'completed' ? '완료' :
                                 step.status === 'current' ? '진행중' : '대기'}
                              </Badge>
                              <Badge variant="outline" className={`${actorInfo.color} border-current`}>
                                {actorInfo.label}
                              </Badge>
                              {step.canProcess && step.status === 'current' && (
                                <Button 
                                  size="sm"
                                  className="bg-blue-600/20 hover:bg-blue-600 border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-300"
                                  onClick={() => {
                                    if (step.id === 'order_submit') onNavigate('order-form');
                                    else if (step.actor === 'admin') onNavigate('admin-dashboard');
                                    else if (step.actor === 'partner') onNavigate('partner-dashboard');
                                    else processNextStep();
                                  }}
                                >
                                  {step.actor === 'user' ? '처리하기' : '대시보드 이동'}
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* 실시간 모니터링 탭 */}
          <TabsContent value="monitoring">
            <div className="space-y-6">
              {/* 시스템 현황 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="shadow-blue border-blue-100">
                  <CardContent className="p-6 text-center">
                    <User className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-blue-900">156</div>
                    <div className="text-sm text-blue-600">활성 사용자</div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-blue border-blue-100">
                  <CardContent className="p-6 text-center">
                    <Package className="h-8 w-8 text-green-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-green-900">42</div>
                    <div className="text-sm text-green-600">처리중 주문</div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-blue border-blue-100">
                  <CardContent className="p-6 text-center">
                    <Truck className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-orange-900">18</div>
                    <div className="text-sm text-orange-600">배송중</div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-blue border-blue-100">
                  <CardContent className="p-6 text-center">
                    <CheckCircle className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                    <div className="text-2xl font-bold text-purple-900">329</div>
                    <div className="text-sm text-purple-600">완료된 배송</div>
                  </CardContent>
                </Card>
              </div>

              {/* QR 코드 처리 현황 */}
              <Card className="shadow-blue border-blue-100">
                <CardHeader>
                  <CardTitle className="text-blue-900">QR 코드 처리 현황</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 'YCS-12345678', status: '입고 완료', location: 'YCS 물류센터', time: '2분 전', type: 'warehouse' },
                      { id: 'YCS-12345679', status: '픽업 완료', location: '배송 파트너', time: '15분 전', type: 'pickup' },
                      { id: 'YCS-12345680', status: '배송 중', location: '태국 방콕', time: '1시간 전', type: 'transit' },
                      { id: 'YCS-12345681', status: '배송 완료', location: '최종 목적지', time: '3시간 전', type: 'delivered' }
                    ].map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 border border-blue-100 rounded-lg bg-blue-50/30">
                        <div className="flex items-center gap-3">
                          <QrCode className="h-5 w-5 text-blue-600" />
                          <div>
                            <div className="font-medium text-blue-900">{item.id}</div>
                            <div className="text-sm text-blue-600">{item.location}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant="outline" 
                            className={
                              item.type === 'delivered' ? 'text-green-600 border-green-300' :
                              item.type === 'transit' ? 'text-orange-600 border-orange-300' :
                              'text-blue-600 border-blue-300'
                            }
                          >
                            {item.status}
                          </Badge>
                          <div className="text-xs text-gray-500 mt-1">{item.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* 액션 버튼들 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                  onClick={() => onNavigate('order-form')}
                >
                  <FileText className="h-6 w-6" />
                  새 주문 등록
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                  onClick={() => onNavigate('order-history')}
                >
                  <Package className="h-6 w-6" />
                  주문 내역
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                  onClick={() => onNavigate('admin-dashboard')}
                >
                  <Settings className="h-6 w-6" />
                  관리자 모드
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300"
                  onClick={() => onNavigate('partner-dashboard')}
                >
                  <Scan className="h-6 w-6" />
                  파트너 모드
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}