const { Client, GatewayIntentBits } = require('discord.js')
const cli = require('./cli')
const config = require('./config')

const bot = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
})

bot.on('messageCreate', (msg) => {
    cli.appendMessage(msg.guild.name + ' | #' + msg.channel.name + ' | ' + msg.author.username + ': ' + msg.content)
})

bot.on('ready', () => {
    cli.appendMessage('[LOG] Connected to Discord, enjoy 😎')
})

bot.login(config.BOT_TOKEN)