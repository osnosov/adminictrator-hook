export default async function (server, opts, next) {
  const params = {
    type: 'object',
    required: ['hook'],
    properties: {
      hook: {
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

  server.post('/telegram/:hook', { schema }, async (request, reply) => {
    const {
      body,
      params: { hook },
      method,
      url
    } = request

    const bot = await server.hooks.checkHooks(hook)

    if (!bot) {
      reply.code(404).send({
        statusCode: 404,
        errorCode: 'Not Found',
        message: `Route ${method}:${url} not found`
      })
    }

    await server.amqpProduce.produce(server.config.fromTelegramQueueBot, {
      pattern: 'fromTelegram',
      data: {
        // bot_id: bot.id,
        bot_hook: hook,
        bot_data: body
      }
    })

    reply.send({
      message: 'Success',
      statusCode: 200
    })
  })

  next()
}
