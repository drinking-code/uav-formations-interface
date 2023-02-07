import path from 'path'
import fs from 'fs'
import child_process from 'child_process'

import http_code from './readable-error-codes.js'

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

const pythonCwd = path.dirname(pythonEntry)

const pythonBin = path.join(pythonCwd, 'venv', 'bin', 'python')

/**
 * Starts script with given mesh and options, and streams results to client
 * */
export function scriptHandler({mesh, options}, res) {
    // mesh is empty -> no points
    if (mesh.replace(/(end)?solid( .+)/gm, '').trim() === '')
        res.end()

    const pythonProcess = child_process.spawn(pythonBin, [pythonEntry, mesh], {cwd: pythonCwd})
    pythonProcess.stdout.on('data', data => {
        const points = data.toString()
        res.write(points)
    })
    pythonProcess.stderr.on('data', data => {
        console.log('stderr: ' + data.toString().replace(/\n$/, ''))
    })

    let resolve
    const pythonProcessPromise = new Promise(res => resolve = res)
    pythonProcess.on('exit', (code) => {
        if (code !== 0) {
            res.status(http_code.internal_server_error)
        }
        res.end()
    })

    return pythonProcessPromise
}
