module.exports = (message, lobby) => {

	const userToAdd = message.author;

	lobby.addPlayer(userToAdd);

	return message.reply('you\'re queued!');
}