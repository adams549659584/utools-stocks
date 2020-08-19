import { IStocksEnt } from '@/model/IStocksEnt';
import { DBItem } from '@/types/utools';

const FUND_DB_PRE_FIX = 'stocks_';

export default class StocksDBHelper {
  static set(data: IStocksEnt) {
    return utools.db.put({
      _id: `${FUND_DB_PRE_FIX}${data.id}`,
      data,
    });
  }

  static setList(data: IStocksEnt[]) {
    const dbList = data.map(x => {
      const db: DBItem<IStocksEnt> = {
        _id: `${FUND_DB_PRE_FIX}${x.id}`,
        data: x,
      };
      return db;
    });
    return utools.db.bulkDocs(dbList);
  }

  static update<IStocksEnt>(data: DBItem<IStocksEnt>) {
    return utools.db.put(data);
  }

  static get(stocksId: string) {
    return utools.db.get<IStocksEnt>(`${FUND_DB_PRE_FIX}${stocksId}`);
  }

  static getAll() {
    return utools.db.allDocs<IStocksEnt>(FUND_DB_PRE_FIX);
  }

  static del(stocksId: string) {
    return utools.db.remove(`${FUND_DB_PRE_FIX}${stocksId}`);
  }
}
