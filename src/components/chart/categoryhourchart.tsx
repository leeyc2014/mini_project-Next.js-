"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid } from "recharts";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

const COLORS = [
    "#2563eb",
    "#16a34a",
    "#f97316",
    "#7c3aed",
    "#0ea5e9",
    "#ec4899" 
];

export default function CategoryHourChart() { 
    const { data, error, isLoading } = useSWR("/api/timeseries/category_hour", fetcher);

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>에러 발생</div>;
    if (!data || data.length === 0) return null;

    // hour 제외한 모든 key = 업종
    const categoryKeys = Object.keys(data[0]).filter(k => k !== "hour");

    return (
        <div className="w-full h-90">
            <ResponsiveContainer width="100%" height={360}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 3, 6, 9, 12, 15, 18, 21, 23]} tickFormatter={(v) => `${v}시`} />
                    <YAxis />
                    <Tooltip formatter={(value) => typeof value === "number" ? `${value.toLocaleString()}곳` : value} labelFormatter={(v) => `${v}시`} />
                    <Legend />
                    {categoryKeys.map((key, idx) => (
                        <Line key={key} dataKey={key} stroke={COLORS[idx % COLORS.length]} strokeWidth={2} dot={false} />
                    ))}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
