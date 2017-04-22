var express = require('express');
var router = express.Router();

var pg = require('pg');
var db_config = require('../config/database_info');

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

const pool = new pg.Pool(db_config);

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
			client.query('SELECT task, completed FROM public.todotable WHERE userid=($1)', [req.user.id], function(err, result) {
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

		client.query('INSERT INTO public.todotable(task, userid) VALUES($1, $2)', [req.body.task, req.user.id], function(err, result) {
			done(err);

			if(err) {
				return console.error('error running query', err);
			} else {
				res.sendStatus(200);
				done();
			}
		});

	});
	
});

router.delete('/todo', isAuthenticated, function(req, res) {

	pool.connect(function(err, client, done) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}

		client.query('DELETE FROM public.todotable WHERE userid=($1) and task=($2)', [req.user.id, req.body.task], function(err, result) {
			done(err);

			if(err) {
				return console.error('error running query', err);
			} else {
				res.sendStatus(200);
				done();
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

		client.query('UPDATE public.todotable SET completed=true WHERE userid=($1) and task=($2)', [req.user.id, req.body.task], function(err, result) {

			if(err) {
				return console.error('error running query', err);
				return done(err);
			} else {
				res.sendStatus(200);
				done();
			}
		});

	});

});

module.exports = router;
