# 설계 문서

## 개요

반려동물 시설 지도 애플리케이션은 Next.js 14 App Router를 사용하여 프론트엔드와 백엔드를 모두 처리하는 풀스택 웹 애플리케이션입니다. 공공데이터 CSV 파일을 파싱하여 시설 정보를 추출하고, 카카오맵 또는 네이버 지도 API를 사용하여 지도 위에 시설을 표시합니다. 사용자는 지역별, 카테고리별로 필터링하여 원하는 시설을 검색할 수 있습니다.

## 아키텍처

### 전체 구조

```
┌─────────────────────────────────────────────────────────┐
│                    클라이언트 (브라우저)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ 지도 컴포넌트  │  │ 필터 컴포넌트  │  │ 검색 컴포넌트  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js 서버 (App Router)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  API Routes  │  │  CSV Parser  │  │ Data Service │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
                    ┌──────────────┐
                    │  JSON 파일    │
                    │  (파싱된 데이터)│
                    └──────────────┘
```

### 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **지도 API**: Kakao Maps JavaScript API
- **상태 관리**: React Hooks (useState, useEffect)
- **데이터베이스**: MySQL 8.0+
- **ORM**: Prisma (TypeScript ORM)
- **데이터베이스 연결**: MySQL2 또는 Prisma Client

## 컴포넌트 및 인터페이스

### 1. 데이터 모델

#### Facility 인터페이스

```typescript
interface Facility {
  id: string;                      // 고유 ID (생성)
  facilityName: string;            // FCLTY_NM: 시설명
  categoryOne: string;             // CTGRY_ONE_NM: 대분류
  categoryTwo: string;             // CTGRY_TWO_NM: 중분류
  categoryThree: string;           // CTGRY_THREE_NM: 소분류
  province: string;                // CTPRVN_NM: 시/도
  district: string;                // SIGNGU_NM: 시/군/구
  legalDong: string;               // LEGALDONG_NM: 법정동
  roadName: string;                // ROAD_NM: 도로명
  buildingNumber: string;          // BULD_NO: 건물번호
  latitude: number;                // LC_LA: 위도
  longitude: number;               // LC_LO: 경도
  zipCode: string;                 // ZIP_NO: 우편번호
  roadAddress: string;             // RDNMADR_NM: 도로명주소
  lotAddress: string;              // LNM_ADDR: 지번주소
  telephone: string;               // TEL_NO: 전화번호
  homepage: string;                // HMPG_URL: 홈페이지
  operationTime: string;           // OPER_TIME: 운영시간
  parkingAvailable: boolean;       // PARKNG_POSBL_AT: 주차가능여부
  utilizationPrice: string;        // UTILIIZA_PRC_CN: 이용가격
  petPossible: boolean;            // PET_POSBL_AT: 반려동물가능여부
  petInfo: string;                 // PET_INFO_CN: 반려동물정보
  petSizeLimit: string;            // ENTRN_POSBL_PET_SIZE_VALUE: 입장가능반려동물크기
  petLimitInfo: string;            // PET_LMTT_MTR_CN: 반려동물제한사항
  indoorPetAllowed: boolean;       // IN_PLACE_ACP_POSBL_AT: 실내동반가능여부
  outdoorPetAllowed: boolean;      // OUT_PLACE_ACP_POSBL_AT: 실외동반가능여부
  facilityInfo: string;            // FCLTY_INFO_DC: 시설정보
  petAdditionalCharge: string;     // PET_ACP_ADIT_CHRGE_VALUE: 반려동물추가요금
  lastUpdateDate: string;          // LAST_UPDT_DE: 최종수정일
}
```

#### FilterOptions 인터페이스

```typescript
interface FilterOptions {
  provinces: string[];             // 시/도 목록
  districts: string[];             // 시/군/구 목록
  categories: string[];            // 카테고리 목록
}

interface ActiveFilters {
  province: string | null;
  district: string | null;
  categories: string[];
  searchQuery: string;
}
```

### 2. 백엔드 컴포넌트

#### CSV Parser

CSV 파일을 읽어 Facility 객체 배열로 변환합니다.

```typescript
class CSVParser {
  /**
   * CSV 파일을 파싱하여 Facility 배열로 변환
   * @param filePath - CSV 파일 경로
   * @returns Facility 객체 배열
   */
  static async parseCSV(filePath: string): Promise<Facility[]>
  
  /**
   * CSV 행을 Facility 객체로 변환
   * @param row - CSV 행 데이터
   * @returns Facility 객체 또는 null (유효하지 않은 경우)
   */
  private static rowToFacility(row: any): Facility | null
  
  /**
   * 필수 필드 유효성 검증
   * @param facility - 검증할 Facility 객체
   * @returns 유효 여부
   */
  private static validateFacility(facility: Facility): boolean
}
```

#### Data Service

데이터베이스 쿼리를 관리하고 필터링 기능을 제공합니다.

