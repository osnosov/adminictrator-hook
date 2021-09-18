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

  server.post('/viber/:botHook', { schema }, async (request, reply) => {
    const {
      headers,
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

    const signature = headers['x-viber-content-signature']

    await server.amqp.sendToQueue({ bot: 'viber', bot_id: bot.id, signature, body })

    return {
      message: 'Success',
      statusCode: 200
    }
  })

  next()
}
