'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
  //设置cookies
  async setCookies() {
    // console.log(data, 'setCookies');
    let res = await this.service.user.setCookies(this.ctx.query)
    this.ctx.body = res
  }
}

module.exports = UserController;