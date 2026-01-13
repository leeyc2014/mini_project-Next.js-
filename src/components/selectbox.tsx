'use client';

import { useEffect, useState } from "react";

interface Ctp {
    ctprvn_cd: number;
    ctprvn_nm: string;
}
interface Sig {
    signgu_cd: number;
    ctprvn_cd: number;
    signgu_nm: string;
}
interface Dong {
    legaldong_cd: number;
    signgu_cd: number;
    legaldong_nm: string;
}

interface RegionSelectProps {
    ctpCd: string;
    setCtpCd: (v: string) => void;
    setCtpNm: (v: string) => void;
    sigCd: string;
    setSigCd: (v: string) => void;
    setSigNm: (v: string) => void;
    dongCd: string;
    setDongCd: (v: string) => void;
    setDongNm: (v: string) => void;
}

export default function RegionSelect({ ctpCd, setCtpCd, setCtpNm, sigCd, setSigCd, setSigNm, dongCd, setDongCd, setDongNm }: RegionSelectProps) {
    const [ctpList, setCtpList] = useState<Ctp[]>([]);
    const [sigList, setSigList] = useState<Sig[]>([]);
    const [dongList, setDongList] = useState<Dong[]>([]);

    /** 시·도 */
    useEffect(() => {
        fetch("/api/ctprvn")
            .then(res => res.json())
            .then(setCtpList);
    }, []);

    /** 시·군·구 */
    useEffect(() => {
        if (!ctpCd) return;
        setSigCd("");
        setDongCd("");

        fetch(`/api/signgu?ctprvn_cd=${ctpCd}`)
            .then(res => res.json())
            .then(setSigList);
    }, [ctpCd]);

    /** 동 */
    useEffect(() => {
        if (!sigCd) return;
        setDongCd("");

        fetch(`/api/legaldong?signgu_cd=${sigCd}`)
            .then(res => res.json())
            .then(setDongList);
    }, [sigCd]);

    return (
        <div className="flex flex-col">
            <p className="text-m font-bold text-gray-800 mb-3">지역</p>
            <div className="flex flex-row items-center gap-2">
                <select value={ctpCd} onChange={e => {
                    const selected = ctpList.find(c => String(c.ctprvn_cd) === e.target.value);
                    setCtpCd(e.target.value);
                    setCtpNm(selected?.ctprvn_nm || "");
                }}
                    className="border border-gray-200 rounded-lg text-sm focus:ring-blue-500 p-2">
                    <option value="">시·도 선택</option>
                    {ctpList.map(c => (
                        <option key={c.ctprvn_cd} value={c.ctprvn_cd}>
                            {c.ctprvn_nm}
                        </option>
                    ))}
                </select>
                <select value={sigCd} onChange={e => {
                    const selected = sigList.find(s => String(s.signgu_cd) === e.target.value);
                    setSigCd(e.target.value);
                    setSigNm(selected?.signgu_nm || "");
                }}
                    disabled={!ctpCd} className="border border-gray-200 rounded-lg text-sm focus:ring-blue-500 p-2">
                    <option value="">시·군·구 선택</option>
                    {sigList.map(s => (
                        <option key={s.signgu_cd} value={s.signgu_cd}>
                            {s.signgu_nm}
                        </option>
                    ))}
                </select>

                <select value={dongCd} onChange={e => {
                    const selected = dongList.find(d => String(d.legaldong_cd) === e.target.value);
                    setDongCd(e.target.value);
                    setDongNm(selected?.legaldong_nm || "");
                }}
                    disabled={!sigCd} className="border border-gray-200 rounded-lg text-sm focus:ring-blue-500 p-2">
                    <option value="">동·읍·면 선택</option>
                    {dongList.map(d => (
                        <option key={d.legaldong_cd} value={d.legaldong_cd}>
                            {d.legaldong_nm}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}