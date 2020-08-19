/**
 * @type { import ('./src/types/utools').PluginConfig }
 */
const pluginConfig = {
  pluginName: '自选股票助手',
  // version: 'v0.0.0',
  description: '自选股票助手',
  author: '罗君',
  homepage: 'https://github.com/adams549659584/utools-stocks',
  // main: 'index.html',
  preload: 'preload.js',
  logo: 'assets/img/logo.png',
  platform: ['win32'],
  // development: {
  //   main: '',
  //   preload: '',
  //   logo: '',
  //   buildPath: '',
  // },
  // pluginSetting: {
  //   single: true,
  //   height: 0,
  // },
  features: [
    {
      code: 'utools_stocks_add',
      explain: '添加自选股票',
      icon: 'assets/img/add.png',
      cmds: ['添加自选股票', '继续添加自选股票', '股票', 'stocks'],
    },
    {
      code: 'utools_stocks_del',
      explain: '删除自选股票',
      icon: 'assets/img/del.png',
      cmds: ['删除自选股票', '继续删除自选股票', '股票', 'stocks'],
    },
    {
      code: 'utools_stocks_my',
      explain: '我的自选股票',
      icon: 'assets/img/logo.png',
      cmds: ['我的自选股票', '股票', 'stocks'],
    },
    {
      code: 'utools_stocks_config_export',
      explain: '导出我的自选股票',
      icon: 'assets/img/sync.png',
      cmds: ['导出我的自选股票', '股票', 'stocks'],
    },
    {
      code: 'utools_stocks_config_import',
      explain: '导入我的自选股票',
      icon: 'assets/img/sync.png',
      cmds: [
        {
          type: 'files',
          label: '导入我的自选股票',
          match: '/stocks_data.json/',
        },
      ],
    },
  ],
};
export default pluginConfig;
