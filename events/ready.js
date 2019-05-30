const LobbyClass = require('../classes/lobby.js');

module.exports = (client) => {
	
	var lobbyMap = new Map();

	//create a lobby for each server the client operates within
	client.guilds.forEach(async(guild) => {

		const newLobby = new LobbyClass();

		/*
		* Find a channel named queue and reset it, otherwise create a new queue channel.
		*/
		var queueChannel = guild.channels.find(channel => channel.name === 'queue');

		if(!queueChannel){
			queueChannel = await guild.createChannel('queue', 'text' )
			.then(function(result){
				console.log("Created queue channel on server id: " + guild.id);
				return result;
			}).catch(function(error){
				console.log("Failed to create queue channel on server id: " + guild.id);
				throw error;
			});
		}else{

			//clone the queue channel for resetting purposes
			var temp = await queueChannel.clone(undefined,true);
			
			temp.setParent(queueChannel.parent,`Reinitialize queue channel`);

			//console.log(temp);
			//console.log("QC: ******", queueChannel);
			queueChannel.delete(`Clearing queue channel`);
			queueChannel = temp;
		}

		//Set the queue channel for the new lobby.
		await newLobby.setQueueChannel(queueChannel);

		lobbyMap.set(guild.id,newLobby);
	});

	client.lobbyMap = lobbyMap;
}