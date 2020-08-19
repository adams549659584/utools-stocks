import { TplFeature, CallbackListItem } from '@/types/utools';
import StocksDBHelper from '@/Helper/StocksDBHelper';

const stocksDel: TplFeature = {
  mode: 'list',
  args: {
    placeholder: '选择需删除的股票，回车键确认',
    enter: (action, callbackSetList) => {
      const dbList = StocksDBHelper.getAll();
      if (dbList.length === 0) {
        utools.redirect('我的自选股票', '');
      }
      const cbList = dbList.map(db => {
        const cb: CallbackListItem = {
          title: db.data.id,
          description: db.data.name,
        };
        return cb;
      });
      // 如果进入插件就要显示列表数据
      callbackSetList(cbList);
    },
    search: (action, searchWord, callbackSetList) => {
      let dbList = StocksDBHelper.getAll();
      if (searchWord) {
        dbList = dbList.filter(x => x.data.id.includes(searchWord) || x.data.name.includes(searchWord) || x.data.py.includes(searchWord.toLowerCase()));
      }
      const cbList = dbList.map(db => {
        const cb: CallbackListItem = {
          title: db.data.id,
          description: db.data.name,
        };
        return cb;
      });
      callbackSetList(cbList);
    }, // 用户选择列表中某个条目时被调用
    select: (action, itemData, callbackSetList) => {
      StocksDBHelper.del(itemData.title);
      utools.redirect('继续删除自选股票', '');
    },
  },
};
export default stocksDel;
