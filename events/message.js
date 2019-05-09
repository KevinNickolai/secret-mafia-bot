const queue = require('../commands/queue')

module.exports = (client, message, lobby) => {

	//console.log(message);
	//console.log(lobby);

	//if the channel the message was sent in was the lobby channel, delete the message from the channel
	if(message.channel.id === lobby.lobbyChannel().id){
		message.delete();
	}

	//queueing messages
	if(message.content === '!q' || message.content === '!dq'){
		return queue(message,lobby);
	}
}