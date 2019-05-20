const rolesLink = 'https://mafia.gg/guide/roles';

const rolesCommand = 'roles';

module.exports = {
	name: rolesCommand,
	description: "Provide a link to the roles page of Mafia.gg",
	execute(message, args){
		message.author.send(rolesLink);
	}
}