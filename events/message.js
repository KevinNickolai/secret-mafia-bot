const queue = require('../commands/queue')

module.exports = (client, message, lobby) => {
	if(message.content === '!q'){
		return queue(message,lobby)
	}
}