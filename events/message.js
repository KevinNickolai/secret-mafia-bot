//command/argument help taken from discordjs documents found here
//https://discordjs.guide/creating-your-bot/commands-with-user-input.html#basic-arguments

const queue = require('../commands/queue');
const roles = require('../commands/roles');

module.exports = (client, message, lobby) => {

	//prefix for commands
	const cmdPrefix = '!';

	//if the channel the message was sent in was the lobby channel, delete the message from the channel
	if(message.channel.id === lobby.lobbyChannel().id){
		message.delete();
	}

	//if the message isn't a command or is a message from another bot, we don't need to process it
	if(!message.content.startsWith(cmdPrefix) || message.author.bot) return;

	//user that sent the message
	const user = message.author;

	//split up the message into arguments, with whitespace as the delimiter,
	//while also removing the command prefix from the message
	const args = message.content.slice(cmdPrefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	//console.log('command: ' + command);
	//console.log('arguments: ');
	//console.log(args);
	
	switch(command){
		case queue.cmdQueue:
		case queue.cmdDequeue:
			queue.onQueue(command, args, user, lobby);
			break;

		case roles.cmdRoles:
			roles.onRoles(user);
			break;

		default:
			user.send('Error: no command \'' + command + '\' found.');
	}
}