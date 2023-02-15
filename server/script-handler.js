import child_process from 'child_process'

import chalk from 'chalk'

import http_code from './readable-error-codes.js'
import {pythonBin, pythonCwd, pythonMainScript} from './ensure-scripts.js'
import {FormationCache} from './formation-cache.js'

const memCache = new FormationCache()

/**
 * Starts script with given mesh and options, and streams results to client
 * */
export function scriptHandler({mesh, options}, req, res) {
    // mesh is empty -> no points
    if (mesh.replace(/(end)?solid( .+)/gm, '').trim() === '')
        res.end()

    const optionsForMainScript = {
        max_amount: options.max_amount,
        min_distance: options.min_distance,
        sharpness_threshold: options.sharp_threshold,
        features_only: options.features_only,
    }

    const pythonMainProcess = child_process.spawn(pythonBin, [pythonMainScript, mesh, JSON.stringify(optionsForMainScript)], {cwd: pythonCwd})
    res.on('close', () => pythonMainProcess.kill('SIGINT'))
    req.on('close', () => pythonMainProcess.kill('SIGINT'))
    pythonMainProcess.stdout.on('data', data => {
        const points = data.toString()
        res.write(points)
        memCache.addPoint(mesh, optionsForMainScript, ...points.split("\n"))
    })
    if (process.env.NODE_ENV === 'development')
        pythonMainProcess.stderr.on('data', data => {
            console.error(
                chalk.bgRed.hex('#ddd')(' ERROR (Python script) '),
                data.toString().replace(/\n$/, '')
            )
        })

    let resolve
    const pythonProcessPromise = new Promise(res => resolve = res)
    pythonMainProcess.on('exit', (code) => {
        if (code !== 0) {
            res.status(http_code.internal_server_error)
        }
        memCache.setComplete(mesh, optionsForMainScript)
        res.end()
    })

    return pythonProcessPromise
}
