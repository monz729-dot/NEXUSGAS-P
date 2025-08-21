import React, { useState, useEffect } from 'react';
import { User, UserType } from './types';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { SignupCompletePage } from './components/SignupCompletePage';
import { SignupPendingPage } from './components/SignupPendingPage';
import { FindIdPage } from './components/FindIdPage';
import { FindPasswordPage } from './components/FindPasswordPage';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { MyPage } from './components/MyPage';
import { OrderForm } from './components/OrderForm';
import { OrderHistory } from './components/OrderHistory';
import { OrderDetailPage } from './components/OrderDetailPage';
import { PaymentPage } from './components/PaymentPage';
import { NoticesPage } from './components/NoticesPage';
import { FAQPage } from './components/FAQPage';
import { MobileNavigation } from './components/MobileNavigation';
import { WorkflowSimulator } from './components/WorkflowSimulator';
import { AdminMyPage } from './components/AdminMyPage';
import { AdminNavigation } from './components/AdminNavigation';
import { AdminOrderManagement } from './components/AdminOrderManagement';
import { AdminOrderDetailPage } from './components/AdminOrderDetailPage';
import { Footer } from './components/Footer';
import { PartnerDashboard } from './components/PartnerDashboard';
import { PartnerHistory } from './components/PartnerHistory';
import { PartnerMyPage } from './components/PartnerMyPage';
import { PartnerNavigation } from './components/PartnerNavigation';
import { PartnerOrderManagement } from './components/PartnerOrderManagement';
import { PartnerSettlement } from './components/PartnerSettlement';
import { PartnerTasks } from './components/PartnerTasks';
import { PageList } from './components/PageList';

// 페이지별 필요한 사용자 타입 매핑
const getRequiredUserTypeForPage = (page: string): UserType | null => {
  const pageUserTypeMap: Record<string, UserType | null> = {
    // 인증 페이지 (로그인 불필요)
    'login': null,
    'signup': null,
    'signup-complete': null,
    'signup-pending': null,
    'find-id': null,
    'find-password': null,
    'page-list': null,
    
    // 공통 페이지 (일반 사용자로 처리)
    'notices': 'general',
    'faq': 'general',
    'workflow-simulator': 'general',
    
    // 일반/기업 회원 페이지
    'dashboard': 'general', // 기본값은 일반, URL 파라미터로 변경 가능
    'mypage': 'general',
    'order-form': 'general',
    'order-history': 'general',
    'order-detail': 'general',
    'payment': 'general',
    
    // 관리자 페이지
    'admin-dashboard': 'admin',
    'admin-orders': 'admin',
    'admin-order-detail': 'admin',
    
    // 파트너 페이지
    'partner-dashboard': 'partner',
    'partner-orders': 'partner',
    'partner-history': 'partner',
    'partner-settlement': 'partner',
    'partner-tasks': 'partner'
  };
  
  return pageUserTypeMap[page] || null;
};

// Mock 사용자 생성 함수
const createMockUser = (userType: UserType, userSubType?: 'general' | 'corporate'): User => {
  const baseUsers = {
    general: {
      id: 'user-general-001',
      email: 'user@ycs-logistics.com',
      name: '김일반',
      type: 'general' as UserType,
      phone: '010-1234-5678',
      address: '서울특별시 강남구 테헤란로 123',
      joinDate: '2024-01-15',
      lastLogin: new Date().toISOString()
    },
    corporate: {
      id: 'corp-business-001',
      email: 'business@company.co.kr',
      name: '(주)비즈니스컴퍼니',
      type: 'corporate' as UserType,
      phone: '02-1234-5678',
      address: '서울특별시 중구 을지로 456',
      businessNumber: '123-45-67890',
      joinDate: '2024-01-10',
      lastLogin: new Date().toISOString()
    },
    admin: {
      id: 'admin-system-001',
      email: 'admin@ycs-logistics.com',
      name: '시스템관리자',
      type: 'admin' as UserType,
      phone: '02-9876-5432',
      address: '서울특별시 서초구 강남대로 789',
      department: '운영팀',
      joinDate: '2023-12-01',
      lastLogin: new Date().toISOString()
    },
    partner: {
      id: 'partner-logistics-001',
      email: 'partner@logistics-partner.com',
      name: '물류파트너(주)',
      type: 'partner' as UserType,
      phone: '02-5555-7777',
      address: '인천광역시 중구 항동 물류단지 101',
      businessNumber: '987-65-43210',
      partnerCode: 'P-2024-001',
      joinDate: '2024-01-05',
      lastLogin: new Date().toISOString()
    }
  };

  if (userType === 'corporate' || (userType === 'general' && userSubType === 'corporate')) {
    return baseUsers.corporate;
  } else if (userType === 'admin') {
    return baseUsers.admin;
  } else if (userType === 'partner') {
    return baseUsers.partner;
  } else {
    return baseUsers.general;
  }
};

