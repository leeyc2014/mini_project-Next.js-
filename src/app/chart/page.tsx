'use client'

import { useState, useEffect } from "react";

import HourlyChart from "@/components/chart/hourlychart";
import WeekdayChart from "@/components/chart/weekdaychart";
import CategoryHourChart from "@/components/chart/categoryhourchart";
import TwentyFourHourChart from "@/components/chart/24houroperchart";

import Link from "next/link";

interface Kpi {
    total: number;
    open_now: number;
    open_24: number;
}

export default function ChartPage() {
    const [kpi, setKpi] = useState<Kpi | null>(null);

    useEffect(() => {
        fetch("/api/kpi")
            .then(res => res.json())
            .then(setKpi);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800">반려동물 서비스 시계열</h1>
                <Link href="/dashboard" className="text-2xl font-semibold text-gray-500 hover:text-gray-900 transition">뒤로가기</Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-3">
                <div className="rounded-2xl bg-white p-5 shadow-sm border">
                    <p className="text-sm text-gray-500">전체 시설 수</p>
                    <p className="mt-2 text-3xl font-bold text-gray-800">{kpi?.total ?? "-"}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm border">
                    <p className="text-sm text-gray-500">현재 운영 중</p>
                    <p className="mt-2 text-3xl font-bold text-green-600">{kpi?.open_now ?? "-"}</p>
                </div>
                <div className="rounded-2xl bg-white p-5 shadow-sm border">
                    <p className="text-sm text-gray-500">24시간 운영</p>
                    <p className="mt-2 text-3xl font-bold text-indigo-600">{kpi?.open_24 ?? "-"}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mt-10">
                <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
                    <h2 className="mb-3 text-lg font-semibold text-gray-700">⏰ 시간대별 영업 시설</h2>
                    <div className="h-90"><HourlyChart /></div>
                </div>
                <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
                    <h2 className="mb-3 text-lg font-semibold text-gray-700">📅 요일별 가용 시설</h2>
                    <div className="h-90"><WeekdayChart /></div>
                </div>
                <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
                    <h2 className="mb-3 text-lg font-semibold text-gray-700">🐶 카테고리별 가용 시설</h2>
                    <div className="h-90"><CategoryHourChart /></div>
                </div>
                <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md">
                    <h2 className="mb-3 text-lg font-semibold text-gray-700">🌙 24시간 영업 시설</h2>
                    <div className="h-90"><TwentyFourHourChart /></div>
                </div>
            </div>
        </div>
    );
}
