import {v4 as uuid} from 'uuid'

import http_code from './readable-error-codes.js'
import {pythonDirectionalityScript, pythonMainScript} from './ensure-scripts.js'
import {FormationCache} from './formation-cache.js'
import {killWhenConnectionClosed, logErrorInDevMode, startPython} from './subprocess-helpers.js'

const memCache = new FormationCache()

function filterNonNumeric(string) {
    return string.split(' ').filter(value => !isNaN(Number(value))).join(' ')
}

/**
 * Starts script with given mesh and options, and streams results to client
 * */
export function scriptHandler({mesh, options}, req, res) {
    let resolve
    const pythonProcessPromise = new Promise(res => resolve = res)
    const points = new Map()

    // mesh is empty -> no points
    if (mesh.replace(/(end)?solid( .+)/gm, '').trim() === '')
        return res.end()

    const optionsForMainScript = {
        max_amount: options.max_amount,
        min_distance: options.min_distance,
        sharpness_threshold: options.sharp_threshold,
        features_only: options.features_only,
    }

    const optionsForDirectionalityScript = {
        bleed: options.illumination_directionality_bleed,
    }

    /*if (memCache.has(mesh, optionsForMainScript) && memCache.isComplete(mesh, optionsForMainScript)) {
        res.write(
            memCache.getResult(mesh, optionsForMainScript).map(point =>
                filterNonNumeric(point)
            ).join("\n")
        )
        res.end()
        return
    }*/

    let lastPointSent = null, mainDone = false

    const directionalityOkay = () => {
        memCache.setComplete(mesh, {...optionsForMainScript, ...optionsForDirectionalityScript})
        res.end()
        resolve()
    }
    const pythonDirectionalityProcess = pythonDirectionalityScript ? startPython([pythonDirectionalityScript, mesh, JSON.stringify(optionsForDirectionalityScript)],
        pointsString => {
            const pointsArray = pointsString.split("\n").filter(value => value.trim() !== '')
            let arrayContainsLastPointSent = false
            for (const pointData of pointsArray) {
                const pointArray = pointData.split(' ')
                const id = pointArray.shift()
                const pointPosition = points.get(id)
                const pointPositionNumbersOnly = filterNonNumeric(pointPosition)
                const positionAndDirectionality = [pointPositionNumbersOnly, ...pointArray].join(' ')
                res.write(positionAndDirectionality)
                res.write("\n")
                memCache.addPoint(mesh, {...optionsForMainScript, ...optionsForDirectionalityScript}, positionAndDirectionality)
                arrayContainsLastPointSent = arrayContainsLastPointSent || id === lastPointSent
            }
            if (arrayContainsLastPointSent && mainDone)
                directionalityOkay()
        },
        error => logErrorInDevMode(error, 'directionality python script'),
        code => {
            if (code !== 0) res.status(http_code.internal_server_error)
            directionalityOkay()
        }
    ) : null
    if (pythonDirectionalityProcess)
        killWhenConnectionClosed(pythonDirectionalityProcess, req, res)

    const pythonMainProcess = startPython([pythonMainScript, mesh, JSON.stringify(optionsForMainScript)],
        pointsString => {
            const pointsArray = pointsString.split("\n").filter(value => value.trim() !== '')
            for (const pointData of pointsArray) {
                const id = uuid()
                points.set(id, pointData)
                if (pythonDirectionalityProcess) {
                    pythonDirectionalityProcess.stdin.write([id, pointData].join(' '))
                    pythonDirectionalityProcess.stdin.write("\n")
                } else {
                    res.write(filterNonNumeric(pointData))
                    res.write("\n")
                }
                lastPointSent = id
            }
            memCache.addPoint(mesh, optionsForMainScript, ...pointsArray)
        },
        error => logErrorInDevMode(error, 'main python script'),
        code => {
            if (code !== 0) res.status(http_code.internal_server_error)
            memCache.setComplete(mesh, optionsForMainScript)
            mainDone = true
            setTimeout(() => pythonDirectionalityProcess?.kill('SIGINT'), 500)
            if (!pythonDirectionalityProcess) {
                res.end()
                resolve()
            }
        }
    )
    killWhenConnectionClosed(pythonMainProcess, req, res)

    return pythonProcessPromise
}
