module.exports = (options, app) => {
    return async function addParams(ctx, next) {
        ctx.query = {
            ...ctx.query,
            ...ctx.request.body
        }
        await next()
    }
}