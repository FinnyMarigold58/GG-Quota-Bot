module.exports = {
  name: "lock",
  run: async (message, args, client) => {
    let locked = client.db.fetch(`quota_off`)
    if (locked) {
      client.db.set(`quota_off`, false)
      message.reply("They'll hate you for this one now...")
    } else {
      client.db.set(`quota_off`, true)
      message.reply("Ahwwwww. You shared some love...")
    }
  }
}