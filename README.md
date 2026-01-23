# Next.js 기반 반려동물 관련 시설 검색 및 통계 대시보드

이 프로젝트는 Next.js를 사용하여 반려동물 관련 시설(병원, 약국 등)의 정보를 검색하고, 관련 데이터를 시각화하는 풀스택 웹 애플리케이션입니다. 사용자는 지도 또는 목록을 통해 원하는 조건의 시설을 쉽게 찾을 수 있으며, 관리자는 대시보드를 통해 다양한 통계 데이터를 확인할 수 있습니다.

## 1. 프로젝트 개요

- **목표**: 공공 데이터를 활용하여 사용자에게 유용한 반려동물 관련 시설 정보를 제공하고, 데이터 기반의 인사이트를 얻을 수 있는 대시보드 기능을 구현합니다.
- **주요 기능**:
    - 지역 및 업종에 따른 시설 검색 (지도/목록)
    - 사용자 인증 및 마이페이지
    - 커뮤니티 게시판
    - 데이터 시각화 대시보드
    - 관리자 페이지
- **개발 기간**: 2025.12.17 ~ 2026.01.21
- **팀 구성**: 1인 개발 (Frontend & Backend 전담)

## 2. 주요 기능 상세

### 2.1. 공통 기능 (모든 사용자)
- **회원 관리**:
    - 일반 이메일 회원가입 및 로그인
    - Google 소셜 로그인 (`NextAuth.js` 활용)
    - 비밀번호 찾기 및 재설정
- **시설 검색**:
    - **지도 기반 검색**: `Kakao Maps API`를 연동하여 지도상에서 시설의 위치를 직관적으로 확인하고 정보를 조회할 수 있습니다.
    - **통합 검색**: 지역(시/도, 시/군/구)과 업종(동물병원, 동물약국 등) 필터를 조합하여 원하는 조건의 시설 목록을 검색합니다.
    - **상세 정보**: 각 시설의 주소, 운영 시간, 연락처 등 상세 정보를 팝업 또는 상세 페이지 형태로 제공합니다.
- **커뮤니티**:
    - 자유게시판 기능
    - 게시글 작성, 조회, 수정, 삭제 (CRUD)
    - 게시글에 대한 댓글 작성 및 조회
- **대시보드 및 데이터 시각화**:
    - **빠른 검색 및 현황**: 주요 지표(KPI)와 시설 현황을 한눈에 파악할 수 있는 위젯을 제공합니다.
    - **시간대별/요일별 운영 현황**: `recharts`를 활용하여 시설들의 시간대별, 요일별 운영 통계를 막대그래프로 시각화합니다.
    - **24시간 운영 시설 분석**: 24시간 운영되는 시설의 비율과 분포를 차트로 보여줍니다.
    - **카테고리별 시간대 분석**: 특정 업종 카테고리의 시간대별 운영 통계를 비교 분석합니다.

### 2.2. 관리자 기능
- **회원 관리**: 가입된 전체 회원 목록을 조회하고 관리합니다.
- **게시판 관리**: 모든 게시글을 조회하고 부적절한 컨텐츠를 관리합니다.

## 3. 기술 스택

| 구분 | 기술 | 설명 |
| --- | --- | --- |
| **Frontend** | `Next.js 16` (`React`) | App Router 기반의 서버 컴포넌트와 클라이언트 컴포넌트를 활용하여 UI/UX 구현 |
| | `TypeScript` | 정적 타이핑을 통해 코드의 안정성과 가독성 확보 |
| | `Tailwind CSS` | Utility-First CSS 프레임워크로 신속하고 일관된 스타일링 적용 |
| | `recharts` | 대시보드의 데이터 시각화를 위한 동적 차트 라이브러리 |
| | `Kakao Maps API` | 지도 기반의 시설 검색 기능 구현 |
| **Backend** | `Next.js 16 (API Routes)` | App Router의 Route Handlers를 사용하여 RESTful API 서버 구축 |
| | `TypeScript` | 백엔드 로직의 타입 안정성 강화 |
| **Database** | `MySQL` | `EER.mwb` 파일로 설계된 관계형 데이터베이스. 시설 정보, 사용자, 게시글 등 저장 |
| **Authentication** | `NextAuth.js` | 이메일 및 소셜 로그인(Google) 기능 구현 |
| **Data Processing**| `Python`, `Jupyter Notebook`| `KC_PET_ACP_CTLSTT_LC_DATA_2023.csv` 등 원시 데이터(CSV)를 파싱하여 DB에 적재 |

## 4. 시스템 아키텍처

1.  **데이터 준비 단계 (Preprocessing)**:
    - `parsing/*.ipynb` 스크립트를 사용하여 공공 데이터(CSV)를 정제하고 분석합니다.
    - 정제된 데이터를 `MySQL` 데이터베이스의 각 테이블(시설 정보, 운영 시간, 지역 코드 등)에 적재합니다.

