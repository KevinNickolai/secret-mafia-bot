const queue = require('../commands/queue')

module.exports = (client, message) => {
	if(message.content === '!q'){
		return queue(message)
	}
}