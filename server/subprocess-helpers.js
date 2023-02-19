import child_process from 'child_process'

import chalk from 'chalk'

import {pythonBin, pythonCwd} from './ensure-scripts.js'

/**
 * @param {string[]} args
 * @param {(data: string) => void} onStdOut
 * @param {(data: string) => void} onStdErr
 * @param {(code: number) => void} onClose
 * */
export function startPython(args, onStdOut = () => 0, onStdErr = () => 0, onClose = () => 0) {
    const process = child_process.spawn(pythonBin, args, {cwd: pythonCwd})
    process.stdout.on('data', data => onStdOut(data.toString()))
    process.stderr.on('data', data => onStdErr(data.toString()))
    process.on('exit', onClose)
    return process
}

export function killWhenConnectionClosed(process, req, res) {
    res.on('close', () => process.kill('SIGINT'))
    req.on('close', () => process.kill('SIGINT'))
}

export function logErrorInDevMode(error, key) {
    if (process.env.NODE_ENV !== 'development') return
    let tag = ' ERROR '
    if (key)
        tag += `(${key.trim()}) `
    console.error(chalk.bgRed.hex('#ddd')(tag), error.replace(/\n$/, ''))
}
