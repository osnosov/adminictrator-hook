import fp from 'fastify-plugin'
import { connect } from 'amqp-connection-manager'
import EventEmitter from 'events'

export default fp(async server => {
  const connection = connect(process.env.AMQP_HOST)
  connection.on('connect', () => server.log.info('Connected to AMQP consume'))
  connection.on('disconnect', err => server.log.error('Disconnected from AMQP consume', err))

  const channel = connection.createChannel({
    json: false,
    setup: async channel => {
      return await Promise.all([
        channel.assertQueue(process.env.FROM_TELEGRAM_QUEUE_BOT, { durable: true }),
        channel.prefetch(1)
      ])
    }
  })

  const consume = async () => {
    const consumeEmitter = new EventEmitter()
    channel.consume('fromTelegram', message => {
      consumeEmitter.emit('data', message.content.toString(), () => {
        channel.ack(message)
      })
    })
    return consumeEmitter
  }

  const amqp = {
    connection,
    channel,
    consume
  }

  server.decorate('amqpConsume', amqp)

  server.addHook('onClose', () => {
    server.log.error('AMQP consume channel and connect close')
    channel.close()
    connect.close()
  })
})
