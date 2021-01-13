'use strict';
const request = require('../public/utils/request');
const cheerio = require('cheerio');

const Service = require('egg').Service;

class HomeService extends Service {
    async hot(raw) {
        const result = await request({
            url: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg',
        });
        if (Number(raw)) {
            return {
                result
            }
        }
        return {
            result: 100,
            data: result.data.hotkey,
        }
    }

    async search(params) {
        const {
            cache
        } = global;
        let {
            pageNo = 1,
                pageSize = 20,
                key,
                t = 0, // 0：单曲，2：歌单，7：歌词，8：专辑，9：歌手，12：mv
                raw,
        } = params;
        let total = 0;
        if (!key) {
            return {
                result: 500,
                errMsg: '关键词不能为空',
            };
        }
        const cacheKey = `search_${key}_${pageNo}_${pageSize}_${t}`
        const cacheData = cache.get(cacheKey);
        console.log(cacheData);
        if (cacheData) {
            return cacheData;
        }
        const url = {
            0: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp',
            2: `https://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist?remoteplace=txt.yqq.playlist&page_no=${pageNo - 1}&num_per_page=${pageSize}&query=${key}`,
        } [t] || 'http://c.y.qq.com/soso/fcgi-bin/client_search_cp';

        const typeMap = {
            0: 'song',
            2: 'songlist',
            7: 'lyric',
            8: 'album',
            12: 'mv',
            9: 'singer',
        };

        if (!typeMap[t]) {
            return {
                result: 500,
                errMsg: '搜索类型错误，检查一下参数 t'
            }
        }

        let data = {
            format: 'json', // 返回json格式
            n: pageSize, // 一页显示多少条信息
            p: pageNo, // 第几页
            w: key, // 搜索关键词
            cr: 1,
            g_tk: 5381,
            t,
        };

        if (Number(t) === 2) {
            data = {
                query: key,
                page_no: pageNo - 1,
                num_per_page: pageSize,
            }
        }

        const result = await request({
            url,
            method: 'get',
            data,
            headers: {
                Referer: 'https://y.qq.com'
            }
        });
        if (Number(raw)) {
            return result;
        }

        // 下面是数据格式的美化
        const {
            keyword
        } = result.data;
        const keyMap = {
            0: 'song',
            2: '',
            7: 'lyric',
            8: 'album',
            12: 'mv',
            9: 'singer',
        };

        const searchResult = (keyMap[t] ? result.data[keyMap[t]] : result.data) || [];
        const {
            list,
            curpage,
            curnum,
            totalnum,
            page_no,
            num_per_page,
            display_num
        } = searchResult;

        switch (Number(t)) {
            case 2:
                pageNo = page_no + 1;
                pageSize = num_per_page;
                total = display_num;
                break;
            default:
                pageNo = curpage;
                pageSize = curnum;
                total = totalnum;
                break;
        }

        const resData = {
            result: 100,
            data: {
                list,
                pageNo,
                pageSize,
                more: list.length === 20,
                total,
                key: keyword || key,
                t,
                type: typeMap[t],
            },
        }
        cache.set(cacheKey, resData, 120);
        return resData;
    }

    async banner() {
        const page = await request('https://c.y.qq.com/node/musicmac/v6/index.html', {
            dataType: 'raw',
        })
        const $ = cheerio.load(page);
        const result = [];
        $('.focus__box .focus__pic').each((a, b) => {
            const domA = cheerio(b).find('a');
            const domImg = cheerio(b).find('img');
            const [type, id] = [domA.attr('data-type'), domA.attr('data-rid')];
            const obj = {
                type,
                id,
                picUrl: domImg.attr('src'),
                h5Url: {
                    10002: `https://y.qq.com/musicmac/v6/album/detail.html?albumid=${id}`
                } [type] || undefined,
                typeStr: {
                    10002: 'album'
                } [type] || undefined
            }
            result.push(obj);
        })

        return {
            result: 100,
            data: result,
        }
    }
}
module.exports = HomeService;