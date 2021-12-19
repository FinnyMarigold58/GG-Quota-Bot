const { MessageEmbed } = require("discord.js")
const config = require("./config.json")

module.exports = (client) => {
  const update = async () => {
    if (client.db.fetch(`quota_off`) === false) {
    let guild = client.guilds.resolve(config.guild)
    let roleids = Object.keys(config.staffRoles)

    let info = config.staffRoles
    let staff = {}

    for (i=0;i<roleids.length;i++) {
      const role = guild.roles.resolve(roleids[i])

      const members = role.members.filter(member => !member.user.bot).filter(member => member.roles.highest.id == role.id)
      staff[role.id] = []
      members.forEach(member => {
        staff[role.id].push(member.id)
      })
    }
    const embed = new MessageEmbed()
      .setTitle(`Quota Control`)
      .setDescription(`View below to check quotas (Updates every minute)`)
      
    for (c=0;c < Object.keys(staff).length;c++) {
      let msg = ``
      let currole = Object.keys(staff)[c]
      let roleusers = Object.values(staff)[c] || ["None"]
      for (v=0;v < roleusers.length;v++) {
        if (roleusers[v] === "None") { 
          msg += "No staff with this rank"
        } else {
          if (!client.db.fetch(`quota-${roleusers[v]}`)) await client.db.set(`quota-${roleusers[v]}`, 0)
        msg += `${client.users.resolve(roleusers[v])}: ${client.db.fetch(`quota-${roleusers[v]}`)}${client.db.fetch(`quota-${roleusers[v]}`) >= Object.values(info)[c] ? "✅" : `/${Object.values(info)[c]} ❌`}\n`
        }
      }
      embed.addField(`${client.guilds.resolve(config.guild).roles.resolve(currole).name}`,`${msg || "None"}`)
    }

    embed.setFooter(`Week's Total: ${client.db.fetch("weekly_total")} | Total: ${client.db.fetch("total")}`)
    embed.setTimestamp()

    client.channels.resolve(config.quotaChannel).messages.fetch(config.quotaMessage).then(message => message.edit({embeds: [embed]}))
  } else {
    const embed = new MessageEmbed()
      .setTitle("Quota Control")
      .setDescription('```css\n No quota this week! You have been blessed by the gods.```')
     client.channels.resolve(config.quotaChannel).messages.fetch(config.quotaMessage).then(message => message.edit({embeds: [embed]}))
  }
  }

  setInterval(update, 60000)
  update()
}