const express = require('express');

const port = 8000;;

const app = express();

app.set('view engine', 'ejs');

const db = require('./config/db');

const User = require('./models/userModel');

const fs = require('fs');

// multer + images start

const path = require('path');

app.use('/uploads', express.static(path.join('uploads')))

const multer = require('multer');

const fileUpload = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});

const imageupload = multer({ storage: fileUpload }).single('avtar');

// multer + images end

// add record start

app.get('/', (req, res) => {
  User.find({})
    .then((record) => {
      return res.render('index', { record });
    }).catch((err) => {
      console.log(err);
      return false;
    })

})

app.get('/add', (req, res) => {
  return res.render('add');
})

app.post('/addRecord', imageupload, (req, res) => {
  const { name, price, pages, author } = req.body;

  if (!name || !price || !pages || !author || !req.file) {
    console.log("Invalid Field");
    return res.redirect('/add');
  }

  User.create({
    name, price, pages, author,
    image: req.file.path
  }).then((success) => {
    console.log("User successfully inserted");
    return res.redirect('/');
  }).catch((err) => {
    console.log(err);
    return res.redirect('/add');
  });
});

// add record end

// delete record start
app.get('/deleteRecord', (req, res) => {
  let id = req.query.id;

  User.findById(id)
    .then((oldRecord) => {
      fs.unlinkSync(oldRecord.image);
    }).catch((err) => {
      console.log(err);
      return false;
    })

  User.findByIdAndDelete(id)
    .then((success) => {
      console.log("Record Succesfully delete");
      return res.redirect('/');
    }).catch((err) => {
      console.log(err);
      return false;
    })
})
// delete record end

// edit record start
app.get('/editRecord', (req, res) => {
  let id = req.query.id;
  User.findById(id)
    .then((single) => {
      return res.render('edit', {
        single
      })
    }).catch((err) => {
      console.log(err);
      return false;
    })
})
// edit record end

// update record start
app.post('/updateRecord', imageupload, (req, res) => {
  let id = req.body.editid;
  if (req.file) {
    User.findById(id)
      .then((oldRecord) => {
        fs.unlinkSync(oldRecord.image)
      }).catch((err) => {
        console.log(err);
        return false;
      })

    User.findByIdAndUpdate(id, {
      name: req.body.name,
      price: req.body.email,
      pages: req.body.password,
      author: req.body.gender,
      image: req.file.path
    }).then((success) => {
      console.log("successfully edit");
      return res.redirect('/');
    }).catch((err) => {
      console.log(err);
      return false
    })
  } else {
    User.findById(id)
      .then((oldRecord) => {
        User.findByIdAndUpdate(id, {
          name: req.body.name,
          price: req.body.email,
          pages: req.body.password,
          author: req.body.gender,
          image: oldRecord.image
        }).then((success) => {
          console.log("successfully edit");
          return res.redirect('/');
        }).catch((err) => {
          console.log(err);
          return false
        })
      }).catch((err) => {
        console.log(err);
        return false;
      })
  }
})
// update record end

// server start

app.listen(port, (err) => {
  if (err) {
    console.log(err);
    return false;
  }
  console.log(`Server is start :- ${port}`);
})

// server end
