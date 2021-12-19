module.exports = {
  command: {
    name: "dm",
    description: "Dm user set",
    options: [
      {
        type: "USER",
        name: "user",
        description: "User to dm",
        required: true
      },
      {
         type: "STRING",
         name: "message",
         description: "Message to dm user",
         required: true
      }
    ],
    default_permission: false,
  },
  permissions: [
    {
      id: "263472056753061889",
      type: "USER",
      permission: true
    },
    {
      id: "879485394100568164",
      type: "USER",
      permission: true
    }
  ],
  run: async (interaction, client) => {
    let user = interaction.options.getUser("user")
    let message =interaction.options.getString("message")

      user.send({content: message}).catch(console.log)
      interaction.reply({content: "Sent", ephemeral: true})
  }
}