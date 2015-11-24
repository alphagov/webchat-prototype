var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
  res.render('index');
});

router.get('/examples/template-data', function (req, res) {
  res.render('examples/template-data', { 'name' : 'Foo' });
});

// add your routes here

router.post('/webchat/triage', function (req, res) {
	var name = req.body.name,
		userQuery = req.body.userQuery;
	req.session.name = name;
	req.session.userQuery = userQuery;
	res.redirect('queue');
	
});

router.get('/webchat/queue', function (req, res) {
  res.render('webchat/queue', { 'name' : req.session.name });
});

module.exports = router;
