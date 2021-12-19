const config = require("../../config.json")
const { MessageEmbed } = require("discord.js")

module.exports = {
  name:"reset",
  run: async (message, args, client) => {
    let guild = client.guilds.resolve(config.guild)
    let db = client.db
    let roleids = Object.keys(require("../../config.json").staffRoles)
    let staffids = []

    for (i=0;i < roleids.length;i++) {
      const role = guild.roles.resolve(roleids[i])

      const members = role.members.filter(member => !member.user.bot).filter(member => member.roles.highest.id == role.id)
      members.forEach(member => staffids.push(member.id))
    }

    for (i=0;i < staffids.length;i++) {
      db.set(`quota-${staffids[i]}`,0)
    }

    const resetEmbed = new MessageEmbed()
   .setTitle("Quota's Resetted")
   .addField("Stats", `With the best work we have all sent \`${db.fetch("weekly_total")}\` messages this week.\nThat's adding up to a **total** of \`${db.fetch("total")}\` messages since December 12th 2021`)
    message.delete()
   client.channels.resolve(config.quotaChannel).send({embeds: [resetEmbed]}).then(msg => db.set(`reset-msg`, msg.id))
   db.set(`weekly_total`,0)
  }
}