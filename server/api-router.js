import path from 'path'
import fs from 'fs'

import express from 'express'

import http_code from './readable-error-codes.js'

const router = express.Router()

const data = {
    mesh: null,
    options: null,
}

router.use(express.text())
router.put('/mesh', async (req, res) => {
    data.mesh = req.body
    res.status(http_code.no_content).end()
})

router.put('/options', async (req, res) => {

})

const pythonRepo = 'https://github.com/drinking-code/uav-formations-for-volumetric-displays-from-polygon-meshes'
let providedPath = process.argv[2]
if (!providedPath) {
    console.error(`Please provide the path to \`main.py\` as an argument (from ${pythonRepo})`)
    process.exit(1)
}
if (providedPath.startsWith('~'))
    providedPath = path.join(process.env.HOME, providedPath.replace('~', ''))
const pythonEntry = path.resolve(providedPath)
if (!fs.existsSync(pythonEntry)) {
    console.error(`Incorrect path to \`main.py\`:`)
    console.log(pythonEntry)
    process.exit(1)
}

router.get('/formation', async (req, res) => {
    if (!data.mesh || !data.options)
        res.status(http_code.conflict).end()
})

export default router
