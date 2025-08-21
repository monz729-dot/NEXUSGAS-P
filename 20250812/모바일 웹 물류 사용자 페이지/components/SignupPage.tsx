import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, User, Building, Users, Eye, EyeOff, Check, Mail, Upload, FileText, CheckCircle, AlertCircle, HelpCircle, Clock, Shield, Navigation, AlertTriangle } from 'lucide-react';

interface SignupPageProps {
  onNavigate: (page: string, options?: { userType?: 'general' | 'corporate' | 'partner' }) => void;
}

export function SignupPage({ onNavigate }: SignupPageProps) {
  const [userType, setUserType] = useState<'general' | 'corporate' | 'partner'>('general');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    name: '',
    email: '',
    phone: '',
    emailVerificationCode: '',
    // 기업 회원용 추가 필드
    companyName: '',
    businessNumber: '',
    businessCertificate: null as File | null,
    contactPerson: '',
    contactPhone: '',

    // 약관 동의
    agreeTerms: false,
    agreePrivacy: false,
    agreeMarketing: false
  });
  
  const [validationState, setValidationState] = useState({
    usernameChecked: false,
    usernameAvailable: false,
    emailVerified: false,
    emailCodeSent: false
  });
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLetter: false,
    hasNumber: false
  });

  // 입력 필드 참조
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const emailVerificationRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const businessNumberRef = useRef<HTMLInputElement>(null);
  const businessCertificateRef = useRef<HTMLInputElement>(null);
  const contactPersonRef = useRef<HTMLInputElement>(null);
  const contactPhoneRef = useRef<HTMLInputElement>(null);


  // 비밀번호 검증 함수
  const validatePassword = (password: string) => {
    const validation = {
      minLength: password.length >= 8,
      hasLetter: /[a-zA-Z]/.test(password),
      hasNumber: /[0-9]/.test(password)
    };
    setPasswordValidation(validation);
    return validation.minLength && validation.hasLetter && validation.hasNumber;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setFormData({ ...formData, password });
    validatePassword(password);
  };

  // 아이디 중복체크
  const checkUsernameAvailability = async () => {
    if (!formData.username.trim()) {
      setError('아이디를 입력해주세요.');
      usernameRef.current?.focus();
      return;
    }

    if (formData.username.length < 4) {
      setError('아이디는 4자 이상이어야 합니다.');
      usernameRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setError('');

    // 데모용 중복체크 로직
    setTimeout(() => {
      const unavailableUsernames = ['admin', 'test', 'user123', 'demo'];
      const isAvailable = !unavailableUsernames.includes(formData.username.toLowerCase());
      
      setValidationState(prev => ({
        ...prev,
        usernameChecked: true,
        usernameAvailable: isAvailable
      }));

      if (!isAvailable) {
        setError('이미 사용 중인 아이디입니다.');
      }
      
      setIsLoading(false);
    }, 1000);
  };

  // 이메일 인증번호 발송
  const sendEmailVerification = async () => {
    if (!formData.email.trim()) {
      setError('이메일을 입력해주세요.');
      emailRef.current?.focus();
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('올바른 이메일 형식을 입력해주세요.');
      emailRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setError('');

    // 데모용 인증번호 발송 로직
    setTimeout(() => {
      setValidationState(prev => ({
        ...prev,
        emailCodeSent: true
      }));
      setIsLoading(false);
      alert('인증번호가 이메일로 전송되었습니다. (데모: 123456)');
    }, 1000);
  };

  // 이메일 인증번호 확인
  const verifyEmailCode = async () => {
    if (!formData.emailVerificationCode.trim()) {
      setError('인증번호를 입력해주세요.');
      emailVerificationRef.current?.focus();
      return;
    }

    setIsLoading(true);
    setError('');

    // 데모용 인증번호 확인 로직
    setTimeout(() => {
      if (formData.emailVerificationCode === '123456') {
        setValidationState(prev => ({
          ...prev,
          emailVerified: true
        }));
        alert('이메일 인증이 완료되었습니다.');
      } else {
        setError('인증번호가 일치하지 않습니다.');
      }
      setIsLoading(false);
    }, 1000);
  };

  // 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 제한 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('파일 크기는 5MB 이하로 업로드해주세요.');
        return;
      }

      // 파일 형식 제한
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('PDF, JPG, PNG 파일만 업로드 가능합니다.');
        return;
      }

      setFormData({ ...formData, businessCertificate: file });
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 포커스 및 에러 표시 함수
    const focusAndHighlight = (ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement>, message: string) => {
      setError(message);
      setIsLoading(false);
      setTimeout(() => {
        ref.current?.focus();
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    };

    // 아이디 검증
    if (!formData.username.trim()) {
      focusAndHighlight(usernameRef, '아이디를 입력해주세요.');
      return;
    }

    if (!validationState.usernameChecked) {
      focusAndHighlight(usernameRef, '아이디 중복체크를 해주세요.');
      return;
    }

    if (!validationState.usernameAvailable) {
      focusAndHighlight(usernameRef, '사용 가능한 아이디로 변경해주세요.');
      return;
    }

    // 이메일 검증
    if (!formData.email.trim()) {
      focusAndHighlight(emailRef, '이메일을 입력해주세요.');
      return;
    }

    if (!validationState.emailVerified) {
      focusAndHighlight(emailRef, '이메일 인증을 완료해주세요.');
      return;
    }

    // 비밀번호 검증
    if (!formData.password) {
      focusAndHighlight(passwordRef, '비밀번호를 입력해주세요.');
      return;
    }

    if (!validatePassword(formData.password)) {
      focusAndHighlight(passwordRef, '비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      focusAndHighlight(confirmPasswordRef, '비밀번호가 일치하지 않습니다.');
      return;
    }

    // 일반회원 전용 필드 검증
    if (userType === 'general') {
      if (!formData.name.trim()) {
        focusAndHighlight(nameRef, '이름을 입력해주세요.');
        return;
      }

      if (!formData.phone.trim()) {
        focusAndHighlight(phoneRef, '연락처를 입력해주세요.');
        return;
      }
    }

    // 기업회원 전용 필드 검증
    if (userType === 'corporate') {
      if (!formData.companyName.trim()) {
        focusAndHighlight(companyNameRef, '회사명을 입력해주세요.');
        return;
      }
      if (!formData.businessNumber.trim()) {
        focusAndHighlight(businessNumberRef, '사업자등록번호를 입력해주세요.');
        return;
      }
      if (!formData.businessCertificate) {
        focusAndHighlight(businessCertificateRef, '사업자등록증을 첨부해주세요.');
        return;
      }
      if (!formData.contactPerson.trim()) {
        focusAndHighlight(contactPersonRef, '담당자 이름을 입력해주세요.');
        return;
      }
      if (!formData.contactPhone.trim()) {
        focusAndHighlight(contactPhoneRef, '담당자 연락처를 입력해주세요.');
        return;
      }
    }

    // 파트너 회원 전용 필드 검증
    if (userType === 'partner') {
      if (!formData.companyName.trim()) {
        focusAndHighlight(companyNameRef, '회사명을 입력해주세요.');
        return;
      }
      if (!formData.businessNumber.trim()) {
        focusAndHighlight(businessNumberRef, '사업자등록번호를 입력해주세요.');
        return;
      }
      if (!formData.businessCertificate) {
        focusAndHighlight(businessCertificateRef, '사업자등록증을 첨부해주세요.');
        return;
      }
      if (!formData.contactPerson.trim()) {
        focusAndHighlight(contactPersonRef, '담당자 이름을 입력해주세요.');
        return;
      }
      if (!formData.contactPhone.trim()) {
        focusAndHighlight(contactPhoneRef, '담당자 연락처를 입력해주세요.');
        return;
      }
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      setError('필수 약관에 동의해주세요.');
      setIsLoading(false);
      return;
    }

    // 데모용 회원가입 로직
    setTimeout(() => {
      // 회원가입 완료 페이지로 이동 (userType 전달)
      onNavigate('signup-complete', { userType });
      setIsLoading(false);
    }, 2000);
  };

  // 비밀번호 검증 표시 컴포넌트
  const PasswordValidationIndicator = () => (
    <div className="mt-2 space-y-1">
      <div className="flex items-center gap-2 text-xs">
        {passwordValidation.minLength ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <AlertCircle className="h-3 w-3 text-gray-400" />
        )}
        <span className={passwordValidation.minLength ? 'text-green-600' : 'text-gray-500'}>
          8자 이상
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {passwordValidation.hasLetter ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <AlertCircle className="h-3 w-3 text-gray-400" />
        )}
        <span className={passwordValidation.hasLetter ? 'text-green-600' : 'text-gray-500'}>
          영문 포함
        </span>
      </div>
      <div className="flex items-center gap-2 text-xs">
        {passwordValidation.hasNumber ? (
          <CheckCircle className="h-3 w-3 text-green-500" />
        ) : (
          <AlertCircle className="h-3 w-3 text-gray-400" />
        )}
        <span className={passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-500'}>
          숫자 포함
        </span>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <Card className="shadow-blue-lg border-blue-100">
          <CardHeader className="text-center pb-8">
            <div className="flex items-center justify-center mb-6">
              <button
                onClick={() => onNavigate('login')}
                className="absolute left-6 p-2 text-blue-600/60 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all opacity-60 hover:opacity-100"
                aria-label="로그인 페이지로 돌아가기"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-blue-900 mb-3">회원가입</CardTitle>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            {/* 회원 유형 선택 */}
            <div className="space-y-4 mb-8">
              <Label className="text-blue-900">회원 유형</Label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('general')}
                  className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-all duration-300 ${
                    userType === 'general'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200/50 hover:border-blue-300 text-gray-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <User className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">일반 회원</div>
                    <div className="text-xs opacity-75">개인 사용자</div>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => setUserType('corporate')}
                  className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-all duration-300 ${
                    userType === 'corporate'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200/50 hover:border-blue-300 text-gray-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Building className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">기업 회원</div>
                    <div className="text-xs opacity-75">기업 담당자</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType('partner')}
                  className={`p-4 rounded-lg border-2 flex items-center gap-3 transition-all duration-300 ${
                    userType === 'partner'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200/50 hover:border-blue-300 text-gray-600 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Users className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">파트너 회원</div>
                    <div className="text-xs opacity-75">제휴마케팅 파트너</div>
                  </div>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 공통 필드 */}
              <div className="space-y-6">
                {/* 아이디 */}
                <div className="space-y-3">
                  <Label htmlFor="username" className="text-blue-900">아이디</Label>
                  <div className="flex gap-3">
                    <Input
                      ref={usernameRef}
                      id="username"
                      type="text"
                      value={formData.username}
                      onChange={(e) => {
                        setFormData({ ...formData, username: e.target.value });
                        setValidationState(prev => ({ ...prev, usernameChecked: false, usernameAvailable: false }));
                      }}
                      placeholder="아이디를 입력하세요 (4자 이상)"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={checkUsernameAvailability}
                      disabled={isLoading || !formData.username.trim()}
                      className="h-14 px-6 border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 opacity-70 hover:opacity-100 transition-all duration-300"
                    >
                      중복확인
                    </Button>
                  </div>
                  {validationState.usernameChecked && (
                    <div className={`flex items-center gap-2 text-sm ${validationState.usernameAvailable ? 'text-green-600' : 'text-red-600'}`}>
                      {validationState.usernameAvailable ? (
                        <>
                          <CheckCircle className="h-4 w-4" />
                          사용 가능한 아이디입니다.
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-4 w-4" />
                          이미 사용 중인 아이디입니다.
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* 이메일 */}
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-blue-900">이메일</Label>
                  <div className="flex gap-3">
                    <Input
                      ref={emailRef}
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        setValidationState(prev => ({ ...prev, emailCodeSent: false, emailVerified: false }));
                      }}
                      placeholder="이메일을 입력해주세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      disabled={validationState.emailVerified}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendEmailVerification}
                      disabled={isLoading || !formData.email.trim() || validationState.emailVerified}
                      className="h-14 px-6 border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 opacity-70 hover:opacity-100 transition-all duration-300"
                    >
                      {validationState.emailCodeSent ? '재발송' : '인증발송'}
                    </Button>
                  </div>
                  
                  {/* 이메일 인증번호 입력 */}
                  {validationState.emailCodeSent && !validationState.emailVerified && (
                    <div className="flex gap-3">
                      <Input
                        ref={emailVerificationRef}
                        type="text"
                        value={formData.emailVerificationCode}
                        onChange={(e) => setFormData({ ...formData, emailVerificationCode: e.target.value })}
                        placeholder="인증번호 6자리"
                        maxLength={6}
                        className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={verifyEmailCode}
                        disabled={isLoading || !formData.emailVerificationCode.trim()}
                        className="h-14 px-6 border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 opacity-70 hover:opacity-100 transition-all duration-300"
                      >
                        확인
                      </Button>
                    </div>
                  )}
                  
                  {validationState.emailVerified && (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      이메일 인증이 완료되었습니다.
                    </div>
                  )}
                </div>

                {/* 비밀번호 */}
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-blue-900">비밀번호</Label>
                  <div className="relative">
                    <Input
                      ref={passwordRef}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handlePasswordChange}
                      placeholder="비밀번호를 입력하세요"
                      className="h-14 px-4 pr-12 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600/60 hover:text-blue-700 transition-colors opacity-70 hover:opacity-100 focus:opacity-100"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  
                  {/* 비밀번호 검증 인디케이터 */}
                  {formData.password && (
                    <div className="p-3 bg-gray-50/50 rounded-lg border border-gray-200/50">
                      <p className="text-xs text-gray-600 mb-2">비밀번호 조건</p>
                      <PasswordValidationIndicator />
                    </div>
                  )}
                </div>

                {/* 비밀번호 확인 */}
                <div className="space-y-3">
                  <Label htmlFor="confirmPassword" className="text-blue-900">비밀번호 확인</Label>
                  <div className="relative">
                    <Input
                      ref={confirmPasswordRef}
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      placeholder="비밀번호를 다시 입력하세요"
                      className="h-14 px-4 pr-12 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600/60 hover:text-blue-700 transition-colors opacity-70 hover:opacity-100 focus:opacity-100"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* 일반회원 전용 필드 */}
              {userType === 'general' && (
                <div className="space-y-6 pt-6 border-t border-blue-100">
                  <h3 className="font-medium text-blue-900">개인 정보</h3>
                  
                  {/* 이름 */}
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-blue-900">이름</Label>
                    <Input
                      ref={nameRef}
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="이름을 입력하세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  {/* 연락처 */}
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-blue-900">연락처</Label>
                    <Input
                      ref={phoneRef}
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="연락처를 입력해주세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* 기업회원 전용 필드 */}
              {userType === 'corporate' && (
                <div className="space-y-6 pt-6 border-t border-blue-100">
                  <h3 className="font-medium text-blue-900">회사 정보</h3>
                  
                  {/* 회사명 */}
                  <div className="space-y-3">
                    <Label htmlFor="companyName" className="text-blue-900">회사명</Label>
                    <Input
                      ref={companyNameRef}
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="회사명을 입력하세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  {/* 사업자등록번호 */}
                  <div className="space-y-3">
                    <Label htmlFor="businessNumber" className="text-blue-900">사업자등록번호</Label>
                    <Input
                      ref={businessNumberRef}
                      id="businessNumber"
                      type="text"
                      value={formData.businessNumber}
                      onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })}
                      placeholder="123-45-67890"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  {/* 사업자등록증 첨부 */}
                  <div className="space-y-3">
                    <Label htmlFor="businessCertificate" className="text-blue-900">
                      사업자등록증 <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          ref={businessCertificateRef}
                          id="businessCertificate"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-14 px-4 border-2 border-dashed border-blue-200 hover:border-blue-300 bg-blue-50/30 hover:bg-blue-50/50 transition-all duration-300 rounded-md flex items-center gap-3 cursor-pointer">
                          <Upload className="h-5 w-5 text-blue-600" />
                          <span className="text-blue-700">
                            {formData.businessCertificate ? formData.businessCertificate.name : '파일을 선택하세요'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• 파일 형식: PDF, JPG, PNG</p>
                        <p>• 최대 파일 크기: 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* 담당자 이름 */}
                  <div className="space-y-3">
                    <Label htmlFor="contactPerson" className="text-blue-900">담당자 이름</Label>
                    <Input
                      ref={contactPersonRef}
                      id="contactPerson"
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="담당자 이름을 입력하세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  {/* 담당자 연락처 */}
                  <div className="space-y-3">
                    <Label htmlFor="contactPhone" className="text-blue-900">담당자 연락처</Label>
                    <Input
                      ref={contactPhoneRef}
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="담당자 연락처를 입력하세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* 파트너 회원 전용 필드 */}
              {userType === 'partner' && (
                <div className="space-y-6 pt-6 border-t border-blue-100">
                  <h3 className="font-medium text-blue-900">파트너 정보</h3>
                  
                  {/* 회사명 */}
                  <div className="space-y-3">
                    <Label htmlFor="companyName" className="text-blue-900">회사명</Label>
                    <Input
                      ref={companyNameRef}
                      id="companyName"
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="회사명을 입력하세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  {/* 사업자등록번호 */}
                  <div className="space-y-3">
                    <Label htmlFor="businessNumber" className="text-blue-900">사업자등록번호</Label>
                    <Input
                      ref={businessNumberRef}
                      id="businessNumber"
                      type="text"
                      value={formData.businessNumber}
                      onChange={(e) => setFormData({ ...formData, businessNumber: e.target.value })}
                      placeholder="123-45-67890"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  {/* 사업자등록증 첨부 */}
                  <div className="space-y-3">
                    <Label htmlFor="businessCertificate" className="text-blue-900">
                      사업자등록증 <span className="text-red-500">*</span>
                    </Label>
                    <div className="space-y-3">
                      <div className="relative">
                        <input
                          ref={businessCertificateRef}
                          id="businessCertificate"
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileUpload}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <div className="h-14 px-4 border-2 border-dashed border-blue-200 hover:border-blue-300 bg-blue-50/30 hover:bg-blue-50/50 transition-all duration-300 rounded-md flex items-center gap-3 cursor-pointer">
                          <Upload className="h-5 w-5 text-blue-600" />
                          <span className="text-blue-700">
                            {formData.businessCertificate ? formData.businessCertificate.name : '파일을 선택하세요'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• 파일 형식: PDF, JPG, PNG</p>
                        <p>• 최대 파일 크기: 5MB</p>
                      </div>
                    </div>
                  </div>

                  {/* 담당자 이름 */}
                  <div className="space-y-3">
                    <Label htmlFor="contactPerson" className="text-blue-900">담당자 이름</Label>
                    <Input
                      ref={contactPersonRef}
                      id="contactPerson"
                      type="text"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      placeholder="담당자 이름을 입력하세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  {/* 담당자 연락처 */}
                  <div className="space-y-3">
                    <Label htmlFor="contactPhone" className="text-blue-900">담당자 연락처</Label>
                    <Input
                      ref={contactPhoneRef}
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="담당자 연락처를 입력하세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* 약관 동의 */}
              <div className="space-y-4 pt-6 border-t border-blue-100">
                <Label className="text-blue-900">약관 동의</Label>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-blue-200 rounded focus:ring-blue-200"
                    />
                    <Label htmlFor="agreeTerms" className="text-sm text-blue-700 cursor-pointer flex-1">
                      이용약관에 동의합니다 <span className="text-red-500">*</span>
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:text-blue-700 underline"
                    >
                      보기
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="agreePrivacy"
                      checked={formData.agreePrivacy}
                      onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-blue-200 rounded focus:ring-blue-200"
                    />
                    <Label htmlFor="agreePrivacy" className="text-sm text-blue-700 cursor-pointer flex-1">
                      개인정보 처리방침에 동의합니다 <span className="text-red-500">*</span>
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:text-blue-700 underline"
                    >
                      보기
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="agreeMarketing"
                      checked={formData.agreeMarketing}
                      onChange={(e) => setFormData({ ...formData, agreeMarketing: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-blue-200 rounded focus:ring-blue-200"
                    />
                    <Label htmlFor="agreeMarketing" className="text-sm text-blue-700 cursor-pointer flex-1">
                      마케팅 정보 수신에 동의합니다 (선택)
                    </Label>
                  </div>
                </div>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <Alert className="border-red-200 bg-red-50/50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}

              {/* 회원가입 버튼 */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-14 bg-gradient-primary hover:opacity-90 text-white font-medium rounded-lg shadow-blue hover:shadow-blue-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] opacity-90 hover:opacity-100"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    회원가입 처리 중...
                  </div>
                ) : (
                  '회원가입'
                )}
              </Button>

              {/* 로그인 링크 */}
              <div className="text-center pt-4">
                <p className="text-sm text-blue-600/70">
                  이미 계정이 있으신가요?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="text-blue-600 hover:text-blue-700 font-medium underline opacity-70 hover:opacity-100 transition-all"
                  >
                    로그인하기
                  </button>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}