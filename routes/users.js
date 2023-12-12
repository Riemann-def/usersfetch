var express = require('express');
var router = express.Router();
const multer  = require('multer');
var path = require('path');
const mongojs = require('mongojs');
const db = mongojs('usersdb', ['users']);

// Función para verificar el tipo de archivo
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/png'  || file.mimetype === 'image/jpg') {
      cb(null, true); // Acepta el archivo
  } else {
      cb(null, false); // Rechaza el archivo
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/uploads'));
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
      fileSize: 2 * 1024 * 1024 // 2MB
  }
});

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

router.post('/new', upload.single('avatar'), function(req, res) {
  const bezeroBerria = {
      izena : req.body.izena,
      abizena: req.body.abizena,
      email: req.body.email
  };
  // Añadir profile solo si se ha subido un archivo
  if (req.file) {
    bezerobBerria.profile = req.file.filename;
  }

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

router.post('/update', upload.single('avatar'), function(req, res) {
  
  const updatedUser = {
      izena: req.body.izena,
      abizena: req.body.abizena,
      email: req.body.email
  };

  // Añadir profile solo si se ha subido un archivo
  if (req.file) {
      updatedUser.profile = req.file.filename;
  }


  db.users.update({_id: mongojs.ObjectID(req.body._id)}, {$set: updatedUser}, function(err, doc) {
      if (err) {
          res.send(err);
      } else {
          res.redirect('/users');
      }
  });
});


module.exports = router;

