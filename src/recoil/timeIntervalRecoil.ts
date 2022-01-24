import { atom } from 'recoil';
import { TimeInterval } from '../types/chart';

export const TimeIntervalRecoil = atom<TimeInterval>({
  key: 'timeIntervalRecoil',
  default: '1m',
});
