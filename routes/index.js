var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.user){
    res.redirect('/dashboard');
  }else{
    res.render('login');
  }
});

router.get('/dashboard', function(req, res, next) {
  if(req.session.user){
    res.render('dashboard', {user: req.session.user});
  }else{
    res.redirect('/');
  }
});

module.exports = router;
