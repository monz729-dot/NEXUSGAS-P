# Nexus 퍼블 프로토타입

이 프로젝트는 Nexus 웹사이트의 퍼블리싱 프로토타입입니다.

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 개발 서버 실행
```bash
npm run dev
```

또는

```bash
npm start
```

## 프로젝트 구조

```
20250810/
├── assets/          # CSS, JS, 이미지 등 정적 파일
│   ├── css/         # 스타일시트
│   ├── js/          # 자바스크립트
│   ├── img/         # 이미지 파일
│   └── font/        # 폰트 파일
└── html/            # HTML 파일들
    ├── main/        # 메인 페이지
    └── sub/         # 서브 페이지들
```

## 접속 방법

개발 서버 실행 후 브라우저에서 다음 주소로 접속:

- **프로토타입 네비게이션**: http://localhost:3000/html/prototype-index.html
- 메인 페이지: http://localhost:3000/html/main/MN01.html
- 대시보드: http://localhost:3000/html/dashboard.html

## 네비게이션 기능

### 🔗 페이지 간 이동
- **헤더 네비게이션**: 모든 페이지의 상단에서 주요 섹션으로 이동
- **로고 클릭**: 메인 페이지로 돌아가기
- **푸터 링크**: 모든 페이지의 하단에서 세부 페이지로 이동
- **More View 버튼**: 관련 페이지로 직접 이동

### 📋 주요 네비게이션 경로
- **NEXUSGAS** → 기업개요 (CO01.html)
- **사업분야** → 사업분야 개요 (BU00.html)
- **솔루션분야** → NEXUS™ (SU01.html)
- **홍보** → 뉴스 (MK21.html)
- **지속가능경영** → ESG경영 (EM01.html)
- **채용** → 인재상 (FAQ01.html)

## 주요 페이지

- **메인 페이지**: `/html/main/MN01.html`
- **NEXUSGAS (기업소개)**: `/html/sub/CO01.html` ~ `/html/sub/CO08.html`
- **사업분야**: `/html/sub/BU00.html` ~ `/html/sub/BU33.html`
- **솔루션분야**: `/html/sub/SU01.html` ~ `/html/sub/SU05.html`
- **홍보**: `/html/sub/MK01.html` ~ `/html/sub/MK23.html`
- **지속가능경영**: `/html/sub/EM01.html` ~ `/html/sub/EM04.html`
- **채용**: `/html/sub/FAQ01.html`, `/html/sub/FAQ02.html`

## 기능

- 실시간 파일 변경 감지 및 자동 새로고침
- 로컬 개발 서버 (포트 3000)
- 정적 파일 서빙
- **완전한 페이지 간 네비게이션**: 모든 페이지에서 다른 페이지로 이동 가능
- **통합된 헤더/푸터**: 일관된 네비게이션 경험
- **프로토타입 네비게이션**: 모든 페이지를 한 번에 확인할 수 있는 인덱스 페이지
