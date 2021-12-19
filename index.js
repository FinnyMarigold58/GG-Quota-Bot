console.log("Booting...")
require("dotenv").config()
const config = require("./config.json")

const fs = require("fs")

const { keep_alive } = require("./keep_alive");
const db = require("quick.db")
const Discord = require("discord.js")
const client = new Discord.Client({ intents: ["GUILDS","GUILD_MEMBERS","GUILD_BANS","GUILD_EMOJIS_AND_STICKERS","GUILD_INTEGRATIONS","GUILD_WEBHOOKS","GUILD_INVITES","GUILD_VOICE_STATES","GUILD_PRESENCES","GUILD_MESSAGES","GUILD_MESSAGE_REACTIONS","GUILD_MESSAGE_TYPING","DIRECT_MESSAGES","DIRECT_MESSAGE_REACTIONS","DIRECT_MESSAGE_TYPING"]})
client.db = db

client.commands = new Discord.Collection()
fs.readdir("./commands/", (err, files) => {
    files.forEach((file) => {
        let path = `./commands/${file}`
        fs.readdir(path, (err, files) => {
            if (err) console.error(err)
            let jsfile = files.filter((f) => f.split(".").pop() === "js")
            if (jsfile.length <= 0) {
                console.error(`Couldn't find commands in the ${file} category.`)
                return
            }
            jsfile.forEach((f, i) => {
                let props = require(`./commands/${file}/${f}`)
                props.category = file
                try {
                    client.commands.set(props.name, props)
                    if (props.aliases) props.aliases.forEach((alias) => client.commands.set(alias, props))
                } catch (err) {
                    if (err) console.error(err)
                }
            })
        })
    })
})
client.slashCommands = new Discord.Collection()
fs.readdir("./slashCommands/", (err, files) => {
    files.forEach((file) => {
        let path = `./slashCommands/${file}`
        fs.readdir(path, (err, files) => {
            if (err) console.error(err)
            let jsfile = files.filter((f) => f.split(".").pop() === "js")
            if (jsfile.length <= 0) {
                console.error(`Couldn't find slash commands in the ${file} category.`)
            }
            jsfile.forEach((f, i) => {
                let props = require(`./slashCommands/${file}/${f}`)
                props.category = file
                try {
                    client.slashCommands.set(props.command.name, props)
                } catch (err) {
                    if (err) console.error(err)
                }
            })
        })
    })
})

const eventFiles = fs.readdirSync("./events").filter((file) => file.endsWith(".js"))
for (const file of eventFiles) {
    require(`./events/${file}`)(client)
}

client.botAdmin = (id) => {
    if (["263472056753061889","606022064792535070","879485394100568164", "775676708509581335"].includes(id)) return true
    return false
}

client.on("ready", async() => {
    console.log("Connected!")
    client.user.setActivity(`Quota Bot`)
 let msg = await client.channels.resolve(config.quotaChannel).messages.fetch(config.quotaMessage)
    client.quotacheck = require("./quotaCheck.js")(client)

})

//client.on("debug", console.log)

client.login(process.env.TOKEN)

client.on("error", (err) => console.error(err))

module.exports = { client }