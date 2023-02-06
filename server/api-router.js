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

router.get('/formation', async (req, res) => {
    if (!data.mesh || !data.options)
        res.status(http_code.conflict).end()
})

export default router
