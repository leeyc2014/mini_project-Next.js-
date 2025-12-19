import { atom } from "jotai";

export type AuthUser = {
  id: number;
  email: string;
  accessToken: string;
};

export const userAtom = atom<AuthUser | null>(null);
