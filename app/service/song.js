'use strict';

const Service = require('egg').Service;
const Base64 = require('js-base64');
const request = require('../public/utils/request')
class SongService extends Service {
    // 播放链接请求
    async playUrl(params) {
        let uin = global.userCookie.uin
        const {
            cache
        } = global

        const {
            id
        } = params
        const idArr = id.split(',')
        let count = 0
        const idStr = idArr.map((id) => `"${id}"`).join(',')

        let cacheKey = `song_url_${idStr}`
        let cacheData = cache.get(cacheKey)
        if (cacheData) {
            return cacheData
        }
        let url = `https://u.y.qq.com/cgi-bin/musicu.fcg?-=getplaysongvkey2682247447678878&g_tk=5381&loginUin=${uin}&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq.json&needNewCode=0&data=%7B"req_0"%3A%7B"module"%3A"vkey.GetVkeyServer"%2C"method"%3A"CgiGetVkey"%2C"param"%3A%7B"guid"%3A"2796982635"%2C"songmid"%3A%5B${idStr}%5D%2C"songtype"%3A%5B0%5D%2C"uin"%3A"${uin}"%2C"loginflag"%3A1%2C"platform"%3A"20"%7D%7D%2C"comm"%3A%7B"uin"%3A${uin}%2C"format"%3A"json"%2C"ct"%3A24%2C"cv"%3A0%7D%7D`
        let isOk = false
        let result = null
        const reqFun = async () => {
            count += 1
            result = await request(url)
            if (result.req_0.data.testfile2g) {
                isOk = true
            }

        }
        while (!isOk && count < 10) {
            await reqFun()
        }

        const domain = 'http://122.226.161.16/amobile.music.tc.qq.com/'
        const data = {}
        let total = 0;
        result.req_0.data.midurlinfo.forEach((item) => {
            if (item.purl) {
                total += 1;
                data[item.songmid] = `${domain}${item.purl}`
            }
        })
        if (Object.keys(data).length !== 0) {
            cacheData = {
                data,
                total,
                result: 100,
            }
        } else {
            cacheData = {
                result: 400,
                errMsg: '获取播放链接出错',
            }
        }
        cache.set(cacheKey, cacheData)
        return cacheData

    }
    // 歌词请求
    async lyric(params) {
        const {
            songmid,
            raw
        } = params;

        if (!songmid) {
            return {
                result: 500,
                errMsg: 'songmid 不能为空',
            }
        }

        const result = await request({
            url: 'http://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg',
            data: {
                songmid,
                pcachetime: new Date().getTime(),
                g_tk: 5381,
                loginUin: 0,
                hostUin: 0,
                inCharset: 'utf8',
                outCharset: 'utf-8',
                notice: 0,
                platform: 'yqq',
                needNewCode: 0,
            },
            headers: {
                Referer: 'https://y.qq.com',
            }
        });
        let resData = {
            lyric: Base64.Base64.decode(result.lyric),
            trans: Base64.Base64.decode(result.trans || ''),
        };
        result.lyric = Base64.Base64.decode(result.lyric);
        result.trans = Base64.Base64.decode(result.trans || '');
        if (Number(raw)) {
            return result;
        } else {
            return {
                result: 100,
                data: resData,
            }
        }
    }
    // 下载
    async downUrl(params) {
        let uin = global.userCookie.uin
        const {
            cache
        } = global

        const {
            id,
            type = '128',
            mediaId = id,
            isRedirect = '0'
        } = params
        const typeMap = {
            m4a: {
                s: 'C400',
                e: '.m4a',
            },
            128: {
                s: 'M500',
                e: '.mp3',
            },
            320: {
                s: 'M800',
                e: '.mp3',
            },
            ape: {
                s: 'A000',
                e: '.ape',
            },
            flac: {
                s: 'F000',
                e: '.flac',
            },
        }
        const typeObj = typeMap[type]

        if (!typeObj) {
            return {
                result: 500,
                errMsg: 'type错误',
            }
        }
        const file = `${typeObj.s}${id}${mediaId}${typeObj.e}`
        const guid = (Math.random() * 10000000).toFixed(0)

        let purl = ''
        let count = 0
        let cacheKey = `song_url_${file}`
        let cacheData = cache.get(cacheKey)
        if (cacheData) {
            return cacheData
        }
        while (!purl && count < 10) {
            count += 1
            const result = await request({
                url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
                data: {
                    '-': 'getplaysongvkey',
                    g_tk: 5381,
                    loginUin: uin,
                    hostUin: 0,
                    format: 'json',
                    inCharset: 'utf8',
                    outCharset: 'utf-8¬ice=0',
                    platform: 'yqq.json',
                    needNewCode: 0,
                    data: JSON.stringify({
                        req_0: {
                            module: 'vkey.GetVkeyServer',
                            method: 'CgiGetVkey',
                            param: {
                                filename: [file],
                                guid: guid,
                                songmid: [id],
                                songtype: [0],
                                uin: uin,
                                loginflag: 1,
                                platform: '20',
                            },
                        },
                        comm: {
                            uin: uin,
                            format: 'json',
                            ct: 19,
                            cv: 0,
                        },
                    }),
                },
            })
            if (
                result.req_0 &&
                result.req_0.data &&
                result.req_0.data.midurlinfo.length !== 0
            ) {
                purl = result.req_0.data.midurlinfo[0].purl
            }
        }
        if (!purl) {
            return {
                result: 400,
                errMsg: '获取播放链接出错',
            }
        }

        if (Number(isRedirect)) {
            return res.redirect(`http://122.226.161.16/amobile.music.tc.qq.com/${purl}`)
        }

        cacheData = {
            data: `http://122.226.161.16/amobile.music.tc.qq.com/${purl}`,
            result: 100,
        }
        cache.set(cacheKey, cacheData)
        return cacheData

    }
}
module.exports = SongService;