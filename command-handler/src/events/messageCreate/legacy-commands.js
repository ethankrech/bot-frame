export default (message, handler) => {
  const { commandHandler } = handler
  const { prefix, commands } = commandHandler
  const { content, author } = message

  if (author.bot || !content.startsWith(prefix)) {
    return
  }

  const args = content.slice(prefix.length).split(/ +/g)
  const commandName = args.shift().toLowerCase()

  const command = commands.get(commandName)
  if (!command || !command.run) {
    return
  }

  const { guild } = message
  const { test } = command

  if (test === true && !testServers.includes(guild?.id)) {
    return
  }

  const text = args.join(' ')

  command.run({ message, text, args })
}