```typescript
class DataService {
  private prisma: PrismaClient;
  
  constructor() {
    this.prisma = new PrismaClient();
  }
  
  /**
   * 모든 시설 데이터 반환
   * @param limit - 반환할 최대 개수 (선택 사항)
   * @param offset - 건너뛸 개수 (페이지네이션)
   */
  async getAllFacilities(limit?: number, offset?: number): Promise<Facility[]>
  
  /**
   * 필터 옵션 반환 (시/도, 시/군/구, 카테고리 목록)
   */
  async getFilterOptions(): Promise<FilterOptions>
  
  /**
   * 필터 조건에 따라 시설 필터링
   * @param filters - 적용할 필터 조건
   */
  async filterFacilities(filters: ActiveFilters): Promise<Facility[]>
  
  /**
   * 검색어로 시설 검색 (FULLTEXT 검색 사용)
   * @param query - 검색어
   */
  async searchFacilities(query: string): Promise<Facility[]>
  
  /**
   * ID로 시설 조회
   * @param id - 시설 ID
   */
  async getFacilityById(id: number): Promise<Facility | null>
  
  /**
   * 위치 기반 시설 검색 (특정 반경 내)
   * @param latitude - 중심 위도
   * @param longitude - 중심 경도
   * @param radiusKm - 반경 (킬로미터)
   */
  async getFacilitiesNearby(
    latitude: number, 
    longitude: number, 
    radiusKm: number
  ): Promise<Facility[]>
}
```

#### API Routes

Next.js API Routes를 사용하여 RESTful API를 제공합니다.

**GET /api/facilities**
- 쿼리 파라미터:
  - `province`: 시/도 필터
  - `district`: 시/군/구 필터
  - `categories`: 카테고리 필터 (쉼표로 구분)
  - `search`: 검색어
  - `limit`: 반환할 최대 개수 (기본값: 1000)
  - `offset`: 건너뛸 개수 (페이지네이션, 기본값: 0)
  - `lat`: 위도 (위치 기반 검색)
  - `lng`: 경도 (위치 기반 검색)
  - `radius`: 반경 (킬로미터, 기본값: 10)
- 응답: `{ data: Facility[], count: number, total: number }`

**GET /api/facilities/[id]**
- 경로 파라미터:
  - `id`: 시설 ID
- 응답: `{ data: Facility }`

**GET /api/filters**
- 응답: `FilterOptions` (사용 가능한 필터 옵션)

**GET /api/categories**
- 응답: `{ categories: string[] }` (모든 카테고리 목록)

**GET /api/regions**
- 쿼리 파라미터:
  - `province`: 시/도 (선택 사항, 제공 시 해당 시/도의 시/군/구 목록 반환)
- 응답: `{ provinces: string[] }` 또는 `{ districts: string[] }`

### 3. 프론트엔드 컴포넌트

#### MapComponent

지도를 렌더링하고 마커를 표시합니다.

```typescript
interface MapComponentProps {
  facilities: Facility[];
  onMarkerClick: (facility: Facility) => void;
  center?: { lat: number; lng: number };
}

function MapComponent({ facilities, onMarkerClick, center }: MapComponentProps)
```

**주요 기능:**
- 카카오맵 초기화 및 렌더링
- 시설 마커 표시 (마커 클러스터링 적용)
- 마커 클릭 시 상세 정보 팝업
- 지도 중심 및 줌 레벨 조정

#### FilterPanel

필터 UI를 제공합니다.

```typescript
interface FilterPanelProps {
  filterOptions: FilterOptions;
  activeFilters: ActiveFilters;
  onFilterChange: (filters: ActiveFilters) => void;
}

function FilterPanel({ filterOptions, activeFilters, onFilterChange }: FilterPanelProps)
```

**주요 기능:**
- 시/도 선택 드롭다운
- 시/군/구 선택 드롭다운 (시/도 선택 시 활성화)
- 카테고리 다중 선택 체크박스
- 필터 초기화 버튼

#### SearchBar

검색 기능을 제공합니다.

```typescript
interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

function SearchBar({ onSearch, placeholder }: SearchBarProps)
```

**주요 기능:**
- 검색어 입력 필드
- 실시간 검색 (디바운싱 적용)
- 검색 결과 자동완성 (선택 사항)

#### FacilityDetailModal

시설 상세 정보를 표시하는 모달입니다.

```typescript
interface FacilityDetailModalProps {
  facility: Facility | null;
  isOpen: boolean;
  onClose: () => void;
}

function FacilityDetailModal({ facility, isOpen, onClose }: FacilityDetailModalProps)
```

**주요 기능:**
- 시설 전체 정보 표시
- 전화 걸기, 홈페이지 링크
- 길찾기 버튼 (카카오맵 앱 연동)

#### MainPage

메인 페이지 컴포넌트로 모든 하위 컴포넌트를 통합합니다.

```typescript
function MainPage()
```

**주요 기능:**
- 시설 데이터 로드
- 필터 상태 관리
- 컴포넌트 간 데이터 전달
- 로딩 및 에러 상태 처리

## 데이터 모델

### CSV 파일 구조

CSV 파일은 다음과 같은 컬럼을 포함합니다:

