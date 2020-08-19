import { TplFeature } from '@/types/utools';
import StocksDBHelper from '@/Helper/StocksDBHelper';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

const stocksExport: TplFeature = {
  mode: 'none',
  args: {
    placeholder: '导出我的自选股票数据',
    enter: async (action, callbackSetList) => {
      const dbList = StocksDBHelper.getAll();
      const stocksData = dbList.map(db => db.data);
      const savePath = resolve(utools.getPath('desktop'), 'stocks_data.json');
      writeFileSync(savePath, JSON.stringify(stocksData), { encoding: 'utf-8' });
      utools.showNotification(`已导出数据 stocks_data.json 至桌面`);
      utools.redirect('我的自选股票', '');
    },
  },
};

export default stocksExport;
