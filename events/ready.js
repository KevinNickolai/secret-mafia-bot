module.exports = (client) => {
	//when the client is ready, we can get the queue channel for the lobby.
	return client.channels.get('573911375840280577');
}