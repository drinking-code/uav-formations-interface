import path from 'path'
import fs from 'fs'
import child_process from 'child_process'

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
    console.log('scriptHandler')
    const pythonProcess = child_process.spawn(pythonBin, [pythonEntry, mesh], {cwd: pythonCwd})
    pythonProcess.stdout.on('data', data => {
        console.log('stdout: ' + data)
    })
    pythonProcess.stderr.on('data', data => {
        console.log('stderr: ' + data.toString().replace(/\n$/, ''))
    })
}
