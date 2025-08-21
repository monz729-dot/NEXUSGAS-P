# YCS 물류 시스템 - HTML 버전

React/TSX로 작성된 YCS 물류 시스템을 표준 HTML/CSS/JavaScript로 변환한 버전입니다.

## 📁 파일 구조

```
html/
├── index.html              # 메인 페이지 (페이지 목록)
├── login.html              # 로그인 페이지
├── dashboard.html          # 대시보드
├── assets/
│   ├── common.css         # 공통 스타일
│   └── common.js          # 공통 JavaScript
└── README.md              # 이 파일
```

## 🚀 시작하기

1. 웹 서버를 통해 html 폴더를 서빙하거나
2. `index.html` 파일을 브라우저에서 직접 열기

### 로컬 서버 실행 (권장)

```bash
# Python 3가 있는 경우
cd html
python -m http.server 8000

# Node.js가 있는 경우
cd html
npx serve .

# 그 후 http://localhost:8000 접속
```

## 🔐 테스트 계정

| 사용자 타입 | 이메일 | 비밀번호 |
|------------|--------|----------|
| 일반회원 | general@example.com | password123 |
| 기업회원 | corporate@example.com | password123 |
| 관리자 | admin@example.com | admin123 |
| 파트너 | partner@example.com | partner123 |

## 🎯 주요 기능

### 변환된 페이지
- ✅ **로그인 페이지** - 사용자 인증
- ✅ **대시보드** - 주요 통계 및 빠른 액션
- ✅ **페이지 목록** - 모든 페이지 네비게이션

### 공통 기능
- ✅ **반응형 디자인** - 모바일/태블릿/데스크톱 지원
- ✅ **사용자 권한 관리** - 타입별 접근 제어
- ✅ **테스트 계정** - 빠른 로그인
- ✅ **모의 데이터** - 실제 API 없이 동작
- ✅ **애니메이션** - 부드러운 전환 효과

## 🛠 기술 스택

- **HTML5** - 시맨틱 마크업
- **CSS3** - 스타일링 (Tailwind CSS 사용)
- **JavaScript (ES6+)** - 인터랙션 및 상태 관리
- **Font Awesome** - 아이콘
- **LocalStorage** - 클라이언트 데이터 저장

## 📱 지원하는 사용자 타입

### 일반회원/기업회원
- 대시보드
- 주문서 작성
- 주문 내역
- 마이페이지

### 관리자
- 관리자 대시보드
- 주문 관리
- 시스템 관리

### 파트너
- 파트너 대시보드
- 주문 처리
- 정산 관리

## 🎨 디자인 특징

### 색상 체계
- **Primary**: 파란색 계열 (#3b82f6)
- **Secondary**: 회색 계열
- **Success**: 녹색 계열
- **Warning**: 주황색 계열
- **Danger**: 빨간색 계열

### 레이아웃
- **헤더**: 로고, 사용자 정보, 네비게이션
- **메인**: 페이지별 컨텐츠
- **하단 네비게이션**: 모바일 최적화된 탭 네비게이션

## 🔧 주요 컴포넌트

### 공통 유틸리티 (common.js)
- `Utils` - 데이터 포매팅, 유효성 검사
- `UserManager` - 사용자 인증 관리
- `Navigation` - 페이지 네비게이션
- `NotificationManager` - 알림 시스템
- `LoadingManager` - 로딩 상태 관리
- `ModalManager` - 모달 다이얼로그
- `FormValidator` - 폼 유효성 검사
- `MockAPI` - 모의 API 시뮬레이션

### 스타일 시스템 (common.css)
- 애니메이션 클래스
- 카드 스타일
- 버튼 스타일
- 폼 컨트롤 스타일
- 반응형 그리드

## 📝 변환 과정

### TSX → HTML 변환 내용
1. **컴포넌트 구조** → HTML 섹션
2. **JSX 문법** → 표준 HTML
3. **Props** → JavaScript 함수 매개변수
4. **State** → JavaScript 변수
5. **Event Handler** → onclick 등 이벤트 속성
6. **조건부 렌더링** → JavaScript if/else
7. **배열 렌더링** → JavaScript 반복문

### 유지된 기능
- ✅ 사용자 인증 및 권한 관리
- ✅ 반응형 디자인
- ✅ 애니메이션 효과
- ✅ 데이터 유효성 검사
- ✅ 에러 처리 및 알림
- ✅ 로컬 데이터 저장

## 🌐 브라우저 지원

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📋 향후 개발 계획

### 추가 예정 페이지
- [ ] 회원가입 페이지
- [ ] 주문서 작성 페이지  
- [ ] 주문 내역 페이지
- [ ] 주문 상세 페이지
- [ ] 마이페이지
- [ ] 공지사항
- [ ] FAQ
- [ ] 관리자 페이지들
- [ ] 파트너 페이지들

### 기능 개선
- [ ] PWA 지원
- [ ] 다크 모드
- [ ] 다국어 지원
- [ ] 접근성 개선
- [ ] 성능 최적화

## 🐛 알려진 이슈

- 일부 고급 기능은 추후 구현 예정
- 실제 API 연동은 별도 작업 필요
- IE 브라우저는 지원하지 않음

## 📞 문의

프로젝트 관련 문의사항이 있으시면 개발팀에 연락주세요.

---

© 2024 YCS 물류 시스템. All rights reserved.