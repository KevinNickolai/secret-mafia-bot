module.exports = function asdf(){

	this.players = [];
	this.x = 5;
	this.addPlayer(player) = function(){
		if(this.containsPlayer(player)){
			return true;
		}else{
			return false;
		}
	};

	//function indicating if the player is already in the current Lobby
	//returns true if player is in lobby, false otherwise
	this.containsPlayer(player) = function(){
		for(i = 0; i < players.length; ++i){
			if(players[i] === player){
				return true;
			}
		}
		return false;
	};
};

