export default (message) => {
    if (message.content === 'ping') {
      message.reply('pong')
    }
  }
  