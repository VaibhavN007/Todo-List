var express = require('express');
var router = express.Router();
var expressValidator = require('express-validator');

var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcryptjs');

var pg = require('pg');
var db_config = require('../config/database_info');

const pool = new pg.Pool(db_config);

pool.on('error', function (err, client) {
  console.error('idle client error', err.message, err.stack);
});

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	
	pool.connect(function(err, client, donePool) {
		if(err) {
			console.error('error fetching client from pool', err);
			return donePool(err);
		}

		client.query('SELECT * from public.usertable WHERE id=($1)', [id], function(err, res) {
			if(err)
				return done(err);
			var userObj = {
				id: res.rows[0].id,
				username: res.rows[0].username,
				password: res.rows[0].password
			};
			done(err, userObj); 
		});
	});
});

// LocalStrategy(config-object, callback);
passport.use('local-signup', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password1',
	passReqToCallback: true
}, function(req, username, password, done){

	pool.connect(function(err, client, donePool) {
		if(err) {
			return console.error('error fetching client from pool', err);
		}

		// execute a query on our database
		client.query('SELECT username::text from public.usertable WHERE username=($1)', [username], function (err, result) {
			if (err) 
			{
				console.log("QUERY ERROR", err);
				throw err;
			}
			
			if(result.rows[0]) {
				// console.log('username exists', result.rows[0]);
				client.end();
				return done({message: "username already exists"});
			} else {
				// console.log('username available');

				client.query('INSERT INTO public.usertable(username, password) VALUES($1, $2) RETURNING id', [username, password], function(err, result1) {
					if(err)
					{
						console.log(err);
						client.end();
						return done(err);
					}
					console.log("successfully inserted");
					console.log(result1.rows[0]);
					var newUser = {
						id: result1.rows[0].id,
						username: result1.rows[0].username,
						password: result1.rows[0].password,
					};

					client.end();
					return done(null, newUser);
				});
			}
		});
	});

}));

passport.use('local-signin', new LocalStrategy(

	function(username, password, done) {

		pool.connect(function(err, client, donePool) {
			if(err) {
				return console.error('error fetching client from pool', err);
			}

			// execute a query on our database
			client.query('SELECT * from public.usertable WHERE username=($1)', [username], function (err, result) {
				if (err) 
				{
					console.log("QUERY ERROR", err);
					donePool(err);
					throw err;
				}

				if(result.rows[0])
				{
					bcrypt.compare(password, result.rows[0].password, function(err, isMatch) {
						if(err)
						{
							// console.log('bcrypt err');
							client.end();
							return done(err, false);
						}
						else if(!isMatch)
						{
							// console.log('Incorrect password');
							client.end();
							return done(null, false, {message: "Incorrect password"});
						}
						else
						{
							// console.log('correct password');
							// client.end();
							var user =  {
								id: result.rows[0].id,
								username: result.rows[0].username,
								password: result.rows[0].password,
							};

							// console.log('serializeUser', user);
							return done(null, user);
						}
					});
				}
				else
				{
					console.log('Incorrect username');
					client.end();
					done(null, false, {message: "Incorrect username"});
				}
			});
		});
	}
));

function expressBodyValidation(req, res, next) {
	
	// get form values
	var username = req.body.username;
	var password1 = req.body.password1;
	var password2 = req.body.password2;

	// form validation
	req.checkBody('username', "Username Field is required").notEmpty();
	req.checkBody('password1', "Password Field is required").notEmpty();
	req.checkBody('password2', "Please Confirm password").notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password1);
	// req.checkBody('password1', 'Password must be between 3 to 20 characters').len(3, 20);

	var errors = req.validationErrors();

	if(errors)
	{
		res.render('register', {
			errors: errors
		});
	}
	else
	{
		bcrypt.hash(password1, 10, function(err, hash) {
			if(err) throw err;

			req.body.password1 = hash;
			req.body.password2 = hash;	//	just in case
			next();
		});
	}
}

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


/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a resource');
});

router.get('/register', isNotAuthenticated, function(req, res, next) {
	res.render('register', {
		user: false,
		errors: []
	});
});

router.post('/register', isNotAuthenticated, expressBodyValidation, passport.authenticate('local-signup', {
	successRedirect: '/todo',
	failureRedirect: '/users/register',
	failureFlash: true
}));

router.get('/login', isNotAuthenticated, function(req, res) {
	res.render('login', {
		user: false
	});
});

router.post('/login', isNotAuthenticated, passport.authenticate('local-signin', {
	// successRedirect: '/todo',
	failureRedirect: '/users/login',
	failureFlash: true
}), function(req, res) {
	// console.log('successfully logged in');
	res.redirect('/todo');
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/users/login');
});

module.exports = router;
