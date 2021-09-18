import fp from 'fastify-plugin'

export default fp(async server => {
  const twoify = function (n) {
    if (n && !(n & (n - 1))) return n
    var p = 1
    while (p < n) p <<= 1
    return p
  }

  const size = twoify(server.config.localBufferSize || 8)

  const localCircleBuffer = Array(size)

  const setInLocalBuffer = val => {
    localCircleBuffer.shift()
    localCircleBuffer.push({ ...val, time_stamp: +new Date() })
  }

  const findInLocalBuffer = val => {
    let bot = localCircleBuffer.find(v =>
      v?.hook && v?.time_stamp
        ? v.hook === val && v.time_stamp + +server.config.localExpiretime * 1000 > +new Date()
        : false
    )

    // delete bot.time_stamp
    // const { time_stamp, ...result } = bot
    // return result

    return bot
  }

  const localBuffer = {
    setInLocalBuffer,
    findInLocalBuffer
  }

  server.decorate('localBuffer', localBuffer)
})
