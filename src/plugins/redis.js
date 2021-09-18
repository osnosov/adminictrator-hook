import fp from 'fastify-plugin'
import IORedis from 'ioredis'
import fastifyRedis from 'fastify-redis'

export default fp(async server => {
  const redis = new IORedis({
    host: server.config.redisHost,
    port: server.config.redisPort,
    password: server.config.redisPassword,
    closeClient: true,
    tls: true
  })

  server.register(await fastifyRedis, {
    client: redis
  })

  redis.on('connect', () => {
    server.log.info('Connected to Redis')
  })

  redis.on('disconnect', () => {
    server.log.info('Redis disconnected')
  })

  redis.on('reconnecting', num => {
    server.log.info('Redis reconnecting with attempt #' + num)
  })

  redis.on('error', e => {
    server.log.error('Connected redis error', e)
  })

  redis.on('end', () => {
    server.log.info('Redis connected closed')
  })

  server.addHook('onClose', (server, done) => redis.disconnect(done))
})
