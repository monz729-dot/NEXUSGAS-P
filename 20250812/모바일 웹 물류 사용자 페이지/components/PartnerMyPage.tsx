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
  Crown,
  User,
  Building,
  Bell,
  Lock,
  Eye,
  EyeOff,
  Save,
  Package,
  MapPin,
  Clock,
  Star,
  ShoppingBag,
  TrendingUp,
  Users
} from 'lucide-react';
import { User as UserType } from '../App';

interface PartnerMyPageProps {
  user: UserType | null;
  onNavigate: (page: string) => void;
}

export function PartnerMyPage({ user, onNavigate }: PartnerMyPageProps) {
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
    companyName: user?.companyName || '',
    businessNumber: user?.businessNumber || '',
    partnerType: 'marketing',
    mallName: '프리미엄 쇼핑몰',
    mallCategory: '패션/뷰티',
    targetAge: '20-40대 여성'
  });

  const [securityData, setSecurityData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    newOrders: true,
    orderUpdates: true,
    paymentNotifications: true,
    systemNotifications: true,
    emailNotifications: true,
    smsNotifications: true
  });

  // 입력 필드 참조
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const companyNameRef = useRef<HTMLInputElement>(null);
  const businessNumberRef = useRef<HTMLInputElement>(null);
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

    if (!profileData.companyName.trim()) {
      focusAndHighlight(companyNameRef, '회사명을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!profileData.businessNumber.trim()) {
      focusAndHighlight(businessNumberRef, '사업자등록번호를 입력해주세요.');
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
        confirmPassword: ''
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
              onClick={() => onNavigate('partner-dashboard')}
              className="p-2 text-blue-600/60 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-all opacity-60 hover:opacity-100"
              aria-label="파트너 대시보드로 돌아가기"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-blue">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-blue-900">파트너 설정</h1>
              <p className="text-xs text-blue-600">파트너 | {user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
              승인됨
            </Badge>
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

        {/* 파트너 상태 카드 */}
        <Card className="mb-6 shadow-blue border-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900">{profileData.companyName}</h3>
                  <p className="text-blue-600">파트너 ID: {user.id}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-purple-600 border-purple-300 bg-purple-50">
                      <Crown className="h-3 w-3 mr-1" />
                      제휴마케팅 파트너
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-blue-600">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">2024.01.15</div>
                <div className="text-sm text-blue-600">가입일</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-blue-50/50">
            <TabsTrigger value="profile" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">프로필</span>
            </TabsTrigger>
            <TabsTrigger value="business" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <Building className="h-4 w-4" />
              <span className="hidden sm:inline">사업정보</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">보안</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">알림</span>
            </TabsTrigger>
          </TabsList>

          {/* 프로필 탭 */}
          <TabsContent value="profile">
            <Card className="shadow-blue border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">개인 정보</CardTitle>
                <CardDescription>파트너 개인 정보를 관리합니다</CardDescription>
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
                      <Label htmlFor="mallName" className="text-blue-900">마케팅몰 명</Label>
                      <Input
                        id="mallName"
                        type="text"
                        value={profileData.mallName}
                        onChange={(e) => setProfileData({ ...profileData, mallName: e.target.value })}
                        placeholder="마케팅몰 이름"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
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

          {/* 사업정보 탭 */}
          <TabsContent value="business">
            <Card className="shadow-blue border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900">사업자 정보</CardTitle>
                <CardDescription>파트너 사업자 정보를 관리합니다</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveProfile} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="companyName" className="text-blue-900">회사명 *</Label>
                      <Input
                        ref={companyNameRef}
                        id="companyName"
                        type="text"
                        value={profileData.companyName}
                        onChange={(e) => setProfileData({ ...profileData, companyName: e.target.value })}
                        placeholder="회사명을 입력하세요"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="businessNumber" className="text-blue-900">사업자등록번호 *</Label>
                      <Input
                        ref={businessNumberRef}
                        id="businessNumber"
                        type="text"
                        value={profileData.businessNumber}
                        onChange={(e) => setProfileData({ ...profileData, businessNumber: e.target.value })}
                        placeholder="123-45-67890"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="mallCategory" className="text-blue-900">몰 카테고리</Label>
                      <select
                        id="mallCategory"
                        value={profileData.mallCategory}
                        onChange={(e) => setProfileData({ ...profileData, mallCategory: e.target.value })}
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300 rounded-md w-full"
                      >
                        <option value="패션/뷰티">패션/뷰티</option>
                        <option value="생활/가전">생활/가전</option>
                        <option value="푸드/건강">푸드/건강</option>
                        <option value="스포츠/레저">스포츠/레저</option>
                        <option value="육아/완구">육아/완구</option>
                      </select>
                    </div>

                    <div className="space-y-3">
                      <Label htmlFor="targetAge" className="text-blue-900">타겟 고객층</Label>
                      <Input
                        id="targetAge"
                        type="text"
                        value={profileData.targetAge}
                        onChange={(e) => setProfileData({ ...profileData, targetAge: e.target.value })}
                        placeholder="20-40대 여성"
                        className="h-12 px-4 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
                      />
                    </div>
                  </div>

                  {/* 마케팅 통계 */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-blue-100">
                    <div className="text-center p-4 bg-blue-50/50 rounded-lg">
                      <ShoppingBag className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-blue-900">1,284</div>
                      <div className="text-sm text-blue-600">총 주문</div>
                    </div>
                    <div className="text-center p-4 bg-green-50/50 rounded-lg">
                      <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-green-900">₩8.9M</div>
                      <div className="text-sm text-green-600">월 매출</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50/50 rounded-lg">
                      <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-yellow-900">4.8</div>
                      <div className="text-sm text-yellow-600">몰 평점</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50/50 rounded-lg">
                      <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                      <div className="text-xl font-bold text-purple-900">2,456</div>
                      <div className="text-sm text-purple-600">회원수</div>
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
                        사업정보 저장
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
                <CardDescription>파트너 알림 설정을 관리합니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'newOrders', label: '새 주문 알림', description: '마케팅몰 신규 주문 시 알림' },
                  { key: 'orderUpdates', label: '주문 업데이트 알림', description: '주문 상태 변경 시 알림' },
                  { key: 'paymentNotifications', label: '정산 알림', description: '마케팅 수수료 정산 관련 알림' },
                  { key: 'systemNotifications', label: '시스템 알림', description: '시스템 공지사항 및 업데이트 알림' },
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
        </Tabs>
      </div>
    </div>
  );
}