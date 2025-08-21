import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Clock, CheckCircle, AlertTriangle, Mail, Phone, Building2, ArrowLeft, RefreshCw } from 'lucide-react';

interface SignupPendingPageProps {
  onNavigate: (page: string) => void;
  userType: 'partner';
}

export function SignupPendingPage({ onNavigate, userType }: SignupPendingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* 메인 카드 */}
        <Card className="shadow-blue border-orange-200 bg-orange-50/30">
          <CardHeader className="text-center space-y-4">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <Clock className="h-10 w-10 text-orange-600" />
            </div>
            <div>
              <CardTitle className="text-orange-900 mb-2">
                파트너 가입 신청이 완료되었습니다
              </CardTitle>
              <p className="text-orange-700 text-sm">
                관리자 승인 후 서비스를 이용하실 수 있습니다
              </p>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 신청 정보 */}
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h3 className="font-medium text-orange-900 mb-3 flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                신청 정보
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-orange-700">신청 타입</span>
                  <Badge variant="outline" className="border-orange-300 text-orange-700">
                    물류 파트너
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">신청 일시</span>
                  <span className="font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">신청 번호</span>
                  <code className="bg-orange-100 px-2 py-1 rounded text-xs">
                    P-{new Date().getFullYear()}-{String(Math.floor(Math.random() * 1000)).padStart(3, '0')}
                  </code>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">승인 상태</span>
                  <Badge variant="outline" className="border-yellow-300 text-yellow-700 bg-yellow-50">
                    <Clock className="h-3 w-3 mr-1" />
                    승인 대기
                  </Badge>
                </div>
              </div>
            </div>

            {/* 다음 단계 안내 */}
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h3 className="font-medium text-orange-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                다음 단계
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-orange-700">1</span>
                  </div>
                  <div>
                    <p className="font-medium text-orange-900">서류 검토</p>
                    <p className="text-orange-700">제출하신 사업자등록증 및 서류를 검토합니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-medium text-orange-700">2</span>
                  </div>
                  <div>
                    <p className="font-medium text-orange-900">승인 처리</p>
                    <p className="text-orange-700">관리자가 파트너 자격을 검토하고 승인합니다</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-orange-900">서비스 이용 시작</p>
                    <p className="text-orange-700">승인 완료 후 파트너 시스템을 이용하실 수 있습니다</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 예상 처리 시간 */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-blue-600" />
                <h3 className="font-medium text-blue-900">예상 처리 시간</h3>
              </div>
              <p className="text-sm text-blue-700">
                일반적으로 <strong>1-3 영업일</strong> 소요됩니다. 서류에 문제가 있는 경우 추가 시간이 필요할 수 있습니다.
              </p>
            </div>

            {/* 연락처 정보 */}
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <h3 className="font-medium text-orange-900 mb-3">문의 연락처</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-orange-600" />
                  <div>
                    <span className="font-medium text-orange-900">전화 문의:</span>
                    <span className="ml-2 text-orange-700">1588-0000 (평일 09:00~18:00)</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-orange-600" />
                  <div>
                    <span className="font-medium text-orange-900">이메일:</span>
                    <span className="ml-2 text-orange-700">partner@ycs-logistics.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="space-y-3">
              <Button
                onClick={() => onNavigate('login')}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                승인 상태 확인하기
              </Button>
              
              <Button
                variant="outline"
                onClick={() => onNavigate('page-list')}
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                메인 페이지로
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 추가 안내 */}
        <Card className="shadow-blue border-yellow-200 bg-yellow-50/30">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="font-medium text-yellow-900">중요 안내사항</h3>
                <div className="text-sm text-yellow-800 space-y-1">
                  <p>• 승인 완료 시 등록하신 이메일로 알림을 발송합니다</p>
                  <p>• 서류에 문제가 있는 경우 별도 연락을 드립니다</p>
                  <p>• 승인 후 초기 로그인 비밀번호는 이메일로 안내됩니다</p>
                  <p>• 파트너 계약서는 승인 후 별도로 진행됩니다</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}