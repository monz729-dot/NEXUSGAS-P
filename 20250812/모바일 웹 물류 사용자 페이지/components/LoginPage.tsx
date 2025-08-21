import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  AlertTriangle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { User, PageProps } from '../types';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface LoginPageProps extends Omit<PageProps, 'user'> {
  onLogin: (userData: User) => void;
}

export function LoginPage({ onLogin, onNavigate }: LoginPageProps) {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'info'>('info');
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  // Mock 사용자 데이터
  const mockUsers: Record<string, { password: string; userData: User }> = {
    'general@example.com': {
      password: 'password123',
      userData: {
        id: 'USER-001',
        type: 'general',
        name: '김일반',
        email: 'general@example.com',
        phone: '010-1234-5678',
      },
    },
    'corporate@example.com': {
      password: 'password123',
      userData: {
        id: 'USER-002',
        type: 'corporate',
        name: '이기업',
        email: 'corporate@example.com',
        phone: '02-1234-5678',
        companyName: '(주)테스트기업',
        businessNumber: '123-45-67890',
        contactPerson: '김담당',
        contactPhone: '010-9876-5432',
      },
    },

    'admin@example.com': {
      password: 'admin123',
      userData: {
        id: 'USER-003',
        type: 'admin',
        name: '관리자',
        email: 'admin@example.com',
        phone: '02-9999-8888',
      },
    },
    'partner@example.com': {
      password: 'partner123',
      userData: {
        id: 'USER-004',
        type: 'partner',
        name: '파트너',
        email: 'partner@example.com',
        phone: '02-7777-8888',
        companyName: '(주)파트너물류',
        businessNumber: '987-65-43210',
        contactPerson: '박파트',
        contactPhone: '010-1111-2222',
      },
    },
  };

  // 컴포넌트 마운트 시 저장된 로그인 정보 확인
  useEffect(() => {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      setFormData(prev => ({ ...prev, email: rememberedUser, rememberMe: true }));
    }
    
    // 첫 번째 입력 필드에 포커스
    emailInputRef.current?.focus();
  }, []);

  // 알림 메시지 자동 숨김
  useEffect(() => {
    if (alertMessage) {
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [alertMessage]);

  // 이메일 유효성 검사
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // 폼 데이터 변경 핸들러
  const handleInputChange = (field: keyof LoginFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 기존 에러 메시지 제거
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // 폼 유효성 검사
  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof LoginFormData, string>> = {};
    
    if (!formData.email.trim()) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!validateEmail(formData.email)) {
      errors.email = '올바른 이메일 형식을 입력해주세요.';
    }
    
    if (!formData.password.trim()) {
      errors.password = '비밀번호를 입력해주세요.';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // 로그인 처리
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setAlertMessage('입력 정보를 확인해주세요.');
      setAlertType('error');
      return;
    }

    setIsLoading(true);
    setAlertMessage('');

    try {
      // Mock 로그인 처리
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = mockUsers[formData.email];
      
      // operator 계정 로그인 시도 체크
      if (formData.email.includes('operator@')) {
        throw new Error('오퍼레이터 계정은 더 이상 지원하지 않습니다. 관리자에게 문의해주세요.');
      }
      
      if (!mockUser || mockUser.password !== formData.password) {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

      // 로그인 정보 저장
      if (formData.rememberMe) {
        localStorage.setItem('rememberedUser', formData.email);
      } else {
        localStorage.removeItem('rememberedUser');
      }

      setAlertMessage('로그인이 완료되었습니다.');
      setAlertType('success');

      // 성공 후 사용자 데이터 전달
      setTimeout(() => {
        onLogin(mockUser.userData);
      }, 1000);

    } catch (error) {
      setAlertMessage(error instanceof Error ? error.message : '로그인에 실패했습니다.');
      setAlertType('error');
    } finally {
      setIsLoading(false);
    }
  };

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent, nextRef?: React.RefObject<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (nextRef?.current) {
        nextRef.current.focus();
      } else {
        handleSubmit(e as any);
      }
    }
  };

  // 테스트 계정 빠른 로그인
  const handleQuickLogin = (userType: 'general' | 'corporate' | 'partner' | 'admin') => {
    const email = `${userType}@example.com`;
    let password = 'password123';
    if (userType === 'admin') password = 'admin123';
    if (userType === 'partner') password = 'partner123';
    
    setFormData({
      email,
      password,
      rememberMe: false,
    });
    
    setAlertMessage(`${userType} 계정 정보가 입력되었습니다.`);
    setAlertType('info');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* 로고 및 타이틀 */}
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce-in">
            <span className="text-white font-bold text-xl">YCS</span>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-blue-900">YCS 물류 시스템</h1>
            <p className="text-blue-600">안전하고 신뢰할 수 있는 물류 서비스</p>
          </div>
        </div>

        {/* 로그인 폼 */}
        <Card className="shadow-lg border-blue-100">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-blue-900">로그인</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* 이메일 입력 */}
              <div className="space-y-2">
                <Label 
                  htmlFor="email" 
                  className="text-blue-900 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" />
                  이메일
                  <span className="text-red-500" aria-label="필수 입력">*</span>
                </Label>
                <div className="relative">
                  <Input
                    ref={emailInputRef}
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, passwordInputRef)}
                    placeholder="example@company.com"
                    className={`h-12 px-4 bg-blue-50/30 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      fieldErrors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                    disabled={isLoading}
                    autoComplete="email"
                    required
                  />
                  {fieldErrors.email && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <AlertTriangle className="h-4 w-4 text-red-500" aria-hidden="true" />
                    </div>
                  )}
                </div>
                {fieldErrors.email && (
                  <p id="email-error" className="text-sm text-red-600" role="alert">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* 비밀번호 입력 */}
              <div className="space-y-2">
                <Label 
                  htmlFor="password" 
                  className="text-blue-900 flex items-center gap-2"
                >
                  <Lock className="h-4 w-4" />
                  비밀번호
                  <span className="text-red-500" aria-label="필수 입력">*</span>
                </Label>
                <div className="relative">
                  <Input
                    ref={passwordInputRef}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e)}
                    placeholder="비밀번호를 입력하세요"
                    className={`h-12 px-4 pr-12 bg-blue-50/30 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${
                      fieldErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''
                    }`}
                    aria-invalid={!!fieldErrors.password}
                    aria-describedby={fieldErrors.password ? 'password-error' : undefined}
                    disabled={isLoading}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-blue-600 hover:text-blue-700 transition-colors"
                    aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p id="password-error" className="text-sm text-red-600" role="alert">
                    {fieldErrors.password}
                  </p>
                )}
              </div>

              {/* 로그인 유지 체크박스 */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="rememberMe"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => handleInputChange('rememberMe', !!checked)}
                  disabled={isLoading}
                  aria-describedby="remember-description"
                />
                <Label 
                  htmlFor="rememberMe" 
                  className="text-sm text-blue-700 cursor-pointer"
                >
                  로그인 상태 유지
                </Label>
              </div>
              <p id="remember-description" className="text-xs text-blue-600 ml-6">
                공용 컴퓨터에서는 사용하지 마세요
              </p>

              {/* 로그인 버튼 */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" aria-hidden="true" />
                    <span>로그인 중...</span>
                  </>
                ) : (
                  '로그인'
                )}
              </Button>
            </form>

            {/* 링크 섹션 */}
            <div className="mt-6 space-y-4">
              <div className="flex justify-center space-x-4 text-sm">
                <button
                  onClick={() => onNavigate('find-id')}
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  disabled={isLoading}
                >
                  아이디 찾기
                </button>
                <span className="text-blue-300">|</span>
                <button
                  onClick={() => onNavigate('find-password')}
                  className="text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                  disabled={isLoading}
                >
                  비밀번호 찾기
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-blue-600 mb-2">아직 계정이 없으신가요?</p>
                <Button
                  onClick={() => onNavigate('signup')}
                  variant="outline"
                  disabled={isLoading}
                  className="w-full bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                >
                  회원가입
                </Button>
              </div>

              {/* 알림 메시지 */}
              {alertMessage && (
                <Alert 
                  className={`animate-scale-in ${
                    alertType === 'success' ? 'bg-green-50 border-green-200 text-green-800' :
                    alertType === 'error' ? 'bg-red-50 border-red-200 text-red-800' :
                    'bg-blue-50 border-blue-200 text-blue-800'
                  }`}
                  role="alert"
                  aria-live="polite"
                >
                  {alertType === 'success' && <CheckCircle className="h-4 w-4" />}
                  {alertType === 'error' && <AlertTriangle className="h-4 w-4" />}
                  <AlertDescription>{alertMessage}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 테스트 계정 빠른 로그인 */}
        <Card className="border-blue-100 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-sm text-blue-900">테스트 계정</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'general' as const, label: '일반회원' },
                { type: 'corporate' as const, label: '기업회원' },
                { type: 'partner' as const, label: '파트너' },
                { type: 'admin' as const, label: '관리자' },
              ].map(({ type, label }) => (
                <Button
                  key={type}
                  onClick={() => handleQuickLogin(type)}
                  variant="ghost"
                  size="sm"
                  disabled={isLoading}
                  className="text-blue-700 hover:bg-blue-50"
                >
                  {label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}