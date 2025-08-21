// YCS 물류 시스템 공통 JavaScript

// 전역 변수
window.YCS = {
    currentUser: null,
    config: {
        apiBaseUrl: '/api',
        pageTransitionDelay: 300
    }
};

// 유틸리티 함수들
const Utils = {
    // 이메일 유효성 검사
    validateEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // 금액 포매팅
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('ko-KR', {
            style: 'currency',
            currency: 'KRW',
            minimumFractionDigits: 0,
        }).format(amount);
    },

    // 날짜 포매팅
    formatDate: (date) => {
        return new Date(date).toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        });
    },

    // 날짜시간 포매팅
    formatDateTime: (date) => {
        return new Date(date).toLocaleString('ko-KR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // 전화번호 포매팅
    formatPhone: (phone) => {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11) {
            return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
        } else if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
        }
        return phone;
    },

    // 사업자등록번호 포매팅
    formatBusinessNumber: (number) => {
        const cleaned = number.replace(/\D/g, '');
        if (cleaned.length === 10) {
            return cleaned.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
        }
        return number;
    },

    // 디바운스 함수
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 랜덤 ID 생성
    generateId: () => {
        return Math.random().toString(36).substr(2, 9);
    },

    // 파일 크기 포매팅
    formatFileSize: (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // URL 파라미터 파싱
    getUrlParams: () => {
        const params = {};
        const urlParams = new URLSearchParams(window.location.search);
        for (const [key, value] of urlParams) {
            params[key] = value;
        }
        return params;
    },

    // 쿠키 설정
    setCookie: (name, value, days) => {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },

    // 쿠키 가져오기
    getCookie: (name) => {
        const nameEQ = name + '=';
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
};

// 사용자 관리
const UserManager = {
    // 현재 사용자 가져오기
    getCurrentUser: () => {
        const userStr = localStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    // 사용자 정보 저장
    setCurrentUser: (user) => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        window.YCS.currentUser = user;
    },

    // 로그아웃
    logout: () => {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('rememberedUser');
        localStorage.removeItem('mockUser');
        window.YCS.currentUser = null;
        Navigation.navigateTo('login');
    },

    // 사용자 타입별 권한 확인
    hasPermission: (permission) => {
        const user = UserManager.getCurrentUser();
        if (!user) return false;

        const permissions = {
            'order-create': ['general', 'corporate'],
            'order-manage': ['admin'],
            'partner-manage': ['partner'],
            'admin-access': ['admin']
        };

        return permissions[permission] ? permissions[permission].includes(user.type) : false;
    },

    // 사용자 타입별 메뉴 필터링
    getAvailablePages: () => {
        const user = UserManager.getCurrentUser();
        if (!user) return [];

        const allPages = {
            'dashboard': { label: '대시보드', icon: 'fas fa-home', userTypes: ['general', 'corporate'] },
            'order-form': { label: '주문서 작성', icon: 'fas fa-plus', userTypes: ['general', 'corporate'] },
            'order-history': { label: '주문 내역', icon: 'fas fa-list', userTypes: ['general', 'corporate'] },
            'mypage': { label: '마이페이지', icon: 'fas fa-user', userTypes: ['general', 'corporate', 'admin', 'partner'] },
            'notices': { label: '공지사항', icon: 'fas fa-bell', userTypes: ['general', 'corporate'] },
            'faq': { label: 'FAQ', icon: 'fas fa-question-circle', userTypes: ['general', 'corporate'] },
            'admin-dashboard': { label: '관리자 대시보드', icon: 'fas fa-cog', userTypes: ['admin'] },
            'admin-orders': { label: '주문 관리', icon: 'fas fa-boxes', userTypes: ['admin'] },
            'partner-dashboard': { label: '파트너 대시보드', icon: 'fas fa-truck', userTypes: ['partner'] },
            'partner-orders': { label: '파트너 주문', icon: 'fas fa-clipboard-list', userTypes: ['partner'] }
        };

        const availablePages = {};
        for (const [pageId, pageInfo] of Object.entries(allPages)) {
            if (pageInfo.userTypes.includes(user.type)) {
                availablePages[pageId] = pageInfo;
            }
        }

        return availablePages;
    }
};

// 네비게이션 관리
const Navigation = {
    // 페이지 이동
    navigateTo: (page, params = {}) => {
        let url = `${page}.html`;
        
        // URL 파라미터 추가
        const urlParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
            urlParams.append(key, value);
        }
        
        if (urlParams.toString()) {
            url += '?' + urlParams.toString();
        }

        window.location.href = url;
    },

    // 뒤로가기
    goBack: () => {
        if (window.history.length > 1) {
            window.history.back();
        } else {
            Navigation.navigateTo('dashboard');
        }
    },

    // 네비게이션 상태 업데이트
    updateNavigation: (currentPage) => {
        // 하단 네비게이션의 활성 상태 업데이트
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            const page = item.getAttribute('data-page');
            if (page === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // 페이지 타이틀 업데이트
        const user = UserManager.getCurrentUser();
        const pageTitles = {
            'dashboard': user?.type === 'corporate' ? '기업 고객 대시보드' : '개인 고객 대시보드',
            'order-form': '배송 접수',
            'order-history': '주문 내역',
            'order-detail': '주문 상세',
            'payment': '무통장 입금',
            'mypage': user?.type === 'corporate' ? '기업 정보 관리' : '개인 정보 관리',
            'notices': user?.type === 'corporate' ? '기업 고객 공지사항' : '개인 고객 공지사항',
            'faq': user?.type === 'corporate' ? '기업 고객 FAQ' : '개인 고객 FAQ',
            'workflow-simulator': '워크플로우 시뮬레이터',
            'page-list': '전체 페이지 목록'
        };

        const pageTitle = document.querySelector('[data-page-title]');
        if (pageTitle && pageTitles[currentPage]) {
            pageTitle.textContent = pageTitles[currentPage];
        }
    }
};

// 알림 시스템
const NotificationManager = {
    // 알림 표시
    show: (message, type = 'info', duration = 5000) => {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up alert alert-${type}`;
        
        const iconMap = {
            info: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-exclamation-triangle'
        };

        notification.innerHTML = `
            <i class="${iconMap[type]} alert-icon"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // 자동 제거
        setTimeout(() => {
            notification.classList.add('animate-fade-out');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);

        return notification;
    },

    // 성공 알림
    success: (message, duration = 3000) => {
        return NotificationManager.show(message, 'success', duration);
    },

    // 에러 알림
    error: (message, duration = 5000) => {
        return NotificationManager.show(message, 'error', duration);
    },

    // 경고 알림
    warning: (message, duration = 4000) => {
        return NotificationManager.show(message, 'warning', duration);
    },

    // 정보 알림
    info: (message, duration = 3000) => {
        return NotificationManager.show(message, 'info', duration);
    }
};

// 로딩 관리
const LoadingManager = {
    // 로딩 표시
    show: (message = '처리 중...') => {
        const existing = document.getElementById('loadingOverlay');
        if (existing) return;

        const loading = document.createElement('div');
        loading.id = 'loadingOverlay';
        loading.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        loading.innerHTML = `
            <div class="bg-white rounded-lg p-6 flex items-center space-x-3">
                <div class="loading-spinner-large"></div>
                <span class="text-gray-700">${message}</span>
            </div>
        `;

        document.body.appendChild(loading);
        document.body.style.overflow = 'hidden';
    },

    // 로딩 숨김
    hide: () => {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.remove();
            document.body.style.overflow = '';
        }
    }
};

// 모달 관리
const ModalManager = {
    // 모달 열기
    open: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // ESC 키로 모달 닫기
            const closeOnEsc = (e) => {
                if (e.key === 'Escape') {
                    ModalManager.close(modalId);
                    document.removeEventListener('keydown', closeOnEsc);
                }
            };
            document.addEventListener('keydown', closeOnEsc);
        }
    },

    // 모달 닫기
    close: (modalId) => {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    },

    // 확인 다이얼로그
    confirm: (message, title = '확인') => {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">${title}</h3>
                    <p class="text-gray-700 mb-6">${message}</p>
                    <div class="flex space-x-3 justify-end">
                        <button id="confirmCancel" class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">취소</button>
                        <button id="confirmOk" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">확인</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            modal.querySelector('#confirmOk').addEventListener('click', () => {
                modal.remove();
                document.body.style.overflow = '';
                resolve(true);
            });

            modal.querySelector('#confirmCancel').addEventListener('click', () => {
                modal.remove();
                document.body.style.overflow = '';
                resolve(false);
            });
        });
    }
};