```
FCLTY_NM, CTGRY_ONE_NM, CTGRY_TWO_NM, CTGRY_THREE_NM, CTPRVN_NM, 
SIGNGU_NM, LEGALDONG_NM, LI_NM, LNBR_NO, ROAD_NM, BULD_NO, 
LC_LA, LC_LO, ZIP_NO, RDNMADR_NM, LNM_ADDR, TEL_NO, HMPG_URL, 
RSTDE_GUID_CN, OPER_TIME, PARKNG_POSBL_AT, UTILIIZA_PRC_CN, 
PET_POSBL_AT, PET_INFO_CN, ENTRN_POSBL_PET_SIZE_VALUE, 
PET_LMTT_MTR_CN, IN_PLACE_ACP_POSBL_AT, OUT_PLACE_ACP_POSBL_AT, 
FCLTY_INFO_DC, PET_ACP_ADIT_CHRGE_VALUE, LAST_UPDT_DE
```

### MySQL 데이터베이스 스키마

데이터베이스는 정규화를 통해 여러 테이블로 구성되어 검색 성능을 최적화합니다.

#### provinces 테이블 (시/도)

```sql
CREATE TABLE provinces (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE COMMENT '시/도명',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시/도 정보';
```

#### districts 테이블 (시/군/구)

```sql
CREATE TABLE districts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  province_id INT NOT NULL COMMENT '시/도 ID',
  name VARCHAR(100) NOT NULL COMMENT '시/군/구명',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE CASCADE,
  UNIQUE KEY unique_district (province_id, name),
  INDEX idx_province_id (province_id),
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='시/군/구 정보';
```

#### categories 테이블 (카테고리)

```sql
CREATE TABLE categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category_one VARCHAR(100) NOT NULL COMMENT '대분류',
  category_two VARCHAR(100) NOT NULL COMMENT '중분류',
  category_three VARCHAR(100) COMMENT '소분류',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY unique_category (category_one, category_two, category_three),
  INDEX idx_category_one (category_one),
  INDEX idx_category_two (category_two)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='카테고리 정보';
```

#### facilities 테이블 (시설 정보)

```sql
CREATE TABLE facilities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  facility_name VARCHAR(255) NOT NULL COMMENT '시설명',
  category_id INT NOT NULL COMMENT '카테고리 ID',
  province_id INT NOT NULL COMMENT '시/도 ID',
  district_id INT NOT NULL COMMENT '시/군/구 ID',
  legal_dong VARCHAR(100) COMMENT '법정동',
  li_name VARCHAR(100) COMMENT '리명',
  lot_number VARCHAR(50) COMMENT '지번',
  road_name VARCHAR(255) COMMENT '도로명',
  building_number VARCHAR(50) COMMENT '건물번호',
  latitude DECIMAL(10, 7) NOT NULL COMMENT '위도',
  longitude DECIMAL(10, 7) NOT NULL COMMENT '경도',
  zip_code VARCHAR(10) COMMENT '우편번호',
  road_address VARCHAR(500) COMMENT '도로명주소',
  lot_address VARCHAR(500) COMMENT '지번주소',
  telephone VARCHAR(50) COMMENT '전화번호',
  homepage VARCHAR(500) COMMENT '홈페이지',
  rest_guide TEXT COMMENT '휴무일안내',
  operation_time VARCHAR(500) COMMENT '운영시간',
  parking_available CHAR(1) DEFAULT 'N' COMMENT '주차가능여부',
  utilization_price TEXT COMMENT '이용가격',
  pet_possible CHAR(1) DEFAULT 'Y' COMMENT '반려동물가능여부',
  pet_info TEXT COMMENT '반려동물정보',
  pet_size_limit VARCHAR(100) COMMENT '입장가능반려동물크기',
  pet_limit_info TEXT COMMENT '반려동물제한사항',
  indoor_pet_allowed CHAR(1) DEFAULT 'N' COMMENT '실내동반가능여부',
  outdoor_pet_allowed CHAR(1) DEFAULT 'N' COMMENT '실외동반가능여부',
  facility_info TEXT COMMENT '시설정보',
  pet_additional_charge VARCHAR(100) COMMENT '반려동물추가요금',
  last_update_date DATE COMMENT '최종수정일',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
  FOREIGN KEY (province_id) REFERENCES provinces(id) ON DELETE RESTRICT,
  FOREIGN KEY (district_id) REFERENCES districts(id) ON DELETE RESTRICT,
  INDEX idx_category_id (category_id),
  INDEX idx_province_id (province_id),
  INDEX idx_district_id (district_id),
  INDEX idx_location (latitude, longitude),
  INDEX idx_facility_name (facility_name),
  INDEX idx_composite_filter (province_id, district_id, category_id),
  FULLTEXT INDEX idx_fulltext_search (facility_name, road_address, lot_address)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='반려동물 시설 정보';
```

### CSV 데이터 임포트 SQL

CSV 데이터를 임포트하기 위해서는 먼저 참조 테이블(provinces, districts, categories)을 채운 후 facilities 테이블에 데이터를 삽입해야 합니다.

#### 1. 참조 데이터 추출 및 삽입

