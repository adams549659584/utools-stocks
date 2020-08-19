import { TplFeature, DBItem, CallbackListItem, CallbackSetList } from '@/types/utools';
import StocksDBHelper from '@/Helper/StocksDBHelper';
import { IStocksValuationDetailResult } from '@/model/IStocksValuationDetailResult';
import { get } from '@/Helper/HttpHelper';
import { ISearchStocksResult } from '@/model/ISearchStocksResult';
import { IStocksEnt } from '@/model/IStocksEnt';

// 缓存股票详情
let CACHE_FUND_DB_LIST: DBItem<IStocksEnt>[];
// 当前搜索关键字
let CURRENT_SEARCH_WORD = '';
let QUERY_TIMER: NodeJS.Timeout;

const getMyStocksDetails = async () => {
  const dbList = StocksDBHelper.getAll();
  if (dbList.length > 0) {
    const quoteIds = dbList.map(db => db.data.quoteID).join(',');
    const stocksValuationDetailResult = await get<IStocksValuationDetailResult>(
      `http://push2.eastmoney.com/api/qt/ulist.np/get?fields=f12,f2,f14&secids=${quoteIds}&ut=6d2ffaa6a585d612eda28417681d58fb`
    );
    if (stocksValuationDetailResult.data.total > 0) {
      stocksValuationDetailResult.data.diff.forEach(stocks => {
        const db = dbList.find(d => d.data.id === stocks.f12);
        if (db) {
          const oldData = db.data;
          db.data = {
            ...oldData,
            nowPrice: stocks.f2 / 100,
          };
        }
        StocksDBHelper.update(db);
      });
    }
  }
  return StocksDBHelper.getAll();
};

const stocksDetailsToCbList = (dbList: DBItem<IStocksEnt>[], searchWord = '') => {
  let sumIncome = 0;
  let cbList = dbList.map(db => {
    const stocks = db.data;
    const rate = stocks.buyPrice > 0 ? stocks.nowPrice / stocks.buyPrice - 1 : 0;
    const income = stocks.holdCount > 0 ? (stocks.nowPrice - stocks.buyPrice) * stocks.holdCount : 0;
    sumIncome += income;
    const cb: CallbackListItem = {
      stocksCode: stocks.id,
      title: `${stocks.id} ${stocks.name}`,
      description: `${(rate * 100).toFixed(2)}% ￥${income.toFixed(2)}`,
      icon: rate >= 0 ? 'assets/img/up.png' : 'assets/img/down.png',
      searchWord,
    };
    return cb;
  });
  if (cbList.length === 0) {
    cbList = [
      {
        title: ``,
        description: ``,
        icon: 'assets/img/add.png',
        searchWord,
      },
    ];
  } else {
    cbList = [
      {
        title: `今日总收益`,
        description: `￥${sumIncome.toFixed(2)}`,
        icon: sumIncome >= 0 ? 'assets/img/up.png' : 'assets/img/down.png',
        searchWord,
      },
      ...cbList,
    ];
  }
  return cbList;
};

const loading = (cb: CallbackSetList, loadingTips = '加载中，请稍后。。。') => {
  cb([
    {
      title: loadingTips,
      description: '~~~~~~~~~~~~~~~',
      icon: 'assets/img/loading.png',
    },
  ]);
};

const showStocksDetails = async (cb: CallbackSetList, isShowLoading = true) => {
  if (isShowLoading) {
    loading(cb);
  }
  const dbList = await getMyStocksDetails();
  // 缓存
  CACHE_FUND_DB_LIST = dbList;
  const cbList = stocksDetailsToCbList(dbList);
  cb(cbList);
  // 定时展示
  QUERY_TIMER = setTimeout(() => {
    showStocksDetails(cb, false);
  }, 1000 * 60);
};
utools.onPluginOut(() => {
  clearTimeout(QUERY_TIMER);
});

const stocksMy: TplFeature = {
  mode: 'list',
  args: {
    placeholder: '输入（持有份额,买入价），选择对应股票，回车键保存',
    enter: async (action, callbackSetList) => {
      clearTimeout(QUERY_TIMER);
      showStocksDetails(callbackSetList);
    },
    search: async (action, searchWord, callbackSetList) => {
      let dbList = CACHE_FUND_DB_LIST && CACHE_FUND_DB_LIST.length > 0 ? CACHE_FUND_DB_LIST : await getMyStocksDetails();
      const cbList = stocksDetailsToCbList(dbList, searchWord);
      callbackSetList(cbList);
    }, // 用户选择列表中某个条目时被调用
    select: (action, itemData, callbackSetList) => {
      if (!CACHE_FUND_DB_LIST || CACHE_FUND_DB_LIST.length === 0) {
        utools.redirect('添加自选股票', '');
        return;
      }
      if (action.type === 'text' && itemData.stocksCode) {
        debugger;
        const stocksDb = StocksDBHelper.get(itemData.stocksCode);
        if (itemData.searchWord && itemData.searchWord.includes(',')) {
          const [holdCountStr, buyPriceStr] = itemData.searchWord.split(',');
          const holdCount = parseFloat(holdCountStr);
          const buyPrice = parseFloat(buyPriceStr);
          if (!Number.isNaN(holdCount) && !Number.isNaN(buyPrice)) {
            stocksDb.data.holdCount = holdCount;
            stocksDb.data.buyPrice = buyPrice;
            StocksDBHelper.update(stocksDb);
          }
        }
      }
      utools.redirect('我的自选股票', '');
    },
  },
};

export default stocksMy;
