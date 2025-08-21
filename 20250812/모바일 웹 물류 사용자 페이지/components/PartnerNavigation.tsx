import React from 'react';
import { Home, Truck, Package, Clock, BarChart3, Settings, LogOut, List } from 'lucide-react';

interface PartnerNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function PartnerNavigation({ currentPage, onNavigate, onLogout }: PartnerNavigationProps) {
  const navigationItems = [
    {
      id: 'partner-dashboard',
      label: '홈',
      icon: <Home className="h-5 w-5" />,
      description: '파트너 대시보드'
    },
    {
      id: 'partner-tasks',
      label: '업무',
      icon: <Truck className="h-5 w-5" />,
      description: '창고 및 청구서 업무'
    },
    {
      id: 'partner-orders',
      label: '주문',
      icon: <Package className="h-5 w-5" />,
      description: '주문 관리'
    },
    {
      id: 'page-list',
      label: '전체',
      icon: <List className="h-5 w-5" />,
      description: '전체 페이지'
    },
    {
      id: 'mypage',
      label: '내정보',
      icon: <Settings className="h-5 w-5" />,
      description: '파트너 설정'
    }
  ];

  return (
    <>
      {/* 상단 헤더 */}
      <header className="bg-white border-b border-blue-100 shadow-sm sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold">YCS</span>
            </div>
            <div>
              <h1 className="font-semibold text-blue-900">YCS 파트너 시스템</h1>
              <p className="text-xs text-blue-600">
                {currentPage === 'partner-dashboard' && '파트너 대시보드'}
                {currentPage === 'partner-tasks' && '파트너 업무'}
                {currentPage === 'partner-orders' && '주문 관리'}
                {currentPage === 'partner-history' && '업무 이력'}
                {currentPage === 'partner-settlement' && '정산 관리'}
                {currentPage === 'mypage' && '파트너 설정'}
                {currentPage === 'page-list' && '전체 페이지 목록'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => onNavigate('page-list')}
              className="text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-3 py-1 rounded-full transition-colors"
            >
              페이지목록
            </button>
            <button 
              onClick={onLogout}
              className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-full transition-colors"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-blue-100 shadow-lg z-50">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 transition-all duration-300 ${
                currentPage === item.id
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-blue-400 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <div className={`transition-transform duration-300 ${
                currentPage === item.id ? 'scale-110' : 'scale-100'
              }`}>
                {item.icon}
              </div>
              <span className={`text-xs transition-all duration-300 ${
                currentPage === item.id ? 'font-medium' : ''
              }`}>
                {item.label}
              </span>
              {currentPage === item.id && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}