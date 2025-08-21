import React from 'react';
import { Badge } from './ui/badge';
import { Home, Package, FileText, User as UserIcon, LogOut, Menu, List } from 'lucide-react';
import { User } from '../types';

interface MobileNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  user?: User | null;
}

export function MobileNavigation({ currentPage, onNavigate, onLogout, user }: MobileNavigationProps) {
  const navigationItems = [
    {
      id: 'dashboard',
      label: '홈',
      icon: <Home className="h-5 w-5" />,
      description: '메인 대시보드'
    },
    {
      id: 'order-form',
      label: '접수',
      icon: <Package className="h-5 w-5" />,
      description: '배송 접수'
    },
    {
      id: 'order-history',
      label: '내역',
      icon: <FileText className="h-5 w-5" />,
      description: '주문 내역'
    },
    {
      id: 'mypage',
      label: '내정보',
      icon: <UserIcon className="h-5 w-5" />,
      description: '마이페이지'
    },
    {
      id: 'page-list',
      label: '전체',
      icon: <List className="h-5 w-5" />,
      description: '전체 페이지'
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
              <h1 className="font-semibold text-blue-900">
                YCS 물류 시스템
                {user?.type === 'corporate' && (
                  <Badge variant="outline" className="ml-2 border-orange-300 text-orange-700">
                    기업
                  </Badge>
                )}
                {user?.type === 'general' && (
                  <Badge variant="outline" className="ml-2 border-blue-300 text-blue-700">
                    개인
                  </Badge>
                )}
              </h1>
              <p className="text-xs text-blue-600">
                {currentPage === 'dashboard' && (user?.type === 'corporate' ? '기업 고객 대시보드' : '개인 고객 대시보드')}
                {currentPage === 'order-form' && '배송 접수'}
                {currentPage === 'order-history' && '주문 내역'}
                {currentPage === 'order-detail' && '주문 상세'}
                {currentPage === 'payment' && '무통장 입금'}
                {currentPage === 'mypage' && (user?.type === 'corporate' ? '기업 정보 관리' : '개인 정보 관리')}
                {currentPage === 'notices' && (user?.type === 'corporate' ? '기업 고객 공지사항' : '개인 고객 공지사항')}
                {currentPage === 'faq' && (user?.type === 'corporate' ? '기업 고객 FAQ' : '개인 고객 FAQ')}
                {currentPage === 'workflow-simulator' && '워크플로우 시뮬레이터'}
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