import fp from 'fastify-plugin'

export default fp(async server => {
  const checkHooks = async hook => {
    // let bot = server.localBuffer.findInLocalBuffer(hook) || null
    // // console.log('local:', bot)

    // if (!bot) {
    //   const botRedis = await server.redis.get(hook)
    //   if (botRedis) {
    //     bot = JSON.parse(botRedis)
    //     server.localBuffer.setInLocalBuffer(bot)
    //   }
    //   // console.log('redis:', bot)
    // }

    // if (!bot) {
    //   const { rows } =
    //     (await server.pg.pool.query('SELECT * FROM bot WHERE hook = $1;', [hook])) || null

    //   bot = rows[0]?.hook ? rows[0] : null

    //   if (bot) {
    //     await server.redis.set(hook, JSON.stringify(bot), 'EX', server.config.redisExpiretime)
    //     server.localBuffer.setInLocalBuffer(bot)
    //   }
    //   // console.log('pg.pool:', bot)
    // }

    // return bot
    return await hook.match(
      '^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$'
    )
  }

  const hooks = {
    checkHooks
  }

  server.decorate('hooks', hooks)
})
