import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { ArrowLeft, Search, HelpCircle, User, Building2, Package, CreditCard, Truck, FileText, MessageCircle, Phone } from 'lucide-react';
import { User as UserType } from '../types';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'shipping' | 'billing' | 'service' | 'technical' | 'corporate' | 'general';
  targetUsers: ('general' | 'corporate' | 'admin' | 'partner')[];
  priority: number; // 낮은 숫자일수록 우선순위 높음
  views: number;
}

interface FAQPageProps {
  onNavigate: (page: string) => void;
  user?: UserType | null;
}

export function FAQPage({ onNavigate, user }: FAQPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // FAQ 데이터 (사용자 타입에 따라 다른 내용 표시)
  const faqs: FAQ[] = [
    // 개인 고객 전용 FAQ
    {
      id: 'general-001',
      question: '개인 고객도 국제 배송을 이용할 수 있나요?',
      answer: '네, 개인 고객도 국제 배송 서비스를 이용하실 수 있습니다. 소량 배송부터 가능하며, 개인 통관 절차를 도와드립니다. 배송비는 무게와 부피에 따라 계산되며, 온라인에서 간편하게 견적을 확인할 수 있습니다.',
      category: 'shipping',
      targetUsers: ['general'],
      priority: 1,
      views: 1250
    },
    {
      id: 'general-002',
      question: '개인 고객 할인 혜택은 어떤 것이 있나요?',
      answer: '개인 고객을 위한 다양한 할인 혜택을 제공합니다. 첫 주문 시 20% 할인, 월 5회 이상 이용 시 15% 할인, 추천인 제도를 통한 추가 할인 등이 있습니다. 마이페이지에서 현재 이용 가능한 쿠폰을 확인하실 수 있습니다.',
      category: 'billing',
      targetUsers: ['general'],
      priority: 2,
      views: 890
    },
    {
      id: 'general-003',
      question: '소량 배송도 안전하게 포장해주나요?',
      answer: '물론입니다. 개인 고객의 소량 배송도 전문 포장재를 사용하여 안전하게 포장해드립니다. 깨지기 쉬운 물품은 에어캡과 충격 완충재를 추가로 사용하며, 배송 중 손상 시 보상도 가능합니다.',
      category: 'service',
      targetUsers: ['general'],
      priority: 3,
      views: 650
    },

    // 기업 고객 전용 FAQ
    {
      id: 'corporate-001',
      question: '기업 고객 전용 대량 배송 할인은 얼마나 되나요?',
      answer: '기업 고객 대량 배송 할인은 월 배송량에 따라 차등 적용됩니다. 월 100건 이상 시 10%, 500건 이상 시 15%, 1000건 이상 시 20% 할인을 제공합니다. 또한 연간 계약 시 추가 5% 할인 혜택이 있습니다.',
      category: 'billing',
      targetUsers: ['corporate'],
      priority: 1,
      views: 420
    },
    {
      id: 'corporate-002',
      question: '기업 전담 매니저 서비스는 어떤 내용인가요?',
      answer: '월 300건 이상 이용하는 기업 고객에게는 전담 매니저를 배정해드립니다. 전담 매니저는 배송 일정 관리, 특별 요청 처리, 월별 리포트 제공, 비용 최적화 컨설팅 등의 서비스를 제공합니다.',
      category: 'service',
      targetUsers: ['corporate'],
      priority: 2,
      views: 380
    },
    {
      id: 'corporate-003',
      question: '기업 정산은 어떻게 이루어지나요?',
      answer: '기업 고객은 월말 정산 또는 분기별 정산을 선택할 수 있습니다. 세금계산서 발행, 상세 배송 내역서 제공, 부서별 비용 분석 리포트 등을 포함합니다. 정산 시스템을 통해 실시간으로 사용 현황을 확인할 수 있습니다.',
      category: 'billing',
      targetUsers: ['corporate'],
      priority: 3,
      views: 290
    },

    // 공통 FAQ
    {
      id: 'common-001',
      question: '배송 추적은 어떻게 하나요?',
      answer: '주문 완료 후 제공되는 송장번호로 실시간 배송 추적이 가능합니다. 웹사이트 또는 모바일 앱에서 송장번호를 입력하면 현재 배송 상태, 예상 도착 시간을 확인할 수 있습니다. SMS 알림 서비스도 제공합니다.',
      category: 'shipping',
      targetUsers: ['general', 'corporate'],
      priority: 1,
      views: 2100
    },
    {
      id: 'common-002',
      question: '배송이 지연되면 어떻게 하나요?',
      answer: '배송 지연 시 SMS 또는 이메일로 알림을 드립니다. 통관 지연, 천재지변 등 불가항력적 사유를 제외한 당사 책임 지연의 경우 배송비 환불 또는 차회 배송 할인을 제공합니다. 고객센터로 문의해주시면 즉시 처리해드립니다.',
      category: 'shipping',
      targetUsers: ['general', 'corporate'],
      priority: 2,
      views: 1800
    },
    {
      id: 'common-003',
      question: '결제는 어떤 방법을 사용할 수 있나요?',
      answer: '현재는 무통장 입금만 지원합니다. 주문 완료 후 24시간 내 지정 계좌로 입금해주시면 됩니다. 입금 확인 후 즉시 배송 접수 처리됩니다. 향후 신용카드, 간편결제 등 다양한 결제 수단을 추가할 예정입니다.',
      category: 'billing',
      targetUsers: ['general', 'corporate'],
      priority: 3,
      views: 1650
    },
    {
      id: 'common-004',
      question: '금지 품목은 어떤 것들이 있나요?',
      answer: '위험물(폭발물, 인화성 물질), 생물(동식물), 액체류, 의약품, 전자제품(리튬배터리 포함), 현금 및 귀중품, 음식물 등은 배송이 제한됩니다. 자세한 금지 품목 리스트는 배송 접수 시 확인하실 수 있습니다.',
      category: 'shipping',
      targetUsers: ['general', 'corporate'],
      priority: 4,
      views: 1320
    },
    {
      id: 'common-005',
      question: '시스템 사용법을 알고 싶어요.',
      answer: '시스템 사용법은 각 페이지의 도움말을 참고하시거나, 워크플로우 시뮬레이터를 이용해 전체 배송 프로세스를 미리 체험해보실 수 있습니다. 추가 문의는 고객센터(1588-0000)로 연락해주세요.',
      category: 'technical',
      targetUsers: ['general', 'corporate'],
      priority: 5,
      views: 980
    }
  ];

  // 카테고리 정보 (사용자 타입에 따라 다르게 표시)
  const getCategories = () => {
    const baseCategories = [
      { id: 'all', name: '전체', description: '모든 FAQ', icon: <HelpCircle className="h-4 w-4" /> },
      { id: 'shipping', name: '배송', description: '배송 관련', icon: <Package className="h-4 w-4" /> },
      { id: 'billing', name: '결제/정산', description: '비용 관련', icon: <CreditCard className="h-4 w-4" /> },
      { id: 'service', name: '서비스', description: '서비스 이용', icon: <Truck className="h-4 w-4" /> },
      { id: 'technical', name: '기술지원', description: '시스템 사용법', icon: <FileText className="h-4 w-4" /> }
    ];

    if (user?.type === 'corporate') {
      return [
        ...baseCategories,
        { id: 'corporate', name: '기업전용', description: '기업 고객 전용', icon: <Building2 className="h-4 w-4" /> }
      ];
    } else if (user?.type === 'general') {
      return [
        ...baseCategories,
        { id: 'general', name: '개인고객', description: '개인 고객 전용', icon: <User className="h-4 w-4" /> }
      ];
    } else {
      return [
        ...baseCategories,
        { id: 'corporate', name: '기업전용', description: '기업 고객 전용', icon: <Building2 className="h-4 w-4" /> },
        { id: 'general', name: '개인고객', description: '개인 고객 전용', icon: <User className="h-4 w-4" /> }
      ];
    }
  };

  // 사용자 타입에 따른 FAQ 필터링
  const getFilteredFAQs = () => {
    let filtered = faqs;

    // 사용자 타입에 따른 필터링
    if (user) {
      filtered = filtered.filter(faq => 
        faq.targetUsers.includes(user.type)
      );
    }

    // 카테고리 필터링
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(faq => faq.category === selectedCategory);
    }

    // 검색 필터링
    if (searchTerm) {
      filtered = filtered.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // 우선순위 및 조회수로 정렬
    return filtered.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      return b.views - a.views;
    });
  };

  const categories = getCategories();
  const filteredFAQs = getFilteredFAQs();

  // 카테고리별 FAQ 수 계산
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') return filteredFAQs.length;
    return faqs.filter(faq => {
      if (user && !faq.targetUsers.includes(user.type)) return false;
      return faq.category === categoryId;
    }).length;
  };

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
          <h1 className="text-xl text-blue-900">자주 묻는 질문 (FAQ)</h1>
          <p className="text-sm text-blue-600">
            {user?.type === 'corporate' ? '기업 고객' : user?.type === 'general' ? '개인 고객' : '전체'} 대상 FAQ - 총 {filteredFAQs.length}개
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
              {user.type === 'corporate' ? '기업 고객 맞춤 FAQ' : '개인 고객 맞춤 FAQ'}
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
                  맞춤 FAQ
                </p>
                <p className={`font-medium ${user.type === 'corporate' ? 'text-orange-600' : 'text-blue-600'}`}>
                  {filteredFAQs.length}개 제공
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
              placeholder="질문 내용으로 검색..."
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2 h-auto py-3"
              >
                {category.icon}
                <div className="text-left">
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs opacity-70">
                    {getCategoryCount(category.id)}개
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ 목록 */}
      {filteredFAQs.length > 0 ? (
        <Card className="shadow-blue border-blue-100">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              {user?.type === 'corporate' ? '기업 고객' : user?.type === 'general' ? '개인 고객' : '전체'} FAQ 목록
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full space-y-2">
              {filteredFAQs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border border-blue-100 rounded-lg px-4">
                  <AccordionTrigger className="text-blue-900 hover:text-blue-700 text-left">
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {faq.category === 'shipping' ? '배송' :
                             faq.category === 'billing' ? '결제/정산' :
                             faq.category === 'service' ? '서비스' :
                             faq.category === 'technical' ? '기술지원' :
                             faq.category === 'corporate' ? '기업전용' :
                             faq.category === 'general' ? '개인고객' : '기타'}
                          </Badge>
                          <Badge variant="outline" className="text-xs text-gray-600">
                            조회 {faq.views.toLocaleString()}
                          </Badge>
                        </div>
                        <div className="font-medium">{faq.question}</div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-blue-700 pt-4 pb-2">
                    <div className="bg-blue-50/50 rounded-lg p-4 leading-relaxed">
                      {faq.answer}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-blue border-blue-100">
          <CardContent className="text-center py-8">
            <HelpCircle className="h-12 w-12 text-blue-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-blue-900 mb-2">FAQ가 없습니다</h3>
            <p className="text-blue-600">
              {searchTerm ? '검색 조건에 맞는 FAQ가 없습니다.' : '현재 등록된 FAQ가 없습니다.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 고객센터 연락처 */}
      <Card className="shadow-blue border-green-100 bg-green-50/30">
        <CardHeader>
          <CardTitle className="text-green-900 flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            추가 문의가 있으신가요?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-green-200">
              <Phone className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">고객센터 전화</p>
                <p className="text-green-700">1588-0000</p>
                <p className="text-xs text-green-600">평일 09:00 ~ 18:00</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-lg border border-green-200">
              <MessageCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">이메일 문의</p>
                <p className="text-green-700">support@ycs-logistics.com</p>
                <p className="text-xs text-green-600">24시간 접수 가능</p>
              </div>
            </div>
          </div>
          <div className="text-sm text-green-800 bg-white p-3 rounded-lg border border-green-200">
            <p className="font-medium mb-2">문의 시 필요한 정보:</p>
            <ul className="space-y-1 text-xs">
              <li>• 고객명 및 연락처</li>
              <li>• {user?.type === 'corporate' ? '사업자등록번호' : '회원 이메일 주소'}</li>
              <li>• 주문번호 (배송 관련 문의 시)</li>
              <li>• 구체적인 문의 내용</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}