export interface Place {
  id: number;
  fclty_nm: string;
  rdnmadr_nm?: string;
  lnm_addr?: string;
  ctgry_two_nm?: string;
  ctgry_three_nm?: string;
}

export interface PlaceResponse {
  page: number;
  size: number;
  data: Place[];
  totalCount: number;
}

export interface Ctp {
    ctprvn_cd: number;
    ctprvn_nm: string;
}
export interface Sig {
    signgu_cd: number;
    ctprvn_cd: number;
    signgu_nm: string;
}
export interface Dong {
    legaldong_cd: number;
    signgu_cd: number;
    legaldong_nm: string;
}

export interface RegionSelectProps {
    ctpCd: string;
    setCtpCd: (v: string) => void;
    setCtpNm: (v: string) => void;
    sigCd: string;
    setSigCd: (v: string) => void;
    setSigNm: (v: string) => void;
    dongCd: string;
    setDongCd: (v: string) => void;
    setDongNm: (v: string) => void;
}