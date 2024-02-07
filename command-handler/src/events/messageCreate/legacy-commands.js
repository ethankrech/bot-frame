export default (message, handler) => {
    const { commandHandler } = handler
    const { prefix, commands } = commandHandler
    const { content, author } = message
    console.log("H")
  
    if (author.bot || !content.startsWith(prefix)) {
      return
    }
  
    const args = content.slice(prefix.length).split(/ +/g)
    const commandName = args.shift().toLowerCase()
  
    const command = commands.get(commandName)
    if (!command || !command.run) {
      return
    }
  
    command.run({ message })
  }
  