// 폼 유효성 검사
const FormValidator = {
    // 기본 검증 규칙
    rules: {
        required: (value) => value.trim() !== '',
        email: (value) => Utils.validateEmail(value),
        phone: (value) => /^01[0-9]-?\d{3,4}-?\d{4}$/.test(value),
        password: (value) => value.length >= 6,
        businessNumber: (value) => /^\d{3}-?\d{2}-?\d{5}$/.test(value)
    },

    // 필드 검증
    validateField: (input, rules) => {
        const value = input.value;
        const errors = [];

        for (const rule of rules) {
            if (typeof rule === 'string' && FormValidator.rules[rule]) {
                if (!FormValidator.rules[rule](value)) {
                    errors.push(FormValidator.getErrorMessage(rule));
                }
            } else if (typeof rule === 'function') {
                const result = rule(value);
                if (result !== true) {
                    errors.push(result);
                }
            }
        }

        // UI 업데이트
        const errorElement = input.parentNode.querySelector('.error-message');
        if (errors.length > 0) {
            input.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errors[0];
                errorElement.classList.remove('hidden');
            }
        } else {
            input.classList.remove('error');
            if (errorElement) {
                errorElement.classList.add('hidden');
            }
        }

        return errors.length === 0;
    },

    // 에러 메시지
    getErrorMessage: (rule) => {
        const messages = {
            required: '필수 입력 항목입니다.',
            email: '올바른 이메일 형식을 입력해주세요.',
            phone: '올바른 전화번호 형식을 입력해주세요.',
            password: '비밀번호는 6자 이상이어야 합니다.',
            businessNumber: '올바른 사업자등록번호 형식을 입력해주세요.'
        };
        return messages[rule] || '입력값이 올바르지 않습니다.';
    },

    // 폼 전체 검증
    validateForm: (formId, validationRules) => {
        const form = document.getElementById(formId);
        if (!form) return false;

        let isValid = true;
        for (const [fieldName, rules] of Object.entries(validationRules)) {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field) {
                if (!FormValidator.validateField(field, rules)) {
                    isValid = false;
                }
            }
        }

        return isValid;
    }
};

