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