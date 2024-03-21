export default (message, handler) => {
    const { content, author } = message

    /* 

    Connect to banned words database and download it 
    every time the bot is restarted. Most likely a supabase
    database.

    The punishment is a 4 letter code that is then acted on 
    based on a pre-provided table.

    A points system is used, and when a certain number of points is
    reached, then a punishment is given. When someone reaches 100 points
    they are permanently banned from the server.

    Data structure - banned word, punishment
    Supabase structure - banned word | punishment
    */
    
    // AUTOMATED FILTER, STAFF CAN STILL USE COMMANDS ON THOSE
    // WHO TRY TO GET AROUND THE SYSTEM

    const bannedWordsDatabase = ['hello', 'hi']
    
    // Not final, needs real testing to see how it works
    const fourLetterCodes = {
        phob: 5,
        raci: 5,
        rude: 3,
        holo: 20,
    }

    const sentMessage = content.toLowerCase()

    for (const word in bannedWordsDatabase) {
        if (sentMessage.includes(word)) {
            console.log("H")
            message.reply('This word is not allowed')
            message.delete()
        } else { continue }
    }
}