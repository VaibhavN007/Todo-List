var express = require('express');
var router = express.Router();

var pg = require('pg');

var config = {
	user: 'postgres', //env var: PGUSER 
	database: 'tododb', //env var: PGDATABASE 
	password: 'vaibhav', //env var: PGPASSWORD 
	host: 'localhost', // Server hosting the postgres database 
	port: 5432, //env var: PGPORT 
	max: 10, // max number of clients in the pool 
	idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed 
};

//this initializes a connection pool 
//it will keep idle connections open for 30 seconds 
//and set a limit of maximum 10 idle clients 
var pool = new pg.Pool(config);

pool.on('error', function (err, client) {
	// if an error is encountered by a client while it sits idle in the pool 
	// the pool itself will emit an error event with both the error and 
	// the client which emitted the original error 
	// this is a rare occurrence but can happen if there is a network partition 
	// between your application and the database, the database restarts, etc. 
	// and so you might want to handle it and at least log it out 
	console.error('idle client error', err.message, err.stack)
});


/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/todo', function(req, res) {
	res.render('todo');
})

router.get('/todo/allTasks', function(req, res) {
	pool.connect(function(err, client, done) {
		if(err)
		{
			return console.error('error fetching client from pool', err);
		}

		client.query("SELECT task, completed FROM todotable", function(err, result) {
			if(err)
				done(err);
			else
			{
				done();
				res.status(200).send(result.rows);
			}
		});
	});
});

router.post('/todo', function(req, res) {

	pool.connect(function(err, client, done) {
		if(err)
		{
			return console.error('error fetching client from pool', err);
		}

		client.query("INSERT INTO todotable(task) VALUES($1)", [req.body.task], function(err, result) {
			if(err)
				done(err);
			else
			{
				done();
				res.status(200).send("new task added");
			}
		});
	});

});

router.delete('/todo', function(req, res) {
	
	pool.connect(function(err, client, done) {
		if(err)
		{
			return console.error('error fetching client from pool', err);
		}

		client.query("DELETE FROM todotable WHERE task=$1", [req.body.task], function(err, result) {
			if(err)
				done(err);
			else
			{
				done();
				res.status(200).send("successfully deleted task");
			}
		});
	});

});

router.put('/todo', function(req, res) {
	
	pool.connect(function(err, client, done) {
		if(err)
		{
			return console.error('error fetching client from pool', err);
		}

		client.query("UPDATE todotable SET completed=true WHERE task=$1", [req.body.task], function(err, result) {
			if(err)
				done(err);
			else
			{
				done();
				res.status(200).send("successfully completed task");
			}
		});
	});

});

module.exports = router;
