module.exports = (app, path) => {
    const {
        router,
        controller
    } = app;
    router.post(`${path}/setCookie`, controller.user.setCookies)
}