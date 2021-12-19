const Discord = require("discord.js")
const prefix = process.env.PREFIX
const { staffRoles, allowedChannels } = require("../config.json")

module.exports = (client) => {
    client.on("messageCreate", async (message) => {
        if (!client.db.fetch(`quota_off`)) {
        if (message.member.roles.cache.has("893798847690715136") && allowedChannels.includes(message.channel.id)) {
          client.db.add(`quota-${message.author.id}`,1)
          client.db.add(`total`,1)
          client.db.add(`weekly_total`, 1)
        }
        }

        if (message.author.bot) return
        if (!message.content.startsWith(prefix)) return
        const args = message.content.slice(prefix.length).split(/ +/)
        const commandName = args.shift().toLowerCase()
        const command = client.commands.get(commandName) || client.commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName))
        if (!command) return

        if (!client.botAdmin(message.author.id)) return
        
        await command.run(message, args, client)?.catch((error) => {
          console.error(error)
          message.channel.send(`An error occured when trying to execute this command. The developers have been notified.`)
        })
    })
}