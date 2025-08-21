import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { User, Edit, Save, X, Lock, Eye, EyeOff, Check, Calendar, Award, Upload, FileText, CheckCircle, Search, Package, Truck, ShoppingBag, MapPin, Phone, Mail, DollarSign, Hash, Plane, Ship, Navigation, HelpCircle, AlertTriangle, Clock, Shield, Info, Bell, BarChart3 } from 'lucide-react';
import { User as UserType } from '../types';

interface MyPageProps {
  user: UserType | null;
  onNavigate: (page: string, options?: { orderId?: string }) => void;
}

export function MyPage({ user, onNavigate }: MyPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {
    id: '',
    type: 'general',
    name: '',
    email: '',
    phone: '',
    companyName: '',
    businessNumber: '',
    contactPerson: '',
    contactPhone: ''
  });

  // 사업자등록증 파일 상태
  const [businessCertificate, setBusinessCertificate] = useState<File | null>(null);
  const businessCertificateRef = useRef<HTMLInputElement>(null);

  // 비밀번호 변경 상태
  const [passwordDialog, setPasswordDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // 알림 설정 상태
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    emailNotifications: true,
    smsNotifications: false
  });

  // 주문내역 관련 상태
  const [searchTerm, setSearchTerm] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  // 주문 데이터
  const orders = [
    {
      id: 'YCS-2024-001',
      date: '2024-01-15',
      status: '배송중',
      statusColor: 'bg-blue-100 text-blue-800',
      estimatedArrival: '2024-01-22',
      items: [
        { name: '전자제품', quantity: 2, weight: 1.5, usd: 100 }
      ],
      shippingType: '해상',
      trackingNumber: 'KR123456789',
      destination: '태국 방콕'
    },
    {
      id: 'YCS-2024-002',
      date: '2024-01-14',
      status: '준비중',
      statusColor: 'bg-orange-100 text-orange-800',
      estimatedArrival: '2024-01-25',
      items: [
        { name: '의류', quantity: 5, weight: 2.0, usd: 200 },
        { name: '액세서리', quantity: 3, weight: 0.5, usd: 50 }
      ],
      shippingType: '항공',
      trackingNumber: 'KR987654321',
      destination: '태국 치앙마이'
    },
    {
      id: 'YCS-2024-003',
      date: '2024-01-13',
      status: '완료',
      statusColor: 'bg-green-100 text-green-800',
      estimatedArrival: '2024-01-20',
      items: [
        { name: '건강식품', quantity: 1, weight: 1.0, usd: 150 }
      ],
      shippingType: '해상',
      trackingNumber: 'KR456789123',
      destination: '태국 파타야'
    }
  ];

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 파일 업로드 처리
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('파일 크기는 5MB 이하로 업로드해주세요.');
        return;
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        setError('PDF, JPG, PNG 파일만 업로드 가능합니다.');
        return;
      }

      setBusinessCertificate(file);
      setError('');
    }
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    // 입력 검증
    if (!editData.name.trim()) {
      setError('이름을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!editData.email.trim()) {
      setError('이메일을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!editData.phone.trim()) {
      setError('연락처를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    // 기업회원 추가 검증
    if (user.type === 'corporate') {
      if (!editData.companyName?.trim()) {
        setError('회사명을 입력해주세요.');
        setIsLoading(false);
        return;
      }
      if (!editData.businessNumber?.trim()) {
        setError('사업자등록번호를 입력해주세요.');
        setIsLoading(false);
        return;
      }
      if (!businessCertificate && !user.businessNumber) {
        setError('사업자등록증을 첨부해주세요.');
        setIsLoading(false);
        return;
      }
    }

    setTimeout(() => {
      setIsEditing(false);
      setSuccess('정보가 성공적으로 저장되었습니다.');
      setIsLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 1000);
  };

  const handleCancel = () => {
    setEditData(user);
    setBusinessCertificate(null);
    setIsEditing(false);
    setError('');
  };

  const handlePasswordChange = async () => {
    setError('');
    setIsLoading(true);

    if (!passwordData.currentPassword) {
      setError('현재 비밀번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!passwordData.newPassword) {
      setError('새 비밀번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setError('새 비밀번호는 8자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    setTimeout(() => {
      setPasswordDialog(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccess('비밀번호가 성공적으로 변경되었습니다.');
      setIsLoading(false);
      setTimeout(() => setSuccess(''), 3000);
    }, 1500);
  };

  const getUserTypeLabel = () => {
    switch (user.type) {
      case 'general': return '일반 회원';
      case 'corporate': return '기업 회원';
      case 'partner': return '파트너';
      case 'admin': return '관리자';
      default: return '일반 회원';
    }
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(passwordData.newPassword);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 space-y-6">
      {/* 성공/에러 메시지 */}
      {(success || error) && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
          <Alert variant={error ? "destructive" : "default"} className="shadow-blue-lg">
            <AlertDescription>{success || error}</AlertDescription>
          </Alert>
        </div>
      )}

      {/* 프로필 카드 */}
      <Card className="shadow-blue border-blue-100 glass-effect">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center shadow-blue">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 border-2 border-white rounded-full flex items-center justify-center">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <div>
              <CardTitle className="text-xl text-blue-900">{user.name}</CardTitle>
              <p className="text-blue-600 mb-1">{getUserTypeLabel()}</p>
              <div className="flex items-center gap-2 text-sm text-blue-500">
                <Calendar className="h-4 w-4" />
                <span>가입일: 2024.01.15</span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 메인 탭 컨텐츠 */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-blue-50/50">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            프로필
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            주문내역
          </TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            알림
          </TabsTrigger>
          <TabsTrigger value="stats" className="data-[state=active]:bg-white data-[state=active]:text-blue-700">
            통계
          </TabsTrigger>
        </TabsList>

        {/* 프로필 탭 */}
        <TabsContent value="profile">
          <Card className="shadow-blue border-blue-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-900">기본 정보</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 opacity-70 hover:opacity-100 transition-all duration-300"
                >
                  {isEditing ? <X className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  {isEditing ? '취소' : '편집'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-3">
                  <Label className="text-blue-900">아이디</Label>
                  <Input 
                    value={user.id} 
                    disabled 
                    className="h-12 bg-gray-50 border-gray-200" 
                  />
                </div>
                
                <div className="space-y-3">
                  <Label className="text-blue-900">이메일</Label>
                  <Input 
                    value={isEditing ? editData.email : user.email} 
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    disabled={!isEditing}
                    className={`h-12 ${isEditing ? 'border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white' : 'bg-gray-50 border-gray-200'} transition-all duration-300`}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-blue-900">{user.type === 'general' ? '이름' : '담당자 이름'}</Label>
                  <Input 
                    value={isEditing ? editData.name : user.name} 
                    onChange={(e) => setEditData({...editData, name: e.target.value})}
                    disabled={!isEditing}
                    className={`h-12 ${isEditing ? 'border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white' : 'bg-gray-50 border-gray-200'} transition-all duration-300`}
                  />
                </div>

                <div className="space-y-3">
                  <Label className="text-blue-900">{user.type === 'general' ? '연락처' : '담당자 연락처'}</Label>
                  <Input 
                    value={isEditing ? editData.phone : user.phone} 
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    disabled={!isEditing}
                    className={`h-12 ${isEditing ? 'border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white' : 'bg-gray-50 border-gray-200'} transition-all duration-300`}
                  />
                </div>

                {user.type !== 'general' && (
                  <>
                    <div className="space-y-3">
                      <Label className="text-blue-900">회사명</Label>
                      <Input 
                        value={isEditing ? editData.companyName : user.companyName} 
                        onChange={(e) => setEditData({...editData, companyName: e.target.value})}
                        disabled={!isEditing}
                        className={`h-12 ${isEditing ? 'border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white' : 'bg-gray-50 border-gray-200'} transition-all duration-300`}
                      />
                    </div>

                    {user.type === 'corporate' && (
                      <>
                        <div className="space-y-3">
                          <Label className="text-blue-900">사업자등록번호</Label>
                          <Input 
                            value={isEditing ? editData.businessNumber : user.businessNumber} 
                            onChange={(e) => setEditData({...editData, businessNumber: e.target.value})}
                            disabled={!isEditing}
                            className={`h-12 ${isEditing ? 'border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white' : 'bg-gray-50 border-gray-200'} transition-all duration-300`}
                          />
                        </div>

                        {/* 사업자등록증 첨부 */}
                        {isEditing && (
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
                                    {businessCertificate ? businessCertificate.name : '파일을 선택하세요'}
                                  </span>
                                </div>
                              </div>
                              {businessCertificate && (
                                <div className="flex items-center gap-2 text-sm text-green-600">
                                  <FileText className="h-4 w-4" />
                                  {businessCertificate.name} ({(businessCertificate.size / 1024 / 1024).toFixed(2)} MB)
                                </div>
                              )}
                              <p className="text-xs text-blue-600">
                                PDF, JPG, PNG 파일 (최대 5MB)
                              </p>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>

              {/* 비밀번호 변경 버튼 */}
              <div className="pt-6 border-t border-blue-100">
                <Dialog open={passwordDialog} onOpenChange={setPasswordDialog}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start h-14 border-blue-200/50 text-blue-600/70 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 opacity-70 hover:opacity-100 transition-all duration-300"
                    >
                      <Lock className="h-5 w-5 mr-3" />
                      비밀번호 변경
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>비밀번호 변경</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label>현재 비밀번호</Label>
                        <div className="relative">
                          <Input
                            type={showPasswords.current ? 'text' : 'password'}
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                            className="h-12 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, current: !showPasswords.current})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                          >
                            {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <Label>새 비밀번호</Label>
                        <div className="relative">
                          <Input
                            type={showPasswords.new ? 'text' : 'password'}
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                            className="h-12 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, new: !showPasswords.new})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                          >
                            {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                        
                        {/* 비밀번호 강도 표시 */}
                        {passwordData.newPassword && (
                          <div className="space-y-2">
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div
                                  key={level}
                                  className={`h-1 flex-1 rounded-full transition-colors ${
                                    level <= passwordStrength
                                      ? passwordStrength <= 2
                                        ? 'bg-red-400'
                                        : passwordStrength <= 3
                                        ? 'bg-yellow-400'
                                        : 'bg-green-400'
                                      : 'bg-gray-200'
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-xs text-blue-600">
                              {passwordStrength <= 2 && '약함'}
                              {passwordStrength === 3 && '보통'}
                              {passwordStrength >= 4 && '강함'}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <Label>새 비밀번호 확인</Label>
                        <div className="relative">
                          <Input
                            type={showPasswords.confirm ? 'text' : 'password'}
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                            className="h-12 pr-12"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPasswords({...showPasswords, confirm: !showPasswords.confirm})}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700"
                          >
                            {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                          </button>
                        </div>
                      </div>

                      <Button 
                        onClick={handlePasswordChange}
                        disabled={isLoading}
                        className="w-full h-12"
                      >
                        {isLoading ? '변경 중...' : '비밀번호 변경'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              {/* 편집 모드 저장/취소 버튼 */}
              {isEditing && (
                <div className="flex gap-4 pt-6 border-t border-blue-100">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1 h-12"
                    disabled={isLoading}
                  >
                    취소
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1 h-12"
                    disabled={isLoading}
                  >
                    {isLoading ? '저장 중...' : '저장'}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 주문내역 탭 */}
        <TabsContent value="orders">
          <Card className="shadow-blue border-blue-100">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-blue-900">주문 내역</CardTitle>
                <div className="flex gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="주문번호 또는 품목명 검색"
                      className="pl-10 w-64 h-10"
                    />
                  </div>
                  <Button
                    onClick={() => onNavigate('order-history')}
                    variant="outline"
                    size="sm"
                    className="h-10"
                  >
                    전체보기
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12 text-blue-600">
                  <Package className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">주문 내역이 없습니다</p>
                  <p className="text-sm mb-4">아직 주문하신 내역이 없어요</p>
                  <Button
                    onClick={() => onNavigate('order-form')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    첫 주문하기
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 border border-blue-100 rounded-lg hover:bg-blue-50/30 transition-colors cursor-pointer"
                      onClick={() => onNavigate('order-detail', { orderId: order.id })}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            {order.shippingType === '해상' ? (
                              <Ship className="h-5 w-5 text-blue-600" />
                            ) : (
                              <Plane className="h-5 w-5 text-blue-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-medium text-blue-900">{order.id}</h3>
                            <p className="text-sm text-blue-600">{order.date}</p>
                          </div>
                        </div>
                        <Badge className={order.statusColor}>
                          {order.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-blue-600 mb-1">품목</p>
                          <p className="font-medium">
                            {order.items[0].name}
                            {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                          </p>
                        </div>
                        <div>
                          <p className="text-blue-600 mb-1">배송지</p>
                          <p className="font-medium">{order.destination}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-blue-100">
                        <div className="text-sm text-blue-600">
                          <span>송장번호: {order.trackingNumber}</span>
                        </div>
                        <div className="text-sm text-blue-600">
                          <span>예상도착: {order.estimatedArrival}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 설정 탭 */}
        <TabsContent value="notifications">
          <Card className="shadow-blue border-blue-100">
            <CardHeader>
              <CardTitle className="text-blue-900">알림 설정</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">주문 상태 업데이트</p>
                      <p className="text-sm text-blue-600">주문 처리 상태가 변경될 때 알림을 받습니다</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.orderUpdates}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, orderUpdates: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">이메일 알림</p>
                      <p className="text-sm text-blue-600">중요한 알림을 이메일로 받습니다</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border border-blue-100 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-blue-900">SMS 알림</p>
                      <p className="text-sm text-blue-600">긴급한 알림을 문자메시지로 받습니다</p>
                    </div>
                  </div>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, smsNotifications: checked})}
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-blue-100">
                <Button className="w-full h-12">
                  설정 저장
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 통계 탭 */}
        <TabsContent value="stats">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-blue border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  이용 통계
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                  <span className="text-blue-700">총 주문 수</span>
                  <span className="font-bold text-blue-900">{orders.length}건</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50/50 rounded-lg">
                  <span className="text-green-700">완료된 주문</span>
                  <span className="font-bold text-green-900">{orders.filter(o => o.status === '완료').length}건</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange-50/50 rounded-lg">
                  <span className="text-orange-700">진행 중인 주문</span>
                  <span className="font-bold text-orange-900">{orders.filter(o => o.status !== '완료').length}건</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-blue border-blue-100">
              <CardHeader>
                <CardTitle className="text-blue-900 flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  배송 현황
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                  <span className="text-blue-700">해상운송</span>
                  <span className="font-bold text-blue-900">{orders.filter(o => o.shippingType === '해상').length}건</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50/50 rounded-lg">
                  <span className="text-purple-700">항공운송</span>
                  <span className="font-bold text-purple-900">{orders.filter(o => o.shippingType === '항공').length}건</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50/50 rounded-lg">
                  <span className="text-gray-700">평균 배송기간</span>
                  <span className="font-bold text-gray-900">12일</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}