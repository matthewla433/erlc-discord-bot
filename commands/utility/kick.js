const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a user from the server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.addUserOption(option => 
			option.setName('user')
				.setDescription('The user to kick.')
				.setRequired(true))
		.addStringOption(option => 
			option.setName('reason')
				.setDescription('The reason for kicking the user.')
				.setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('user');
		const reason = interaction.options.getString('reason');
		const member = interaction.guild.members.cache.get(user.id);

		if (!member) {
			return interaction.reply({ content: 'User not found in the server.', ephemeral: true });
		}

		try {
			await member.kick(reason);
			interaction.reply({ content: `Successfully kicked ${user.tag}. Reason: ${reason}` });
		} catch (error) {
			console.error(error);
			interaction.reply({ content: 'Failed to kick the user.', ephemeral: true });
		}
	},
};
