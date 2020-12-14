'use strict';
const jsonFile = require('jsonfile');

const Service = require('egg').Service;

class UserService extends Service {
    async setCookies(params) {
        let {
            data
        } = params
        const userCookie = {};
        data.split('; ').forEach((c) => {
            const arr = c.split('=');
            userCookie[arr[0]] = arr[1];
        });
        global.allCookies[userCookie.uin] = userCookie;
        jsonFile.writeFile('app/public/data/allCookies.json', global.allCookies);

        if (String(userCookie.uin) === String(global.QQ)) {
            global.userCookie = userCookie;
            jsonFile.writeFile('app/public/data/cookie.json', global.userCookie);
        }

        return {
            result: 100,
            data: '操作成功'
        }
    }
}
module.exports = UserService;