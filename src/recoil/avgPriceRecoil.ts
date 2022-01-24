import { atom } from 'recoil';

export const AvgPriceRecoil = atom<number | undefined>({
  key: 'avgPriceRecoil',
  default: undefined,
});
