import React from 'react';
import { Home, Package, BarChart3, Settings, LogOut, List } from 'lucide-react';

interface AdminNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminNavigation({ currentPage, onNavigate, onLogout }: AdminNavigationProps) {
  const navigationItems = [
    {
      id: 'admin-dashboard',
      label: '대시보드',
      icon: <Home className="h-5 w-5" />,
      description: '관리자 메인'
    },
    {
      id: 'admin-orders',
      label: '주문관리',
      icon: <Package className="h-5 w-5" />,
      description: '주문 관리'
    },
    {
      id: 'workflow-simulator',
      label: '시뮬레이터',
      icon: <BarChart3 className="h-5 w-5" />,
      description: '워크플로우'
    },
    {
      id: 'page-list',
      label: '전체페이지',
      icon: <List className="h-5 w-5" />,
      description: '페이지 목록'
    },
    {
      id: 'mypage',
      label: '설정',
      icon: <Settings className="h-5 w-5" />,
      description: '관리자 설정'
    }
  ];

  return (
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
  );
}