require('dotenv').config();

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('punish')
		.setDescription('Punish a Roblox user in the private server.')
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
		.addSubcommand(subcommand =>
			subcommand
				.setName('warn')
				.setDescription('Warn a Roblox user.')
				.addStringOption(option =>
					option.setName('username')
						.setDescription('Roblox username to warn.')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('reason')
						.setDescription('Reason for warning.')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('kick')
				.setDescription('Kick a Roblox user.')
				.addStringOption(option =>
					option.setName('username')
						.setDescription('Roblox username to kick.')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('reason')
						.setDescription('Reason for kicking.')
						.setRequired(true)))
		.addSubcommand(subcommand =>
			subcommand
				.setName('ban')
				.setDescription('Ban a Roblox user.')
				.addStringOption(option =>
					option.setName('username')
						.setDescription('Roblox username to ban.')
						.setRequired(true))
				.addStringOption(option =>
					option.setName('reason')
						.setDescription('Reason for banning.')
						.setRequired(true))),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		const username = interaction.options.getString('username');
		const reason = interaction.options.getString('reason');

		const pastTenseMap = {
			warn: 'warned',
			kick: 'kicked',
			ban: 'banned'
		};

		await interaction.reply("Loading...");

		try {
			const robloxId = await getRobloxIdFromUsername(username);

			let command;
			if (subcommand === 'warn') {
				command = `:pm ${username} You are receiving a warning for: ${reason}.`;
			} else if (subcommand === 'kick') {
				command = `:kick ${robloxId} ${reason}`;
			} else if (subcommand === 'ban') {
				command = `:ban ${robloxId}`;
			}

			await sendPunishmentCommand(command);
			await interaction.editReply(`**${username}** has been ${pastTenseMap[subcommand]} successfully for: ${reason}`);
		} catch (error) {
			await interaction.editReply(`Error: ${error.message}`);
		}
	},
};

async function getRobloxIdFromUsername(username) {
	try {
		const response = await fetch('https://users.roblox.com/v1/usernames/users', {
			method: 'post',
			body: JSON.stringify({
				"usernames": [username],
				"excludeBannedUsers": true
			}),
			headers: { 'Content-Type': 'application/json' },
		});

		if (response.status !== 200) {
			throw new Error('Failed to fetch Roblox ID.');
		}

		const data = await response.json();
		if (data.data.length === 0) {
			throw new Error('That Roblox user does not exist.');
		}

		return data.data[0].id;
	} catch (error) {
		console.error('Error fetching Roblox ID:', error);
		throw error;
	}
}

async function sendPunishmentCommand(command) {
	try {
		const response = await fetch('https://api.policeroleplay.community/v1/server/command', {
			method: 'post',
			body: JSON.stringify({ "command": command }),
			headers: { 
				'Server-Key': process.env.serverKey,
				'Content-Type': 'application/json'
			},
		});

		if (response.status === 422) {
			await interaction.editReply("Private server is shut down (there are no players), unable to complete punishment.");
		}
		if (response.status === 400) {
			const retryAfter = parseInt(response.headers.get('Retry-After'), 10) * 1000;
			console.log(`Rate limit exceeded. Waiting for ${retryAfter} ms before retrying.`);
			await new Promise(resolve => setTimeout(resolve, retryAfter));

			const retryResponse = await fetch('https://api.policeroleplay.community/v1/server/command', {
				method: 'post',
				body: JSON.stringify({ "command": command }),
				headers: { 
					'Server-Key': process.env.serverKey,
					'Content-Type': 'application/json'
				},
			});
			if (!retryResponse.ok) {
				const errorBody = await retryResponse.json();
				throw new Error(`Failed to execute punishment command after retry: ${errorBody.message}`);
			}
		} else if (!response.ok) {
			const errorBody = await response.json();
			throw new Error(`Failed to execute punishment command: ${errorBody.message}`);
		}
	} catch (error) {
		console.error('Error sending punishment command:', error);
		throw error;
	}
}
