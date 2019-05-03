function Lobby(){

	this.players = [];
	this.x = 5;
};

Lobby.prototype.addPlayer = function(player){
		if(!this.containsPlayer(player)){
			//successful, non-duplicate player addition
			this.players.push(player);
			return true;
		}else{
			
			//failure, attempted to add a player already in queue
			return false;
		}
};

//function indicating if the player is already in the current Lobby
//returns true if player is in lobby, false otherwise
Lobby.prototype.containsPlayer = function(player){
		for(i = 0; i < this.players.length; ++i){
			if(this.players[i] === player){
				return true;
			}
		}
		return false;
}

Lobby.prototype.displayPlayers = function(){
	for(i = 0; i < this.players.length; ++i){
		console.log(this.players[i]);
	}
}

module.exports = new Lobby();