'use client';

import { useState } from "react";

import QuickSearch from "@/components/dashboard/quicksearch";
import QuickSearchResult from "@/components/dashboard/quicksearchresult";
import ChartPreview from "@/components/dashboard/chartpreview";
import HourlyChart from "@/components/chart/hourlychart";
import BoardView from "@/components/dashboard/boardview";

export default function Page() {
    const [keyword, setKeyword] = useState("");
    const [results, setResults] = useState<any[]>([]);

    return (
        <div className="w-full h-full p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <section className="flex flex-col gap-4">
                    <QuickSearch onResult={(data, key) => { setResults(data); setKeyword(key); }} />
                    <QuickSearchResult keyword={keyword} results={results} />
                </section>
                <section className="flex flex-col gap-6">
                    <ChartPreview title="시간대별 영업 시설 추이" href="/dashboard/chart">
                        <HourlyChart />
                    </ChartPreview>
                    <BoardView />
                </section>
            </div>
        </div>
    );
}
