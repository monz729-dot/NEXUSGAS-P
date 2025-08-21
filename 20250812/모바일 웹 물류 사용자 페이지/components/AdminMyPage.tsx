import React, { useState, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  Settings,
  User,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  Users,
  Package,
  BarChart3,
  Globe
} from 'lucide-react';
import { User as UserType } from '../App';

interface AdminMyPageProps {
  user: UserType | null;
  onNavigate: (page: string) => void;
}

export function AdminMyPage({ user, onNavigate }: AdminMyPageProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // 폼 데이터 상태
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    adminLevel: 'super',
    department: '시스템관리팀'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorEnabled: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    systemAlerts: true,
    userRegistrations: true,
    orderNotifications: true,
    securityAlerts: true,
    emailNotifications: true,
    smsNotifications: false
  });

  // 입력 필드 참조
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const currentPasswordRef = useRef<HTMLInputElement>(null);
  const newPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  // 포커스 및 에러 표시 함수
  const focusAndHighlight = (ref: React.RefObject<HTMLInputElement>, message: string) => {
    setMessage(message);
    setTimeout(() => {
      ref.current?.focus();
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // 프로필 저장
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    // 유효성 검사
    if (!profileData.name.trim()) {
      focusAndHighlight(nameRef, '이름을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!profileData.email.trim()) {
      focusAndHighlight(emailRef, '이메일을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      focusAndHighlight(emailRef, '올바른 이메일 형식을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!profileData.phone.trim()) {
      focusAndHighlight(phoneRef, '휴대폰 번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    // 데모용 저장 로직
    setTimeout(() => {
      setMessage('프로필이 성공적으로 저장되었습니다.');
      setIsLoading(false);
    }, 1000);
  };

  // 비밀번호 변경
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);

    // 유효성 검사
    if (!securityData.currentPassword) {
      focusAndHighlight(currentPasswordRef, '현재 비밀번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!securityData.newPassword) {
      focusAndHighlight(newPasswordRef, '새 비밀번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (securityData.newPassword.length < 8) {
      focusAndHighlight(newPasswordRef, '새 비밀번호는 8자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      focusAndHighlight(confirmPasswordRef, '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    // 데모용 저장 로직
    setTimeout(() => {
      setMessage('비밀번호가 성공적으로 변경되었습니다.');
      setSecurityData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
        twoFactorEnabled: securityData.twoFactorEnabled
      });
      setIsLoading(false);
    }, 1000);
  };

  // 알림 설정 저장
  const handleSaveNotifications = async () => {
    setMessage('');
    setIsLoading(true);

    setTimeout(() => {
      setMessage('알림 설정이 성공적으로 저장되었습니다.');
      setIsLoading(false);
    }, 1000);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* 헤더 */}
      <header className="bg-white border-b border-blue-100 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate('admin-dashboard')}
              className="p-2 text-blue-600/60 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all opacity-60 hover:opacity-100"
              aria-label="관리자 대시보드로 돌아가기"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-blue">
              <Settings className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-blue-900">관리자 설정</h1>
              <p className="text-xs text-blue-600">시스템 관리자 | {user.name}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        {/* 메시지 표시 */}
        {message && (
          <Alert className={`mb-6 animate-scale-in ${
            message.includes('성공') ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <AlertDescription className={
              message.includes('성공') ? 'text-green-700' : 'text-red-700'
            }>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-blue-50/50">
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">프로필</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">보안</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">알림</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline">시스템</span>
            </TabsTrigger>
          </TabsList>

          {/* 프로필 탭 */}
          <TabsContent value="profile">
            <Card className="shadow-blue border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">관리자 프로필</CardTitle>
                <CardDescription>관리자 계정 정보를 관리합니다</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-blue-900">이름 *</Label>
                      <Input
                        ref={nameRef}
                        id="name"
                        type="text"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        placeholder="이름을 입력하세요"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-blue-900">이메일 *</Label>
                      <Input
                        ref={emailRef}
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="example@domain.com"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="phone" className="text-blue-900">휴대폰 번호 *</Label>
                      <Input
                        ref={phoneRef}
                        id="phone"
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="010-1234-5678"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="department" className="text-blue-900">부서</Label>
                      <Input
                        id="department"
                        type="text"
                        value={profileData.department}
                        onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                        placeholder="부서명"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-blue-900">관리자 권한</Label>
                    <div className="flex gap-3">
                      <Badge variant="outline" className="text-red-600 border-red-300 bg-red-50">
                        <Shield className="h-3 w-3 mr-1" />
                        최고 관리자
                      </Badge>
                      <Badge variant="outline" className="text-blue-600 border-blue-300 bg-blue-50">
                        <Users className="h-3 w-3 mr-1" />
                        사용자 관리
                      </Badge>
                      <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                        <Package className="h-3 w-3 mr-1" />
                        주문 관리
                      </Badge>
                      <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50">
                        <Globe className="h-3 w-3 mr-1" />
                        시스템 관리
                      </Badge>
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full md:w-auto bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500 opacity-70 hover:opacity-100 hover:shadow-blue"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        저장 중...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Save className="h-4 w-4" />
                        프로필 저장
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 보안 탭 */}
          <TabsContent value="security">
            <Card className="shadow-blue border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">보안 설정</CardTitle>
                <CardDescription>비밀번호 변경 및 보안 설정을 관리합니다</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="currentPassword" className="text-blue-900">현재 비밀번호 *</Label>
                    <div className="relative">
                      <Input
                        ref={currentPasswordRef}
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={securityData.currentPassword}
                        onChange={(e) => setSecurityData({ ...securityData, currentPassword: e.target.value })}
                        placeholder="현재 비밀번호"
                        className="h-12 px-4 pr-12 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600/60 hover:text-blue-700 transition-colors opacity-70 hover:opacity-100"
                      >
                        {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="newPassword" className="text-blue-900">새 비밀번호 *</Label>
                    <div className="relative">
                      <Input
                        ref={newPasswordRef}
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        value={securityData.newPassword}
                        onChange={(e) => setSecurityData({ ...securityData, newPassword: e.target.value })}
                        placeholder="새 비밀번호 (8자 이상)"
                        className="h-12 px-4 pr-12 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-600/60 hover:text-blue-700 transition-colors opacity-70 hover:opacity-100"
                      >
                        {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="confirmPassword" className="text-blue-900">새 비밀번호 확인 *</Label>
                    <Input
                      ref={confirmPasswordRef}
                      id="confirmPassword"
                      type="password"
                      value={securityData.confirmPassword}
                      onChange={(e) => setSecurityData({ ...securityData, confirmPassword: e.target.value })}
                      placeholder="새 비밀번호 확인"
                      className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                    <div>
                      <Label className="text-blue-900">2단계 인증</Label>
                      <p className="text-sm text-blue-600">추가 보안을 위해 2단계 인증을 사용합니다</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="twoFactor"
                        checked={securityData.twoFactorEnabled}
                        onChange={(e) => setSecurityData({ ...securityData, twoFactorEnabled: e.target.checked })}
                        className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-200"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full md:w-auto bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500 opacity-70 hover:opacity-100 hover:shadow-blue"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                        변경 중...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4" />
                        비밀번호 변경
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 알림 탭 */}
          <TabsContent value="notifications">
            <Card className="shadow-blue border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">알림 설정</CardTitle>
                <CardDescription>관리자 알림 설정을 관리합니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'systemAlerts', label: '시스템 알림', description: '시스템 오류 및 중요 이벤트 알림' },
                  { key: 'userRegistrations', label: '회원 가입 알림', description: '새로운 회원 가입 요청 알림' },
                  { key: 'orderNotifications', label: '주문 알림', description: '새로운 주문 및 주문 상태 변경 알림' },
                  { key: 'securityAlerts', label: '보안 알림', description: '로그인 시도 및 보안 관련 알림' },
                  { key: 'emailNotifications', label: '이메일 알림', description: '이메일로 알림 받기' },
                  { key: 'smsNotifications', label: 'SMS 알림', description: 'SMS로 중요 알림 받기' }
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                    <div>
                      <Label className="text-blue-900">{item.label}</Label>
                      <p className="text-sm text-blue-600">{item.description}</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={item.key}
                        checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                        onChange={(e) => setNotificationSettings({
                          ...notificationSettings,
                          [item.key]: e.target.checked
                        })}
                        className="w-4 h-4 text-blue-600 border-blue-300 rounded focus:ring-blue-200"
                      />
                    </div>
                  </div>
                ))}

                <Button 
                  onClick={handleSaveNotifications}
                  disabled={isLoading}
                  className="w-full md:w-auto bg-blue-600/20 hover:bg-gradient-primary border border-blue-300/50 hover:border-blue-500 text-blue-700 hover:text-white transition-all duration-500 opacity-70 hover:opacity-100 hover:shadow-blue"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      저장 중...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4" />
                      알림 설정 저장
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 시스템 탭 */}
          <TabsContent value="system">
            <Card className="shadow-blue border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">시스템 정보</CardTitle>
                <CardDescription>시스템 상태 및 관리자 권한 정보</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                    <h4 className="font-medium text-blue-900 mb-2">로그인 정보</h4>
                    <div className="space-y-2 text-sm text-blue-600">
                      <p>마지막 로그인: 2024-01-15 14:30</p>
                      <p>로그인 IP: 192.168.1.100</p>
                      <p>세션 시간: 8시간</p>
                    </div>
                  </div>

                  <div className="p-4 border border-blue-200 rounded-lg bg-blue-50/30">
                    <h4 className="font-medium text-blue-900 mb-2">관리 통계</h4>
                    <div className="space-y-2 text-sm text-blue-600">
                      <p>처리한 승인: 142건</p>
                      <p>관리한 사용자: 89명</p>
                      <p>처리한 주문: 1,234건</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 border border-orange-200 rounded-lg bg-orange-50">
                  <h4 className="font-medium text-orange-800 mb-2">⚠️ 관리자 주의사항</h4>
                  <ul className="space-y-1 text-sm text-orange-700">
                    <li>• 관리자 권한으로 중요한 시스템 설정을 변경할 수 있습니다</li>
                    <li>• 사용자 데이터 처리 시 개인정보보호법을 준수해주세요</li>
                    <li>• 의심스러운 활동 발견 시 즉시 보고해주세요</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}