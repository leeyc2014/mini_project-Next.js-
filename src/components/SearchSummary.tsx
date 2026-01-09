interface SearchSummaryProps {
    searchMode: "region" | "category" | "both";
    region?: { ctp?: string; sig?: string; dong?: string };
    category?: { twoNm?: string; threeNms?: string[] };
    count: number;
}

export default function SearchSummary({
    searchMode,
    region,
    category,
    count,
}: SearchSummaryProps) {
    if (count === 0) return null;

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 shadow-sm">
            <p className="font-semibold text-blue-900 mb-2">검색 조건 요약</p>

            <div className="space-y-1 text-sm text-gray-800">
                {(searchMode === "region" || searchMode === "both") && (
                    <p>
                        <span className="font-medium">지역:</span>{" "}
                        {[region?.ctp, region?.sig, region?.dong].filter(Boolean).join(" > ")}
                    </p>
                )}

                {(searchMode === "category" || searchMode === "both") && (
                    <p>
                        <span className="font-medium">카테고리:</span>{" "}
                        {category?.twoNm}
                        {category?.threeNms && category.threeNms.length > 0 && (
                            <> &gt; {category.threeNms.join(", ")}</>
                        )}
                    </p>
                )}
            </div>
            <div className="mt-3 pt-3 border-t flex justify-between items-center">
                <span className="text-sm text-gray-600">검색 결과</span>
                <span className="text-2xl font-bold text-blue-700">{count}개</span>
            </div>
        </div>
    );
}
