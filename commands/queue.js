module.exports = (message, lobby) => {

	//the user that sent the message is the one trying to queue or dequeue
	const user = message.author;

	//command for queuing the player
	if(message.content === "!q"){
		return lobby.addPlayer(user);
	}else if(message.content === "!dq"){ //<command for dequeuing the player
		return lobby.removePlayer(user);
	}
}