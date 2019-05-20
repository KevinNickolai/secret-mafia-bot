require('dotenv').config();

const databaseConnection = {
	host: process.env.DATABASE_HOST,
	user: process.env.DATABASE_USER,
	password: process.env.DATABASE_PASSWORD,
}

module.exports = {
	prefix: '!',
	dbConfig:databaseConnection,
	botToken: process.env.BOT_TOKEN
}