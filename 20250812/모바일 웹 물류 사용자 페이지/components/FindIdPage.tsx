import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { ArrowLeft, Mail, CheckCircle, User } from 'lucide-react';

interface FindIdPageProps {
  onNavigate: (page: string) => void;
}

export function FindIdPage({ onNavigate }: FindIdPageProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    verificationCode: ''
  });
  const [step, setStep] = useState<'input' | 'verify' | 'result'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [foundIds, setFoundIds] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 입력 검증
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

    // 데모용 로직
    setTimeout(() => {
      if (step === 'input') {
        setStep('verify');
      } else if (step === 'verify') {
        if (formData.verificationCode === '123456') {
          // 데모용 아이디 결과
          setFoundIds(['hong123', 'hong_user']);
          setStep('result');
        } else {
          setError('인증번호가 일치하지 않습니다.');
        }
      }
      setIsLoading(false);
    }, 1500);
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
      name: '',
      email: '',
      verificationCode: ''
    });
    setError('');
    setFoundIds([]);
  };

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
            <CardTitle className="text-2xl text-blue-900 mb-3">아이디 찾기</CardTitle>

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

            {step === 'result' && (
              <div className="space-y-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-blue-600 mb-8">
                    총 {foundIds.length}개의 아이디를 찾았습니다.
                  </p>
                </div>

                <div className="space-y-4">
                  {foundIds.map((id, index) => (
                    <div 
                      key={index}
                      className="p-5 bg-blue-50/50 border border-blue-200/50 rounded-lg animate-scale-in hover:bg-blue-50 transition-colors duration-300"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-blue-900 mb-1">{id}</p>
                          <p className="text-sm text-blue-600">가입일: 2024.01.15</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            onNavigate('login');
                            // 로그인 페이지로 아이디 전달 로직 추가 가능
                          }}
                          className="border-blue-300/50 text-blue-600/70 hover:bg-blue-100 hover:text-blue-700 hover:border-blue-400 opacity-70 hover:opacity-100 transition-all duration-300"
                        >
                          로그인하기
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onNavigate('find-password')}
                    className="flex-1 h-14 border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 opacity-70 hover:opacity-100 transition-all duration-300"
                  >
                    비밀번호 찾기
                  </Button>
                  <Button
                    type="button"
                    onClick={() => onNavigate('login')}
                    className="flex-1 h-14 bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500 opacity-70 hover:opacity-100 hover:shadow-blue"
                  >
                    로그인하기
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}