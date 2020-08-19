import { TemplatePlugin } from '@/types/utools';
import stocksAdd from './features/stocksAdd';
import stocksDel from './features/stocksDel';
import stocksExport from './features/stocksExport';
import stocksMy from './features/stocksMy';
import stocksImport from './features/stocksImport';

const preload: TemplatePlugin = {
  utools_stocks_add: stocksAdd,
  utools_stocks_del: stocksDel,
  utools_stocks_my: stocksMy,
  utools_stocks_config_export: stocksExport,
  utools_stocks_config_import: stocksImport,
};

window.exports = preload;
