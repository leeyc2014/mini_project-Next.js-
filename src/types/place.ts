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
}