// Mock API 시뮬레이션
const MockAPI = {
    // 사용자 데이터
    users: {
        'general@example.com': {
            password: 'password123',
            userData: {
                id: 'USER-001',
                type: 'general',
                name: '김일반',
                email: 'general@example.com',
                phone: '010-1234-5678'
            }
        },
        'corporate@example.com': {
            password: 'password123',
            userData: {
                id: 'USER-002',
                type: 'corporate',
                name: '이기업',
                email: 'corporate@example.com',
                phone: '02-1234-5678',
                companyName: '(주)테스트기업',
                businessNumber: '123-45-67890'
            }
        },
        'admin@example.com': {
            password: 'admin123',
            userData: {
                id: 'USER-003',
                type: 'admin',
                name: '관리자',
                email: 'admin@example.com',
                phone: '02-9999-8888'
            }
        },
        'partner@example.com': {
            password: 'partner123',
            userData: {
                id: 'USER-004',
                type: 'partner',
                name: '파트너',
                email: 'partner@example.com',
                phone: '02-7777-8888',
                companyName: '(주)파트너물류',
                businessNumber: '987-65-43210'
            }
        }
    },

    // API 호출 시뮬레이션
    call: async (endpoint, data = null, delay = 1000) => {
        await new Promise(resolve => setTimeout(resolve, delay));
        
        switch (endpoint) {
            case 'login':
                return MockAPI.login(data);
            case 'dashboard':
                return MockAPI.getDashboardData();
            case 'orders':
                return MockAPI.getOrders();
            default:
                throw new Error('Unknown endpoint');
        }
    },

    // 로그인
    login: (data) => {
        const { email, password } = data;
        const user = MockAPI.users[email];
        
        if (!user || user.password !== password) {
            throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        
        return { success: true, user: user.userData };
    },

    // 대시보드 데이터
    getDashboardData: () => {
        return {
            stats: {
                totalOrders: 156,
                pendingOrders: 12,
                completedOrders: 144,
                totalAmount: 45600000,
                monthlyGrowth: 12.5
            },
            recentOrders: [
                {
                    id: '1',
                    orderNumber: 'ORD-2024-001',
                    orderDate: '2024-01-15',
                    status: 'shipping',
                    items: [{ name: '노트북 컴퓨터', quantity: 1 }]
                }
            ],
            notifications: ['새로운 배송 알림이 있습니다.']
        };
    },

    // 주문 목록
    getOrders: () => {
        return [
            {
                id: '1',
                orderNumber: 'ORD-2024-001',
                orderDate: '2024-01-15',
                status: 'shipping',
                items: [{ name: '노트북 컴퓨터', quantity: 1 }]
            }
        ];
    }
};

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 현재 사용자 정보 로드
    window.YCS.currentUser = UserManager.getCurrentUser();
    
    // 현재 페이지 파악
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
    
    // 네비게이션 상태 업데이트
    Navigation.updateNavigation(currentPage);
    
    // 페이지별 권한 검사
    const user = window.YCS.currentUser;
    const protectedPages = ['dashboard', 'order-form', 'order-history', 'mypage'];
    
    if (protectedPages.includes(currentPage) && !user) {
        Navigation.navigateTo('login');
        return;
    }
    
    // 전역 에러 핸들러
    window.addEventListener('error', (e) => {
        console.error('전역 에러:', e.error);
        NotificationManager.error('오류가 발생했습니다. 페이지를 새로고침해주세요.');
    });
    
    // 전역 unhandled promise rejection 핸들러
    window.addEventListener('unhandledrejection', (e) => {
        console.error('처리되지 않은 Promise 에러:', e.reason);
        NotificationManager.error('요청 처리 중 오류가 발생했습니다.');
    });
});

// 전역 함수로 내보내기
window.Utils = Utils;
window.UserManager = UserManager;
window.Navigation = Navigation;
window.NotificationManager = NotificationManager;
window.LoadingManager = LoadingManager;
window.ModalManager = ModalManager;
window.FormValidator = FormValidator;
window.MockAPI = MockAPI;