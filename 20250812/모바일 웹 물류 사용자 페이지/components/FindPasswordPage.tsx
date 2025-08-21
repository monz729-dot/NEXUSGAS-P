import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Lock, Mail, CheckCircle, Eye, EyeOff, AlertCircle } from 'lucide-react';

interface FindPasswordPageProps {
  onNavigate: (page: string) => void;
}

export function FindPasswordPage({ onNavigate }: FindPasswordPageProps) {
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: '',
    verificationCode: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [step, setStep] = useState<'input' | 'verify' | 'reset' | 'complete'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasLetter: false,
    hasNumber: false
  });

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
    setFormData({ ...formData, newPassword: password });
    validatePassword(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (step === 'input') {
      // 입력 검증
      if (!formData.userId.trim()) {
        setError('아이디를 입력해주세요.');
        setIsLoading(false);
        return;
      }
      if (!formData.name.trim()) {
        setError('이름을 입력해주세요.');
        setIsLoading(false);
        return;
      }
      if (!formData.email.trim()) {
        setError('이메일을 입력해주세요.');
        setIsLoading(false);
        return;
      }

      // 이메일 형식 검증
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError('올바른 이메일 형식을 입력해주세요.');
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        setStep('verify');
        setIsLoading(false);
      }, 1500);
    } else if (step === 'verify') {
      if (formData.verificationCode === '123456') {
        setTimeout(() => {
          setStep('reset');
          setIsLoading(false);
        }, 1000);
      } else {
        setError('인증번호가 일치하지 않습니다.');
        setIsLoading(false);
      }
    } else if (step === 'reset') {
      // 비밀번호 검증
      if (!formData.newPassword) {
        setError('새 비밀번호를 입력해주세요.');
        setIsLoading(false);
        return;
      }
      if (!validatePassword(formData.newPassword)) {
        setError('비밀번호는 8자 이상, 영문과 숫자를 포함해야 합니다.');
        setIsLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setError('비밀번호가 일치하지 않습니다.');
        setIsLoading(false);
        return;
      }

      setTimeout(() => {
        setStep('complete');
        setIsLoading(false);
      }, 1500);
    }
  };

  const sendVerificationCode = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert(`인증번호가 이메일로 전송되었습니다. (데모: 123456)`);
    }, 1000);
  };

  const resetForm = () => {
    setStep('input');
    setFormData({
      userId: '',
      name: '',
      email: '',
      verificationCode: '',
      newPassword: '',
      confirmPassword: ''
    });
    setError('');
    setPasswordValidation({
      minLength: false,
      hasLetter: false,
      hasNumber: false
    });
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
                onClick={() => step === 'input' ? onNavigate('login') : resetForm()}
                className="absolute left-6 p-2 text-blue-600/60 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all opacity-60 hover:opacity-100"
                aria-label="이전으로 돌아가기"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl text-blue-900 mb-3">비밀번호 찾기</CardTitle>

          </CardHeader>

          <CardContent className="px-8 pb-8">
            {step === 'input' && (
              <div className="space-y-8">
                {/* 인증 방법 안내 */}
                <div className="p-4 bg-blue-50/50 border border-blue-200/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">이메일 인증</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    등록된 이메일 주소로 인증번호를 전송합니다.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="userId" className="text-blue-900">아이디</Label>
                    <Input
                      id="userId"
                      type="text"
                      value={formData.userId}
                      onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                      placeholder="아이디를 입력하세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-blue-900">이름</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="이름을 입력하세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-blue-900">이메일 주소</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="이메일을 입력해주세요"
                      className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive" className="animate-scale-in">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500 transform hover:scale-[1.02] opacity-70 hover:opacity-100 hover:shadow-blue"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        인증번호 전송 중...
                      </div>
                    ) : (
                      '인증번호 받기'
                    )}
                  </Button>
                </form>
              </div>
            )}

            {step === 'verify' && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-600 mb-6">
                    {formData.email}로<br />
                    인증번호를 전송했습니다.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="verificationCode" className="text-blue-900">인증번호</Label>
                    <div className="flex gap-3">
                      <Input
                        id="verificationCode"
                        type="text"
                        value={formData.verificationCode}
                        onChange={(e) => setFormData({ ...formData, verificationCode: e.target.value })}
                        placeholder="6자리 인증번호"
                        maxLength={6}
                        className="h-14 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={sendVerificationCode}
                        disabled={isLoading}
                        className="h-14 px-6 border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 opacity-70 hover:opacity-100 transition-all duration-300"
                      >
                        재전송
                      </Button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="animate-scale-in">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={resetForm}
                      className="flex-1 h-14 border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 opacity-70 hover:opacity-100 transition-all duration-300"
                    >
                      이전
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 h-14 bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500 opacity-70 hover:opacity-100 hover:shadow-blue"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                          확인 중...
                        </div>
                      ) : (
                        '확인'
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            )}

            {step === 'reset' && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Lock className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm text-blue-600 mb-6">
                    새로운 비밀번호를 설정해주세요.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="newPassword" className="text-blue-900">새 비밀번호</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder="새 비밀번호를 입력하세요 (영문+숫자, 8자 이상)"
                        className="h-14 px-4 pr-12 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600/60 hover:text-blue-700 transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    
                    {/* 비밀번호 검증 인디케이터 */}
                    {formData.newPassword && (
                      <div className="p-3 bg-gray-50/50 rounded-lg border border-gray-200/50">
                        <p className="text-xs text-gray-600 mb-2">비밀번호 조건</p>
                        <PasswordValidationIndicator />
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-blue-900">비밀번호 확인</Label>
                    <div className="relative">
                      <Input
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
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600/60 hover:text-blue-700 transition-colors opacity-0 hover:opacity-100 focus:opacity-100"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <Alert variant="destructive" className="animate-scale-in">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500 opacity-70 hover:opacity-100 hover:shadow-blue"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        비밀번호 변경 중...
                      </div>
                    ) : (
                      '비밀번호 변경'
                    )}
                  </Button>
                </form>
              </div>
            )}

            {step === 'complete' && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-in">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-blue-900 mb-3">
                    비밀번호 변경 완료
                  </h3>
                  <p className="text-blue-600 mb-8">
                    새로운 비밀번호로 로그인해주세요.
                  </p>
                </div>

                <Button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="w-full h-14 bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500 opacity-70 hover:opacity-100 hover:shadow-blue"
                >
                  로그인하기
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}