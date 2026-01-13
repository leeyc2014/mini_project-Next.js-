export const DAY_OF_WEEK_MAP: Record<string, number> = {
    '월': 0,
    '화': 1,
    '수': 2,
    '목': 3,
    '금': 4,
    '토': 5,
    '일': 6,
};

export const OPEN_FILTER_MAP: Record<string, string> = {
    '지금 영업 중': 'openNow',
    '공휴일 영업': 'holidayOpen',
    '설날 영업': 'seolOpen',
    '추석 영업': 'chuseokOpen',
    '크리스마스 영업': 'christmasOpen',
};

export const PET_SIZE_MAP: Record<string, number> = {
    '해당없음': 0,
    '소형': 1,
    '중형': 2,
    '대형': 3,
    '모두 가능': 4,
};

export const PET_ONLY_MAP: Record<string, number> = {
    '해당없음': 0,
    '반려동물전용': 1,
};

export const PLACE_TYPE_MAP: Record<string, string> = {
    '실내 동반 가능': 'IN',
    '실외 동반 가능': 'OUT',
};

export const PARKING_POSS_MAP: Record<string, string> = {
    '주차 가능': 'Y',
    '주차 불가능': 'N',
}

export const PET_CHARGE_MAP: Record<string, string> = {
    '무료': 'FREE',
    '5천원 이하': 'UNDER_5000',
    '1만원 이하': 'UNDER_10000',
    '1만원 초과': 'OVER_10000',
};
