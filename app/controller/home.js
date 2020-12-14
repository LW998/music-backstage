'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
    async index() {
        const {
            ctx
        } = this;
        ctx.body = 'hi, egg';
    }
    //   热搜关键字
    async hot() {
        let {
            raw
        } = this.ctx.query;
        let res = await this.service.home.hot(raw)
        this.ctx.body = res
    }
    // 搜索
    async search() {
        let res = await this.service.home.search(this.ctx.query)
        this.ctx.body = res
    }
    //首页轮播图
    async banner() {
        let res = await this.service.home.banner()
        this.ctx.body = res
    }
}
module.exports = HomeController;