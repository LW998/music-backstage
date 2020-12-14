module.exports = (app, path) => {
    const {
        router,
        controller
    } = app;
    // 批量获取播放链接
    router.get(`${path}/urls`, controller.song.playUrl)
    router.post(`${path}/urls`, controller.song.playUrl)
    // 歌词
    router.get(`${path}/lyric`, controller.song.lyric)
    router.post(`${path}/lyric`, controller.song.lyric)
    // 下载链接
    router.get(`${path}/url`, controller.song.downUrl)
    router.post(`${path}/url`, controller.song.downUrl)
}