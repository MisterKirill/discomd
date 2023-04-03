const clc = require('cli-color')
const keypress = require('keypress')

keypress(process.stdin)
const stdin = process.stdin
const stdout = process.stdout

let messages = []
let message = ''

function init() {
    stdin.on('keypress', (ch, key) => {
        if(!key) return

        if(key.ctrl && key.name == 'c') {
            process.exit(0)
        }

        if(key.name == 'space') {
            message += ' '
            return
        }
        if(key.name == 'backspace') {
            message = message.slice(0, -1)
            return
        }

        if(key.name == 'return') {
            // send message
            return
        }

        message += key.name

        reload()
    })

    reload()

    stdin.setRawMode(true)
    stdin.resume()
}

function reload() {
    console.clear()
    
    if(messages.length > (stdout.rows - 4)) {
        // clean messages
        messages = messages.slice(-Math.abs(stdout.rows - 4))
    }

    // draw messages
    stdout.cursorTo(0, stdout.rows - 4 - messages.length + 1)
    stdout.write(messages.join('\n'))

    // draw input field
    stdout.cursorTo(0, stdout.rows - 2)
    stdout.write(clc.cyan('> ') + message)
}

function appendMessage(message) {
    messages.push(message)
    reload()
}

module.exports = {
    init,
    appendMessage
}

init()

setInterval(() => {appendMessage('[LOG] Connected to Discord, enjoy 😎')}, 500)