```sql
-- 1단계: 임시 테이블 생성 및 CSV 데이터 로드
CREATE TEMPORARY TABLE temp_facilities (
  facility_name VARCHAR(255),
  category_one VARCHAR(100),
  category_two VARCHAR(100),
  category_three VARCHAR(100),
  province VARCHAR(50),
  district VARCHAR(100),
  legal_dong VARCHAR(100),
  li_name VARCHAR(100),
  lot_number VARCHAR(50),
  road_name VARCHAR(255),
  building_number VARCHAR(50),
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  zip_code VARCHAR(10),
  road_address VARCHAR(500),
  lot_address VARCHAR(500),
  telephone VARCHAR(50),
  homepage VARCHAR(500),
  rest_guide TEXT,
  operation_time VARCHAR(500),
  parking_available CHAR(1),
  utilization_price TEXT,
  pet_possible CHAR(1),
  pet_info TEXT,
  pet_size_limit VARCHAR(100),
  pet_limit_info TEXT,
  indoor_pet_allowed CHAR(1),
  outdoor_pet_allowed CHAR(1),
  facility_info TEXT,
  pet_additional_charge VARCHAR(100),
  last_update_date VARCHAR(20)
);

-- CSV 파일 로드
LOAD DATA LOCAL INFILE '/path/to/facilities.csv'
INTO TABLE temp_facilities
CHARACTER SET utf8mb4
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS;

-- 2단계: provinces 테이블 채우기
INSERT IGNORE INTO provinces (name)
SELECT DISTINCT province
FROM temp_facilities
WHERE province IS NOT NULL AND province != '';

-- 3단계: districts 테이블 채우기
INSERT IGNORE INTO districts (province_id, name)
SELECT DISTINCT p.id, t.district
FROM temp_facilities t
JOIN provinces p ON t.province = p.name
WHERE t.district IS NOT NULL AND t.district != '';

-- 4단계: categories 테이블 채우기
INSERT IGNORE INTO categories (category_one, category_two, category_three)
SELECT DISTINCT category_one, category_two, category_three
FROM temp_facilities
WHERE category_one IS NOT NULL AND category_one != ''
  AND category_two IS NOT NULL AND category_two != '';

-- 5단계: facilities 테이블 채우기
INSERT INTO facilities (
  facility_name, category_id, province_id, district_id,
  legal_dong, li_name, lot_number, road_name, building_number,
  latitude, longitude, zip_code, road_address, lot_address,
  telephone, homepage, rest_guide, operation_time,
  parking_available, utilization_price, pet_possible, pet_info,
  pet_size_limit, pet_limit_info, indoor_pet_allowed, outdoor_pet_allowed,
  facility_info, pet_additional_charge, last_update_date
)
SELECT 
  t.facility_name,
  c.id AS category_id,
  p.id AS province_id,
  d.id AS district_id,
  t.legal_dong,
  t.li_name,
  t.lot_number,
  t.road_name,
  t.building_number,
  t.latitude,
  t.longitude,
  t.zip_code,
  t.road_address,
  t.lot_address,
  t.telephone,
  t.homepage,
  t.rest_guide,
  t.operation_time,
  t.parking_available,
  t.utilization_price,
  t.pet_possible,
  t.pet_info,
  t.pet_size_limit,
  t.pet_limit_info,
  t.indoor_pet_allowed,
  t.outdoor_pet_allowed,
  t.facility_info,
  t.pet_additional_charge,
  STR_TO_DATE(t.last_update_date, '%Y%m%d')
FROM temp_facilities t
JOIN provinces p ON t.province = p.name
JOIN districts d ON t.district = d.name AND d.province_id = p.id
JOIN categories c ON t.category_one = c.category_one 
  AND t.category_two = c.category_two
  AND (t.category_three = c.category_three OR (t.category_three IS NULL AND c.category_three IS NULL))
WHERE t.facility_name IS NOT NULL
  AND t.latitude IS NOT NULL
  AND t.longitude IS NOT NULL;

-- 6단계: 임시 테이블 삭제
DROP TEMPORARY TABLE temp_facilities;
```

#### 3. 대체 방법: Node.js 스크립트를 통한 임포트

LOAD DATA INFILE이 작동하지 않는 경우, Node.js 스크립트를 사용하여 CSV를 파싱하고 데이터베이스에 삽입할 수 있습니다.

