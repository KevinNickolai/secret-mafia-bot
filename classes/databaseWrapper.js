const mysql = require('mysql');

const dbName = 'MafiaDB';

/*
* class that wraps a mysql database into utilizing promises
* class inspiration found here:
* https://codeburst.io/node-js-mysql-and-promises-4c3be599909b
*/
class DatabaseWrapper {

	/*
	* DatabaseWrapper constructor
	* @param {Object} config Configuration setup for a mysql connection
	*/
	constructor(config) {
		this.config = config;
		this.connection = mysql.createConnection(config);
		this.setupTableName = "setups";

		//TODO: Create a separate Table object for each 
		//table the database requires to function

		var that = this;

		//Keep the database connection open, querying at least once every minute
		setInterval(function() {
			that.query('SELECT 1');
		},45000);

		//Catch any errors that result in database connection loss, and establish a new connection
		this.connection.on('error', function(err){
			console.log("Database Error", err);
			if(err.code === 'PROTOCOL_CONNECTION_LOST'){
				that.handleDisconnect();
			} else{
				throw err;
			}
		});
	}

	/*
	* Handles disconnection from the database at any time
	* solution to problem found here:
	* https://stackoverflow.com/questions/20210522/nodejs-mysql-error-connection-lost-the-server-closed-the-connection
	*/
	handleDisconnect(){
		this.connection = mysql.createConnection(this.config);

		var that = this;

		this.connection.connect(function(err){
			if(err){
				console.log("Error when reconnecting to database: ", err);
				setTimeout(that.handleDisconnect, 2000);
			}
		});

		this.connection.on('error', function(err){
			console.log("Database Error", err);
			if(err.code === 'PROTOCOL_CONNECTION_LOST'){
				that.handleDisconnect();
			} else{
				throw err;
			}
		});
	}

	/*
	* Query the database
	* @param {string} sql An SQL query to send to the database
	* @param {Array} args An array of arguments to pass with the SQL statement
	*				      defaulted to undefined
	* @return {Promise} a promise object to resolve or reject on database querying completion
	*/
	query(sql, args){
		return new Promise((resolve, reject) => {
			this.connection.query(sql,args, (err, rows) => {
				if(err) return reject(err);

				resolve(rows);
			});
		});
	}

	/*
	* Close the database connection when done with database querying
	*/
	close(){
		return new Promise((resolve,reject) => {
			this.connection.end( err => {
				if(err) return reject(err);

				resolve();
			});
		});
	}

	/*
	* Initialize the database
	*/
	async init(){
		var that = this;

		return new Promise((resolve, reject) => {
			
			//create a database if it doesn't already exist
			var sql = `CREATE DATABASE IF NOT EXISTS ${that.config.database};`;
			that.query(sql)
			.then(function(result){

				//return a promise of changing the database to allow for chaining
				//of database processes after the database has been assigned to our Configuration
				//for mysql
				return new Promise((resolve,reject) => {
					that.connection.changeUser({
						database: that.config.database
					}, (err, rows) => {
						if(err){
							console.log("error in setting database to connection user", err);
							return reject(err);
						}

						return resolve(rows);
					})			
				})

			}).catch(function(err){
				throw err;
			}).then(function(result){

				//columns for the setupTable
				var columns = `
				(setupCode VARCHAR(255) PRIMARY KEY,
				playerNumber TINYINT)
				`
				
				sql = `CREATE TABLE IF NOT EXISTS ${that.setupTableName} ` + columns;

				return that.query(sql);
			}).then(function(result){
				console.log("Database Initialization complete.");

				return resolve(result);
			});
		});
	}
}

module.exports = DatabaseWrapper;