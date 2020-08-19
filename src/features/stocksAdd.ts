import { TplFeature, CallbackListItem } from '@/types/utools';
import { ISearchStocksResult } from '@/model/ISearchStocksResult';
import { get } from '@/Helper/HttpHelper';
import StocksDBHelper from '@/Helper/StocksDBHelper';
import { IStocksValuationDetailResult } from '@/model/IStocksValuationDetailResult';

const stocksAdd: TplFeature = {
  mode: 'list',
  args: {
    placeholder: '输入股票简称/代码/拼音，回车键确认',
    search: async (action, searchWord, callbackSetList) => {
      // 获取一些数据
      let cbList: CallbackListItem[] = [];
      if (searchWord) {
        const searchResult = await get<ISearchStocksResult>(
          `http://searchapi.eastmoney.com/api/suggest/get?input=${searchWord}&type=14&token=D43BF722C8E33BDC906FB84D85E326E8&markettype=&mktnum=&jys=&classify=&securitytype=&count=10`
        );
        if (searchResult && searchResult.QuotationCodeTable) {
          if (searchResult.QuotationCodeTable.Status === 0) {
            cbList = searchResult.QuotationCodeTable.Data.map(stocks => {
              const cb: CallbackListItem = {
                title: stocks.Code,
                description: stocks.Name,
                PinYin: stocks.PinYin,
                QuoteID: stocks.QuoteID,
              };
              return cb;
            });
          } else {
            utools.showMessageBox({
              message: searchResult.QuotationCodeTable.Message,
            });
          }
        }
      }
      callbackSetList(cbList);
    }, // 用户选择列表中某个条目时被调用
    select: async (action, itemData, callbackSetList) => {
      const stocksCode = itemData.title;
      const existStocks = StocksDBHelper.get(stocksCode);
      if (!existStocks) {
        const stocksValuationDetailResult = await get<IStocksValuationDetailResult>(
          `http://push2.eastmoney.com/api/qt/ulist.np/get?fields=f12,f2,f14&secids=${itemData.QuoteID}&ut=6d2ffaa6a585d612eda28417681d58fb`
        );
        let nowPrice = 0;
        if (stocksValuationDetailResult && stocksValuationDetailResult.data.diff.length > 0) {
          const stocks = stocksValuationDetailResult.data.diff.find(x => x.f12 === stocksCode);
          if (stocks) {
            nowPrice = stocks.f2 / 100;
          }
        }
        StocksDBHelper.set({
          id: itemData.title,
          quoteID: itemData.QuoteID,
          name: itemData.description,
          py: itemData.PinYin.toLowerCase(),
          holdCount: 0,
          buyPrice: nowPrice, //加入价作为最初买入价
          nowPrice,
        });
      }
      utools.redirect('继续添加自选股票', '');
    },
  },
};
export default stocksAdd;