```typescript
// scripts/import-csv.ts
import fs from 'fs';
import csv from 'csv-parser';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CSVRow {
  FCLTY_NM: string;
  CTGRY_ONE_NM: string;
  CTGRY_TWO_NM: string;
  CTGRY_THREE_NM: string;
  CTPRVN_NM: string;
  SIGNGU_NM: string;
  LEGALDONG_NM: string;
  LI_NM: string;
  LNBR_NO: string;
  ROAD_NM: string;
  BULD_NO: string;
  LC_LA: string;
  LC_LO: string;
  ZIP_NO: string;
  RDNMADR_NM: string;
  LNM_ADDR: string;
  TEL_NO: string;
  HMPG_URL: string;
  RSTDE_GUID_CN: string;
  OPER_TIME: string;
  PARKNG_POSBL_AT: string;
  UTILIIZA_PRC_CN: string;
  PET_POSBL_AT: string;
  PET_INFO_CN: string;
  ENTRN_POSBL_PET_SIZE_VALUE: string;
  PET_LMTT_MTR_CN: string;
  IN_PLACE_ACP_POSBL_AT: string;
  OUT_PLACE_ACP_POSBL_AT: string;
  FCLTY_INFO_DC: string;
  PET_ACP_ADIT_CHRGE_VALUE: string;
  LAST_UPDT_DE: string;
}

async function importCSV(filePath: string) {
  const rows: CSVRow[] = [];
  
  // CSV 파일 읽기
  await new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row: CSVRow) => rows.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  console.log(`총 ${rows.length}개의 행을 읽었습니다.`);

  // 1단계: 시/도 데이터 삽입
  const provinces = [...new Set(rows.map(r => r.CTPRVN_NM).filter(Boolean))];
  console.log(`${provinces.length}개의 시/도를 삽입합니다...`);
  
  for (const provinceName of provinces) {
    await prisma.province.upsert({
      where: { name: provinceName },
      update: {},
      create: { name: provinceName },
    });
  }

  // 2단계: 시/군/구 데이터 삽입
  const districtMap = new Map<string, string>();
  rows.forEach(r => {
    if (r.CTPRVN_NM && r.SIGNGU_NM) {
      districtMap.set(`${r.CTPRVN_NM}|${r.SIGNGU_NM}`, r.CTPRVN_NM);
    }
  });

  console.log(`${districtMap.size}개의 시/군/구를 삽입합니다...`);
  
  for (const [key, provinceName] of districtMap.entries()) {
    const districtName = key.split('|')[1];
    const province = await prisma.province.findUnique({
      where: { name: provinceName },
    });
    
    if (province) {
      await prisma.district.upsert({
        where: {
          provinceId_name: {
            provinceId: province.id,
            name: districtName,
          },
        },
        update: {},
        create: {
          provinceId: province.id,
          name: districtName,
        },
      });
    }
  }

  // 3단계: 카테고리 데이터 삽입
  const categoryMap = new Map<string, { one: string; two: string; three: string | null }>();
  rows.forEach(r => {
    if (r.CTGRY_ONE_NM && r.CTGRY_TWO_NM) {
      const key = `${r.CTGRY_ONE_NM}|${r.CTGRY_TWO_NM}|${r.CTGRY_THREE_NM || ''}`;
      categoryMap.set(key, {
        one: r.CTGRY_ONE_NM,
        two: r.CTGRY_TWO_NM,
        three: r.CTGRY_THREE_NM || null,
      });
    }
  });

  console.log(`${categoryMap.size}개의 카테고리를 삽입합니다...`);
  
  for (const [, cat] of categoryMap.entries()) {
    await prisma.category.upsert({
      where: {
        categoryOne_categoryTwo_categoryThree: {
          categoryOne: cat.one,
          categoryTwo: cat.two,
          categoryThree: cat.three,
        },
      },
      update: {},
      create: {
        categoryOne: cat.one,
        categoryTwo: cat.two,
        categoryThree: cat.three,
      },
    });
  }

  // 4단계: 시설 데이터 삽입
  console.log(`${rows.length}개의 시설을 삽입합니다...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    
    try {
      // 필수 필드 검증
      if (!row.FCLTY_NM || !row.LC_LA || !row.LC_LO || !row.CTPRVN_NM || !row.SIGNGU_NM) {
        console.warn(`행 ${i + 1}: 필수 필드 누락`);
        errorCount++;
        continue;
      }

      // 외래 키 조회
      const province = await prisma.province.findUnique({
        where: { name: row.CTPRVN_NM },
      });
      
      const district = await prisma.district.findFirst({
        where: {
          name: row.SIGNGU_NM,
          provinceId: province?.id,
        },
      });
      
      const category = await prisma.category.findFirst({
        where: {
          categoryOne: row.CTGRY_ONE_NM,
          categoryTwo: row.CTGRY_TWO_NM,
          categoryThree: row.CTGRY_THREE_NM || null,
        },
      });

      if (!province || !district || !category) {
        console.warn(`행 ${i + 1}: 참조 데이터를 찾을 수 없음`);
        errorCount++;
        continue;
      }

      // 시설 삽입
      await prisma.facility.create({
        data: {
          facilityName: row.FCLTY_NM,
          categoryId: category.id,
          provinceId: province.id,
          districtId: district.id,
          legalDong: row.LEGALDONG_NM || null,
          liName: row.LI_NM || null,
          lotNumber: row.LNBR_NO || null,
          roadName: row.ROAD_NM || null,
          buildingNumber: row.BULD_NO || null,
          latitude: parseFloat(row.LC_LA),
          longitude: parseFloat(row.LC_LO),
          zipCode: row.ZIP_NO || null,
          roadAddress: row.RDNMADR_NM || null,
          lotAddress: row.LNM_ADDR || null,
          telephone: row.TEL_NO || null,
          homepage: row.HMPG_URL || null,
          restGuide: row.RSTDE_GUID_CN || null,
          operationTime: row.OPER_TIME || null,
          parkingAvailable: row.PARKNG_POSBL_AT === 'Y',
          utilizationPrice: row.UTILIIZA_PRC_CN || null,
          petPossible: row.PET_POSBL_AT === 'Y',
          petInfo: row.PET_INFO_CN || null,
          petSizeLimit: row.ENTRN_POSBL_PET_SIZE_VALUE || null,
          petLimitInfo: row.PET_LMTT_MTR_CN || null,
          indoorPetAllowed: row.IN_PLACE_ACP_POSBL_AT === 'Y',
          outdoorPetAllowed: row.OUT_PLACE_ACP_POSBL_AT === 'Y',
          facilityInfo: row.FCLTY_INFO_DC || null,
          petAdditionalCharge: row.PET_ACP_ADIT_CHRGE_VALUE || null,
          lastUpdateDate: row.LAST_UPDT_DE ? new Date(row.LAST_UPDT_DE) : null,
        },
      });

      successCount++;
      
      if ((i + 1) % 100 === 0) {
        console.log(`진행률: ${i + 1} / ${rows.length}`);
      }
    } catch (error) {
      console.error(`행 ${i + 1} 삽입 실패:`, error);
      errorCount++;
    }
  }

  console.log(`\n임포트 완료!`);
  console.log(`성공: ${successCount}개`);
  console.log(`실패: ${errorCount}개`);
  
  await prisma.$disconnect();
}

