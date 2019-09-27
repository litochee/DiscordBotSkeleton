const gen = require('./../functions/genfunctions');
module.exports = {
	name: 'help',
	description: 'List all of my commands/info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 1,
	guildOnly: false,
	admin: false,
	async execute(message, args, pool, gSet) {
		//const data = [];
		const { commands } = message.client;
		const aCommands = [];
		const uCommands = [];
		const data = [];
		if (!args.length) {
			let adminCommands = commands.filter(a => a.admin === true);
			let userCommands = commands.filter(b => b.admin === false);
			aCommands.push(adminCommands.map(c => c.name).join('\n'));
			uCommands.push(userCommands.map(d => d.name).join('\n'));
			const user = await gen.isAdmin(message, gSet)
			let embed;
			if(user === true){
				embed = await gen.helpEmbed(message.client, uCommands, aCommands);
			}else{
				embed = await gen.helpEmbedUser(message.client, uCommands);
			}
			return message.channel.send(embed)
				.then(() => {
					return;
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('it seems like I can\'t DM you!');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply('that\'s not a valid command!');
		}

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${gSet.prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);
		let hEmbed = await gen.helpCustEmbed(`${command.name}`, data);
		message.channel.send(hEmbed);
	},
};