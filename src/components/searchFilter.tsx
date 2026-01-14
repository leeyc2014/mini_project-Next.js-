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
    PET_CHARGE_MAP,
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

    const [inPlace, setInPlace] = useState<string | null>(null);
    const [outPlace, setOutPlace] = useState<string | null>(null);

    const [parking, setParking] = useState<string | null>(null);

    const [charge, setCharge] = useState<string | null>(null);

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

        setSingleParam(params, 'parking', formData.get('parking'));

        if (inPlace) {
            params.set('inPlace', inPlace);
        }
        else {
            params.delete('inPlace');
        }

        if (outPlace) {
            params.set('outPlace', outPlace);
        }
        else {
            params.delete('outPlace');
        }

        if (charge) {
            params.set('petCharge', charge);
        }
        else {
            params.delete('petCharge');
        }

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
        <form onSubmit={handleSearch} className="flex flex-col h-full overflow-hidden">
            <div className="p-7 border-b bg-white flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900">상세 검색</h2>
                <button type="reset" onClick={() => window.location.reload()} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    초기화
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-7 space-y-10 bg-white">
                {/* 1. 기본 검색 */}
                <section className="space-y-4">
                    <div className="flex gap-2">
                        <select name="searchType" className="border border-gray-200 rounded-lg text-sm focus:ring-blue-500">
                            <option value="FCLTY_NM">시설명</option>
                            <option value="RDNMADR_NM">주소</option>
                            <option value="CTGRY_THREE_NM">카테고리</option>
                        </select>
                        <input name="keyword" type="text" placeholder="검색어를 입력하세요" className="flex-1 p-2 border border-gray-200 rounded-lg text-sm focus:ring-blue-500 " />
                    </div>
                     <RegionSelect ctpCd={ctpCd} setCtpCd={setCtpCd} setCtpNm={setCtpNm} sigCd={sigCd} setSigCd={setSigCd} setSigNm={setSigNm} dongCd={dongCd} setDongCd={setDongCd} setDongNm={setDongNm} />

                </section>

                <hr className="border-gray-50" />

                {/* 2. 카테고리 */}
                <section className="space-y-3">
                    <CategorySelect twoCd={twoCd} setTwoCd={setTwoCd} setTwoNm={setTwoNm} threeCds={threeCds} setThreeCds={setThreeCds} setThreeNmList={setThreeNmList} />
                </section>

                {/* 3. 반려동물 입장 조건 */}
                <section className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-m font-bold text-gray-800">입장 가능 크기</label>
                        <div className="grid grid-cols-3 gap-2 mt-5">
                            {Object.entries(PET_SIZE_MAP).map(([label, value]) => (
                                <label key={value} className="flex flex-col items-center justify-center p-3 border rounded-xl cursor-pointer hover:bg-blue-50 transition-colors has-checked:border-blue-500 has-checked:bg-blue-50">
                                    <input type="checkbox" name="petSize" value={value} className="hidden" />
                                    <span className="text-xs font-medium">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-m font-bold text-gray-800">반려동물 전용 여부</label>
                            <ClearFilterButton onClear={() => setPetOnly(null)} />
                        </div>
                        <div className="flex gap-2">
                            {Object.entries(PET_ONLY_MAP).map(([label, value]) => (
                                <label key={value} className={`flex-1 text-center py-2.5 border rounded-xl text-sm transition-all cursor-pointer ${petOnly === String(value) ? 'border-blue-600 bg-blue-600 text-white font-bold' : 'border-gray-100 text-gray-500'}`}>
                                    <input type="radio" name="petOnly" value={value} checked={petOnly === String(value)} onChange={() => setPetOnly(String(value))} className="hidden" />
                                    {label}
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. 장소 및 편의 정보 */}
                <section className="space-y-6">
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-m font-bold text-gray-800">동반 가능 장소</label>
                            <ClearFilterButton onClear={() => { setInPlace(null); setOutPlace(null); }} />
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: '실내', click: () => { setInPlace('Y'); setOutPlace(null); }, active: inPlace === 'Y' && outPlace !== 'Y' },
                                { label: '실외', click: () => { setInPlace(null); setOutPlace('Y'); }, active: inPlace !== 'Y' && outPlace === 'Y' },
                                { label: '모두', click: () => { setInPlace('Y'); setOutPlace('Y'); }, active: inPlace === 'Y' && outPlace === 'Y' }
                            ].map((btn) => (
                                <button key={btn.label} type="button" onClick={btn.click} className={`py-2.5 border rounded-xl text-sm transition-all cursor-pointer ${btn.active ? 'border-blue-600 bg-blue-600 text-white font-bold' : 'border-gray-100 text-gray-500'}`}>
                                    {btn.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-m font-bold text-gray-800">주차 시설</label>
                            <ClearFilterButton onClear={() => setParking(null)} />
                        </div>
                        <div className="flex gap-2">
                            {['Y', 'N'].map((v) => (
                                <label key={v} className={`flex-1 text-center py-2.5 border rounded-xl text-sm transition-all cursor-pointer ${parking === v ? 'border-blue-600 bg-blue-600 text-white font-bold' : 'border-gray-100 text-gray-500'}`}>
                                    <input type="radio" name="parking" value={v} checked={parking === v} onChange={() => setParking(v)} className="hidden" />
                                    {v === 'Y' ? '주차 가능' : '주차 불가'}
                                </label>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. 영업 시간 설정 */}
                <section className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-m font-bold text-gray-800">영업 조건</label>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3">
                            {Object.entries(OPEN_FILTER_MAP).map(([label, name]) => (
                                <label key={name} className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" name={name} value="1" className="w-4 h-4 rounded text-blue-600 border-gray-300 focus:ring-blue-500" />
                                    <span className="text-sm text-gray-600 group-hover:text-blue-600 transition-colors">{label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-m font-bold text-gray-800">요일/시간대 검색</label>
                            <ClearFilterButton onClear={() => setDayOfWeek(null)} />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(DAY_OF_WEEK_MAP).map(([label, value]) => (
                                <label key={value} className={`px-3 py-1.5 border rounded-full text-xs transition-all cursor-pointer ${dayOfWeek === String(value) ? 'border-blue-600 bg-blue-50 text-blue-600 font-bold' : 'border-gray-100 text-gray-400'}`}>
                                    <input type="radio" name="dayOfWeek" value={value} checked={dayOfWeek === String(value)} onChange={() => setDayOfWeek(String(value))} className="hidden" />
                                    {label}
                                </label>
                            ))}
                        </div>
                        <input type="time" name="targetTime" className="w-full mt-2 border-gray-200 rounded-lg text-sm focus:ring-blue-500" />
                    </div>
                </section>

                {/* 6. 추가 요금 */}
                <section className="space-y-3 pb-6">
                    <div className="flex justify-between items-center">
                        <label className="text-m font-bold text-gray-800">추가 요금</label>
                        <ClearFilterButton onClear={() => setCharge(null)} />
                    </div>
                    <div className="flex gap-2">
                        {Object.entries(PET_CHARGE_MAP).map(([label, value]) => (
                            <label key={value} className={`flex-1 text-center py-2.5 border rounded-xl text-sm transition-all cursor-pointer ${charge === String(value) ? 'border-blue-600 bg-blue-600 text-white font-bold' : 'border-gray-100 text-gray-500'}`}>
                                <input type="radio" name="petCharge" value={value} checked={charge === String(value)} onChange={() => setCharge(String(value))} className="hidden" />
                                {label}
                            </label>
                        ))}
                    </div>
                </section>
            </div>

            <div className="p-7 bg-white border-t border-gray-100">
                <button type="submit" className="w-full bg-black hover:bg-blue-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-gray-200 active:scale-95 cursor-pointer">
                    검색하기
                </button>
            </div>
        </form>
    );
}