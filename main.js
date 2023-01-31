import open from 'open'
import express from 'express'

const app = express()

app.use(express.static('build'))

const port = process.env.PORT ?? 3000
app.listen(port, async () => {
    const url = `http://localhost:${port}`
    console.log(`Go to ${url}`)
    await open(url)
})
