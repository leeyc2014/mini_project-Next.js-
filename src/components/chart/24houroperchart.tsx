"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import useSWR from "swr";

const COLORS = ["#2563eb", "#e5e7eb"];

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function TwentyFourHourChart() {
    const { data, error, isLoading } = useSWR("/api/timeseries/24hour", fetcher);

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>에러 발생</div>;
    if (!Array.isArray(data) || data.length === 0) return null;

    const total = data.reduce((s, d) => s + d.cnt, 0);
    const allDay = data.find(d => String(d.type).includes("24"))?.cnt ?? 0;
    const ratio = total ? Math.round((allDay / total) * 100) : 0;

    return (
        <div className="w-full h-90 flex flex-col items-center justify-center relative">
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie data={data} dataKey="cnt" nameKey="type" innerRadius={80} outerRadius={110} paddingAngle={3} stroke="none">
                        {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip formatter={(v) => [`${Number(v ?? 0).toLocaleString()}곳`, "시설 수"]} />
                </PieChart>
            </ResponsiveContainer>

            <div className="absolute text-center">
                <div className="text-3xl font-bold text-gray-900">{ratio}%</div>
                <div className="text-sm text-gray-500">24시간 운영</div>
            </div>

            <div className="mt-2 flex gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-blue-600" />일반 운영</div>
                <div className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-300" />24시간 운영</div>
            </div>
        </div>
    );
}
