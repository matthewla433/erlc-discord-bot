# ER:LC Discord Bot

## What is this?
This Discord bot has a /punish command (as well as other Discord related commands) where you can punish people in your ER:LC private server by warning them (which sends them a PM), kicking them, or banning them. Open an issue if you have a command suggestion or if there are any issues.

## Why is this useful?
For private servers that want to have a custom bot instead of using a public version.

## Installation
### Prerequisites
- A private server with the **ERLC API** server pack.
- A VPS (Virtual Private Server) or any machine with Node.js, Git installed, and a stable internet connection to host this script (e.g., Raspberry Pi or dedicated server).
- A [Discord Bot](https://discord.com/developers/applications) invited to your server with a token and the "bot" and "application.commands" scopes.

### Installation Steps
1. `git clone https://github.com/JoseMoranUrena523/erlc-discord-bot`
2. `npm install pm2 -g`
3. Make a .env file and follow this format:
```
token=YOURTOKENHERE
clientId=YOURCLIENTIDHERE
serverKey=YOURSERVERKEYHERE
```
4. `npm install`
5. `node deploy-commands.js`
6. `pm2 start index.js`

Using PM2 makes sure that the script keeps running in the background even if you close the terminal or disconnect from the server. Thank you for using this automation!

## Further Notes
If you want to disable some commands, just rename the file names from commands/utility and add the prefix .txt (or you can just delete the file).
