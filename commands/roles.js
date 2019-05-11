const rolesLink = 'https://mafia.gg/guide/roles';

const rolesCommand = 'roles';

module.exports = {
	cmdRoles: rolesCommand,

	/*
	* Called when the user attempts a rolesCommand
	* @param {User} user The user to send the rolesCommand feedback to
	*/
	onRoles: function(user){
		user.send(rolesLink);
	}
}