// 실행
const csvFilePath = process.argv[2] || './data/facilities.csv';
importCSV(csvFilePath).catch(console.error);
```

**실행 방법:**
```bash
npx ts-node scripts/import-csv.ts ./data/facilities.csv
```

### Prisma 스키마

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Province {
  id        Int        @id @default(autoincrement())
  name      String     @unique @db.VarChar(50)
  createdAt DateTime   @default(now()) @map("created_at")
  
  districts District[]
  facilities Facility[]

  @@index([name], map: "idx_name")
  @@map("provinces")
}

model District {
  id         Int      @id @default(autoincrement())
  provinceId Int      @map("province_id")
  name       String   @db.VarChar(100)
  createdAt  DateTime @default(now()) @map("created_at")
  
  province   Province   @relation(fields: [provinceId], references: [id], onDelete: Cascade)
  facilities Facility[]

  @@unique([provinceId, name], map: "unique_district")
  @@index([provinceId], map: "idx_province_id")
  @@index([name], map: "idx_name")
  @@map("districts")
}

model Category {
  id            Int       @id @default(autoincrement())
  categoryOne   String    @map("category_one") @db.VarChar(100)
  categoryTwo   String    @map("category_two") @db.VarChar(100)
  categoryThree String?   @map("category_three") @db.VarChar(100)
  createdAt     DateTime  @default(now()) @map("created_at")
  
  facilities    Facility[]

  @@unique([categoryOne, categoryTwo, categoryThree], map: "unique_category")
  @@index([categoryOne], map: "idx_category_one")
  @@index([categoryTwo], map: "idx_category_two")
  @@map("categories")
}

model Facility {
  id                   Int       @id @default(autoincrement())
  facilityName         String    @map("facility_name") @db.VarChar(255)
  categoryId           Int       @map("category_id")
  provinceId           Int       @map("province_id")
  districtId           Int       @map("district_id")
  legalDong            String?   @map("legal_dong") @db.VarChar(100)
  liName               String?   @map("li_name") @db.VarChar(100)
  lotNumber            String?   @map("lot_number") @db.VarChar(50)
  roadName             String?   @map("road_name") @db.VarChar(255)
  buildingNumber       String?   @map("building_number") @db.VarChar(50)
  latitude             Decimal   @db.Decimal(10, 7)
  longitude            Decimal   @db.Decimal(10, 7)
  zipCode              String?   @map("zip_code") @db.VarChar(10)
  roadAddress          String?   @map("road_address") @db.VarChar(500)
  lotAddress           String?   @map("lot_address") @db.VarChar(500)
  telephone            String?   @db.VarChar(50)
  homepage             String?   @db.VarChar(500)
  restGuide            String?   @map("rest_guide") @db.Text
  operationTime        String?   @map("operation_time") @db.VarChar(500)
  parkingAvailable     Boolean   @default(false) @map("parking_available")
  utilizationPrice     String?   @map("utilization_price") @db.Text
  petPossible          Boolean   @default(true) @map("pet_possible")
  petInfo              String?   @map("pet_info") @db.Text
  petSizeLimit         String?   @map("pet_size_limit") @db.VarChar(100)
  petLimitInfo         String?   @map("pet_limit_info") @db.Text
  indoorPetAllowed     Boolean   @default(false) @map("indoor_pet_allowed")
  outdoorPetAllowed    Boolean   @default(false) @map("outdoor_pet_allowed")
  facilityInfo         String?   @map("facility_info") @db.Text
  petAdditionalCharge  String?   @map("pet_additional_charge") @db.VarChar(100)
  lastUpdateDate       DateTime? @map("last_update_date") @db.Date
  createdAt            DateTime  @default(now()) @map("created_at")
  updatedAt            DateTime  @updatedAt @map("updated_at")

  category   Category @relation(fields: [categoryId], references: [id], onDelete: Restrict)
  province   Province @relation(fields: [provinceId], references: [id], onDelete: Restrict)
  district   District @relation(fields: [districtId], references: [id], onDelete: Restrict)

  @@index([categoryId], map: "idx_category_id")
  @@index([provinceId], map: "idx_province_id")
  @@index([districtId], map: "idx_district_id")
  @@index([latitude, longitude], map: "idx_location")
  @@index([facilityName], map: "idx_facility_name")
  @@index([provinceId, districtId, categoryId], map: "idx_composite_filter")
  @@fulltext([facilityName, roadAddress, lotAddress], map: "idx_fulltext_search")
  @@map("facilities")
}
```

### 데이터 저장 및 접근 방식

