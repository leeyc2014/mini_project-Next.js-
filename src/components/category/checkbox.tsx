'use client';

import { useEffect, useState } from "react";
import ClearFilterButton from '@/components/clearbutton';

interface Two {
    ctgry_two_cd: number;
    ctgry_two_nm: string;
}

interface Three {
    ctgry_three_cd: number;
    ctgry_two_cd: number;
    ctgry_three_nm: string;
}

interface CategorySelectProps {
    twoCd: string;
    setTwoCd: React.Dispatch<React.SetStateAction<string>>;
    setTwoNm: React.Dispatch<React.SetStateAction<string>>;
    threeCds: string[];
    setThreeCds: React.Dispatch<React.SetStateAction<string[]>>;
    setThreeNmList: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function CategoryFilter({ 
    twoCd, 
    setTwoCd, 
    setTwoNm, 
    threeCds, 
    setThreeCds, 
    setThreeNmList 
}: CategorySelectProps) {
    const [twoList, setTwoList] = useState<Two[]>([]);
    const [threeList, setThreeList] = useState<Three[]>([]);

    useEffect(() => {
        fetch("/api/category/two")
            .then(res => res.json())
            .then(data => {
                setTwoList(data);
            })
            .catch(err => console.error("대분류 로드 실패:", err));
    }, []);

    useEffect(() => {
        if (!twoCd) {
            setThreeList([]);
            setThreeCds([]);
            setThreeNmList([]);
            return;
        }

        fetch(`/api/category/three?ctgry_two_cd=${twoCd}`)
            .then(res => res.json())
            .then(data => {
                setThreeList(data);
            })
            .catch(err => console.error("중분류 로드 실패:", err));

        setThreeCds([]);
        setThreeNmList([]);
    }, [twoCd, setThreeCds, setThreeNmList]);

    const toggleThree = (cd: string, name: string) => {
        setThreeCds(prev =>
            prev.includes(cd)
                ? prev.filter(v => v !== cd)
                : [...prev, cd]
        );
        setThreeNmList(prev =>
            prev.includes(name)
                ? prev.filter(v => v !== name)
                : [...prev, name]
        );
    };

    const handleClearAll = () => {
        setTwoCd("");
        setTwoNm("");
        setThreeList([]);
        setThreeCds([]);
        setThreeNmList([]);
    };

    return (
        <div className="flex flex-col gap-8 bg-white">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <p className="text-m font-bold text-gray-800">카테고리</p>
                    </div>
                    <ClearFilterButton onClear={handleClearAll} />
                </div>
                <div className="flex flex-wrap gap-2">
                    {twoList.map(t => {
                        const isSelected = twoCd === String(t.ctgry_two_cd);
                        return (
                            <label key={t.ctgry_two_cd} className="cursor-pointer group">
                                <input type="radio" name="ctgry_two" className="hidden" value={t.ctgry_two_cd} checked={isSelected}  onChange={() => { setTwoCd(String(t.ctgry_two_cd)); setTwoNm(t.ctgry_two_nm); }} />
                                <div className={`px-4 py-2 rounded-full border text-sm transition-all duration-200
                                    ${isSelected 
                                        ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-md shadow-blue-100' 
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30'}
                                `}>
                                    {t.ctgry_two_nm}
                                </div>
                            </label>
                        );
                    })}
                </div>
            </div>

            {threeList.length > 0 && (
                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <p className="text-[15px] font-bold text-gray-800">세부 카테고리</p>
                            {threeCds.length > 0 && (
                                <ClearFilterButton onClear={() => { setThreeCds([]); setThreeNmList([]); }} />
                            )}
                        </div>
                        <p className="text-[12px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded">중복 선택</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {threeList.map(t => {
                            const isChecked = threeCds.includes(String(t.ctgry_three_cd));
                            return (
                                <label key={t.ctgry_three_cd} className="cursor-pointer">
                                    <input type="checkbox" className="hidden" checked={isChecked} onChange={() => toggleThree(String(t.ctgry_three_cd), t.ctgry_three_nm)} />
                                    <div className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border text-[13px] transition-all
                                        ${isChecked 
                                            ? 'bg-blue-50 border-blue-200 text-blue-700 font-semibold shadow-sm' 
                                            : 'bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-700'}
                                    `}>
                                        {isChecked && (
                                            <svg className="w-3.5 h-3.5 animate-in zoom-in duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                        {t.ctgry_three_nm}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}