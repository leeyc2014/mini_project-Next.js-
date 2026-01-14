'use client';

import { useState, useEffect } from "react";

import RegionSelect from "@/components/selectbox";
import CategorySelect from "@/components/category/checkbox";
import SearchSummary from "@/components/searchsummary";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";
import Link from "next/link";

type SearchMode = "region" | "category" | "both";

const KakaoMap = dynamic(
    () => import("@/components/kakaomap"),
    { ssr: false }
);

function Info({ label, value, highlight = false }: { label: string; value?: string; highlight?: boolean }) {
    return (
        <div className="flex flex-col bg-gray-50 rounded-lg p-3">
            <span className="text-xs text-gray-500">{label}</span>
            <span className={`font-medium ${highlight ? "text-green-600" : "text-gray-800"}`}>
                {value || "-"}
            </span>
        </div>
    );
}

export default function Page() {
    const [searchMode, setSearchMode] = useState<SearchMode>("region");

    const [ctpCd, setCtpCd] = useState("");
    const [sigCd, setSigCd] = useState("");
    const [dongCd, setDongCd] = useState("");
    const [ctpNm, setCtpNm] = useState("");
    const [sigNm, setSigNm] = useState("");
    const [dongNm, setDongNm] = useState("");

    const [twoCd, setTwoCd] = useState("");
    const [twoNm, setTwoNm] = useState("");
    const [threeCds, setThreeCds] = useState<string[]>([]);
    const [threeNmList, setThreeNmList] = useState<string[]>([]);

    const [places, setPlaces] = useState<any[]>([]);

    const [selectedPlaceId, setSelectedPlaceId] = useState<number | null>(null);
    const [placeDetail, setPlaceDetail] = useState<any>(null);

    const [ctp, setCtp] = useState({ cd: "", nm: "" });
    const [sig, setSig] = useState({ cd: "", nm: "" });
    const [dong, setDong] = useState({ cd: "", nm: "" });


    const handleSearch = async () => {
        let url = "";

        /** 지역 */
        if (searchMode === "region" || searchMode === "both") {
            const params = new URLSearchParams();
            if (ctpCd) params.append("ctprvn_cd", ctpCd);
            if (sigCd) params.append("signgu_cd", sigCd);
            if (dongCd) params.append("legaldong_cd", dongCd);

            if ([...params].length === 0) {
                toast.error("검색 조건을 선택하세요");
                return;
            }

            url = `/api/place/regionsearch?${params.toString()}`;
        }

        /** 카테고리 */
        if (searchMode === "category" || searchMode === "both") {
            const params = new URLSearchParams();
            if (twoCd) params.append("ctgry_two_cd", twoCd);
            threeCds.forEach(cd =>
                params.append("ctgry_three_cd", cd)
            );

            if ([...params].length === 0) {
                toast.error("검색 조건을 선택하세요");
                return;
            }

            url = `/api/place/categorysearch?${params.toString()}`;
        }

        /** 통합 */
        if (searchMode === "both") {
            const params = new URLSearchParams();

            // 지역
            if (ctpCd) params.append("ctprvn_cd", ctpCd);
            if (sigCd) params.append("signgu_cd", sigCd);
            if (dongCd) params.append("legaldong_cd", dongCd);

            // 카테고리
            if (twoCd) params.append("ctgry_two_cd", twoCd);
            threeCds.forEach(cd =>
                params.append("ctgry_three_cd", cd)
            );

            if ([...params].length === 0) {
                toast.error("검색 조건을 선택하세요");
                return;
            }

            url = `/api/place/bothsearch?${params.toString()}`; // 👉 통합용 API
        }

        const res = await fetch(url);
        const data = await res.json();
        setPlaces(data);
    };

    useEffect(() => {
        if (searchMode === "region") {
            setTwoCd("");
            setThreeCds([]);
        }
        if (searchMode === "category") {
            setCtpCd("");
            setSigCd("");
            setDongCd("");
        }
        if (searchMode === "both") {
            setCtpCd("");
            setSigCd("");
            setDongCd("");
            setTwoCd("");
            setThreeCds([]);
        }
    }, [searchMode]);

    useEffect(() => {
        if (!selectedPlaceId) return;

        const fetchDetail = async () => {
            const res = await fetch(
                `api/place/detail?id=${selectedPlaceId}`
            );
            const data = await res.json();
            setPlaceDetail(data);
        };

        fetchDetail();
    }, [selectedPlaceId]);

    return (
        <div className="flex flex-col w-full">
            <h1 className="text-3xl font-bold my-3 text-center px-4">지도 검색</h1>
            <div className="flex flex-row">
                <div className="flex flex-col border p-3 rounded container w-3/5 m-3">
                    <div className="flex flex-row mb-2 justify-between">
                        <label className="mr-4">
                            <input type="radio" checked={searchMode === "region"} onChange={() => setSearchMode("region")} className="mr-2" />
                            지역 기반
                        </label>
                        <label className="mr-4">
                            <input type="radio" checked={searchMode === "category"} onChange={() => setSearchMode("category")} className="mr-2" />
                            카테고리 기반
                        </label>
                        <label>
                            <input type="radio" checked={searchMode === "both"} onChange={() => setSearchMode("both")} className="mr-2" />
                            지역 + 카테고리
                        </label>
                        <button type="button" onClick={handleSearch} className="w-1/5 mx-5 border border-gray-300 rounded-lg px-5 py-2.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 cursor-pointer">
                            검색
                        </button>
                    </div>
                    {(searchMode === "region" || searchMode === "both") && (
                        <RegionSelect ctpCd={ctpCd} setCtpCd={setCtpCd} setCtpNm={setCtpNm} sigCd={sigCd} setSigCd={setSigCd} setSigNm={setSigNm} dongCd={dongCd} setDongCd={setDongCd} setDongNm={setDongNm} />
                    )}
                    {(searchMode === "category" || searchMode === "both") && (
                        <CategorySelect twoCd={twoCd} setTwoCd={setTwoCd} setTwoNm={setTwoNm} threeCds={threeCds} setThreeCds={setThreeCds} setThreeNmList={setThreeNmList} />
                    )}
                    <div className="mt-5">
                        <KakaoMap places={places} onSelectPlace={setSelectedPlaceId} />
                    </div>
                </div>
                <div className="flex flex-col mx-auto px-4 py-8 w-2/5">
                    <SearchSummary searchMode={searchMode} region={{ ctp: ctpNm, sig: sigNm, dong: dongNm }} category={{ twoNm: twoNm, threeNms: threeNmList }} count={places.length} />
                    {!placeDetail && (
                        <p className="text-gray-400 text-center">마커 클릭 시 상세 정보 표시</p>
                    )}
                    {placeDetail && (
                        <div className="bg-white rounded-xl shadow-md p-6 space-y-4">
                            <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
                                {placeDetail.fclty_nm}
                            </h2>
                            <div className="space-y-1 text-sm text-gray-700">
                                <p><span className="font-semibold">도로명 주소:</span> {placeDetail.rdnmadr_nm || "-"}</p>
                                <p><span className="font-semibold">지번 주소:</span> {placeDetail.lnm_addr || "-"}</p>
                                <p><span className="font-semibold">전화번호:</span> {placeDetail.tel_no === 0 || !placeDetail.tel_no ? "-" : placeDetail.tel_no}</p>
                                <p>
                                    <span className="font-semibold">홈페이지:</span>{" "}
                                    {!placeDetail.hmpg_url ? "-" : (
                                        <a href={placeDetail.hmpg_url} target="_blank" className="text-blue-600 hover:underline break-all">
                                            {placeDetail.hmpg_url}
                                        </a>
                                    )}
                                </p>
                            </div>
                            <hr />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <Info label="휴무일 안내" value={placeDetail.rstde_guid_cn} />
                                <Info label="운영 시간" value={placeDetail.oper_time} />
                                <Info label="주차 가능 여부" value={placeDetail.parkng_posbl_at === "Y" ? "가능" : "불가능"} highlight={placeDetail.parkng_posbl_at === "Y"} />
                                <Info label="이용 가격" value={placeDetail.utiliiza_prc_cn} />
                                <Info label="반려동물 가능 여부" value={placeDetail.pet_posbl_at === "Y" ? "가능" : "불가능"} highlight={placeDetail.pet_posbl_at === "Y"} />
                                <Info label="입장 가능 반려동물 크기" value={placeDetail.entrn_posbl_pet_size_value} />
                                <Info label="반려동물 제한사항" value={placeDetail.pet_lmtt_mtr_cn} />
                                <Info label="내부 동반 가능" value={placeDetail.in_place_acp_posbl_at === "Y" ? "가능" : "불가능"} highlight={placeDetail.in_place_acp_posbl_at === "Y"} />
                                <Info label="외부 동반 가능" value={placeDetail.out_place_acp_posbl_at === "Y" ? "가능" : "불가능"} highlight={placeDetail.out_place_acp_posbl_at === "Y"} />
                                <Info label="시설 설명" value={placeDetail.fclty_info_dc} />
                                <Info label="반려동물 추가 요금" value={placeDetail.pet_acp_adit_chrge_value} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
