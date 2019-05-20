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

	async init(){
		var that = this;

		return new Promise((resolve, rejcet) => {
			
			var sql = `CREATE DATABASE IF NOT EXISTS ${dbName};`;

			that.query(sql)
			.then(function(result){

				//return a promise of changing the database to allow for chaining
				//of database processes after the database has been assigned to our Configuration
				//for mysql
				return new Promise((resolve,reject) => {
					that.connection.changeUser({
						database: dbName
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

				var columns = `
				(setupCode VARCHAR(255) PRIMARY KEY,
				playerNumber TINYINT)
				`
				
				sql = `CREATE TABLE IF NOT EXISTS ${that.setupTableName} ` + columns;

				return that.query(sql);
			}).then(function(result){
				console.log("Database Initialization complete.");
			});
		});
	}
}

module.exports = DatabaseWrapper;