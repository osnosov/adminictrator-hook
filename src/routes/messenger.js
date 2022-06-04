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

  server.post('/messenger/:hook', { schema }, async (request, reply) => {
    const {
      body,
      params: { hook },
      method,
      url
    } = request

    let bot = await server.hooks.checkHooks(hook)

    if (!bot) {
      reply.code(404).send({
        statusCode: 404,
        errorCode: 'Not Found',
        message: `Route ${method}:${url} not found`
      })
    }

    await server.amqp.sendToQueue({
      pattern: 'fromMessenger',
      data: { bot_id: bot.id, bot_hook: hook, bot_data: body }
    })

    reply.send({
      message: 'Success',
      statusCode: 200
    })
  })

  server.get('/messenger/:hook', async (request, reply) => {
    const {
      params: { hook },
      query,
      method,
      url
    } = request

    let bot = await server.hooks.checkHooks(hook)

    if (!bot) {
      reply.code(404).send({
        statusCode: 404,
        errorCode: 'Not Found',
        message: `Route ${method}:${url} not found`
      })
    }

    const mode = query['hub.mode']
    const token = query['hub.verify_token']
    const challenge = query['hub.challenge']

    // Check, is there any mode and token
    if (mode && token) {
      // Checking correct mode и token
      if (mode === 'subscribe' && token === bot.verify_token) {
        await server.amqp.sendToQueue({
          pattern: 'fromMessenger',
          data: { bot_id: bot.id, bot_hook: hook, bot_mode: mode }
        })

        // response challenge
        reply.code(200).send(challenge)
      } else {
        reply.code(403).send({
          statusCode: 403,
          errorCode: 'Forbidden',
          message: 'Forbidden'
        })
      }
    }
  })

  next()
}
