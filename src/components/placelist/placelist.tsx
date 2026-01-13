'use client';

import { useState } from 'react';
import PlaceDetailModal from './placedetailpopup';

export default function PlaceList({ data }: { data: any[] }) {
  const [selectedPlace, setSelectedPlace] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const openDetail = async (placeId: number) => {
    setLoading(true);

    try {
      const res = await fetch(`api/place/detail?id=${placeId}`);
      const detail = await res.json();
      setSelectedPlace(detail);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ul className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-12">
        {data.map((place, idx) => (
          <li key={idx} onClick={() => openDetail(place.id)} className="cursor-pointer group bg-white border rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
            <div className="p-5">
              <h2 className="font-bold text-lg truncate group-hover:text-indigo-600">
                {place.fclty_nm}
              </h2>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                {place.rdnmadr_nm || place.lnm_addr || '주소 정보 없음'}
              </p>
            </div>
          </li>
        ))}
      </ul>

      {/* 팝업 */}
      {selectedPlace && (
        <PlaceDetailModal placeDetail={selectedPlace} onClose={() => setSelectedPlace(null)} />
      )}
    </>
  );
}
