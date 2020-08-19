/**
 * 股票搜索结果
 */
export interface ISearchStocksResult {
  QuotationCodeTable: {
    Status: number;
    Message: string;
    Data: {
      /**
       * 股票编码
       */
      Code: string;
      /**
       * 股票名称
       */
      Name: string;
      /**
       * 拼音首字母
       */
      PinYin: string;
      /**
       * 引用id
       */
      QuoteID: string;
    }[];
  };
}