1. **데이터베이스 연결**: Prisma Client를 사용하여 MySQL 데이터베이스에 연결
2. **초기 데이터 로드**: CSV 파일을 파싱하여 정규화된 테이블에 삽입 (일회성 작업)
3. **쿼리 최적화**: 
   - 외래 키와 인덱스를 사용하여 빠른 JOIN 및 필터링
   - 복합 인덱스 (province_id, district_id, category_id)로 다중 필터 쿼리 최적화
   - FULLTEXT 인덱스를 사용하여 시설명 및 주소 검색 최적화
4. **정규화 이점**:
   - 중복 데이터 제거 (시/도, 시/군/구, 카테고리)
   - 데이터 일관성 보장
   - 저장 공간 절약
   - 필터 옵션 조회 성능 향상 (별도 테이블에서 DISTINCT 조회 불필요)

## 정확성 속성 (Correctness Properties)

속성(Property)은 시스템의 모든 유효한 실행에서 참이어야 하는 특성 또는 동작입니다. 속성은 사람이 읽을 수 있는 명세와 기계가 검증할 수 있는 정확성 보장 사이의 다리 역할을 합니다.


### CSV 파싱 속성

**속성 1: 유효한 CSV 행 파싱**
*모든* 유효한 CSV 행에 대해, 파싱 후 반환된 Facility 객체는 원본 CSV 행의 모든 필드 값을 정확하게 포함해야 합니다.
**검증: 요구사항 1.1**

**속성 2: 필수 필드 검증**
*모든* 필수 필드(시설명, 위도, 경도, 주소, 카테고리)가 누락되거나 잘못된 형식인 CSV 행에 대해, 파서는 해당 행을 거부하고 null을 반환해야 합니다.
**검증: 요구사항 1.2**

**속성 3: 잘못된 행 건너뛰기**
*모든* 잘못된 행이 포함된 CSV 파일에 대해, 파싱 결과는 유효한 행만 포함하고 잘못된 행은 제외되어야 합니다.
**검증: 요구사항 1.3**

**속성 4: 데이터베이스 저장 라운드 트립**
*모든* 파싱된 Facility 배열에 대해, 데이터베이스에 저장 후 다시 조회하면 동일한 데이터가 반환되어야 합니다.
**검증: 요구사항 1.4**

**속성 5: 중복 데이터 처리**
*모든* 중복된 시설 데이터에 대해, 데이터베이스에 저장 시 중복이 건너뛰어져야 합니다.
**검증: 요구사항 1.5**

### 지도 표시 속성

**속성 6: 마커 수 일치**
*모든* 시설 배열에 대해, 지도에 표시된 마커의 수는 시설 배열의 길이와 같아야 합니다.
**검증: 요구사항 2.2**

**속성 7: 마커 클릭 시 상세 정보 표시**
*모든* 마커에 대해, 클릭 시 해당 시설의 상세 정보가 표시되어야 합니다.
**검증: 요구사항 2.3**

### 필터링 속성

**속성 8: 지역 필터링 정확성**
*모든* 지역(시/도 또는 시/군/구) 선택에 대해, 필터링된 결과의 모든 시설은 선택된 지역에 속해야 합니다.
**검증: 요구사항 3.1, 3.2**

**속성 9: 필터 초기화**
*모든* 필터 상태에 대해, 필터를 초기화하면 전체 시설 목록이 표시되어야 합니다.
**검증: 요구사항 3.4**

**속성 10: 카테고리 필터링 정확성**
*모든* 카테고리 선택 조합에 대해, 필터링된 결과의 모든 시설은 선택된 카테고리 중 하나에 속해야 합니다.
**검증: 요구사항 4.2, 4.3**

**속성 11: 필터 변경 시 마커 업데이트**
*모든* 필터 변경에 대해, 지도의 마커는 필터링된 시설만 표시하도록 업데이트되어야 합니다.
**검증: 요구사항 4.4**

### 검색 속성

**속성 12: 검색 결과 정확성**
*모든* 검색어에 대해, 검색 결과의 모든 시설은 시설명 또는 주소에 검색어를 포함해야 합니다.
**검증: 요구사항 5.1, 6.4**

**속성 13: 검색 결과 표시 일치**
*모든* 검색 결과에 대해, 지도에 표시된 마커의 수는 검색 결과의 수와 같아야 합니다.
**검증: 요구사항 5.2**

**속성 14: 검색 결과 클릭 시 지도 이동**
*모든* 검색 결과 항목에 대해, 클릭 시 지도의 중심은 해당 시설의 위치로 이동해야 합니다.
**검증: 요구사항 5.3**

### API 속성

**속성 15: API 필터링 정확성**
*모든* 필터 쿼리 파라미터(지역, 카테고리, 검색어)에 대해, API 응답의 모든 시설은 필터 조건을 만족해야 합니다.
**검증: 요구사항 6.2, 6.3, 6.4**

**속성 16: API 위치 기반 검색 정확성**
*모든* 위치 및 반경 쿼리에 대해, API 응답의 모든 시설은 지정된 반경 내에 위치해야 합니다.
**검증: 요구사항 6.5**

**속성 17: API 페이지네이션 정확성**
*모든* 페이지네이션 파라미터에 대해, API 응답은 요청된 개수만큼의 시설을 반환해야 합니다.
**검증: 요구사항 6.6**

