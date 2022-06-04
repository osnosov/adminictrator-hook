import fp from 'fastify-plugin'

export default fp(async server => {
  // config Redis
  const port = process.env.PORT || 3000
  const host = process.env.HOST || '0.0.0.0'
  const redisHost = process.env.REDIS_HOST || 'localhost'
  const redisPort = process.env.REDIS_PORT || 6379
  const redisPassword = process.env.REDIS_PASSWORD || 'password'
  const redisExpiretime = process.env.REDIS_EXPIRET_TIME || 120

  // config PostgeSQL
  const dbHost = process.env.DB_HOST || 'localhost'
  const dbPort = process.env.DB_PORT || 5432
  const dbDatabase = process.env.DB_DATABASE || 'postgres'
  const dbUser = process.env.DB_USER || 'postgres'
  const dbPassword = process.env.DB_PASSWORD || 'password'
  const dbSslmode = process.env.DB_SSLMODE || 'prefer'

  // config RabbitMQ
  const amqpHost = process.env.AMQP_HOST || 'amqp://admin:admin@localhost:5672'
  const fromTelegramQueueBot = process.env.FROM_TELEGRAM_QUEUE_BOT || 'fromTelegram'
  const fromMessengerQueueBot = process.env.FROM_MESSENGER_QUEUE_BOT || 'fromMessenger'
  const fromViberQueueBot = process.env.FROM_VIBER_QUEUE_BOT || 'fromViber'

  // Config Local buffer
  const localBufferSize = process.env.LOCAL_BUFFER_SIZE || 8
  const localExpiretime = process.env.LOCAL_EXPIRET_TIME || 60

  const config = {
    port,
    host,
    dbHost,
    dbPort,
    dbDatabase,
    dbUser,
    dbPassword,
    dbSslmode,
    redisPort,
    redisHost,
    redisPassword,
    redisExpiretime,
    amqpHost,
    fromTelegramQueueBot,
    fromMessengerQueueBot,
    fromViberQueueBot,
    localBufferSize,
    localExpiretime
  }

  server.decorate('config', config)
})
