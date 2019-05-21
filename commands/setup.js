const addArg = "add";
const removeArg = "remove";
const randomArgs = ["random", "r"];

const minimumSetupPlayers = 8;

module.exports = {
	name: 'setup',
	description: 'Gives random setups from a list of previously selected setups.',
	aliases: ['mode', 'gamemode'],
	usage: `<${addArg}>   <setupCode>   <playerNumber> | Add a setup for a specific number of players
					<${removeArg}>   <setupCode> | Remove a setup with a given code from the random list
					<${randomArgs.join("/")}> <playerNumber> | Get a random setup from the list`,
	args: true,
	execute(message,args){

		const { database } = message.client;

		const firstArg = args.shift().toLowerCase();

		//TODO: Polish this if-else chain to be a series of subcommands
		//for !setup; make the first argument handling modular, so each
		//possible first argument can use the same call structure

		//add a setup
		if(firstArg === addArg){
			var setupCode;
			var playerNumber;

			if(!args.length){
				return message.author.send("No setup code was given to add to the list.");
			}

			setupCode = args.shift().toLowerCase();

			if(!args.length){
				return message.author.send("You must set the number of players this setup uses.");
			}

			playerNumber = parseInt(args.shift());

			if(isNaN(playerNumber)){
				return message.author.send("You must give a valid number of players for the setup.");
			} else if(playerNumber < minimumSetupPlayers){
				return message.author.send(`Minimum number of players for random setups is ${minimumSetupPlayers}.`)
			}

			var sql = `INSERT INTO ${database.setupTableName} (setupCode, playerNumber) 
			VALUES ( '${setupCode}', ${playerNumber} );`;

			database.query(sql)
			.then(function(result){
				console.log(`User ${message.author.tag} Added setup ${setupCode} for ${playerNumber} players.`);
				return message.author.send(`Added setup ${setupCode} for ${playerNumber} players.`);
			})
			.catch(function(error){
				console.log(error);
			});
		} else if(firstArg === removeArg){ //< remove a setup
			
			if(!args.length){
				return message.author.send("No setup code was given to remove from the list.");
			}
			var setupCode = args.shift();

			var sql = `DELETE FROM ${database.setupTableName} WHERE setupCode = '${setupCode}';`;

			database.query(sql)
			.then(function(result){
				console.log(`User ${message.author.tag} Removed setup ${setupCode} from random setup selection.`);
				return message.author.send(`Removed setup ${setupCode} from random setup selection.`);
			}).catch(function(error){
				console.log(error);
			});
		} else if(randomArgs.includes(firstArg)){ //< random a setup
			
			var sql;
			var playerNumber;
			if(!args.length){

				//select a random setup of any player number from the setups table
				sql = `SELECT * FROM ${database.setupTableName}
				ORDER BY RAND()
				LIMIT 1;`;

			}else{
				
				playerNumber = args.shift();

				if(isNaN(playerNumber)){
					return message.author.send("You must request a valid number of players for the setup.");
				} else if(playerNumber < minimumSetupPlayers){
					return message.author.send(`Minimum number of players for random setups is ${minimumSetupPlayers}.`)
				}

				//select a random setup with a given player number.
				sql = `SELECT * FROM ${database.setupTableName}
				WHERE playerNumber = ${playerNumber}
				ORDER BY RAND()
				LIMIT 1;`;

			}

			database.query(sql)
			.then(function(result){

				if(!result.length){
					if(playerNumber){
						return message.author.send(`No setups found in random rotation for ${playerNumber} players.`);
					} else{
						return message.author.send("No setups found in random rotation for any number of players.");
					}
				}

				const selectedSetup = result[0];

				//console.log(result);
				return message.author.send(`Setup for ${selectedSetup.playerNumber} players:   ${selectedSetup.setupCode}`);
			}).catch(function(error){
				if(error.code === 'ER_DUP_ENTRY'){
					return message.author.send(`Setup ${setupCode} already exists in the random rotation.`);
				}

				console.log(error);
			});

		}
	}
}