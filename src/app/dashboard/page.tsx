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
    <div className="flex flex-col w-full h-full gap-6 p-5">
      
      {/* 검색 영역 */}
      <div className="w-full space-y-3">
        <QuickSearch onResult={(data, key) => { setResults(data); setKeyword(key) }} />
        <QuickSearchResult keyword={keyword} results={results} />
      </div>

      {/* 차트 + 게시판 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 차트 영역 */}
        <section className="lg:col-span-2 space-y-4">
          <ChartPreview title="시간대별 영업 시설 추이" href="/dashboard/chart">
            <HourlyChart />
          </ChartPreview>
        </section>

        {/* 게시판 영역 */}
        <aside className="lg:col-span-1">
          <BoardView />
        </aside>
      </div>
    </div>
  );
}
