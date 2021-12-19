module.exports = {
  command: {
    name: "set",
    description: "Set a users quota points.",
    options: [
      {
        type: "USER",
        name: "user",
        description: "User to set.",
        required: true
      },
      {
        type: "STRING",
        name: "points",
        description: "Number of points to set to",
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
    let points = interaction.options.getString("points")
let updatepoints = Number(points)
    client.db.set(`quota-${user.id}`, updatepoints)
    return interaction.reply({content: "Set, wait a minute please", ephemeral: true})
  }
}