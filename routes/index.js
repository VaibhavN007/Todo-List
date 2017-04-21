var express = require('express');
var router = express.Router();

var pg = require('pg');

var client = new Client(process.env.DATABASE_URL);
client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/todo', function(req, res) {
	res.render('todo');
})

router.get('/todo/allTasks', function(req, res) {
	
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

router.post('/todo', function(req, res) {

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

router.delete('/todo', function(req, res) {
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

router.put('/todo', function(req, res) {
	
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

module.exports = router;
