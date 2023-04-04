const clc = require('cli-color')
const { EventEmitter } = require('events')
const readline = require('readline')

readline.emitKeypressEvents(process.stdin)
const { stdin, stdout } = process

let messages = []
let message = ''
let header = ''

const ee = new EventEmitter()

function init(headerText) {
    header = clc.blue(headerText)

    stdin.on('keypress', async (ch, key) => {
        if(!key) return

        if(key.ctrl && key.name == 'c') {
            appendMessage(clc.green('[LOG] Have a good day!'))
            process.exit(0)
        }

        if(key.name == 'return') {
            ee.emit('send', message)
            message = ''
        } else if(key.name == 'backspace') {
            message = message.slice(0, -1)
        } else if(key.name == 'space') {
            message += ' '
        } else {
            if(ch) message += ch
            else return
        }

        reload()
    })

    reload()

    stdin.setRawMode(true)
    stdin.resume()
    stdin.setEncoding('utf8')
}

function reload() {
    console.clear()
    
    if(messages.length > (stdout.rows - 5)) {
        // clean messages
        messages = messages.slice(-Math.abs(stdout.rows - 5))
    }

    // draw header
    stdout.cursorTo(0, 0)
    stdout.write(header)

    // draw messages
    stdout.cursorTo(0, stdout.rows - 4 - messages.length + 1)
    stdout.write(messages.join('\n'))

    // draw input field
    stdout.cursorTo(0, stdout.rows - 2)
    stdout.write(clc.cyan('> ') + message.replace('\n', ''))
}

function appendMessage(message) {
    messages.push(message.replace('\n', ''))
    reload()
}

module.exports = {
    init,
    appendMessage,
    ee
}

// init('CenterDash | #главный')
