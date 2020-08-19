import { TplFeature, FilesPayload } from '@/types/utools';

import { readFileSync } from 'fs';
import { IStocksEnt } from '@/model/IStocksEnt';
import StocksDBHelper from '@/Helper/StocksDBHelper';

const stocksImport: TplFeature = {
  mode: 'none',
  args: {
    placeholder: '导入我的自选股票数据',
    enter: async (action, callbackSetList) => {
      if (action.type === 'files') {
        const jsonFile: FilesPayload = action.payload[0];
        if (jsonFile.isFile && jsonFile.name === 'stocks_data.json') {
          const stocksJsonStr = readFileSync(jsonFile.path, { encoding: 'utf-8' });
          const stocksData: IStocksEnt[] = JSON.parse(stocksJsonStr);
          StocksDBHelper.setList(stocksData);
        }
      }
      utools.redirect('我的自选股票', '');
    },
  },
};

export default stocksImport;
