import { config } from 'dotenv'
config()

import Fastify from 'fastify'
import AutoLoad from 'fastify-autoload'
import { join } from 'desm'
import amqpProduce from './plugins/amqpProduce.js'
// import amqpConsume from './plugins/amqpConsume.js'

const server = Fastify({ logger: false })

export const app = async () => {
  await server.register(AutoLoad, { dir: join(import.meta.url, 'config') })
  // server.register(AutoLoad, { dir: join(import.meta.url, 'plugins') })
  await server.register(amqpProduce)
  // await server.register(amqpConsume)
  await server.register(AutoLoad, { dir: join(import.meta.url, 'services') })
  await server.register(AutoLoad, { dir: join(import.meta.url, 'routes') })

  // const consumeEmmitter = await server.amqpConsume.consume()
  // consumeEmmitter.on('data', (message, ack) => {
  //   console.error('consumeData', message)
  //   ack()
  // })

  server.listen(process.env.PORT || 3000, process.env.HOST || '0.0.0.0', async err => {
    if (err) {
      server.log.error(err)
      process.exit(1)
    }

    console.log(process.env.PORT || 3000, process.env.HOST || '0.0.0.0')
    if (process.env.NODE_ENV === 'development') {
      console.log(server.printRoutes())
    }
  })
}
