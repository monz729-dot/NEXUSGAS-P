import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { CheckCircle, User, Building, Users } from 'lucide-react';

interface SignupCompletePageProps {
  onNavigate: (page: string) => void;
  userType: 'general' | 'corporate' | 'partner';
}

export function SignupCompletePage({ onNavigate, userType }: SignupCompletePageProps) {
  const getIconByUserType = () => {
    switch (userType) {
      case 'general':
        return <User className="h-10 w-10 text-white" />;
      case 'corporate':
        return <Building className="h-10 w-10 text-white" />;
      case 'partner':
        return <Users className="h-10 w-10 text-white" />;
      default:
        return <User className="h-10 w-10 text-white" />;
    }
  };

  const getTitle = () => {
    return userType === 'general' ? '회원가입 완료' : '가입신청 완료';
  };

  const getMessage = () => {
    if (userType === 'general') {
      return {
        main: '가입이 완료되었습니다.',
        sub: '가입 해주셔서 감사합니다.'
      };
    } else {
      return {
        main: '가입신청 해주셔서 감사합니다.',
        sub: '가입승인 완료 시 서비스를 사용하실 수 있습니다.',
        additional: '관리자 승인은 평일 기준으로 1~2일 소요됩니다.',
        closing: '감사합니다.'
      };
    }
  };

  const getUserTypeLabel = () => {
    switch (userType) {
      case 'general':
        return '일반 회원';
      case 'corporate':
        return '기업 회원';
      case 'partner':
        return '파트너';
      default:
        return '일반 회원';
    }
  };

  const message = getMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-slide-up">
        <Card className="shadow-blue-lg border-blue-100 glass-effect">
          <CardHeader className="text-center pb-8">
            <div className="mx-auto mb-6 w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg animate-bounce-in">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <CardTitle className="text-3xl bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent mb-3">
              {getTitle()}
            </CardTitle>

          </CardHeader>

          <CardContent className="px-8 pb-8">
            <div className="space-y-8">
              {/* 회원 유형 표시 */}
              <div className="text-center p-4 bg-blue-50/50 border border-blue-200/50 rounded-lg">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                    {userType === 'general' ? <User className="h-4 w-4 text-white" /> :
                     userType === 'corporate' ? <Building className="h-4 w-4 text-white" /> :
                     <Users className="h-4 w-4 text-white" />}
                  </div>
                  <span className="font-medium text-blue-900">{getUserTypeLabel()}</span>
                </div>
                <p className="text-sm text-blue-600">
                  {userType === 'general' ? '개인 사용자' : 
                   userType === 'corporate' ? '기업 담당자' : '물류 파트너'}
                </p>
              </div>

              {/* 완료 메시지 */}
              <div className="text-center space-y-4">
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-blue-900 animate-fade-in">
                    {message.main}
                  </h3>
                  <p className="text-blue-700 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    {message.sub}
                  </p>
                  
                  {message.additional && (
                    <div className="pt-4 space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                      <p className="text-blue-600 text-sm">
                        {message.additional}
                      </p>
                      {message.closing && (
                        <p className="text-blue-600 font-medium">
                          {message.closing}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* 추가 안내 (기업/파트너 회원) */}
                {userType !== 'general' && (
                  <div className="p-4 bg-yellow-50/50 border border-yellow-200/50 rounded-lg animate-scale-in" style={{ animationDelay: '0.6s' }}>
                    <div className="space-y-3">
                      <h4 className="font-medium text-yellow-800">승인 과정 안내</h4>
                      <div className="text-sm text-yellow-700 space-y-2">
                        <p>• 관리자가 제출하신 정보를 검토합니다</p>
                        <p>• 필요시 추가 서류 요청이 있을 수 있습니다</p>
                        <p>• 승인 완료 시 등록하신 이메일로 알림을 드립니다</p>
                        <p>• 문의사항은 고객센터(1588-1234)로 연락해주세요</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 로그인 버튼 */}
              <div className="space-y-4">
                <Button 
                  onClick={() => onNavigate('login')}
                  className="w-full h-14 bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500 transform hover:scale-[1.02] opacity-90 hover:opacity-100 hover:shadow-blue animate-scale-in"
                  style={{ animationDelay: '0.8s' }}
                >
                  로그인 화면으로 이동
                </Button>

                {/* 추가 링크 */}
                <div className="text-center text-sm text-blue-600/70 animate-fade-in" style={{ animationDelay: '1s' }}>
                  <p>
                    문의사항이 있으시면{' '}
                    <span className="font-medium text-blue-700">1588-1234</span>로 연락해주세요
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 보안 정보 */}
        <div className="mt-8 text-center animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <div className="flex items-center justify-center gap-2 text-sm text-blue-600/70 hover:text-blue-600 transition-colors">
            <CheckCircle className="h-4 w-4" />
            <span>안전하게 가입이 처리되었습니다</span>
          </div>
        </div>
      </div>
    </div>
  );
}