export default async function (server, opts, next) {
  const params = {
    type: 'object',
    required: ['botHook'],
    properties: {
      botHook: {
        type: 'string',
        format: 'uuid'
      }
    }
  }

  const schema = {
    // body,
    // querystring,
    params
    // headers
  }

  server.post('/telegram/:botHook', { schema }, async (request, reply) => {
    const {
      body,
      params: { botHook },
      method,
      url
    } = request

    let bot = await server.hooks.checkHooks(botHook)

    if (!bot) {
      reply.code(404).send({
        statusCode: 404,
        errorCode: 'Not Found',
        message: `Route ${method}:${url} not found`
      })
    }

    await server.amqp.sendToQueue({ bot: 'telegram', bot_id: bot.id, body })

    reply.send({
      message: 'Success',
      statusCode: 200
    })
  })

  next()
}
