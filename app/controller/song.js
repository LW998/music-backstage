'use strict';

const Controller = require('egg').Controller;

class SongController extends Controller {
    // 播放链接请求
    async playUrl() {
        let res = await this.service.song.playUrl(this.ctx.query)
        this.ctx.body = res
    }
    // 歌词请求
    async lyric() {
        let res = await this.service.song.lyric(this.ctx.query)
        this.ctx.body = res
    }
    // 下载
    async downUrl() {
        let res = await this.service.song.downUrl(this.ctx.query)
        this.ctx.body = res
    }
}
module.exports = SongController;