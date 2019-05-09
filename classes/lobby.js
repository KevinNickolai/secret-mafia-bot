function Lobby(){

	this.minimumPlayers = 9;

	this.players = [];

	this.queueChannel = {};

	this.queueMessage;// = '```Queue \n-----```';
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

	//clear this.players array and reflect that in the queue message
	this.players = [];
	this.updateQueueMessage();
}

/*
* Start the game
*/
Lobby.prototype.start = function(){
	for(var i = 0; i < this.players.length; ++i){
		this.players[i].send("Game started");
	}

	this.clear();			
}

/*
* Add a player to the lobby queue
* @param {User} player The player we're attempting to add to the lobby
* @return {boolean} true if successfully added player to queue, false otherwise
*/
Lobby.prototype.addPlayer = function(player){

		//checking that the player isn't already in the lobby
		if(!this.containsPlayer(player)){

			//successful, non-duplicate player addition
			this.players.push(player);
			player.send("Queued!");

			//if we've hit the threshold of minimum players for a game, we start
			if(this.players.length >= this.minimumPlayers){
				this.start();
			}

			//update the queue message after game start or single player addition
			this.updateQueueMessage();
			return true;
		}
		//failure, attempted to add a player already in queue
		return false;
};

/*
* Indicate if a player is already in the current lobby
* @param {User} player The player to check for lobby presence
* @return {boolean} true if player is already in the lobby, false otherwise
*/
Lobby.prototype.containsPlayer = function(player){
		for(i = 0; i < this.players.length; ++i){
			if(this.players[i] === player){
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
		retPlayersString += this.players[i].username + ' \n';
	}

	return retPlayersString;
}

/*
* Attepmt to remove a player from the current lobby
* @param {User} the player we're attempting to remove
* @return {boolean} true if the player was removed successfully, false otherwise
*/
Lobby.prototype.removePlayer = function(player){

	var ret = false;
	for(var i = 0; i < this.players.length; ++i){
		if(this.players[i] === player){
			player.send('You\'re unqueued!');
			this.players.splice(i,1);
			ret = true;
		}
	}

	if(!ret){
		player.send('You\'re not even queued!');
	}

	this.updateQueueMessage();

	return ret;
}

/*
* Get the size of the lobby
* @return {number} the number of users in the lobby currently
*/
Lobby.prototype.size = function(){
	return this.players.length;
}

/*
* Get the minimum number of players for a lobby to start
* @return {number} number of players required for lobby start
*/
Lobby.prototype.minPlayers = function(){
	return this.minimumPlayers;
}

/*
* Set the queue channel the lobby will use to display and take queue requests
* @param {Client} client The discord client connection that the bot interfaces with
* @param {Channel} channel The discord text channel the bot uses for queue related information
*/
Lobby.prototype.setQueueChannel = async function(client, channel){
	this.queueChannel = channel;

	//since this is an async function, we're using await to make sure that the 
	//promise of the fetchMessage function goes through, so that this.queueMessage
	//is actually a {Message} object, and not a prmoise.
	this.queueMessage = await channel.fetchMessage('575842249536176158');

	this.updateQueueMessage();

	console.log("queue ready");
}

module.exports = new Lobby();