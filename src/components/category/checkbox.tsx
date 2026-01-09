'use client';

import { useEffect, useState } from "react";

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

export default function CategoryFilter({ twoCd, setTwoCd, setTwoNm, threeCds, setThreeCds, setThreeNmList }: CategorySelectProps) {
    const [twoList, setTwoList] = useState<Two[]>([]);
    const [threeList, setThreeList] = useState<Three[]>([]);

    /** 대분류 */
    useEffect(() => {
        fetch("/api/category/two")
            .then(res => res.json())
            .then(setTwoList);
    }, []);

    /** 중분류 */
    useEffect(() => {
        if (!twoCd) {
            setThreeList([]);
            setThreeCds([]);
            return;
        }

        fetch(`/api/category/three?ctgry_two_cd=${twoCd}`)
            .then(res => res.json())
            .then(setThreeList);

        // 대분류 바뀌면 체크 초기화
        setThreeCds([]);
    }, [twoCd]);

    const toggleThree = (cd: string, name:string) => {
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

    return (
        <div className="flex flex-col gap-3 border p-3 rounded mb-2">
            <div>
                <p className="font-bold mb-1">카테고리</p>
                <div className="flex flex-wrap gap-3">
                    {twoList.map(t => (
                        <label key={t.ctgry_two_cd} className="flex items-center gap-1">
                            <input type="radio" name="ctgry_two" value={t.ctgry_two_cd} checked={twoCd === String(t.ctgry_two_cd)} onChange={() => { setTwoCd(String(t.ctgry_two_cd)); setTwoNm(t.ctgry_two_nm); }} />
                            {t.ctgry_two_nm}
                        </label>
                    ))}
                </div>
            </div>
            {threeList.length > 0 && (
                <div>
                    <p className="font-bold mb-1">세부 카테고리</p>
                    <div className="flex flex-wrap gap-3">
                        {threeList.map(t => (
                            <label key={t.ctgry_three_cd} className="flex items-center gap-1">
                                <input type="checkbox" checked={threeCds.includes(String(t.ctgry_three_cd))} onChange={() => toggleThree(String(t.ctgry_three_cd), t.ctgry_three_nm)} />
                                {t.ctgry_three_nm}
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
