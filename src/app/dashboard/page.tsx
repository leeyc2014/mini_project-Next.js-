'use client';

import { useState } from "react";

import QuickSearch from "@/components/dashboard/quicksearch";
import QuickSearchResult from "@/components/dashboard/quicksearchresult";
import ChartPreview from "@/components/dashboard/chartpreview";
import HourlyChart from "@/components/chart/hourlychart";

export default function Page() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState<any[]>([]);
  return (
    <div className="flex flex-col w-full h-full my-5 pr-5 gap-5">
      <QuickSearch onResult={(data, key) => {setResults(data); setKeyword(key)}} />
      <QuickSearchResult keyword={keyword} results={results} />
      <section>
        <ChartPreview title="시간대별 영업 시설 추이" href="/dashboard/chart">
          <HourlyChart />
        </ChartPreview>
      </section>
    </div>
  );
}
