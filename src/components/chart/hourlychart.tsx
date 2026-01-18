"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function HourlyChart() { 
    const { data, error, isLoading } = useSWR("/api/timeseries/hourly", fetcher);

    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>에러 발생</div>;
    if (!Array.isArray(data)) {
        console.error("HourlyChart data is not array:", data);
        return null;
    }

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" type="number" domain={[0, 23]} ticks={[0, 3, 6, 9, 12, 15, 18, 21, 23]} tickFormatter={(v) => `${v}시`} />
                <YAxis />
                <Tooltip formatter={(v) => [Number(v).toLocaleString(), "영업 시설 수"]} labelFormatter={(h) => `${h}시`} />
                <Legend />
                <Line type="monotone" dataKey="open_cnt" strokeWidth={3} dot={false} name="영업 중 시설 수" />
            </LineChart>
        </ResponsiveContainer>
    );
}
