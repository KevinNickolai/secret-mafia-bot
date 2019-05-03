//Created from tutorial on
//https://medium.freecodecamp.org/how-to-create-a-discord-bot-under-15-minutes-fb2fd0083844

require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const client = new Discord.Client();

fs.readdir('./events/', (err, files) => {
  files.forEach(file => {
    const eventHandler = require(`./events/${file}`);
	const eventName = file.split('.')[0];
    client.on(eventName, (...args) => eventHandler(client, ...args));
  });
});

const lobbyClass = require('./classes/lobby.js');

const lobby = new lobbyClass.Lobby();

/**
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`)
})*/

client.login(process.env.BOT_TOKEN);