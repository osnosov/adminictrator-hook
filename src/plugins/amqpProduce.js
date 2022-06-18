import fp from 'fastify-plugin'
import { connect } from 'amqp-connection-manager'

export default fp(async server => {
  const connection = connect(process.env.AMQP_HOST)
  const channel = connection.createChannel({
    json: false,
    setup: async channel => {
      return await Promise.all([
        channel.assertQueue(process.env.FROM_TELEGRAM_QUEUE_BOT, { durable: true }),
        channel.assertQueue(process.env.FROM_MESSENGER_QUEUE_BOT, { durable: true }),
        channel.assertQueue(process.env.FROM_VIBER_QUEUE_BOT, { durable: true })
      ])
    }
  })

  connection.on('connect', () => server.log.info('Connected to AMQP produce'))
  connection.on('disconnect', err => server.log.error('Disconnected from AMQP produce', err))

  const produce = async (queue, data) => {
    channel
      .sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true })
      .catch(err => server.log.error('AMQP produce failed send message', err))
  }

  const amqp = {
    connection,
    channel,
    produce
  }

  server.decorate('amqpProduce', amqp)

  server.addHook('onClose', () => {
    server.log.error('AMQP produce channel and connect close')
    channel.close()
    connection.close()
  })
})
