/*
 * Queue and Dequeue commands, used to build a help message in the queue channel
 */
const cmdQueue = require('../commands/queue.js');
const cmdDequeue = require('../commands/dequeue.js');
const { prefix } = require('../config.js');

function Lobby() {

	this.minimumPlayers = 7;

	this.players = [];

	this.queueChannel = {};

	this.queueMessage;// = '```AMONG US Queue\n-----```';
};

/*
* Updates the lobby's currently displayed queue
*/
Lobby.prototype.updateQueueMessage = function(){
	this.queueMessage.edit(
	'```Queue: ' + this.players.length + '/' + this.minimumPlayers +
	'\n--------- \n' + 
	this.displayPlayers() +
	'```');
}

/*
* get the channel that the lobby is displayed in
* @return {Channel} the lobby's channel
*/
Lobby.prototype.lobbyChannel = function(){
	return this.queueChannel;
}

/*
* Clear the lobby of players
*/
Lobby.prototype.clear = function(){

	//clear the timers for every player in the queue
	for(i = 0; i < this.players.length; ++i){
		this.players[i].clearTimer();
	}

	//clear this.players array and reflect that in the queue message
	this.players = [];
	this.updateQueueMessage();
}

/*
* Start the game
*/
Lobby.prototype.start = function(){
	for(var i = 0; i < this.players.length; ++i){
		this.players[i].player.send("Queue is starting! Join the secret mafia voice channel to get ready.");
	}

	this.clear();
}

/*
* Add a player to the lobby queue
* @param {User} player The player we're attempting to add to the lobby
* @return {boolean} true if the queue fired from this addition, false otherwise
*/
Lobby.prototype.addPlayer = function(player,time){

		var gameStart = false;

		//checking for requeuing possibilities
		for(i = 0; i < this.players.length; ++i){
			if(this.players[i].player === player){
				this.players[i].setTimer(time);
				return gameStart;
			}
		}

		const playerTimer = new PlayerTimer(player,time,this);
		//successful, non-duplicate player addition
		this.players.push(playerTimer);

		//if we've hit the threshold of minimum players for a game, we start
		if(this.players.length >= this.minimumPlayers){
			this.start();
			gameStart = true;
		}

		//update the queue message after game start or single player addition
		this.updateQueueMessage();
		
		return gameStart;
};

/*
* Indicate if a player is already in the current lobby
* @param {User} player The player to check for lobby presence
* @return {boolean} true if player is already in the lobby, false otherwise
*/
Lobby.prototype.containsPlayer = function(player){
		for(i = 0; i < this.players.length; ++i){
			if(this.players[i].player === player){
				return true;
			}
		}
		return false;
}

/*
* Display the players currently in the lobby
* @return {string} a string containing newline separated usernames of players
*/
Lobby.prototype.displayPlayers = function(){

	var retPlayersString = "";
	for(i = 0; i < this.players.length; ++i){
		retPlayersString += this.players[i].player.username + ' \n';
	}

	return retPlayersString;
}

/**
* Attepmt to remove a player from the current lobby
* @param {Discord.User} player the player we're attempting to remove
* @param {boolean} toTime flag indicating if the player is being removed due to time
* @return {boolean} true if the player was removed successfully, false otherwise
*/
Lobby.prototype.removePlayer = function(player,toTime = false){

	//flag to indicate if the player was removed successfully
	var removed = false;

	for(var i = 0; i < this.players.length; ++i){
		if(this.players[i].player === player){
			this.players[i].clearTimer();
			this.players.splice(i,1);
			removed = true;
			break;
		}
	}

	this.updateQueueMessage();

	return removed;
}

/*
* Timeout the player from the queue
* @param {User} player The player we're removing from the queue because of time
*/
Lobby.prototype.playerTimeout = function(player){
	if(this.removePlayer(player)){
		player.send('Dequeued due to time; requeue if you\'re still available to play.');
	}
}

/*
* Get the size of the lobby
* @return {number} the number of users in the lobby currently
*/
Lobby.prototype.size = function(){
	return this.players.length;
}

/**
* Set the queue channel the lobby will use to display and take queue requests
* @param {Discord.Client} client The discord client connection that the bot interfaces with
* @param {Discord.TextChannel} channel The discord text channel the bot uses for queue related information
*/
Lobby.prototype.setQueueChannel = async function(client, channel){
	this.queueChannel = channel;

	/*
	 * Add a message to the queue channel to indicate the queue commands
	 */
	data = [];
	data.push('*');
	data.push(`**Name:** ${cmdQueue.name}`);

	if (cmdQueue.aliases) data.push(`*Aliases:* ${cmdQueue.aliases.join(', ')}`);
	if (cmdQueue.description) data.push(`*Description:* ${cmdQueue.description}`);
	if (cmdQueue.usage) data.push(`*Usage:* ${prefix}${cmdQueue.name} ${cmdQueue.usage}`);

	data.push('');

	data.push(`**Name:** ${cmdDequeue.name}`);

	if (cmdDequeue.aliases) data.push(`*Aliases:* ${cmdDequeue.aliases.join(', ')}`);
	if (cmdDequeue.description) data.push(`*Description:* ${cmdDequeue.description}`);
	if (cmdDequeue.usage) data.push(`*Usage:* ${prefix}${cmdDequeue.name} ${cmdDequeue.usage}`);

	data.push('*');

	var queueCommandMessage = await channel.send(data, { split: true });

	/*
	 * Delete all messages that aren't the queue channel list message
	 * as long as the queue channel list message doesn't exist in the list.
	 */
	do
	{
		var toDelete = await channel.fetchMessages({ limit: 100 });
		for (let [key, value] of toDelete)
		{
			if (key != '575842249536176158' && key != queueCommandMessage.id)
			{
				toDelete.get(key.toString()).delete();
			}
		}
	}
	while (toDelete.get('575842249536176158') == undefined);

	//since this is an async function, we're using await to make sure that the 
	//promise of the fetchMessage function goes through, so that this.queueMessage
	//is actually a {Message} object, and not a prmoise.
	this.queueMessage = await channel.fetchMessage('575842249536176158');

	this.updateQueueMessage();

	console.log("Lobby queue has successfully been initialized.");
}

/*
* Class that wraps a Discord User with a timer, to track
* how long the user/player has been queued for, where
* time is in minutes.
*/
class PlayerTimer{

	/*
	* PlayerTimer constructor
	* @param {User} player The player associated with the timer
	* @param {int} time The time in minutes the timer will count
	* @param {Lobby} lobby The lobby the player is being timed in
	*/
	constructor(player, time, lobby) {
		this.player = player;
		this.lobby = lobby;

		var that = lobby;
		this.timer = setTimeout(function() {
			that.playerTimeout(player);
		},time * 60 * 1000);
	}
}

/*
* Clear the timeout set for the PlayerTimer
*/
PlayerTimer.prototype.clearTimer = function(){
	clearTimeout(this.timer);
}

/*
* Set the timer of the PlayerTimer
* @param {int} time The time in minutes to set for the PlayerTimer
*/
PlayerTimer.prototype.setTimer = function(time){

	//clear previous timers if they existed.
	this.clearTimer();

	var thatLobby = this.lobby;
	var thatPlayer = this.player;
	this.timer = setTimeout(function(){
		thatLobby.playerTimeout(thatPlayer);
	},time * 60 * 1000);
}

module.exports = new Lobby();