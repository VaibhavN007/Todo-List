var express = require('express');
var router = express.Router();

var pg = require('pg');

// var client = new pg.Client("process.env.DATABASE_URL");
// var client = new pg.Client("postgres://vaibhav:vaibhav@localhost:5432/tododb");
/*
var config = {
	user: process.env.PGUSER, //env var: PGUSER
	database: process.env.PGDATABASE, //env var: PGDATABASE
	password: process.env.PGPASSWORD, //env var: PGPASSWORD
	// host: 'https://young-retreat-32343.herokuapp.com', // Server hosting the postgres database
	host: 'localhost', // Server hosting the postgres database
	port: 5432, //env var: PGPORT
	max: 10, // max number of clients in the pool
	idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
};
*/ 

function isAuthenticated(req, res, next) {
	if(req.isAuthenticated())
	{
		return next();
	}
	res.redirect('/users/login');
}

function isNotAuthenticated(req, res, next) {
	if(req.isAuthenticated())
	{
		res.redirect('/todo');
	}
	return next();
}

var config = {
	user: 'chacttbbnwrmej',
	database: 'd82d88st8qgqda',
	password: '2ea3a76251205520ef12498870912b47711970becb8a39f201b5a946a5598bec',
	host: 'ec2-54-163-252-55.compute-1.amazonaws.com',
	port: 5432,
	max: 10,
	idleTimeoutMillis: 30000,
};

const pool = new pg.Pool(config);

pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', {
		user: req.user
	});
});

router.get('/todo', isAuthenticated, function(req, res) {
	res.render('todo', {
		user: req.user
	});
})

router.get('/todo/allTasks', isAuthenticated, function(req, res) {
	
	pool.connect(function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}
		if(req.user.id)
		{
			client.query('SELECT task, completed FROM todotable WHERE userid=($1)', [req.user.id], function(err, result) {
				done(err);

				if(err) {
					return console.error('error running query', err);
				} else {
					res.status(200).send(result.rows);
				}
			});
		}
		else
		{
			console.log('dont know why req.user.id is not set at allTasks');
			done();
			res.send("A Problem occurred.. please login again");
		}

	});

});

router.post('/todo', isAuthenticated, function(req, res) {
	pool.connect(function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}

		client.query('INSERT INTO todotable(task, userid) VALUES($1, $2)', [req.body.task, req.user.id], function(err, result) {
			done(err);

			if(err) {
				return console.error('error running query', err);
			} else {
				res.status(200).send('new task added');
			}
		});

	});
	
});

router.delete('/todo', isAuthenticated, function(req, res) {

	pool.connect(function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}

		client.query('DELETE FROM todotable WHERE userid=($1) and task=($2)', [req.user.id, req.body.task], function(err, result) {
			done(err);

			if(err) {
				return console.error('error running query', err);
			} else {
				res.status(200).send('task deleted');
			}
		});

	});

});

router.put('/todo', isAuthenticated, function(req, res) {

	pool.connect(function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
			return done(err);
		}

		client.query('UPDATE todotable SET completed=true WHERE userid=($1) and task=($2)', [req.user.id, req.body.task], function(err, result) {

			if(err) {
				return console.error('error running query', err);
				return done(err);
			} else {
				res.status(200).send('task deleted');
				done();
			}
		});

	});

});

module.exports = router;
