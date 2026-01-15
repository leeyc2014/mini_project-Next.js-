'use client';

interface Props {
  placeDetail: any;
  onClose: () => void;
}

function Info({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value?: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg p-3">
      <span className="text-xs text-gray-500">{label}</span>
      <span className={`font-medium ${highlight ? 'text-green-600' : 'text-gray-800'}`}>
        {value || '-'}
      </span>
    </div>
  );
}

export default function PlaceDetailModal({ placeDetail, onClose }: Props) {
  if (!placeDetail) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* 모달 본체 */}
      <div className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          {placeDetail.fclty_nm}
        </h2>

        <div className="mt-4 space-y-1 text-sm text-gray-700">
          <p><b>도로명 주소:</b> {placeDetail.rdnmadr_nm || '-'}</p>
          <p><b>지번 주소:</b> {placeDetail.lnm_addr || '-'}</p>
          <p><b>전화번호:</b> {placeDetail.tel_no || '-'}</p>
          <p>
            <b>홈페이지:</b>{' '}
            {!placeDetail.hmpg_url ? '-' : (
              <a
                href={placeDetail.hmpg_url}
                target="_blank"
                className="text-blue-600 underline break-all"
              >
                {placeDetail.hmpg_url}
              </a>
            )}
          </p>
        </div>

        <hr className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <Info label="휴무일 안내" value={placeDetail.rstde_guid_cn} />
          <Info label="운영 시간" value={placeDetail.oper_time} />
          <Info label="주차 가능 여부" value={placeDetail.parkng_posbl_at === 'Y' ? '가능' : '불가능'} highlight={placeDetail.parkng_posbl_at === 'Y'} />
          <Info label="이용 가격" value={placeDetail.utiliiza_prc_cn} />
          <Info label="반려동물 가능" value={placeDetail.pet_posbl_at === 'Y' ? '가능' : '불가능'} highlight={placeDetail.pet_posbl_at === 'Y'} />
          <Info label="입장 가능 크기" value={placeDetail.entrn_posbl_pet_size_value} />
          <Info label="제한 사항" value={placeDetail.pet_lmtt_mtr_cn} />
          <Info label="내부 동반" value={placeDetail.in_place_acp_posbl_at === 'Y' ? '가능' : '불가능'} highlight={placeDetail.in_place_acp_posbl_at === 'Y'} />
          <Info label="외부 동반" value={placeDetail.out_place_acp_posbl_at === 'Y' ? '가능' : '불가능'} highlight={placeDetail.out_place_acp_posbl_at === 'Y'} />
          <Info label="시설 설명" value={placeDetail.fclty_info_dc} />
          <Info label="추가 요금" value={placeDetail.pet_acp_adit_chrge_value} />
        </div>
      </div>
    </div>
  );
}
