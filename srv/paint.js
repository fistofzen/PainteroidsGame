const loki = require('lokijs')
const db = new loki('DB')
const mediaDB = db.addCollection('Drawings')
const { Readable, PassThrough } = require('stream')

module.exports = srv => {
  srv.before('CREATE', 'Drawings', req => {
    const obj = mediaDB.insert({ media: '' })
    //req.data.id = obj.$loki
  })

  // srv.on('UPDATE', 'Drawings', (req, next) => {
  //   const url = req._.req.path
  //   if (url.includes('content')) {
  //     const id = req.data.id
  //     const obj = mediaDB.get(id)
  //     if (!obj) {
  //       req.reject(404, 'No record found for the ID')
  //       return
  //     }
  //     const stream = new PassThrough()
  //     const chunks = []
  //     stream.on('data', chunk => {
  //       chunks.push(chunk)
  //     })
  //     stream.on('end', () => {
  //       obj.media = Buffer.concat(chunks).toString('base64')
  //       mediaDB.update(obj)
  //     })
  //     req.data.content.pipe(stream)
  //   } else return next()
  // })

  // srv.on('READ', 'Drawings', (req, next) => {
  //   const url = req._.req.path
  //   if (url.includes('content')) {
  //     const id = req.data.id
  //     const mediaObj = mediaDB.get(id)
  //     if (!mediaObj) {
  //       req.reject(404, 'Media not found for the ID')
  //       return
  //     }
  //     const decodedMedia = new Buffer(
  //       mediaObj.media.split(';base64,').pop(),
  //       'base64'
  //     )
  //     return _formatResult(decodedMedia)
  //   } else return next() //> delegate to next/default handlers
  // })

  // srv.on('DELETE', 'Drawings', (req, next) => {
  //   const id = req.data.id
  //   mediaDB
  //     .chain()
  //     .find({ $loki: id })
  //     .remove()
  //   return next() //> delegate to next/default handlers
  // })

  function _formatResult (decodedMedia) {
    const readable = new Readable()
    const result = new Array()
    readable.push(decodedMedia)
    readable.push(null)
    result.push({ value: readable })
    return result
  }
}