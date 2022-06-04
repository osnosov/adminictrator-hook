import fp from 'fastify-plugin'
import amqpcm from 'amqp-connection-manager'

export default fp(async server => {
  const connection = amqpcm.connect(server.config.amqpHost)

  const channel = await connection.createChannel({
    json: false,
    setup: async channel => {
      return await Promise.all([
        channel.assertQueue(server.config.fromTelegramQueueBot, { durable: true }),
        channel.assertQueue(server.config.fromMessengerQueueBot, { durable: true }),
        channel.assertQueue(server.config.fromViberQueueBot, { durable: true })
      ])
    }
  })

  channel.waitForConnect()

  const sendToQueue = async (queue, data) => {
    if (!connection.isConnected()) {
      throw new Error('AMQP server disconected -> Message not sent')
    }
    const buffer = Buffer.from(JSON.stringify(data))
    await channel.sendToQueue(queue, buffer)
  }

  const amqp = {
    connection,
    channel,
    sendToQueue
  }

  server.decorate('amqp', amqp)

  server.addHook('onClose', () => {
    channel.close()
    connection.close()
  })

  connection.on('connect', () => server.log.info('Connected to AMQP Broker'))

  connection.on('disconnect', err => server.log.info('Disconnected from AMQP Broker!', err))
})
