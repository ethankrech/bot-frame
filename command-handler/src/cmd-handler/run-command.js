export default ({
    commandName,
    handler,
    message,
    interaction,
    guild,
    member,
    user,
    args,
    options,
}) => { 
    const { commandHandler } = handler
    const { commands } = commandHandler
  
    const command = commands.get(commandName)
    if (!command || !command.run) {
      return
    }
  
    const { test } = command
  
    if (test === true && !testServers.includes(guild?.id)) {
      return
    }
  
    const text = args.join(' ')

    const reply = (obj) => {
        if (message) {
            message.reply(obj)
        } else if (interaction) {
            interaction.reply(obj)
        }
    }
  
    command.run({ message, interaction, reply, guild, member, user, text, args, options })    
}