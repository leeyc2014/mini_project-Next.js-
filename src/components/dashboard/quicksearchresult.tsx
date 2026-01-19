import type { Place } from "@/types/place";

export default function QuickSearchResult({
    keyword,
    results,
}: {
    keyword: string;
    results: Place[];
}) {
    if (!keyword) return null;

    return (
        <div className="rounded-xl bg-white border p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">
                    “{keyword}” 검색 결과
                </h3>
                <button type="reset" onClick={() => window.location.reload()} className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1 cursor-pointer">
                    초기화
                </button>
            </div>

            {results.length === 0 ? (
                <p className="text-sm text-gray-400">
                    검색 결과가 없습니다.
                </p>
            ) : (
                <ul className="divide-y">
                    {results.map((item) => (
                        <li key={item.id} className="py-3">
                            <p className="font-medium text-gray-900">{item.fclty_nm}</p>
                            <p className="text-xs text-gray-500">{item.rdnmadr_nm || "-"}</p>
                            <p className="text-xs text-gray-500">{item.lnm_addr || "-"}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
