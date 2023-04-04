const { Client, GatewayIntentBits, Partials, DiscordAPIError } = require('discord.js')
const clc = require('cli-color')
const cli = require('./cli')
const config = require('./config')

let channel
let header
let isDM = false

const bot = new Client({
    partials: [
        Partials.Channel,
        Partials.Message
    ],
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageTyping
    ]
})

bot.on('messageCreate', msg => {
    if(msg.channelId == channel.id) {
        if(msg.author.id == bot.user.id) {
            cli.appendMessage(clc.yellow(msg.author.username + ': ' + msg.content))
        } else {
            cli.appendMessage(msg.author.username + ': ' + msg.content)
        }
    }
})

bot.on('ready', async () => {
    channel = bot.channels.cache.get(config.TARGET_ID)

    if(!channel) {
        console.log('Seems like this channel isn\'t in a server, let\'s try DM\'s...')
        try {
            channel = await (await bot.users.fetch(config.TARGET_ID)).createDM()
        } catch(err) {
            if(err.code == 10013) {
                console.log('Channel not found :(')
                process.exit(0)
            }
        }

        isDM = true
    }

    if(isDM)
        header = channel.recipient.username
    else
        header = channel.guild.name + ' | #' + channel.name


    cli.init(header)
    cli.appendMessage(clc.green('[LOG] Connected to Discord, enjoy your chat 😎'))

    cli.ee.on('send', msg => {
        channel.send(msg)
    })
})

bot.login(config.BOT_TOKEN)