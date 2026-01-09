'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import RegionSelect from '@/components/selectbox';
import CategorySelect from '@/components/category/checkbox';
import ClearFilterButton from '@/components/clearbutton';
import {
    setSingleParam,
    setMultiParam,
    setCheckParam,
} from '@/utils/searchParams'

import {
    DAY_OF_WEEK_MAP,
    OPEN_FILTER_MAP,
    PET_SIZE_MAP,
    PET_ONLY_MAP,
} from '@/constants/filters';


export default function SearchFilter() {
    const [ctpCd, setCtpCd] = useState("");
    const [sigCd, setSigCd] = useState("");
    const [dongCd, setDongCd] = useState("");
    const [ctpNm, setCtpNm] = useState("");
    const [sigNm, setSigNm] = useState("");
    const [dongNm, setDongNm] = useState("");

    const [twoCd, setTwoCd] = useState("");
    const [twoNm, setTwoNm] = useState("");
    const [threeCds, setThreeCds] = useState<string[]>([]);
    const [threeNmList, setThreeNmList] = useState<string[]>([]);

    const [dayOfWeek, setDayOfWeek] = useState<string | null>(null);
    const [petOnly, setPetOnly] = useState<string | null>(null);

    const router = useRouter();
    const searchParams = useSearchParams();
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // 검색 실행 함수
    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        sessionStorage.setItem('isSearch', 'true');

        const formData = new FormData(e.currentTarget);
        const params = new URLSearchParams();

        /* ===== 기본 ===== */
        setSingleParam(params, 'searchType', formData.get('searchType'));
        setSingleParam(params, 'keyword', formData.get('keyword'));
        params.set('search', 'true');
        params.set('page', '1');

        /* ===== 지역 ===== */
        if (ctpCd) params.set('ctpCd', ctpCd);
        if (sigCd) params.set('sigCd', sigCd);
        if (dongCd) params.set('dongCd', dongCd);

        /* ===== 카테고리 ===== */
        if (twoCd) params.set('twoCd', twoCd);
        setMultiParam(params, 'threeCd', threeCds);

        /* ===== 반려동물 ===== */
        setMultiParam(params, 'petSize', formData.getAll('petSize'));
        setSingleParam(params, 'petOnly', formData.get('petOnly'));

        /* ===== 영업 ===== */
        setCheckParam(params, 'openNow', formData.get('openNow'));
        setCheckParam(params, 'holidayOpen', formData.get('holidayOpen'));
        setCheckParam(params, 'seolOpen', formData.get('seolOpen'));
        setCheckParam(params, 'chuseokOpen', formData.get('chuseokOpen'));
        setCheckParam(params, 'christmasOpen', formData.get('christmasOpen'));

        setSingleParam(params, 'dayOfWeek', formData.get('dayOfWeek'));
        setSingleParam(params, 'targetTime', formData.get('targetTime'));

        router.push(`/listsearch?${params.toString()}`);
    };



    useEffect(() => {
        const isSearch = sessionStorage.getItem('isSearch');

        // 검색 버튼을 누른 적이 없는데 query가 있다면 → 초기화
        if (!isSearch && searchParams.toString()) {
            router.replace('/listsearch');
        }

        // 최초 진입 후 flag 제거 (한 번만 검색 인정)
        sessionStorage.removeItem('isSearch');
    }, []);

    return (
        <div className="flex flex-row w-full h-full">
            <div className="flex flex-col gap-4 m-5 w-2/3">
                <form onSubmit={handleSearch} className="flex flex-col gap-4">
                    {/* 1. 상단 검색 바 */}
                    <div className="flex gap-2">
                        <select name="searchType" className="border p-2 rounded">
                            <option value="FCLTY_NM">시설명</option>
                            <option value="RDNMADR_NM">주소</option>
                            <option value="CTGRY_THREE_NM">카테고리</option>
                        </select>
                        <input name="keyword" type="text" placeholder="검색어를 입력하세요" className="flex-1 border p-2 rounded" />
                        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded cursor-pointer">
                            검색
                        </button>
                        <button type="button" onClick={() => setIsFilterOpen(!isFilterOpen)} className="border px-4 py-2 rounded">
                            필터 {isFilterOpen ? '▲' : '▼'}
                        </button>
                    </div>

                    {/* 2. 상세 필터 영역 */}
                    {isFilterOpen && (
                        <div className="flex flex-col gap-4 p-4 rounded-lg">
                            {/* 지역 / 카테고리 */}
                            <RegionSelect ctpCd={ctpCd} setCtpCd={setCtpCd} setCtpNm={setCtpNm} sigCd={sigCd} setSigCd={setSigCd} setSigNm={setSigNm} dongCd={dongCd} setDongCd={setDongCd} setDongNm={setDongNm} />
                            <CategorySelect twoCd={twoCd} setTwoCd={setTwoCd} setTwoNm={setTwoNm} threeCds={threeCds} setThreeCds={setThreeCds} setThreeNmList={setThreeNmList} />
                            {/* 반려동물 크기 */}
                            <div className='flex flex-row gap-5'>
                                <div className='flex flex-col'>
                                    <label className="block text-xl font-bold">입장 가능 크기</label>
                                    <div className="flex flex-col gap-2 mt-3">
                                        {Object.entries(PET_SIZE_MAP).map(([label, value]) => (
                                            <label key={value} className="text-sm">
                                                <input type="checkbox" name="petSize" value={value} className='mr-2' />{label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div className='flex flex-col'>
                                    <label className="block text-xl font-bold">반려동물 전용 여부</label>
                                    <div className="flex flex-col gap-2 mt-3">
                                        {Object.entries(PET_ONLY_MAP).map(([label, value]) => (
                                            <label key={value} className="text-sm">
                                                <input type="radio" name="petOnly" value={value} checked={petOnly === String(value)} onChange={() => setPetOnly(String(value))} className='mr-2' />{label}
                                            </label>
                                        ))}
                                        <ClearFilterButton onClear={() => setPetOnly(null)} />
                                    </div>
                                </div>
                            </div>
                            {/* 영업 시간 */}
                            <div className='flex flex-row gap-5'>
                                <div className="flex flex-col">
                                    <label className="block text-xl font-bold">영업 시간</label>
                                    <div className="flex flex-col gap-2 mt-3 text-sm">
                                        {Object.entries(OPEN_FILTER_MAP).map(([label, name]) => (
                                            <label key={name} className="text-sm">
                                                <input type="checkbox" name={name} value="1" className='mr-2' />{label}
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                {/* 요일 + 시간 */}
                                <div className="flex flex-col">
                                    <label className="block text-xl font-bold">특정 시간 검색</label>
                                    <div className="flex flex-col gap-2 mt-3 text-sm">
                                        <div className="flex flex-wrap gap-2">
                                            {Object.entries(DAY_OF_WEEK_MAP).map(([label, value]) => (
                                                <label key={value} className="text-sm">
                                                    <input type="radio" name="dayOfWeek" value={value} checked={dayOfWeek === String(value)} onChange={() => setDayOfWeek(String(value))} className='mr-2' />{label}
                                                </label>
                                            ))}
                                            <ClearFilterButton onClear={() => setDayOfWeek(null)} />
                                        </div>
                                        <input type="time" name="targetTime" className="border p-1 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </form>
            </div >
        </div >
    );
}