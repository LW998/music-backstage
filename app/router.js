'use strict';
const path = require('path');
const fs = require('fs');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const {
    router,
    controller
  } = app;

  fs.readdirSync(path.join(__dirname, 'routes')).reverse().forEach(file => {
    const filename = file.replace(/\.js$/, '');
    // console.log(filename, 'filename');
    require(`./routes/${filename}`)(app, `/${filename}`);
  })
  router.get('/', controller.home.index);
};