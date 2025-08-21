import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Search, 
  Calendar,
  Package, 
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Award,
  Truck
} from 'lucide-react';
import { User as UserType } from '../App';

interface PartnerHistoryProps {
  user: UserType | null;
  onNavigate: (page: string) => void;
}

export function PartnerHistory({ user, onNavigate }: PartnerHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('thisMonth');

  // 데모 데이터
  const completedTasks = [
    {
      id: 'YCS-2024-001',
      date: '2024-01-14',
      time: '15:30',
      customer: '(주)ABC무역',
      type: 'pickup',
      route: '강남구 → 분당구',
      distance: '23km',
      duration: '1시간 45분',
      items: '전자제품 외 2건',
      weight: '15kg',
      fee: '28,000원',
      rating: 5,
      feedback: '정시 배송으로 만족합니다.'
    },
    {
      id: 'YCS-2024-002',
      date: '2024-01-14',
      time: '11:20',
      customer: '개인고객',
      type: 'delivery',
      route: '홍대입구 → 송도',
      distance: '45km',
      duration: '2시간 30분',
      items: '서류봉투',
      weight: '0.5kg',
      fee: '35,000원',
      rating: 4,
      feedback: '친절한 서비스 감사합니다.'
    },
    {
      id: 'YCS-2024-003',
      date: '2024-01-13',
      time: '16:45',
      customer: '스타트업코리아',
      type: 'pickup',
      route: '서초구 → 해운대구',
      distance: '380km',
      duration: '당일배송',
      items: '노트북, 모니터',
      weight: '12kg',
      fee: '85,000원',
      rating: 5,
      feedback: '안전한 포장과 빠른 배송!'
    },
    {
      id: 'YCS-2024-004',
      date: '2024-01-13',
      time: '09:15',
      customer: '(주)테크솔루션',
      type: 'delivery',
      route: '판교 → 여의도',
      distance: '35km',
      duration: '1시간 20분',
      items: '회사서류',
      weight: '2kg',
      fee: '22,000원',
      rating: 5,
      feedback: null
    },
    {
      id: 'YCS-2024-005',
      date: '2024-01-12',
      time: '14:00',
      customer: '김개인',
      type: 'pickup',
      route: '강서구 → 강동구',
      distance: '28km',
      duration: '2시간',
      items: '가전제품',
      weight: '25kg',
      fee: '32,000원',
      rating: 4,
      feedback: '시간에 맞춰 잘 도착했어요.'
    }
  ];

  const filteredTasks = completedTasks.filter(task => 
    task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.route.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 통계 계산
  const totalTasks = completedTasks.length;
  const totalEarnings = completedTasks.reduce((sum, task) => sum + parseInt(task.fee.replace(/[^0-9]/g, '')), 0);
  const averageRating = completedTasks.reduce((sum, task) => sum + task.rating, 0) / totalTasks;
  const totalDistance = completedTasks.reduce((sum, task) => sum + parseInt(task.distance.replace(/[^0-9]/g, '')), 0);

  const periodOptions = [
    { id: 'thisMonth', label: '이번 달' },
    { id: 'lastMonth', label: '지난 달' },
    { id: 'last3Months', label: '최근 3개월' },
    { id: 'thisYear', label: '올해' }
  ];

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pb-20">
      {/* 헤더 */}
      <header className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-blue-900">작업 내역</h1>
              <p className="text-sm text-blue-600">{user.name} 파트너님의 완료된 작업</p>
            </div>
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center shadow-blue">
              <Package className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* 기간 선택 */}
          <div className="flex space-x-2 mb-4 overflow-x-auto">
            {periodOptions.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedPeriod === period.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                }`}
              >
                {period.label}
              </button>
            ))}
          </div>

          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-600/60" />
            <Input
              type="text"
              placeholder="주문번호, 고객명, 경로로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 border-blue-200 focus:border-blue-500 focus:ring-blue-200 bg-blue-50/30 hover:bg-blue-50/50 focus:bg-white transition-all duration-300"
            />
          </div>
        </div>
      </header>

      <div className="p-4">
        {/* 통계 카드 */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="shadow-blue border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600">완료 작업</p>
                  <p className="text-2xl font-bold text-blue-900">{totalTasks}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-blue border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600">총 수익</p>
                  <p className="text-2xl font-bold text-green-900">{totalEarnings.toLocaleString()}원</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-blue border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-yellow-600">평균 평점</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-yellow-900">{averageRating.toFixed(1)}</p>
                    <div className="flex">
                      {getRatingStars(Math.round(averageRating))}
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-blue border-blue-100">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600">총 거리</p>
                  <p className="text-2xl font-bold text-purple-900">{totalDistance}km</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 작업 내역 목록 */}
        <div className="space-y-4">
          {filteredTasks.length === 0 ? (
            <Card className="shadow-blue border-blue-100">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="h-12 w-12 text-blue-300 mb-4" />
                <h3 className="text-lg font-medium text-blue-900 mb-2">작업 내역이 없습니다</h3>
                <p className="text-blue-600 text-center">
                  {searchQuery ? '검색 조건에 맞는 작업이 없습니다.' : '아직 완료된 작업이 없습니다.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredTasks.map((task) => (
              <Card key={task.id} className="shadow-blue border-blue-100">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-blue-900 flex items-center gap-2">
                        <Truck className="h-5 w-5 text-blue-600" />
                        {task.id}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {task.customer} • {task.date} {task.time}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">
                      완료
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* 기본 정보 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">이동 경로</span>
                      </div>
                      <p className="text-sm text-blue-800 ml-6">{task.route}</p>
                      <p className="text-xs text-blue-600 ml-6">{task.distance} • {task.duration}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-900">화물 정보</span>
                      </div>
                      <p className="text-sm text-green-800 ml-6">{task.items}</p>
                      <p className="text-xs text-green-600 ml-6">{task.weight}</p>
                    </div>
                  </div>

                  {/* 수익 및 평점 */}
                  <div className="flex items-center justify-between p-3 bg-blue-50/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm text-blue-600">수익</p>
                        <p className="font-bold text-blue-900">{task.fee}</p>
                      </div>
                      <div>
                        <p className="text-sm text-blue-600">평점</p>
                        <div className="flex items-center gap-1">
                          {getRatingStars(task.rating)}
                          <span className="text-sm font-medium text-blue-900 ml-1">{task.rating}.0</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 고객 피드백 */}
                  {task.feedback && (
                    <div className="p-3 bg-yellow-50/50 rounded-lg">
                      <p className="text-sm text-yellow-600 mb-1">고객 피드백</p>
                      <p className="text-sm text-yellow-800 italic">"{task.feedback}"</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}