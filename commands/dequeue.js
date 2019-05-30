module.exports = {
	name: 'dequeue',
	aliases: ['dq'],
	description: "Dequeues the user from the Mafia queue.",
	execute(message,args){
		const user = message.author;

		const lobby= message.client.lobbyMap.get(message.guild.id);

		console.log(message.guild.id);
		
		const dequeued = lobby.removePlayer(user);
		
		//decide which prompt to send to the user, depending on their queue status.
		dequeued ? user.send('You\'re unqueued!') : 
				   user.send('You weren\'t even queued!');
	}
}