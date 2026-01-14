'use client'

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function WeekdayChart() {
    const { data, error, isLoading } = useSWR(
        '/api/timeseries/weekday',
        fetcher
    )
    if (isLoading) return <div>로딩중...</div>;
    if (error) return <div>에러 발생</div>;

    const categoryKeys =
        data && data.length > 0
            ? Object.keys(data[0]).filter(k => k !== 'weekday')
            : []

    return (
        <div className="w-full h-90">
            <ResponsiveContainer width="100%" height={280}>
                <BarChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="weekday_name" />
                    <YAxis />
                    <Tooltip formatter={(value) => typeof value === "number" ? `${value.toLocaleString()}곳` : value} />
                    <Legend />
                    <Bar dataKey="open_cnt" name="이용 가능 시설" radius={[6, 6, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>

        </div>
    )
}

{/* <LineChart data={data}>
  <XAxis dataKey="weekday" />
  <YAxis />
  <Tooltip />
  <Legend />
  {categoryKeys.map(key => (
    <Line key={key} dataKey={key} />
  ))}
</LineChart> */}