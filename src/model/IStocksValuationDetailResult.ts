/**
 * 股票估值结果
 */
export interface IStocksValuationDetailResult {
  data: {
    total: number;
    diff: {
      f2: number;
      f12: string;
      f14: string;
    }[];
  };
}
