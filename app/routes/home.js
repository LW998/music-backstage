module.exports = (app, path) => {
    const {
        router,
        controller
    } = app;
    // 热搜关键字
    router.get(`${path}/hot`, controller.home.hot)
    router.post(`${path}/hot`, controller.home.hot)
    // 搜索
    router.get(`${path}/search`, controller.home.search)
    router.post(`${path}/search`, controller.home.search)
    // 轮播图
    router.get(`${path}/banner`, controller.home.banner)
    router.post(`${path}/banner`, controller.home.banner)
}