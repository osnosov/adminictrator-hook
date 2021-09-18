import fp from 'fastify-plugin'
import amqpcm from 'amqp-connection-manager'

export default fp(async server => {
  const connection = amqpcm.connect(server.config.amqpHost)

  const channel = connection.createChannel({
    json: true,
    setup: channel => channel.assertQueue(server.config.queueBot, { durable: true })
  })

  channel.waitForConnect()

  const sendToQueue = async data => {
    if (!connection.isConnected()) {
      throw new Error('AMQP server disconected -> Message not sent')
    }
    await channel.sendToQueue(server.config.queueBot, data)
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
