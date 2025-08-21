import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { 
  Package, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  AlertTriangle,
  Bell,
  FileText,
  Users,
  DollarSign,
  ArrowRight,
  Calendar,
  Phone
} from 'lucide-react';
import { User, PageProps, Order } from '../types';

interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalAmount: number;
  monthlyGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'delivery' | 'payment';
  title: string;
  description: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

interface DashboardProps extends PageProps {
  user: User | null;
}

export function Dashboard({ user, onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 금액 포매팅
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // 날짜 포매팅
  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 주문 상태별 배지
  const getOrderStatusBadge = (status: string) => {
    const statusMap: Record<string, { className: string; text: string }> = {
      confirmed: { className: 'bg-green-50 text-green-700 border-green-200', text: '확인됨' },
      pending: { className: 'bg-yellow-50 text-yellow-700 border-yellow-200', text: '대기중' },
      rejected: { className: 'bg-red-50 text-red-700 border-red-200', text: '거부됨' },
      delivered: { className: 'bg-blue-50 text-blue-700 border-blue-200', text: '배송완료' },
      shipping: { className: 'bg-purple-50 text-purple-700 border-purple-200', text: '배송중' },
      processing: { className: 'bg-orange-50 text-orange-700 border-orange-200', text: '처리중' },
    };
    
    return statusMap[status] || {
      className: 'bg-gray-50 text-gray-700 border-gray-200',
      text: status,
    };
  };

  // Mock 데이터 로드
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      try {
        // Mock API 호출 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // 통계 데이터
        const mockStats: DashboardStats = {
          totalOrders: 156,
          pendingOrders: 12,
          completedOrders: 144,
          totalAmount: 45600000,
          monthlyGrowth: 12.5,
        };
        
        // 최근 주문 데이터
        const mockRecentOrders: Order[] = [
          {
            id: '1',
            orderNumber: 'ORD-2024-001',
            orderDate: '2024-01-15',
            expectedDate: '2024-01-20',
            status: 'shipping',
            deliveryType: '일반배송',
            customer: {
              type: 'individual',
              id: 'CUST-001',
              email: 'customer1@example.com',
              phone: '010-1234-5678',
              name: '김고객',
            },
            items: [
              {
                id: 'ITEM-001',
                name: '노트북 컴퓨터',
                quantity: 1,
                declaredValue: 800,
                category: '전자제품',
                weight: '2.5kg',
                shippingType: 'air',
              },
            ],
          },
          {
            id: '2',
            orderNumber: 'ORD-2024-002',
            orderDate: '2024-01-14',
            expectedDate: '2024-01-19',
            status: 'pending',
            deliveryType: '특급배송',
            customer: {
              type: 'corporate',
              id: 'CUST-002',
              email: 'company@example.com',
              phone: '02-1234-5678',
              companyName: '(주)테스트',
              contactName: '이담당',
            },
            items: [
              {
                id: 'ITEM-002',
                name: '무선 이어폰',
                quantity: 5,
                declaredValue: 25,
                category: '전자제품',
                weight: '0.1kg',
                shippingType: 'air',
              },
            ],
          },
        ];
        
        // 최근 활동 데이터
        const mockActivity: RecentActivity[] = [
          {
            id: '1',
            type: 'order',
            title: '새 주문 접수',
            description: 'ORD-2024-003 주문이 접수되었습니다',
            time: '2024-01-15 14:30',
            status: 'info',
          },
          {
            id: '2',
            type: 'delivery',
            title: '배송 완료',
            description: 'ORD-2024-001 배송이 완료되었습니다',
            time: '2024-01-15 12:45',
            status: 'success',
          },
          {
            id: '3',
            type: 'payment',
            title: '결제 확인',
            description: '1,250,000원 결제가 확인되었습니다',
            time: '2024-01-15 11:20',
            status: 'success',
          },
        ];
        
        // 알림 데이터
        const mockNotifications = [
          '새로운 배송 알림이 있습니다. 확인해보세요.',
          '대기 중인 주문이 12개 있습니다.',
        ];
        
        setStats(mockStats);
        setRecentOrders(mockRecentOrders);
        setRecentActivity(mockActivity);
        setNotifications(mockNotifications);
        
      } catch (error) {
        console.error('Dashboard 데이터 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-blue-600 font-medium">대시보드를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 사용자 정보가 없는 경우
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-blue-900 mb-4">로그인이 필요합니다</h2>
          <p className="text-blue-600 mb-6">대시보드를 이용하려면 먼저 로그인해주세요.</p>
          <Button
            onClick={() => onNavigate('login')}
            className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3"
          >
            로그인하기
          </Button>
        </div>
      </div>
    );
  }

  // 사용자 타입별 인사말
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    const timeGreeting = hour < 12 ? '좋은 아침입니다' : 
                        hour < 18 ? '안녕하세요' : '좋은 저녁입니다';
    
    const userTypeText = user.type === 'corporate' ? '기업 고객' : '고객';
    
    return `${timeGreeting}, ${user.name} ${userTypeText}님!`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-20">
      <div className="p-4 max-w-6xl mx-auto space-y-6">
        {/* 헤더 섹션 */}
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-900">{getGreeting()}</h1>
              <p className="text-blue-600 mt-1">
                오늘도 안전한 배송을 위해 함께하겠습니다
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-50 text-green-700 border-green-200">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                온라인
              </Badge>
            </div>
          </div>

          {/* 사용자 정보 카드 */}
          <Card className="border-blue-100 bg-white/80 backdrop-blur-sm shadow-lg">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-blue-900">{user.name}</p>
                  <p className="text-sm text-blue-600">{user.email}</p>
                  {user.type === 'corporate' && user.companyName && (
                    <p className="text-xs text-blue-500">{user.companyName}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                  {user.type === 'corporate' ? '기업회원' : '일반회원'}
                </Badge>
                <p className="text-xs text-blue-600 mt-1">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {formatDate(new Date().toISOString())}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 알림 섹션 */}
        {notifications.length > 0 && (
          <div className="space-y-2 animate-slide-up">
            {notifications.map((notification, index) => (
              <Alert 
                key={index}
                className="border-l-4 border-l-blue-500 bg-blue-50"
                role="alert"
                aria-live="polite"
              >
                <Bell className="h-4 w-4" />
                <AlertDescription>{notification}</AlertDescription>
              </Alert>
            ))}
          </div>
        )}

        {/* 통계 카드 섹션 */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-scale-in">
            <Card className="border-blue-200 shadow-lg">
              <CardContent className="p-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Package className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600">총 주문</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.totalOrders.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-lg">
              <CardContent className="p-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600">대기 중</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.pendingOrders.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-lg">
              <CardContent className="p-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600">완료</p>
                  <p className="text-2xl font-bold text-blue-900">{stats.completedOrders.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 shadow-lg">
              <CardContent className="p-6 flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-600">총 결제금액</p>
                  <p className="text-xl font-bold text-blue-900">{formatCurrency(stats.totalAmount)}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">+{stats.monthlyGrowth}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 빠른 액션 버튼 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slide-up">
          <Button
            onClick={() => onNavigate('order-form')}
            className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg flex flex-col items-center justify-center gap-2"
            disabled={user.type === 'partner' || user.type === 'admin'}
          >
            <FileText className="h-5 w-5" />
            주문서 작성
          </Button>

          <Button
            onClick={() => onNavigate('order-history')}
            variant="outline"
            className="h-16 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 flex flex-col items-center justify-center gap-2"
          >
            <ShoppingBag className="h-5 w-5" />
            주문 내역
          </Button>

          <Button
            onClick={() => onNavigate('notices')}
            variant="outline"
            className="h-16 border-blue-300 text-blue-700 hover:bg-blue-50 flex flex-col items-center justify-center gap-2"
          >
            <Bell className="h-5 w-5" />
            공지사항
          </Button>

          <Button
            onClick={() => onNavigate('faq')}
            variant="ghost"
            className="h-16 text-blue-700 hover:bg-blue-50 flex flex-col items-center justify-center gap-2"
          >
            <Phone className="h-5 w-5" />
            고객지원
          </Button>
        </div>

        {/* 최근 주문 및 활동 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 최근 주문 */}
          <Card className="border-blue-100 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-900">최근 주문</CardTitle>
                <Button
                  onClick={() => onNavigate('order-history')}
                  variant="ghost"
                  size="sm"
                  className="text-blue-600 hover:text-blue-700"
                >
                  전체보기
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>

            </CardHeader>
            <CardContent className="space-y-3">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => {
                  const statusBadge = getOrderStatusBadge(order.status);
                  
                  return (
                    <div
                      key={order.id}
                      className="p-3 border border-blue-100 rounded-lg hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() => onNavigate('order-detail', { orderId: order.orderNumber })}
                      role="button"
                      tabIndex={0}
                      aria-label={`주문 ${order.orderNumber} 상세보기`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onNavigate('order-detail', { orderId: order.orderNumber });
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-900">{order.orderNumber}</p>
                          <p className="text-sm text-blue-600">
                            {order.items[0]?.name}
                            {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                          </p>
                          <p className="text-xs text-blue-500 mt-1">
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {formatDate(order.orderDate)}
                          </p>
                        </div>
                        <Badge className={statusBadge.className}>
                          {statusBadge.text}
                        </Badge>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-blue-600">
                  <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>아직 주문 내역이 없습니다</p>
                  <Button
                    onClick={() => onNavigate('order-form')}
                    variant="outline"
                    size="sm"
                    className="mt-3"
                    disabled={user.type === 'partner' || user.type === 'admin'}
                  >
                    첫 주문 하기
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* 최근 활동 */}
          <Card className="border-blue-100 shadow-lg">
            <CardHeader>
              <CardTitle className="text-blue-900">최근 활동</CardTitle>

            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-3 p-3 border border-blue-100 rounded-lg"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activity.status === 'success' ? 'bg-green-100' :
                    activity.status === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {activity.type === 'order' && <FileText className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'delivery' && <Package className="h-4 w-4 text-green-600" />}
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-blue-900">{activity.title}</p>
                    <p className="text-sm text-blue-600">{activity.description}</p>
                    <p className="text-xs text-blue-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* 고객지원 섹션 */}
        <Card className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg">
          <CardContent className="p-6 text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Phone className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">도움이 필요하신가요?</h3>
              <p className="text-blue-600 mb-4">
                궁금한 점이 있으시면 언제든지 고객지원팀에 문의해주세요
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  onClick={() => onNavigate('faq')}
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  FAQ 보기
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-300 text-blue-700 hover:bg-blue-50"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  전화 문의
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}