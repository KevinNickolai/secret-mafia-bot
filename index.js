//Created from tutorial on
//https://medium.freecodecamp.org/how-to-create-a-discord-bot-under-15-minutes-fb2fd0083844

require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

const LobbyClass = require('./classes/lobby.js');

fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    const eventHandler = require(`./events/${file}`);
	const eventName = file.split('.')[0];

	//handle events of specific names
	if(eventName === 'message'){
		//console.log(LobbyClass);
		client.on(eventName, (...args) => eventHandler(client, ...args, LobbyClass));
	}
	else if(eventName === 'ready'){
		client.once(eventName, (...args) => LobbyClass.setQueueChannel(client, eventHandler(client, ...args)));
		//console.log(LobbyClass);
	}
	else{ //handle all other events
		client.on(eventName, (...args) => eventHandler(client, ...args));
	}
  });
});

client.login(process.env.BOT_TOKEN);