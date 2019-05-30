//minimum, maximum, default queue argument times
//times here are in minutes
const minimumQueueTime = 20;
const defaultQueueTime = 30;
const maximumQueueTime = 180;

module.exports = {
	name: 'queue',
	aliases: ['q'],
	description: "Queues the user for a Mafia game for a given amount of time (in minutes).",
	usage: `<time (minimum: ${minimumQueueTime}, maximum: ${maximumQueueTime}, default: ${defaultQueueTime}>`,
	execute(message, args){

		message.delete();

		//get the lobby object from the client
		const lobby= message.client.lobbyMap.get(message.guild.id);

		console.log(lobby.lobbyChannel().id);

		const user = message.author;

		//variable to hold our queuing time
		var queueTime = defaultQueueTime;

		//determine if an argument was passed in
		if(args.length){

			//argument of time passed in
			const time = parseInt(args[0]);

			if(isNaN(time)){
				return user.send('\'' + args[0] + '\' is not a valid number.');
			}

			//times less than minimumQueueTime assume a minimumQueueTime was requested
			if(time <= minimumQueueTime){
				queueTime = minimumQueueTime;
			}else if(time >= maximumQueueTime){	//< time greater than maxQueueTime assume max time requested
				queueTime = maximumQueueTime;
			} else{ //< otherwise, time was within the minimum-maximum range and can be assigned as a queueTime
				queueTime = time;
			}
		}

		const requeued = lobby.containsPlayer(user);

		const gameStarted = lobby.addPlayer(user,queueTime);

		if(gameStarted) return;

		//decide which prompt to send to the user, based on their previous queue status.
		requeued ? user.send('Requeued for ' + queueTime + ' minutes!') : 
					user.send('Queued for ' + queueTime + ' minutes!');
	}
}


