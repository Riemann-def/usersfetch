var express = require('express');
var router = express.Router();
const mongojs = require('mongojs');
const db = mongojs('usersdb', ['users']);

/* GET users listing. */
router.get('/', function(req, res) {
  db.users.find( function (err, docs) {
      if (err) {
          console.log(err)
      } else {
          res.render('users', {
              title: 'Users',
              users: docs
          })
      }
  })
});

router.post('/new', function(req, res) {
  const bezeroBerria = {
      izena : req.body.izena,
      abizena: req.body.abizena,
      email: req.body.email
  };

  db.users.insert(bezeroBerria, function(err, doc) {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/users');
    }
  });
});

router.post('/delete/', function(req, res) {
  db.users.remove(
      {_id:  mongojs.ObjectID(req.body._id)}, function () {
          console.log("zuzen ezabatu da");
      }
  );
  res.redirect('/users');
})



router.get('/edit/:id', function(req, res) {
  db.users.findOne({_id: mongojs.ObjectID(req.params.id)}, function (err, doc) {
      if (err) {
          res.send(err);
      } else {
          res.render('editUser', {
              user: doc
          });
      }
  });
});

router.post('/update', function(req, res) {
  const updatedUser = {
      izena: req.body.izena,
      abizena: req.body.abizena,
      email: req.body.email
  };

  db.users.update({_id: mongojs.ObjectID(req.body._id)}, {$set: updatedUser}, function(err, doc) {
      if (err) {
          res.send(err);
      } else {
          res.redirect('/users');
      }
  });
});


module.exports = router;

