import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { ArrowLeft, Search, Calendar, User, Eye, Bell, AlertCircle, Info, CheckCircle, Building2, Users } from 'lucide-react';
import { User as UserType } from '../types';

interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'system' | 'service' | 'billing' | 'promotion' | 'corporate' | 'general';
  priority: 'high' | 'medium' | 'low';
  date: string;
  author: string;
  views: number;
  targetUsers: ('general' | 'corporate' | 'admin' | 'partner')[];
  isFixed: boolean;
}

interface NoticesPageProps {
  onNavigate: (page: string) => void;
  user?: UserType | null;
}

export function NoticesPage({ onNavigate, user }: NoticesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 공지사항 데이터 (사용자 타입에 따라 다른 내용 표시)
  const notices: Notice[] = [
    // 고정 공지사항
    {
      id: 'fixed-001',
      title: 'YCS 물류 시스템 이용 안내',
      content: 'YCS 물류 시스템을 이용해주셔서 감사합니다. 시스템 이용 중 문의사항은 고객센터로 연락해주세요.',
      category: 'system',
      priority: 'high',
      date: '2024-01-01',
      author: '시스템관리자',
      views: 1250,
      targetUsers: ['general', 'corporate', 'admin', 'partner'],
      isFixed: true
    },
    
    // 일반 사용자 전용 공지사항
    {
      id: 'general-001',
      title: '개인 고객 배송비 할인 이벤트 안내',
      content: '개인 고객을 대상으로 한 배송비 할인 이벤트를 진행합니다. 첫 번째 주문 시 20% 할인 혜택을 받으실 수 있습니다.',
      category: 'promotion',
      priority: 'medium',
      date: '2024-02-15',
      author: '마케팅팀',
      views: 450,
      targetUsers: ['general'],
      isFixed: false
    },
    {
      id: 'general-002',
      title: '개인 포장 서비스 신규 오픈',
      content: '개인 고객을 위한 맞춤형 포장 서비스를 새롭게 선보입니다. 소량 배송도 안전하고 깔끔하게 포장해드립니다.',
      category: 'service',
      priority: 'medium',
      date: '2024-02-10',
      author: '서비스팀',
      views: 320,
      targetUsers: ['general'],
      isFixed: false
    },
    
    // 기업 고객 전용 공지사항
    {
      id: 'corporate-001',
      title: '기업 고객 전용 대량 배송 서비스 출시',
      content: '월 100건 이상 배송하는 기업 고객을 위한 전용 서비스를 출시했습니다. 전담 매니저 배정 및 특별 할인 혜택을 제공합니다.',
      category: 'corporate',
      priority: 'high',
      date: '2024-02-20',
      author: '기업영업팀',
      views: 180,
      targetUsers: ['corporate'],
      isFixed: false
    },
    {
      id: 'corporate-002',
      title: '기업 회원 정기 정산 시스템 개선',
      content: '기업 회원의 월별/분기별 정산 시스템이 개선되었습니다. 더욱 상세한 리포트와 분석 자료를 제공합니다.',
      category: 'billing',
      priority: 'medium',
      date: '2024-02-12',
      author: '회계팀',
      views: 95,
      targetUsers: ['corporate'],
      isFixed: false
    },
    
    // 공통 공지사항
    {
      id: 'common-001',
      title: '시스템 정기 점검 안내',
      content: '매월 첫째 주 일요일 새벽 2시~4시에 시스템 정기 점검이 진행됩니다. 점검 시간 동안 서비스 이용이 제한될 수 있습니다.',
      category: 'system',
      priority: 'high',
      date: '2024-02-08',
      author: '기술팀',
      views: 680,
      targetUsers: ['general', 'corporate'],
      isFixed: false
    },
    {
      id: 'common-002',
      title: '배송 추적 기능 개선',
      content: '배송 추적 기능이 개선되어 더욱 정확하고 실시간으로 배송 상황을 확인하실 수 있습니다.',
      category: 'service',
      priority: 'medium',
      date: '2024-02-05',
      author: '개발팀',
      views: 520,
      targetUsers: ['general', 'corporate'],
      isFixed: false
    }
  ];

  // 카테고리 정보 (사용자 타입에 따라 다르게 표시)
  const getCategories = () => {
    const baseCategories = [
      { id: 'all', name: '전체', description: '모든 공지사항' },
      { id: 'system', name: '시스템', description: '시스템 관련 안내' },
      { id: 'service', name: '서비스', description: '서비스 변경사항' }
    ];

    if (user?.type === 'corporate') {
      return [
        ...baseCategories,
        { id: 'corporate', name: '기업전용', description: '기업 고객 전용' },
        { id: 'billing', name: '정산', description: '정산 관련 안내' }
      ];
    } else if (user?.type === 'general') {
      return [
        ...baseCategories,
        { id: 'promotion', name: '프로모션', description: '할인 및 이벤트' },
        { id: 'general', name: '개인고객', description: '개인 고객 전용' }
      ];
    } else {
      return [
        ...baseCategories,
        { id: 'promotion', name: '프로모션', description: '할인 및 이벤트' },
        { id: 'corporate', name: '기업전용', description: '기업 고객 전용' }
      ];
    }
  };

  // 사용자 타입에 따른 공지사항 필터링
  const getFilteredNotices = () => {
    let filtered = notices;

    // 사용자 타입에 따른 필터링
    if (user) {
      filtered = filtered.filter(notice => 
        notice.targetUsers.includes(user.type) || 
        notice.targetUsers.includes('general' as any) // 일반적인 공지는 모든 사용자가 볼 수 있음
      );
    }

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(notice => notice.category === selectedCategory);
    }

    // 검색 필터링
    if (searchTerm) {
      filtered = filtered.filter(notice =>
        notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notice.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 고정 공지사항을 맨 위로 정렬
    return filtered.sort((a, b) => {
      if (a.isFixed && !b.isFixed) return -1;
      if (!a.isFixed && b.isFixed) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertCircle className="h-3 w-3" />;
      case 'medium':
        return <Info className="h-3 w-3" />;
      case 'low':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return <Bell className="h-3 w-3" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'corporate':
        return <Building2 className="h-3 w-3" />;
      case 'general':
        return <User className="h-3 w-3" />;
      default:
        return <Users className="h-3 w-3" />;
    }
  };

  const categories = getCategories();
  const filteredNotices = getFilteredNotices();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            if (user?.type === 'admin') {
              onNavigate('admin-dashboard');
            } else if (user?.type === 'partner') {
              onNavigate('partner-dashboard');
            } else {
              onNavigate('dashboard');
            }
          }}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          돌아가기
        </Button>
        <div>
          <h1 className="text-xl text-blue-900">공지사항</h1>
          <p className="text-sm text-blue-600">
            {user?.type === 'corporate' ? '기업 고객' : user?.type === 'general' ? '개인 고객' : '전체'} 대상 공지사항 - 총 {filteredNotices.length}개
          </p>
        </div>
      </div>

      {/* 사용자 정보 카드 */}
      {user && (
        <Card className={`shadow-blue border-blue-100 ${
          user.type === 'corporate' ? 'bg-orange-50/30' : 'bg-blue-50/30'
        }`}>
          <CardHeader>
            <CardTitle className={`${
              user.type === 'corporate' ? 'text-orange-900' : 'text-blue-900'
            } flex items-center gap-2`}>
              {user.type === 'corporate' ? <Building2 className="h-5 w-5" /> : <User className="h-5 w-5" />}
              {user.type === 'corporate' ? '기업 고객 전용 공지사항' : '개인 고객용 공지사항'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className={`text-sm ${user.type === 'corporate' ? 'text-orange-700' : 'text-blue-700'}`}>
                  고객명
                </p>
                <p className="font-medium">{user.name}</p>
              </div>
              <div>
                <p className={`text-sm ${user.type === 'corporate' ? 'text-orange-700' : 'text-blue-700'}`}>
                  고객 유형
                </p>
                <Badge variant="outline" className={
                  user.type === 'corporate' 
                    ? 'border-orange-300 text-orange-700' 
                    : 'border-blue-300 text-blue-700'
                }>
                  {user.type === 'corporate' ? '기업 고객' : '개인 고객'}
                </Badge>
              </div>
              <div>
                <p className={`text-sm ${user.type === 'corporate' ? 'text-orange-700' : 'text-blue-700'}`}>
                  맞춤 공지사항
                </p>
                <p className={`font-medium ${user.type === 'corporate' ? 'text-orange-600' : 'text-blue-600'}`}>
                  {filteredNotices.length}개 제공
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 검색 */}
      <Card className="shadow-blue border-blue-100">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600/60" />
            <Input
              type="text"
              placeholder="공지사항 제목, 내용으로 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-200"
            />
          </div>
        </CardContent>
      </Card>

      {/* 카테고리 필터 */}
      <Card className="shadow-blue border-blue-100">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="text-sm"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 공지사항 목록 */}
      <div className="space-y-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <Card key={notice.id} className={`shadow-blue border-blue-100 hover:shadow-lg transition-all duration-300 ${
              notice.isFixed ? 'border-yellow-200 bg-yellow-50/30' : ''
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {notice.isFixed && (
                        <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
                          고정
                        </Badge>
                      )}
                      <Badge
                        variant="outline"
                        className={getPriorityColor(notice.priority)}
                      >
                        <div className="flex items-center gap-1">
                          {getPriorityIcon(notice.priority)}
                          {notice.priority === 'high' ? '중요' : notice.priority === 'medium' ? '일반' : '안내'}
                        </div>
                      </Badge>
                      <Badge variant="outline" className="flex items-center gap-1">
                        {getCategoryIcon(notice.category)}
                        {notice.category === 'corporate' ? '기업전용' :
                         notice.category === 'general' ? '개인고객' :
                         notice.category === 'promotion' ? '프로모션' :
                         notice.category === 'billing' ? '정산' :
                         notice.category === 'system' ? '시스템' : '서비스'}
                      </Badge>
                    </div>
                    <CardTitle className="text-blue-900">
                      {notice.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-blue-700 leading-relaxed">
                  {notice.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-blue-600 pt-4 border-t border-blue-100">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {notice.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {notice.author}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {notice.views.toLocaleString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="shadow-blue border-blue-100">
            <CardContent className="text-center py-8">
              <Bell className="h-12 w-12 text-blue-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-blue-900 mb-2">공지사항이 없습니다</h3>
              <p className="text-blue-600">
                {searchTerm ? '검색 조건에 맞는 공지사항이 없습니다.' : '현재 등록된 공지사항이 없습니다.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* 도움말 */}
      <Card className="shadow-blue border-green-100 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center gap-2">
            <Info className="h-5 w-5" />
            공지사항 안내
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2 text-sm text-green-800">
            <p>• <strong>맞춤 공지사항</strong>: {user?.type === 'corporate' ? '기업 고객' : '개인 고객'}에게 특화된 공지사항을 제공합니다</p>
            <p>• <strong>우선순위</strong>: 중요, 일반, 안내 순으로 구분되어 표시됩니다</p>
            <p>• <strong>고정 공지</strong>: 중요한 공지사항은 항상 상단에 고정 표시됩니다</p>
            <p>• <strong>검색 기능</strong>: 제목이나 내용으로 원하는 공지사항을 빠르게 찾을 수 있습니다</p>
            {user?.type === 'corporate' && (
              <p>• <strong>기업 전용 서비스</strong>: 대량 배송, 정산 관련 공지사항을 우선 제공합니다</p>
            )}
            {user?.type === 'general' && (
              <p>• <strong>개인 고객 혜택</strong>: 할인 이벤트, 개인 맞춤 서비스 공지사항을 우선 제공합니다</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}