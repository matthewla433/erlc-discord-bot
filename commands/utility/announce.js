const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('announce')
		.setDescription('Announce a message in a specific channel.')
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to send the announcement in.')
				.setRequired(true)
				.addChannelTypes(ChannelType.GuildText))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('The message to announce.')
				.setRequired(true)),
	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		const message = interaction.options.getString('message');

		try {
			await channel.send(message);
			await interaction.reply({ content: `Announcement sent in ${channel}!`, ephemeral: true });
		} catch (error) {
			console.error('Error sending announcement:', error);
			await interaction.reply({ content: 'There was an error sending the announcement.', ephemeral: true });
		}
	},
};