// 로딩 컴포넌트
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
      <p className="text-blue-600 font-medium">로딩 중...</p>
    </div>
  </div>
);

// 접근 권한 없음 페이지
const AccessDeniedPage = ({ userType, onNavigate }: { userType: string; onNavigate: (page: string) => void }) => (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
    <div className="text-center max-w-md">
      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-3xl">🚫</span>
      </div>
      <h2 className="text-2xl font-bold text-blue-900 mb-4">접근 권한이 없습니다</h2>
      <p className="text-blue-600 mb-6">
        {userType === 'admin' && '관리자는 이 기능을 사용할 수 없습니다.'}
        {userType === 'partner' && '파트너는 주문서 작성 기능을 사용할 수 없습니다. 파트너 전용 업무를 수행해주세요.'}
        {!['admin', 'partner'].includes(userType) && '이 페이지에 접근할 권한이 없습니다.'}
      </p>
      <button
        onClick={() => onNavigate('page-list')}
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
      >
        페이지 목록으로 돌아가기
      </button>
    </div>
  </div>
);

// 페이지 전환 애니메이션 래퍼
const PageWrapper = ({ children, isVisible }: { children: React.ReactNode; isVisible: boolean }) => (
  <div className={`transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
    {children}
  </div>
);

export default function App() {
  // 기본 페이지를 page-list로 변경
  const [currentPage, setCurrentPage] = useState<string>('page-list');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [signupUserType, setSignupUserType] = useState<'general' | 'corporate' | 'partner'>('general');

  // 주문 상세 페이지를 위한 상태
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  // 자동 로그인 처리 함수
  const handleAutoLogin = (page: string, urlParams: URLSearchParams) => {
    const requiredUserType = getRequiredUserTypeForPage(page);
    
    if (requiredUserType && !user) {
      // URL에서 사용자 타입 확인 (일반/기업 구분용)
      const userSubType = urlParams.get('userType') as 'general' | 'corporate';
      
      // 대시보드 페이지의 경우 URL 파라미터로 기업/일반 구분
      let finalUserType = requiredUserType;
      if (page === 'dashboard' && userSubType === 'corporate') {
        finalUserType = 'corporate';
      }
      
      const mockUser = createMockUser(finalUserType, userSubType);
      setUser(mockUser);
      
      console.log(`자동 로그인 처리: ${page} 페이지 접근을 위해 ${finalUserType} 사용자로 로그인`);
    }
  };

  // URL 파라미터에서 페이지 정보 읽기
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    const userType = urlParams.get('userType');
    const orderId = urlParams.get('orderId');
    const mockUserData = urlParams.get('mockUser');

    // URL에 페이지 파라미터가 있으면 해당 페이지로, 없으면 페이지 리스트로 설정
    if (page) {
      setCurrentPage(page);
      
      // Mock user 데이터가 URL에 있으면 우선 처리
      if (mockUserData) {
        try {
          const parsedUser = JSON.parse(decodeURIComponent(mockUserData));
          setUser(parsedUser);
          localStorage.setItem('mockUser', JSON.stringify(parsedUser));
        } catch (e) {
          console.error('Mock user 데이터 파싱 오류:', e);
          // 파싱 실패시 자동 로그인 처리
          handleAutoLogin(page, urlParams);
        }
      } else {
        // 자동 로그인 처리
        handleAutoLogin(page, urlParams);
      }
      
      // 회원가입 완료 페이지의 경우 userType 설정
      if ((page.startsWith('signup-complete') || page.startsWith('signup-pending')) && userType) {
        setSignupUserType(userType as any);
      }
      
      // 주문 상세 페이지의 경우 orderId 설정
      if ((page === 'order-detail' || page === 'admin-order-detail' || page === 'payment') && orderId) {
        setSelectedOrderId(orderId);
      }
    } else {
      // URL에 페이지 파라미터가 없으면 페이지 리스트로 설정
      setCurrentPage('page-list');
    }
  }, []);

  // 페이지 접근 권한 확인
  const hasPageAccess = (page: string, userType?: UserType): boolean => {
    if (!userType) return true;
    
    switch (page) {
      case 'order-form':
        // 관리자, 파트너는 주문서 작성 불가
        return userType === 'general' || userType === 'corporate';
      case 'payment':
        // 일반/기업 회원만 결제 페이지 접근 가능
        return userType === 'general' || userType === 'corporate';
      case 'admin-orders':
      case 'admin-order-detail':
        // 관리자 전용 페이지
        return userType === 'admin';
      case 'partner-dashboard':
      case 'partner-orders':
      case 'partner-history':
      case 'partner-settlement':
      case 'partner-tasks':
        // 파트너 전용 페이지
        return userType === 'partner';
      default:
        return true;
    }
  };

  // 페이지 전환 시 부드러운 애니메이션 효과
  const handleNavigate = (page: string, options?: { userType?: 'general' | 'corporate' | 'partner'; orderId?: string }) => {
    // operator 타입 사용자 체크 (더 이상 지원하지 않음)
    if (user && (user.type as string) === 'operator') {
      console.warn('오퍼레이터 계정은 더 이상 지원하지 않습니다. 관리자에게 문의해주세요.');
      handleLogout();
      return;
    }

    setPageVisible(false);
    setIsLoading(true);
    
    // 회원가입 완료 페이지의 경우 userType 저장
    if ((page.startsWith('signup-complete') || page.startsWith('signup-pending')) && options?.userType) {
      setSignupUserType(options.userType);
    }
    
    // 주문 상세 페이지 및 결제 페이지의 경우 orderId 저장
    if ((page === 'order-detail' || page === 'admin-order-detail' || page === 'payment') && options?.orderId) {
      setSelectedOrderId(options.orderId);
    }

    // 페이지 변경 전 필요한 사용자 타입 확인 및 자동 로그인
    const requiredUserType = getRequiredUserTypeForPage(page);
    if (requiredUserType && (!user || user.type !== requiredUserType)) {
      // 사용자 타입이 다르거나 로그인하지 않은 경우 자동 로그인
      let finalUserType = requiredUserType;
      if (page === 'dashboard' && options?.userType === 'corporate') {
        finalUserType = 'corporate';
      }
      
      const mockUser = createMockUser(finalUserType, options?.userType);
      setUser(mockUser);
      console.log(`페이지 이동 중 자동 로그인: ${page} 페이지 접근을 위해 ${finalUserType} 사용자로 로그인`);
    }
    
    setTimeout(() => {
      setCurrentPage(page);
      setIsLoading(false);
      setPageVisible(true);
    }, 300);
  };

  // 로그인 처리
  const handleLogin = (userData: User) => {
    // operator 타입은 더 이상 지원하지 않음
    if ((userData.type as string) === 'operator') {
      alert('오퍼레이터 계정은 더 이상 지원하지 않습니다. 관리자에게 문의해주세요.');
      return;
    }
    
    setUser(userData);
    setIsLoading(true);
    
    setTimeout(() => {
      // 사용자 유형에 따라 적절한 대시보드로 이동
      if (userData.type === 'admin') {
        handleNavigate('admin-dashboard');
      } else if (userData.type === 'partner') {
        handleNavigate('partner-dashboard');
      } else {
        handleNavigate('dashboard');
      }
      setIsLoading(false);
    }, 800);
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setUser(null);
      localStorage.removeItem('rememberedUser');
      localStorage.removeItem('mockUser');
      handleNavigate('page-list'); // 로그아웃 후 페이지 리스트로 이동
      setIsLoading(false);
    }, 500);
  };

  // 초기 로드 시 저장된 로그인 정보 확인
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    const mockUser = localStorage.getItem('mockUser');
    
    // URL에 특정 페이지가 지정되어 있지 않은 경우에만 저장된 로그인 정보 처리
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page');
    
    if (!page && mockUser && !user) {
      try {
        const parsedMockUser = JSON.parse(mockUser);
        
        // operator 타입이면 데이터를 삭제하고 페이지 리스트로 이동
        if (parsedMockUser.type === 'operator') {
          localStorage.removeItem('mockUser');
          localStorage.removeItem('rememberedUser');
          setCurrentPage('page-list');
          console.log('오퍼레이터 계정이 제거되었습니다. 다시 로그인해주세요.');
          return;
        }
        
        setUser(parsedMockUser);
        
        // Mock user가 있어도 일단 페이지 리스트를 보여주고 사용자가 선택할 수 있도록 함
        // 단, URL에 특정 페이지가 없는 경우에만
        setCurrentPage('page-list');
        
      } catch (e) {
        console.error('Mock user 로드 오류:', e);
        // 파싱 오류가 있으면 저장된 데이터를 정리
        localStorage.removeItem('mockUser');
        localStorage.removeItem('rememberedUser');
        setCurrentPage('page-list');
      }
    } else if (!page && rememberedUser) {
      try {
        const parsedRememberedUser = JSON.parse(rememberedUser);
        // operator 타입이면 데이터를 삭제
        if (parsedRememberedUser.type === 'operator') {
          localStorage.removeItem('rememberedUser');
          localStorage.removeItem('mockUser');
          console.log('오퍼레이터 계정이 제거되었습니다.');
        }
        setCurrentPage('page-list');
      } catch (e) {
        // 파싱 오류가 있으면 저장된 데이터를 정리
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('mockUser');
        setCurrentPage('page-list');
      }
    }
  }, [user]);

  // 키보드 네비게이션 지원
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // ESC 키로 모달 닫기 등
      if (event.key === 'Escape') {
        // 필요한 경우 모달 닫기 로직
      }
      
      // 접근성: Tab 키 네비게이션 개선
      if (event.key === 'Tab') {
        // 포커스 트랩 로직 필요시 추가
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const renderPage = () => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    // 접근 권한 확인
    if (user && !hasPageAccess(currentPage, user.type)) {
      return <AccessDeniedPage userType={user.type} onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case 'page-list':
        return <PageList user={user} onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onNavigate={handleNavigate} />;
      case 'signup':
        return <SignupPage onNavigate={handleNavigate} />;
      case 'signup-complete':
        return <SignupCompletePage onNavigate={handleNavigate} userType={signupUserType} />;
      case 'signup-pending':
        return <SignupPendingPage onNavigate={handleNavigate} userType="partner" />;
      case 'find-id':
        return <FindIdPage onNavigate={handleNavigate} />;
      case 'find-password':
        return <FindPasswordPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard user={user} onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return <AdminDashboard user={user} onNavigate={handleNavigate} />;
      case 'partner-dashboard':
        return <PartnerDashboard user={user} onNavigate={handleNavigate} />;
      case 'mypage':
        // 사용자 타입에 따라 적절한 마이페이지로 이동
        if (user?.type === 'admin') {
          return <AdminMyPage user={user} onNavigate={handleNavigate} />;
        } else if (user?.type === 'partner') {
          return <PartnerMyPage user={user} onNavigate={handleNavigate} />;
        } else {
          return <MyPage user={user} onNavigate={handleNavigate} />;
        }
      case 'order-form':
        // 관리자, 파트너는 접근 불가
        if (user?.type === 'admin') {
          return <AccessDeniedPage userType="admin" onNavigate={handleNavigate} />;
        } else if (user?.type === 'partner') {
          return <AccessDeniedPage userType="partner" onNavigate={handleNavigate} />;
        } else {
          return <OrderForm user={user} onNavigate={handleNavigate} />;
        }
      case 'order-history':
        return <OrderHistory user={user} onNavigate={handleNavigate} />;
      case 'order-detail':
        return <OrderDetailPage onNavigate={handleNavigate} orderId={selectedOrderId} />;
      case 'payment':
        return <PaymentPage user={user} onNavigate={handleNavigate} orderId={selectedOrderId} />;
      case 'notices':
        return <NoticesPage onNavigate={handleNavigate} user={user} />;
      case 'faq':
        return <FAQPage onNavigate={handleNavigate} user={user} />;
      case 'workflow-simulator':
        return <WorkflowSimulator onNavigate={handleNavigate} user={user} />;
      
      // 관리자 전용 페이지
      case 'admin-orders':
        return <AdminOrderManagement user={user} onNavigate={handleNavigate} />;
      case 'admin-order-detail':
        return <AdminOrderDetailPage orderId={selectedOrderId} onNavigate={handleNavigate} />;
      
      // 파트너 전용 페이지
      case 'partner-orders':
        return <PartnerOrderManagement user={user} onNavigate={handleNavigate} />;
      case 'partner-history':
        return <PartnerHistory user={user} onNavigate={handleNavigate} />;
      case 'partner-settlement':
        return <PartnerSettlement user={user} onNavigate={handleNavigate} />;
      case 'partner-tasks':
        return <PartnerTasks user={user} onNavigate={handleNavigate} />;
      
      // 기본값: 페이지 리스트
      default:
        return <PageList user={user} onNavigate={handleNavigate} />;
    }
  };

  const shouldShowNavigation = () => {
    return user && (user.type === 'general' || user.type === 'corporate');
  };

  const shouldShowPartnerNavigation = () => {
    return user && user.type === 'partner';
  };

  const shouldShowAdminNavigation = () => {
    return user && user.type === 'admin';
  };

  const shouldShowFooter = () => {
    return shouldShowNavigation() && !['login', 'signup', 'find-id', 'find-password', 'order-detail', 'payment', 'page-list'].includes(currentPage);
  };

  return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* 일반/기업 회원용 상단 네비게이션 */}
        {shouldShowNavigation() && (
          <MobileNavigation 
            currentPage={currentPage} 
            onNavigate={handleNavigate}
            onLogout={handleLogout}
            user={user}
          />
        )}
        
        {/* 관리자용 상단 네비게이션 */}
        {shouldShowAdminNavigation() && ['admin-dashboard'].includes(currentPage) && (
          <header className="bg-white border-b border-blue-100 shadow-sm">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold">YCS</span>
                </div>
                <div>
                  <h1 className="font-semibold text-blue-900">YCS 물류 시스템</h1>
                  <p className="text-xs text-blue-600">
                    관리자 | {user?.name}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => handleNavigate('page-list')}
                  className="text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1 rounded-full transition-colors"
                >
                  페이지목록
                </button>
                <button 
                  onClick={() => handleNavigate('mypage')}
                  className="text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-3 py-1 rounded-full transition-colors"
                >
                  설정
                </button>
                <button 
                  onClick={handleLogout}
                  className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-full transition-colors"
                >
                  로그아웃
                </button>
              </div>
            </div>
          </header>
        )}
        
        {/* 메인 컨텐츠 */}
        <main className={`flex-1 ${shouldShowNavigation() || shouldShowPartnerNavigation() || shouldShowAdminNavigation() ? 'pb-16' : ''}`} id="main-content">
          <PageWrapper isVisible={pageVisible}>
            {renderPage()}
          </PageWrapper>
        </main>
        {/* 파트너 전용 하단 네비게이션 */}
        {shouldShowPartnerNavigation() && (
          <PartnerNavigation
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}

        
        {/* 관리자 전용 하단 네비게이션 */}
        {shouldShowAdminNavigation() && (
          <AdminNavigation
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogout}
          />
        )}
        
        {/* 푸터 */}
        {shouldShowFooter() && <Footer />}
        
        {/* 접근성: 스킵 링크 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded-md z-50"
        >
          메인 콘텐츠로 건너뛰기
        </a>
      </div>
  );
}