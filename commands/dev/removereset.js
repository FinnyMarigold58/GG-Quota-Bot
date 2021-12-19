const config = require("../../config.json")

module.exports = {
  name: "removereset",
  aliases: ["removestats","removeresetmessage"],
  run: async (message, args, client) => {
    const msg = client.channels.resolve(config.quotaChannel).messages.resolve(client.db.fetch(`reset-msg`))
    await msg?.delete().catch(console.log)
    client.db.delete(`reset-msg`)
    message.delete().catch(console.log)
  }
}