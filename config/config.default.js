/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
    /**
     * built-in config
     * @type {Egg.EggAppConfig}
     **/
    const config = (exports = {});

    // 修改默认端口
    config.cluster = {
        listen: {
            path: '',
            port: 3000,
        },
    };

    config.cors = {
        origin: '*',
        allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
        credentials: true,
    };

    config.QQ = '1171851877';

    config.security = {
        csrf: {
            enable: false,
        },
        // 白名单
        domainWhiteList: ['*'],
    };

    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1607304536812_1450';

    // add your middleware config here
    config.middleware = ['params'];

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };

    return {
        ...config,
        ...userConfig,
    };
};
