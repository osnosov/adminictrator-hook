import fp from 'fastify-plugin'
import pg from 'pg'

export default fp(async server => {
  const config = {
    user: server.config.dbUser,
    host: server.config.dbHost,
    database: server.config.dbDatabase,
    password: server.config.dbPassword,
    port: server.config.dbPort,
    sslmode: server.config.dbSslmode,
    // ssl: {
    //   rejectUnauthorized: false
    // },
    min: 2,
    max: 3
  }

  const pool = new pg.Pool(config)

  const db = {
    pool
  }

  server.decorate('pg', db)

  pool.on('error', err => {
    server.log.error('Pg pool error: Unexpected error on idle client', err)
    process.exit(-1)
  })

  pool.on('connect', () => {
    server.log.info('Connected to PostgreSQL')
  })

  server.addHook('onClose', (server, done) => pool.end(done))
})
