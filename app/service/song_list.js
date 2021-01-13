'use strict';

const Service = require('egg').Service;

const request = require('../public/utils/request');

class SongListService extends Service {
    //获取歌单
    async list(params) {
        const {
            raw,
            num = 20,
            pageSize = num,
            pageNo = 1,
            sort = 5,
            category = 10000000,
        } = params;
        const result = await request({
            url: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg',
            data: {
                inCharset: 'utf8',
                outCharset: 'utf-8',
                sortId: sort,
                categoryId: category,
                sin: pageSize * (pageNo - 1),
                ein: pageNo * pageSize - 1,
            },
            headers: {
                Referer: 'https://y.qq.com',
            },
        })

        if (Number(raw)) {
            return result
        } else {
            const {
                list = [], sortId, categoryId, ein, sum
            } = result.data
            return {
                result: 100,
                data: {
                    list,
                    sort: sortId,
                    category: categoryId,
                    pageNo,
                    pageSize,
                    total: sum,
                },
            }
        }
    }
    // 获取推荐歌单详情
    async detail(params) {
        const {
            id,
            raw
        } = params
        if (!id) {
            return {
                result: 500,
                errMsg: 'id 不能为空',
            }
        }
        const result = await request({
            url: 'http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',
            data: {
                type: 1,
                utf8: 1,
                disstid: id, // 歌单的id
                loginUin: 0,
            },
            headers: {
                Referer: 'https://y.qq.com/n/yqq/playlist',
            },
        })

        if (Number(raw)) {
            return result
        } else {
            if (result.cdlist[0]) {
                return {
                    result: 100,
                    data: {
                        disstid: result.cdlist[0].disstid,
                        logo: result.cdlist[0].logo,
                        dissname: result.cdlist[0].dissname,
                        desc: result.cdlist[0].desc,
                        nick: result.cdlist[0].nickname,
                        songnum: result.cdlist[0].total_song_num,
                        head: result.cdlist[0].headurl,
                        list: result.cdlist[0].songlist.map((list) => ({
                            songname: list.songname,
                            songmid: list.songmid,
                            album: list.albumname,
                            singer: list.singer.map((i) => i.name).join('/'),
                            vip: list.pay.payplay,
                        })),
                        visitnum: result.cdlist[0].visitnum,
                    },
                }
            } else {
                return {
                    result: 400,
                    errMsg: '获取内容为空',
                }
            }
        }
    }
    // 获取歌单排行榜
    async category(params) {
        const {
            raw,
        } = params
        let uin = global.userCookie.uin
        const result = await request(
            `https://u.y.qq.com/cgi-bin/musicu.fcg?_=1577086820633&data={%22comm%22:{%22g_tk%22:5381,%22uin%22:${uin},%22format%22:%22json%22,%22inCharset%22:%22utf-8%22,%22outCharset%22:%22utf-8%22,%22notice%22:0,%22platform%22:%22h5%22,%22needNewCode%22:1,%22ct%22:23,%22cv%22:0},%22topList%22:{%22module%22:%22musicToplist.ToplistInfoServer%22,%22method%22:%22GetAll%22,%22param%22:{}}}`
        )

        if (Number(raw)) {
            return result
        }
        return {
            result: 100,
            data: result.topList.data.group.map((o) => ({
                title: o.groupName,
                list: o.toplist
                    .map((t) => ({
                        topId: t.topId,
                        label: t.title,
                        period: t.period,
                        updateTips: t.updateTips,
                        listenNum: t.listenNum,
                        song: t.song.map((item) => ({
                            rank: item.rank,
                            title: item.title,
                            singer: item.singerName,
                        })),
                        picUrl: t.headPicUrl,
                    }))
                    .filter((it) => it.period !== ''),
            })),
        }
    }
    // 获取排行歌单详情
    async top(params) {
        const {
            id = 4,
                pageNo = 1,
                pageSize = 100,
                period,
                time = new Date().toLocaleString().formatTime(`{0}-{1}-{2}`),
                raw,
        } = params;

        const MomentOfYear = () => {
            let date = new Date();
            let year = date.getFullYear();
            let nowMoment = date.getMonth();
            let sum = date.getDate();
            if (nowMoment !== 0) {
                for (let i = 1; i <= nowMoment; i++) {
                    sum += new Date(year, i, 0).getDate()
                }
            }
            return Math.floor(sum / 7) + 1
        }

        let postPeriod = '';
        switch (Number(id)) {
            case 4:
            case 27:
            case 62:
                postPeriod = period || new Date().toLocaleString().formatTime(`{0}-{1}-{2}`)
                break
            default:
                postPeriod = period || new Date().toLocaleString().formatTime(`{0}`) + '_' + MomentOfYear()
        }

        console.log(postPeriod, '/top postPeriod');

        const reqFunc = async () =>
            request({
                url: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
                data: {
                    g_tk: 5381,
                    data: JSON.stringify({
                        detail: {
                            module: 'musicToplist.ToplistInfoServer',
                            method: 'GetDetail',
                            param: {
                                topId: Number(id),
                                offset: (pageNo - 1) * pageSize,
                                num: Number(pageSize),
                                period: postPeriod,
                            },
                        },
                        comm: {
                            ct: 24,
                            cv: 0,
                        },
                    }),
                },
            })
        let result = await reqFunc()

        if (result.detail.data.data.period !== postPeriod) {
            postPeriod = result.detail.data.data.period
            result = await reqFunc()
        }

        if (result.detail.data.data.period)
            if (Number(raw)) {
                return result
            } else {
                const resData = result.detail.data
                return {
                    result: 100,
                    data: {
                        title: resData.data.title,
                        subTitle: resData.data.titleSub,
                        titleDetail: resData.data.titleDetail,
                        list: resData.data.song.map((o, i) => ({
                            rank: o.rank,
                            rankType: o.rankType,
                            rankValue: o.rankValue,
                            songname: o.title,
                            singer: o.singerName,
                            songmid: resData.songInfoList[i].mid,
                            subtitle: resData.songInfoList[i].subtitle,
                        })),
                        total: resData.data.totalNum,
                        listenNum: resData.data.listenNum,
                        period: postPeriod,
                        update: resData.data.updateTime,
                        logo: resData.data.headPicUrl,
                    },
                }
            }
    }

}
module.exports = SongListService;