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
        if (!description) {
            throw new Error(`Command ${name} does not have a description`)
        }

        const commands = await this.getCommands(guildId)

        const existingCommand = commands.cache.find((cmd) => cmd.name === name)
        if (existingCommand) {
            const { description: oldDescription, options: oldOptions } = existingCommand
            if (
                description !== oldDescription ||
                JSON.stringify(options) !== JSON.stringify(oldOptions)
            ) {
                await commands.edit(existingCommand.id, { description, options })
                console.log(`Updating command ${name}`)
            }
            return 
        }

        await commands.create({
            name, description, options
        })
    }

    async delete(name, guildId) {
        const commands = await this.getCommands(guildId)

        const existingCommand = commands.cache.find((cmd) => cmd.name === name)
        if (!existingCommand) {
            return
        }

        console.log(`Deleting the ${name} slash command`)
        await existingCommand.delete()
    }
}