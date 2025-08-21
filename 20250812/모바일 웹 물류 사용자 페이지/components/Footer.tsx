import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-sm pb-16">
      <div className="p-4 space-y-4">
        {/* 회사 정보 */}
        <div className="space-y-2">
          <h3 className="font-semibold text-base">YCS 물류 시스템</h3>
          <div className="space-y-1 text-gray-300">
            <p>대표자: 김대표 | 사업자등록번호: 123-45-67890</p>
            <p>통신판매업신고번호: 2024-서울강남-0001</p>
          </div>
        </div>

        {/* 연락처 정보 */}
        <div className="space-y-2">
          <h4 className="font-semibold">고객센터</h4>
          <div className="space-y-1 text-gray-300">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span>1588-1234</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span>support@ycs-logistics.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>서울특별시 강남구 테헤란로 123</span>
            </div>
          </div>
          <p className="text-gray-400 text-xs">
            운영시간: 평일 09:00 ~ 18:00 (토·일·공휴일 휴무)
          </p>
        </div>

        {/* 링크 */}
        <div className="flex flex-wrap gap-4 text-gray-300">
          <button className="hover:text-white transition-colors">
            이용약관
          </button>
          <button className="hover:text-white transition-colors">
            개인정보처리방침
          </button>
          <button className="hover:text-white transition-colors">
            배송정책
          </button>
        </div>

        {/* 저작권 */}
        <div className="pt-4 border-t border-gray-700">
          <p className="text-gray-400 text-xs">
            Copyright © 2024 YCS Logistics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}