2.  **애플리케이션 실행 단계**:
    - **Client (Browser)**: 사용자가 웹 브라우저를 통해 서비스에 접속합니다.
    - **Next.js Frontend**: React 서버 컴포넌트가 초기 렌더링을 담당하고, 필요한 인터랙션은 클라이언트 컴포넌트가 처리합니다.
    - **Next.js Backend (API Routes)**: 프론트엔드의 요청에 따라 `src/app/api` 경로의 Route Handler들이 비즈니스 로직을 수행합니다.
    - **Database (MySQL)**: 백엔드 서버는 `lib/db.ts`의 DB 커넥션을 통해 데이터베이스에 질의하고 결과를 반환합니다.

```
+----------------+      +-------------------------+      +--------------------------+      +-----------------+
|   Client       | <--> |   Next.js Frontend      | <--> |   Next.js Backend        | <--> |   Database      |
|  (Browser)     |      |  (React, KakaoMap)      |      |   (API Routes)           |      |    (MySQL)      |
+----------------+      +-------------------------+      +--------------------------+      +-----------------+
                                                                    ^
                                                                    | (Initial Data Load)
                                                        +--------------------------+
                                                        |   Data Parsing           |
                                                        | (Python, Jupyter)        |
                                                        +--------------------------+
```

## 5. 데이터베이스 설계

데이터베이스는 `EER.mwb` (MySQL Workbench) 파일을 통해 설계되었으며, 주요 엔티티는 다음과 같습니다.

- **members**: 사용자 정보 (일반/소셜)
- **google_members**: 구글 연동 사용자 정보
- **place**: 시설 기본 정보
- **place_operation**: 시설 운영 시간 정보
- **place_size**: 시설 규모 정보
- **place_charge**: 시설 요금 정보
- **board**: 게시글 정보
- **comment**: 댓글 정보
- **ctprvn**, **signgu**, **legaldong**: 지역 코드 정보 (시/도, 시/군/구, 법정동)

엔티티 간의 관계는 `EER.mwb` 파일에 상세히 정의되어 있습니다.

## 6. API 엔드포인트 명세

API는 `src/app/api` 디렉토리 내에서 RESTful 규칙에 따라 구조화되었습니다.

- `POST /api/members`: 회원가입
- `POST /api/members/check`: 아이디 중복 확인
- `GET /api/auth/[...nextauth]`: 로그인 및 세션 관리
- `GET /api/board`: 게시글 목록 조회
- `POST /api/board`: 게시글 생성
- `GET /api/board/[id]`: 특정 게시글 조회
- `PATCH /api/board/[id]`: 특정 게시글 수정
- `POST /api/board/[id]/comment`: 특정 게시글에 댓글 작성
- `GET /api/place/regionsearch`: 지역 기반 시설 검색
- `GET /api/place/categorysearch`: 카테고리 기반 시설 검색
- `GET /api/place/detail`: 시설 상세 정보 조회
- `GET /api/timeseries/hourly`: 시간대별 통계 데이터 조회
- `GET /api/timeseries/weekday`: 요일별 통계 데이터 조회
... (기타 API는 `src/app/api` 디렉토리 구조 참조)

## 7. 설치 및 실행 방법

1.  **저장소 복제**
    ```bash
    git clone https://github.com/your-repository/mini_project-Next.js-.git
    cd mini_project-Next.js-
    ```

2.  **패키지 설치**
    ```bash
    npm install
    ```

3.  **.env 파일 설정**
    - 루트 디렉토리에 `.env` 파일을 생성하고 아래 내용을 환경에 맞게 수정합니다.
    ```env
    # Database
    DB_HOST=localhost
    DB_USER=your_db_user
    DB_PASS=your_db_password
    DB_NAME=your_db_name

    # NextAuth.js
    NEXTAUTH_URL=http://localhost:3000
    NEXTAUTH_SECRET=your_nextauth_secret_key # openssl rand -base64 32 명령어로 생성
    GOOGLE_CLIENT_ID=your_google_client_id
    GOOGLE_CLIENT_SECRET=your_google_client_secret

    # Kakao Maps API
    NEXT_PUBLIC_KAKAO_MAP_API_KEY=your_kakao_maps_javascript_api_key
    ```

4.  **데이터베이스 설정**
    - `MySQL`에 `.env` 파일에 설정한 데이터베이스를 생성합니다.
    - `DB.sql` 파일을 사용하여 데이터베이스 스키마와 초기 데이터를 임포트합니다.
    ```bash
    mysql -u your_db_user -p your_db_name < DB.sql
    ```
    - 또는 `parsing` 디렉토리의 Jupyter Notebook을 실행하여 데이터를 직접 적재할 수도 있습니다.

5.  **개발 서버 실행**
    ```bash
    npm run dev
    ```

6.  **애플리케이션 접속**
    - 웹 브라우저에서 `http://localhost:3000` 주소로 접속합니다.
