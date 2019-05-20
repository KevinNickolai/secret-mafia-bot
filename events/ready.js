module.exports = (client) => {
	
	const { lobby } = client;

	const queueChannel = client.channels.get('573911375840280577');

	lobby.setQueueChannel(client, queueChannel);
}