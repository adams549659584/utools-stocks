export interface IStocksEnt {
  /**
   * 股票id
   */
  id: string;

  /**
   * 股票查询等等的引用id
   */
  quoteID: string;

  /**
   * 股票名称
   */
  name: string;

  /**
   * 拼音首字母
   */
  py: string;

  /**
   * 持有数量
   */
  holdCount: number;

  /**
   * 买入价
   */
  buyPrice: number;

  /**
   * 现价
   */
  nowPrice: number;
}
