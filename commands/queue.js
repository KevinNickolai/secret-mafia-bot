module.exports = (message, lobby) => {

	const userToAdd = message.author;

	lobby.addPlayer(userToAdd);

	lobby.displayPlayers();

	return message.reply('you\'re queued!');
}