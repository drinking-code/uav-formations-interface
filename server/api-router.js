import express from 'express'

import http_code from './readable-error-codes.js'
import {scriptHandler} from './script-handler.js'

const router = express.Router()

const data = {
    mesh: null,
    options: null,
}

router.use(express.text({limit: '2mb'}))
router.use(express.json())

router.put('/mesh', async (req, res) => {
    data.mesh = req.body
    res.status(http_code.no_content).end()
})

router.put('/options', async (req, res) => {
    if (!req.is('application/json'))
        return res.status(http_code.bad_request).end()
    data.options = req.body
    res.status(http_code.no_content).end()
})

let cancelFormationRequestsFunctions = new Set()
router.get('/formation', async (req, res) => {
    cancelFormationRequestsFunctions.forEach(func => func())
    const cancelRequest = () => res.status(http_code.too_many_requests).end()
    cancelFormationRequestsFunctions.add(cancelRequest)

    if (!data.mesh || !data.options)
        res.status(http_code.conflict).end()

    scriptHandler(data, req, res)

    // res.status(http_code.not_implemented).end()
    cancelFormationRequestsFunctions.delete(cancelRequest)
})

export default router
