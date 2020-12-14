module.exports = (app, path) => {
    const {
        router,
        controller
    } = app;
    // 推荐歌单列表
    router.get(`${path}/list`, controller.songList.list)
    router.post(`${path}/list`, controller.songList.list)
    // 推荐歌单详情
    router.get(`${path}/detail`, controller.songList.detail)
    router.post(`${path}/detail`, controller.songList.detail)
    // 排行歌单列表
    router.get(`${path}/category`, controller.songList.category)
    router.post(`${path}/category`, controller.songList.category)
    // 排行歌单详情
    router.get(`${path}/top`, controller.songList.top)
    router.post(`${path}/top`, controller.songList.top)
}