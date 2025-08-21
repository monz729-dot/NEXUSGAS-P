import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { 
  Search, 
  Home, 
  User, 
  Package, 
  FileText, 
  CreditCard, 
  Settings, 
  HelpCircle, 
  UserPlus, 
  LogIn, 
  Shield, 
  Truck, 
  Building2, 
  BarChart3,
  Clock,
  Eye,
  ArrowLeft,
  ExternalLink,
  Info,
  CheckCircle,
  AlertCircle,
  Copy,
  Database
} from 'lucide-react';
import { User as UserType } from '../types';

interface PageListProps {
  user: UserType | null;
  onNavigate: (page: string, options?: { orderId?: string }) => void;
}

interface PageInfo {
  id: string;
  name: string;
  description: string;
  category: 'auth' | 'common' | 'general' | 'corporate' | 'admin' | 'partner';
  icon: React.ReactNode;
  userTypes: string[];
  requiresLogin: boolean;
  hasParams?: boolean;
  params?: { [key: string]: string };
}

export function PageList({ user, onNavigate }: PageListProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 전체 페이지 정보
  const pages: PageInfo[] = [
    // 인증 관련 페이지
    {
      id: 'login',
      name: '로그인',
      description: '시스템 로그인 페이지',
      category: 'auth',
      icon: <LogIn className="h-4 w-4" />,
      userTypes: ['all'],
      requiresLogin: false
    },
    {
      id: 'signup',
      name: '회원가입',
      description: '새 계정 생성 페이지',
      category: 'auth',
      icon: <UserPlus className="h-4 w-4" />,
      userTypes: ['all'],
      requiresLogin: false
    },
    {
      id: 'signup-complete',
      name: '일반/기업 회원가입 완료',
      description: '일반/기업 회원가입 완료 (즉시 승인)',
      category: 'auth',
      icon: <CheckCircle className="h-4 w-4" />,
      userTypes: ['all'],
      requiresLogin: false,
      hasParams: true,
      params: { userType: 'general' }
    },
    {
      id: 'signup-pending',
      name: '파트너 가입 승인 대기',
      description: '파트너 가입 신청 완료 (승인 대기)',
      category: 'auth',
      icon: <Clock className="h-4 w-4" />,
      userTypes: ['all'],
      requiresLogin: false,
      hasParams: true,
      params: { userType: 'partner' }
    },
    {
      id: 'find-id',
      name: '아이디 찾기',
      description: '분실된 아이디 찾기 페이지',
      category: 'auth',
      icon: <Search className="h-4 w-4" />,
      userTypes: ['all'],
      requiresLogin: false
    },
    {
      id: 'find-password',
      name: '비밀번호 찾기',
      description: '분실된 비밀번호 찾기 페이지',
      category: 'auth',
      icon: <Search className="h-4 w-4" />,
      userTypes: ['all'],
      requiresLogin: false
    },

    // 공통 페이지
    {
      id: 'notices',
      name: '공지사항',
      description: '시스템 공지사항 확인',
      category: 'common',
      icon: <Info className="h-4 w-4" />,
      userTypes: ['general', 'corporate', 'admin', 'partner'],
      requiresLogin: true
    },
    {
      id: 'faq',
      name: 'FAQ',
      description: '자주 묻는 질문과 답변',
      category: 'common',
      icon: <HelpCircle className="h-4 w-4" />,
      userTypes: ['general', 'corporate', 'admin', 'partner'],
      requiresLogin: true
    },
    {
      id: 'workflow-simulator',
      name: '워크플로우 시뮬레이터',
      description: '배송 프로세스 시뮬레이션',
      category: 'common',
      icon: <BarChart3 className="h-4 w-4" />,
      userTypes: ['general', 'corporate', 'admin', 'partner'],
      requiresLogin: true
    },

    // 일반 회원 페이지
    {
      id: 'dashboard',
      name: '개인 고객 대시보드',
      description: '일반 회원 메인 대시보드',
      category: 'general',
      icon: <Home className="h-4 w-4" />,
      userTypes: ['general'],
      requiresLogin: true
    },
    {
      id: 'mypage',
      name: '개인 정보 관리',
      description: '개인정보 관리 및 설정',
      category: 'general',
      icon: <User className="h-4 w-4" />,
      userTypes: ['general'],
      requiresLogin: true
    },
    {
      id: 'order-form',
      name: '개인 배송 접수',
      description: '개인 고객 배송 주문 작성',
      category: 'general',
      icon: <Package className="h-4 w-4" />,
      userTypes: ['general'],
      requiresLogin: true
    },
    {
      id: 'order-history',
      name: '개인 주문 내역',
      description: '개인 고객 배송 주문 내역',
      category: 'general',
      icon: <FileText className="h-4 w-4" />,
      userTypes: ['general'],
      requiresLogin: true
    },
    {
      id: 'order-detail',
      name: '개인 주문 상세',
      description: '개인 고객 주문 상세 정보',
      category: 'general',
      icon: <Eye className="h-4 w-4" />,
      userTypes: ['general'],
      requiresLogin: true,
      hasParams: true,
      params: { orderId: 'YCS-2024-001' }
    },
    {
      id: 'payment',
      name: '개인 무통장 입금',
      description: '개인 고객 청구서 결제',
      category: 'general',
      icon: <CreditCard className="h-4 w-4" />,
      userTypes: ['general'],
      requiresLogin: true,
      hasParams: true,
      params: { orderId: 'YCS-2024-001' }
    },

    // 기업 회원 페이지
    {
      id: 'dashboard',
      name: '기업 고객 대시보드',
      description: '기업 회원 메인 대시보드',
      category: 'corporate',
      icon: <Building2 className="h-4 w-4" />,
      userTypes: ['corporate'],
      requiresLogin: true,
      hasParams: true,
      params: { userType: 'corporate' }
    },
    {
      id: 'mypage',
      name: '기업 정보 관리',
      description: '기업정보 관리 및 설정',
      category: 'corporate',
      icon: <Building2 className="h-4 w-4" />,
      userTypes: ['corporate'],
      requiresLogin: true
    },
    {
      id: 'order-form',
      name: '기업 대량 배송 접수',
      description: '기업 고객 대량 배송 주문',
      category: 'corporate',
      icon: <Package className="h-4 w-4" />,
      userTypes: ['corporate'],
      requiresLogin: true
    },
    {
      id: 'order-history',
      name: '기업 주문 내역',
      description: '기업 고객 배송 주문 내역',
      category: 'corporate',
      icon: <FileText className="h-4 w-4" />,
      userTypes: ['corporate'],
      requiresLogin: true
    },
    {
      id: 'order-detail',
      name: '기업 주문 상세',
      description: '기업 고객 주문 상세 정보',
      category: 'corporate',
      icon: <Eye className="h-4 w-4" />,
      userTypes: ['corporate'],
      requiresLogin: true,
      hasParams: true,
      params: { orderId: 'YCS-2024-001', userType: 'corporate' }
    },
    {
      id: 'payment',
      name: '기업 정산 결제',
      description: '기업 고객 정산 및 결제',
      category: 'corporate',
      icon: <CreditCard className="h-4 w-4" />,
      userTypes: ['corporate'],
      requiresLogin: true,
      hasParams: true,
      params: { orderId: 'YCS-2024-001', userType: 'corporate' }
    },

    // 관리자 페이지
    {
      id: 'admin-dashboard',
      name: '관리자 대시보드',
      description: '관리자 메인 대시보드',
      category: 'admin',
      icon: <Shield className="h-4 w-4" />,
      userTypes: ['admin'],
      requiresLogin: true
    },
    {
      id: 'admin-orders',
      name: '전체 주문 관리',
      description: '전체 주문 관리 및 처리',
      category: 'admin',
      icon: <Package className="h-4 w-4" />,
      userTypes: ['admin'],
      requiresLogin: true
    },
    {
      id: 'admin-order-detail',
      name: '관리자 주문 상세',
      description: '관리자 주문 상세 정보',
      category: 'admin',
      icon: <Eye className="h-4 w-4" />,
      userTypes: ['admin'],
      requiresLogin: true,
      hasParams: true,
      params: { orderId: 'YCS-2024-001' }
    },

    // 파트너 페이지
    {
      id: 'partner-dashboard',
      name: '파트너 대시보드',
      description: '파트너 메인 대시보드',
      category: 'partner',
      icon: <Building2 className="h-4 w-4" />,
      userTypes: ['partner'],
      requiresLogin: true
    },
    {
      id: 'partner-tasks',
      name: '파트너 업무',
      description: '창고 관리 및 청구서 발행',
      category: 'partner',
      icon: <Truck className="h-4 w-4" />,
      userTypes: ['partner'],
      requiresLogin: true
    },
    {
      id: 'partner-orders',
      name: '파트너 주문 관리',
      description: '파트너 담당 주문 관리',
      category: 'partner',
      icon: <Package className="h-4 w-4" />,
      userTypes: ['partner'],
      requiresLogin: true
    },
    {
      id: 'partner-history',
      name: '파트너 이력',
      description: '파트너 업무 이력 확인',
      category: 'partner',
      icon: <Clock className="h-4 w-4" />,
      userTypes: ['partner'],
      requiresLogin: true
    },
    {
      id: 'partner-settlement',
      name: '파트너 정산',
      description: '파트너 수수료 정산 관리',
      category: 'partner',
      icon: <BarChart3 className="h-4 w-4" />,
      userTypes: ['partner'],
      requiresLogin: true
    }
  ];

  // 카테고리 정보
  const categories = [
    { 
      id: 'auth', 
      name: '인증 시스템', 
      description: '로그인, 회원가입, 계정 관리',
      icon: <LogIn className="h-5 w-5" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    { 
      id: 'common', 
      name: '공통 페이지', 
      description: '모든 사용자 공통 기능',
      icon: <Database className="h-5 w-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      id: 'general', 
      name: '일반 회원', 
      description: '개인 고객 전용 페이지',
      icon: <User className="h-5 w-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      id: 'corporate', 
      name: '기업 회원', 
      description: '기업 고객 전용 페이지',
      icon: <Building2 className="h-5 w-5" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    { 
      id: 'admin', 
      name: '관리자', 
      description: '시스템 관리자 전용',
      icon: <Shield className="h-5 w-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    { 
      id: 'partner', 
      name: '파트너', 
      description: '물류 파트너 전용',
      icon: <Truck className="h-5 w-5" />,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }
  ];

  // 사용자 권한 확인 - 모든 페이지를 기본적으로 접근 가능하게 변경
  const hasAccess = (page: PageInfo): boolean => {
    // 로그인이 필요없는 페이지는 모두 접근 가능
    if (!page.requiresLogin) return true;
    
    // 로그인이 필요한 페이지도 PageList에서는 모두 접근 가능하게 표시
    // 실제 접근 시 자동 로그인이 처리됨
    return true;
  };

  // 검색 필터링
  const getFilteredPages = (categoryId: string) => {
    let filtered = pages.filter(page => page.category === categoryId);

    if (searchTerm) {
      filtered = filtered.filter(page => 
        page.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        page.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  // 페이지 이동 핸들러
  const handleNavigateToPage = (page: PageInfo) => {
    if (page.hasParams && page.params) {
      onNavigate(page.id, page.params);
    } else {
      onNavigate(page.id);
    }
  };

  // URL 복사 핸들러
  const handleCopyUrl = (page: PageInfo) => {
    const url = `?page=${page.id}${page.params ? Object.entries(page.params).map(([k, v]) => `&${k}=${v}`).join('') : ''}`;
    navigator.clipboard.writeText(window.location.origin + window.location.pathname + url);
    alert('URL이 클립보드에 복사되었습니다!');
  };

  // 사용자 타입별 통계
  const getStats = () => {
    const total = pages.length;
    const accessible = pages.filter(hasAccess).length;
    const byCategory = categories.reduce((acc, cat) => {
      acc[cat.id] = pages.filter(p => p.category === cat.id && hasAccess(p)).length;
      return acc;
    }, {} as Record<string, number>);

    return { total, accessible, byCategory };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        {user ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (user.type === 'admin') {
                onNavigate('admin-dashboard');
              } else if (user.type === 'partner') {
                onNavigate('partner-dashboard');
              } else if (user.type === 'corporate') {
                onNavigate('dashboard', { userType: 'corporate' });
              } else {
                onNavigate('dashboard');
              }
            }}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            대시보드로
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate('login')}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <LogIn className="h-4 w-4 mr-2" />
            로그인하기
          </Button>
        )}
        <div>
          <h1 className="text-xl text-blue-900">YCS 물류 시스템 - 전체 페이지 목록</h1>
          <p className="text-sm text-blue-600">
            {user ? `${user.name}님이 접근 가능한 페이지: ${stats.accessible}/${stats.total}개` : `로그인하여 더 많은 페이지에 접근하세요 (${stats.total}개 페이지 이용 가능)`}
          </p>
        </div>
      </div>

      {/* 현재 사용자 정보 */}
      {user ? (
        <Card className="shadow-blue border-blue-100 bg-green-50/30">
          <CardHeader>
            <CardTitle className="text-green-900 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              현재 로그인 정보
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-green-700">이름</p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">이메일</p>
                <p className="font-medium text-sm">{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-green-700">사용자 타입</p>
                <Badge variant="outline" className="mt-1 border-green-300 text-green-700">
                  {user.type === 'general' && '일반회원'}
                  {user.type === 'corporate' && '기업회원'}
                  {user.type === 'admin' && '관리자'}
                  {user.type === 'partner' && '파트너'}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-green-700">접근 가능 페이지</p>
                <p className="font-medium text-green-600">{stats.accessible}개</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-blue border-orange-100 bg-orange-50/30">
          <CardHeader>
            <CardTitle className="text-orange-900 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              로그인이 필요합니다
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-orange-800">
              더 많은 페이지에 접근하려면 로그인이 필요합니다. 각 페이지 접근 시 자동으로 해당 사용자 타입으로 로그인됩니다.
            </p>
            <div className="flex gap-4">
              <Button
                onClick={() => onNavigate('login')}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <LogIn className="h-4 w-4 mr-2" />
                로그인하기
              </Button>
              <Button
                variant="outline"
                onClick={() => onNavigate('signup')}
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                회원가입
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 통계 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {categories.map(cat => (
          <Card key={cat.id} className={`shadow-blue ${cat.borderColor}`}>
            <CardContent className="p-4 text-center">
              <div className={`text-2xl font-bold ${cat.color}`}>{stats.byCategory[cat.id] || 0}</div>
              <div className={`text-sm ${cat.color}`}>{cat.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 검색 */}
      <Card className="shadow-blue border-blue-100">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600/60" />
            <Input
              type="text"
              placeholder="페이지명, 설명, ID로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* 카테고리별 테이블 */}
      <div className="space-y-8">
        {categories.map((category) => {
          const filteredPages = getFilteredPages(category.id);
          
          if (filteredPages.length === 0 && searchTerm) {
            return null; // 검색 결과가 없으면 카테고리 자체를 숨김
          }

          return (
            <Card key={category.id} className={`shadow-blue ${category.borderColor} ${category.bgColor}/30`}>
              <CardHeader>
                <CardTitle className={`${category.color} flex items-center gap-3`}>
                  {category.icon}
                  <div>
                    <div className="flex items-center gap-3">
                      <span>{category.name}</span>
                      <Badge variant="outline" className={`${category.color} ${category.borderColor}`}>
                        {filteredPages.length}개 페이지
                      </Badge>
                    </div>
                    <p className={`text-sm ${category.color}/70 font-normal mt-1`}>
                      {category.description}
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredPages.length > 0 ? (
                  <div className="rounded-lg border border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50/50">
                          <TableHead className="w-12"></TableHead>
                          <TableHead className="font-medium">페이지명</TableHead>
                          <TableHead className="font-medium">설명</TableHead>
                          <TableHead className="font-medium text-center">접근 권한</TableHead>
                          <TableHead className="font-medium text-center">로그인 필요</TableHead>
                          <TableHead className="font-medium text-center">파라미터</TableHead>
                          <TableHead className="font-medium text-center">페이지 ID</TableHead>
                          <TableHead className="font-medium text-center">작업</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPages.map((page, index) => {
                          const canAccess = hasAccess(page);
                          // 같은 ID의 페이지가 여러개일 경우 고유 키 생성
                          const uniqueKey = `${page.id}-${category.id}-${index}`;
                          
                          return (
                            <TableRow 
                              key={uniqueKey}
                              className="hover:bg-gray-50/50 transition-colors"
                            >
                              <TableCell>
                                <div className="flex items-center justify-center">
                                  {page.icon}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{page.name}</span>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                </div>
                              </TableCell>
                              <TableCell>
                                <span className="text-sm text-gray-700">{page.description}</span>
                              </TableCell>
                              <TableCell className="text-center">
                                <div className="flex flex-wrap justify-center gap-1">
                                  {page.userTypes.map((type) => (
                                    <Badge key={type} variant="secondary" className="text-xs">
                                      {type === 'all' ? '전체' :
                                       type === 'general' ? '일반' :
                                       type === 'corporate' ? '기업' :
                                       type === 'admin' ? '관리자' :
                                       type === 'partner' ? '파트너' : type}
                                    </Badge>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {page.requiresLogin ? (
                                  <Badge variant="destructive" className="text-xs">필요</Badge>
                                ) : (
                                  <Badge variant="outline" className="text-xs">불필요</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                {page.hasParams ? (
                                  <div className="space-y-1">
                                    <Badge variant="outline" className="text-xs mb-1">있음</Badge>
                                    {page.params && (
                                      <div className="text-xs text-orange-600">
                                        {Object.entries(page.params).map(([key, value]) => 
                                          `${key}=${value}`
                                        ).join(', ')}
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <Badge variant="outline" className="text-xs">없음</Badge>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                  {page.id}
                                </code>
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-center gap-1">
                                  <Button
                                    onClick={() => handleNavigateToPage(page)}
                                    size="sm"
                                    className="h-8 px-3"
                                  >
                                    <ExternalLink className="h-3 w-3 mr-1" />
                                    이동
                                  </Button>
                                  
                                  {page.hasParams && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleCopyUrl(page)}
                                      className="h-8 px-2"
                                    >
                                      <Copy className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">페이지가 없습니다</h3>
                    <p className="text-gray-600">
                      {searchTerm ? '검색 조건에 맞는 페이지가 없습니다.' : '해당 카테고리에 페이지가 없습니다.'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 도움말 */}
      <Card className="shadow-blue border-green-100 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            사용 방법
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm text-green-800">
            <p>• <strong>검색</strong>: 상단 검색창에서 페이지명, 설명, ID로 검색할 수 있습니다</p>
            <p>• <strong>카테고리별 분류</strong>: 일반회원, 기업회원이 각각 분리된 테이블로 제공됩니다</p>
            <p>• <strong>자동 로그인</strong>: 페이지 접근 시 해당 사용자 타입으로 자동 로그인됩니다</p>
            <p>• <strong>페이지 이동</strong>: "이동" 버튼으로 해당 페이지로 바로 이동합니다</p>
            <p>• <strong>URL 복사</strong>: 파라미터가 있는 페이지는 복사 버튼으로 직접 링크를 복사할 수 있습니다</p>
            <p>• <strong>회원가입 완료</strong>: 일반/기업은 즉시 승인, 파트너는 관리자 승인 대기로 구분됩니다</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}