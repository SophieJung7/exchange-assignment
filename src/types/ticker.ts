export interface TickerSocketResponse {
  E: number;
  M: boolean;
  T: number;
  a: number;
  b: number;
  e: string;
  m: boolean;
  p: string;
  q: string;
  s: string;
  t: number;
  error?: {
    code: number;
    msg: string;
  };
}
