'use strict';

const Controller = require('egg').Controller;

class SongListController extends Controller {
    //获取歌单
    async list() {
        let res = await this.service.songList.list(this.ctx.query)
        this.ctx.body = res
    }
    // 获取推荐歌单详情
    async detail() {
        let res = await this.service.songList.detail(this.ctx.query)
        this.ctx.body = res
    }
    // 获取歌单排行榜
    async category() {
        let res = await this.service.songList.category(this.ctx.query)
        this.ctx.body = res
    }
    // 获取排行歌单详情
    async top() {
        let res = await this.service.songList.top(this.ctx.query)
        this.ctx.body = res
    }
};
module.exports = SongListController;