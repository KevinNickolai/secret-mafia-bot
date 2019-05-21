//Created from tutorial on
//https://medium.freecodecamp.org/how-to-create-a-discord-bot-under-15-minutes-fb2fd0083844

const config = require('./config.js');
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//set a command for each file in the commands directory
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}

//set the client's lobby
client.lobby = require('./classes/lobby.js');

/*
* Create and initialize a database
*/
const dbWrapper = new (require('./classes/databaseWrapper.js'))(config.dbConfig);
dbWrapper.init();
client.database = dbWrapper;

/*
* Set event handlers for all possible client events
*/
fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    const eventHandler = require(`./events/${file}`);
	const eventName = file.split('.')[0];

	// Handle the ready event only one time
	if(eventName === 'ready'){
		client.once(eventName, (...args) => eventHandler(client, ...args));
	}
	else{ //< handle all other events
		client.on(eventName, (...args) => eventHandler(client, ...args));
	}
  });
});

client.login(config.botToken);