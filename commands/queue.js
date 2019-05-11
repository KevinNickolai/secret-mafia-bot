//declare queue and dequeue command texts here,
//so that they can be changed and referenced all in
//one place
const queueCommand = 'q';
const dequeueCommand = 'dq';

//minimum, maximum, default queue argument times
//times here are in minutes
const minimumQueueTime = 20;
const defaultQueueTime = 30;
const maximumQueueTime = 180;

module.exports = {

//export the commands for queuing and dequeuing for processing of commands elsewhere
cmdQueue: queueCommand,
cmdDequeue: dequeueCommand,

/*
* function for processing confirmed queue commands
* @param {string} command The command string
* @param {array} args The arguments to the command
* @param {User} user The user that requested a queue command
* @param {Lobby} lobby The lobby the user is queuing for
*/
queue: function(command, args, user, lobby) {

	//command for queuing the player
	if(command === queueCommand){
		
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

		//Add a player to the lobby with a given time.
		//return requeued;
	}else if(command === dequeueCommand){ //<command for dequeuing the player

		const dequeued = lobby.removePlayer(user);
		
		//decide which prompt to send to the user, depending on their queue status.
		dequeued ? user.send('You\'re unqueued!') : 
				   user.send('You weren\'t even queued!');
		//return dequeued;
	}
}
}