**속성 18: API 오류 처리**
*모든* 잘못된 API 요청에 대해, 적절한 HTTP 상태 코드(4xx 또는 5xx)와 오류 메시지가 반환되어야 합니다.
**검증: 요구사항 6.7**

**속성 19: API 시설 상세 조회**
*모든* 유효한 시설 ID에 대해, API는 해당 시설의 상세 정보를 반환해야 합니다.
**검증: 요구사항 6.8**

### UI 반응성 속성

**속성 20: 화면 크기 변경 시 레이아웃 조정**
*모든* 화면 크기 변경에 대해, UI 레이아웃은 새로운 화면 크기에 맞게 조정되어야 합니다.
**검증: 요구사항 7.2**

**속성 21: 마커 클러스터링 활성화**
*모든* 100개 이상의 마커가 표시될 때, 마커 클러스터링이 활성화되어 클러스터가 생성되어야 합니다.
**검증: 요구사항 8.1**

**속성 22: API 요청 중 로딩 상태**
*모든* API 요청 중에, 로딩 상태는 true여야 하며, 요청 완료 후 false가 되어야 합니다.
**검증: 요구사항 8.4**

## 오류 처리

### CSV 파싱 오류

1. **파일 없음**: CSV 파일이 존재하지 않으면 명확한 오류 메시지와 함께 예외 발생
2. **잘못된 형식**: CSV 형식이 잘못되면 해당 행을 건너뛰고 로그 기록
3. **필수 필드 누락**: 필수 필드가 없으면 해당 행을 건너뛰고 경고 로그 기록
4. **잘못된 데이터 타입**: 위도/경도가 숫자가 아니면 해당 행을 건너뛰고 경고 로그 기록

### API 오류

1. **400 Bad Request**: 잘못된 쿼리 파라미터
2. **404 Not Found**: 존재하지 않는 엔드포인트
3. **500 Internal Server Error**: 서버 내부 오류 (데이터 로드 실패 등)

### 프론트엔드 오류

1. **데이터 로드 실패**: 사용자에게 오류 메시지 표시 및 재시도 버튼 제공
2. **지도 로드 실패**: 지도 API 로드 실패 시 오류 메시지 표시
3. **네트워크 오류**: 네트워크 연결 문제 시 사용자에게 알림

## 테스트 전략

### 이중 테스트 접근법

이 프로젝트는 단위 테스트와 속성 기반 테스트를 모두 사용하여 포괄적인 테스트 커버리지를 제공합니다:

- **단위 테스트**: 특정 예제, 엣지 케이스, 오류 조건을 검증
- **속성 기반 테스트**: 모든 입력에 대한 보편적 속성을 검증

두 가지 테스트 방법은 상호 보완적입니다. 단위 테스트는 구체적인 버그를 잡고, 속성 기반 테스트는 일반적인 정확성을 검증합니다.

### 속성 기반 테스트 설정

**테스트 라이브러리**: fast-check (TypeScript/JavaScript용 속성 기반 테스트 라이브러리)

**설정 요구사항**:
- 각 속성 테스트는 최소 100회 반복 실행
- 각 테스트는 설계 문서의 속성을 참조하는 주석 포함
- 주석 형식: `// Feature: pet-facility-map, Property {번호}: {속성 제목}`

**예제**:
```typescript
// Feature: pet-facility-map, Property 1: 유효한 CSV 행 파싱
it('should parse valid CSV rows correctly', () => {
  fc.assert(
    fc.property(
      fc.record({
        FCLTY_NM: fc.string(),
        LC_LA: fc.float(),
        LC_LO: fc.float(),
        // ... 기타 필드
      }),
      (csvRow) => {
        const facility = CSVParser.rowToFacility(csvRow);
        expect(facility).not.toBeNull();
        expect(facility?.facilityName).toBe(csvRow.FCLTY_NM);
        // ... 기타 검증
      }
    ),
    { numRuns: 100 }
  );
});
```

### 단위 테스트 전략

**테스트 프레임워크**: Jest + React Testing Library

**테스트 범위**:
1. **CSV Parser**: 유효한 입력, 잘못된 입력, 엣지 케이스
2. **Data Service**: 필터링 로직, 검색 로직
3. **API Routes**: 각 엔드포인트의 성공/실패 케이스
4. **React Components**: 렌더링, 사용자 상호작용, 상태 변경

**예제**:
```typescript
describe('CSVParser', () => {
  it('should return null for row with missing required fields', () => {
    const invalidRow = { FCLTY_NM: 'Test' }; // 위도/경도 누락
    const result = CSVParser.rowToFacility(invalidRow);
    expect(result).toBeNull();
  });
  
  it('should handle empty CSV file', () => {
    const result = CSVParser.parseCSV('empty.csv');
    expect(result).toEqual([]);
  });
});
```

### 통합 테스트

**범위**:
- API 엔드포인트와 Data Service 통합
- React 컴포넌트와 API 통합
- 전체 사용자 플로우 (검색 → 필터링 → 상세 보기)

**도구**: Playwright 또는 Cypress (E2E 테스트)

### 테스트 커버리지 목표

- 코드 커버리지: 최소 80%
- 속성 기반 테스트: 모든 핵심 비즈니스 로직
- 단위 테스트: 모든 함수 및 컴포넌트
- 통합 테스트: 주요 사용자 플로우
