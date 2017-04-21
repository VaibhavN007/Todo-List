var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Express' });
});

router.get('/todo', function(req, res) {
	res.render('todo');
})

router.post('/todo/add', function(req, res) {
	console.log(req);
	res.status(200).json(req.body);
})

module.exports = router;
