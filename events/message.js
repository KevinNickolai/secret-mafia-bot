//command/argument help taken from discordjs documents found here
//https://discordjs.guide/creating-your-bot/commands-with-user-input.html#basic-arguments
//https://discordjs.guide/command-handling/adding-features.html#a-dynamic-help-command
module.exports = (client, message) => {

	//the lobby we use for queuing
	const { lobby } = client;

	//prefix for commands
	const { prefix } = require('../config.js');

	//if the channel the message was sent in was the lobby channel, delete the message from the channel
	if(message.channel.id === lobby.lobbyChannel().id && !message.author.bot){
		message.delete();
	}

	//if the message isn't a command or is a message from another bot, we don't need to process it
	if(!message.content.startsWith(prefix) || message.author.bot) return;

	//user that sent the message
	const user = message.author;

	//split up the message into arguments, with whitespace as the delimiter,
	//while also removing the command prefix from the message
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	//retrieve a command that has a name or alias of commandName
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if(!command){
		//console.log("No command '" + commandName + "' exists.");
		return user.send("No command '" + commandName + "' exists.");
	}

	//Checking for arguments if a command requires arguments to be present
	if(command.args && !args.length){
		return user.send("You must provide arguments for the " + commandName + " command.");
	}

	try{
		command.execute(message,args);
	} catch(error){
		console.error("Error processing command " + commandName + ":", error);
		return user.send("Error processing command '" + commandName + "'.");
	}
}