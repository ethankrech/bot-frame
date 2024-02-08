export default class SlashCommands {
    constructor(client) {
        this._client = client
    }

    get client() {
        return this._client
    }

    async getCommands(guildId) {
        let commands
        
        if (guildId) {
            const guild = await this.client.guilds.fetch(guildId)
            commands = guild.commands
        } else {
            commands = this.client.application.commands
        }

        await commands.fetch()
        return commands
    }

    async create(name, description, options = [], guildId) {
        const commands = await this.getCommands(guildId)

        const exists = commands.cache.find((cmd) => cmd.name === name)
        if (exists) {
            // Update existing command here
            console.log(`Ignoring command ${name} because it already exists`)
            return 
        }

        await commands.create({
            name, description, options
        })
    }
}