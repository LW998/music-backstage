const jsonFile = require('jsonfile');

const cache = require('./app/public/utils/cache')

class AppBootHook {
    constructor(app) {
        this.app = app;
    }
    // 文件加载完成
    async didLoad() {
        // console.log(this.app.config.qq, 'appdidLoad.js');
        global.QQ = this.app.config.QQ;
        jsonFile.readFile('app/public/data/allCookies.json')
            .then((res) => {
                global.allCookies = res
            }, (err) => {
                global.allCookies = {}
            });
        jsonFile.readFile('app/public/data/cookie.json')
            .then((res) => {
                global.userCookie = res;
            }, (err) => {
                global.userCookie = {}
            });
        global.cache = new cache()
    }
    // 插件启动完毕
    // async willReady() {

    // }
}

module.exports = AppBootHook;