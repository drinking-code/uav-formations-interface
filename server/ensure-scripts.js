import path from 'path'
import fs from 'fs'
import chalk from 'chalk'

const pythonRepo = 'https://github.com/drinking-code/uav-formations-for-volumetric-displays-from-polygon-meshes'
let providedPath = process.argv[2]
if (!providedPath) {
    console.error(`Please provide the path to \`main.py\` as an argument (from ${pythonRepo})`)
    process.exit(1)
}
if (providedPath.startsWith('~'))
    providedPath = path.join(process.env.HOME, providedPath.replace('~', ''))
export const pythonMainScript = path.resolve(providedPath)
if (!fs.existsSync(pythonMainScript)) {
    console.error(`Incorrect path to \`main.py\`:`)
    console.log(pythonMainScript)
    process.exit(1)
}

export const pythonCwd = path.dirname(pythonMainScript)
export const pythonDirectionalityScript = path.join(pythonCwd, 'illumination_directionality.py')
if (!fs.existsSync(pythonDirectionalityScript)) {
    console.warn(
        chalk.bgYellowBright.black(' WARNING '),
        `Script for directionality not found. You may have to pull the newest version of the scripts. Points will be generated without directionality data.`
    )
}

export const pythonBin = path.join(pythonCwd, 'venv', 'bin', 'python')
