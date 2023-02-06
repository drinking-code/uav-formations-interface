import path from 'path'
import fs from 'fs'
import http2 from 'http2'

import open from 'open'
import express from 'express'
import mime from 'mime'

import apiRouter from './server/api-router.js'

const app = express()

const publicDir = 'build'

app.get('*.(js|css)', async (req, res, next) => {
    if (!fs.existsSync(path.join(publicDir, req.url) + '.gz'))
        return next()

    const mimeType = mime.getType(path.extname(req.url).substring(1))
    req.url = req.url + '.gz'
    res.set('Content-Encoding', 'gzip')
    res.set('Content-Type', mimeType)

    next()
})

app.use(express.static(publicDir))
app.use(apiRouter)

const port = process.env.PORT ?? 3000
app.listen(port, async () => {
    const url = `http://localhost:${port}`
    console.log(`Go to ${url}`)
    await open(url)
})
