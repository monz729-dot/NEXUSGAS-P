// 공통 네비게이션 함수들
function goToPageList() {
    window.location.href = '../index.html';
}

function goToDashboard() {
    window.location.href = 'dashboard.html';
}

function goToOrderForm() {
    window.location.href = 'order-form.html';
}

function goToOrderHistory() {
    window.location.href = 'order-history.html';
}

function goToMyPage() {
    window.location.href = 'mypage.html';
}

function goToNotices() {
    window.location.href = 'notices.html';
}

function goToFAQ() {
    window.location.href = 'faq.html';
}

function goToSignup() {
    window.location.href = 'signup.html';
}

function goToLogin() {
    window.location.href = '../LoginPage.html';
}

function logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('mockUser');
    localStorage.removeItem('rememberedUser');
    window.location.href = '../LoginPage.html';
}

// 사용자 정보 가져오기
function getCurrentUser() {
    const userStr = localStorage.getItem('mockUser') || localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// 로그인 확인
function checkLogin() {
    const user = getCurrentUser();
    if (!user) {
        window.location.href = '../LoginPage.html';
        return false;
    }
    return true;
}

// 사용자 타입별 접근 권한 확인
function checkAccess(allowedTypes) {
    const user = getCurrentUser();
    if (!user || !allowedTypes.includes(user.type)) {
        alert('접근 권한이 없습니다.');
        goToPageList();
        return false;
    }
    return true;
}

// 페이지 로딩 표시
function showLoading(message = '로딩 중...') {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.className = 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50';
    loadingDiv.innerHTML = `
        <div class="text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                <div class="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p class="text-blue-600 font-medium">${message}</p>
        </div>
    `;
    document.body.appendChild(loadingDiv);
}

// 페이지 로딩 숨기기
function hideLoading() {
    const loading = document.getElementById('loading');
    if (loading) {
        loading.remove();
    }
}

// 토스트 메시지 표시
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm animate-fade-in`;
    
    let bgColor, textColor, icon;
    switch (type) {
        case 'success':
            bgColor = 'bg-green-50 border-green-200';
            textColor = 'text-green-800';
            icon = '✅';
            break;
        case 'error':
            bgColor = 'bg-red-50 border-red-200';
            textColor = 'text-red-800';
            icon = '❌';
            break;
        case 'warning':
            bgColor = 'bg-yellow-50 border-yellow-200';
            textColor = 'text-yellow-800';
            icon = '⚠️';
            break;
        default:
            bgColor = 'bg-blue-50 border-blue-200';
            textColor = 'text-blue-800';
            icon = 'ℹ️';
    }
    
    toast.className += ` ${bgColor} ${textColor} border`;
    toast.innerHTML = `
        <div class="flex items-center">
            <span class="mr-2">${icon}</span>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-lg leading-none">&times;</button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // 5초 후 자동 제거
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}