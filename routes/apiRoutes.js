/* eslint-disable linebreak-style */
/* eslint-disable no-useless-return */
/* eslint-disable linebreak-style */
/* eslint-disable prefer-template */
/* eslint-disable linebreak-style */
/* eslint-disable spaced-comment */
/* eslint-disable linebreak-style */
/* eslint-disable func-names */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable linebreak-style */
/* eslint-disable indent */
/* eslint-disable linebreak-style */
// Requiring our models and passport as we've configured it
const router = require('express').Router();
const db = require('../models');
const passport = require('../config/passport');

// Using the passport.authenticate middleware with our local strategy.
// If the user has valid login credentials, send them to the members page.
// Otherwise the user will be sent an error
router.post('/login', passport.authenticate('local'), function (req, res) {
  console.log('check for invalid user' + res.message);
  res.json(req.user);
});

// otherwise send back an error
router.post('/signup', (req, res) => {
  db.User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
  })
    .then(function () {
      //res.json(req.body);
      //console.log('createduser' + res.body);
      res.redirect(307, '/api/login');
    })
    .catch((err) => {
      console.log('create user error' + err);
      res.status(406).json(err);
    });
  // .catch((Sequelize.) => {
  //   //console.log('create user error' + err);
  //   res.status(401).json(UniqueConstraintError);
  // });
});

// // Route for logging user out
// router.get('/logout', function (req, res) {
//   req.logout();
//   res.redirect('/');
// });

// ****************LUBA ADD GAME***************************
router.get('/locations', (req, res) => {
  // Here we add an "include" property to our options in our findAll query
  // In this case, just db.Post
  db.Location.findAll().then((response) => {
    res.json(response);
  });
});

router.get('/gametypes', (req, res) => {
  db.GameTypes.findAll().then((response) => {
    res.json(response, 'this response');
  });
});
router.post('/games', (req, res) => {
  db.Game.create({
   date: req.body.date,
   time: req.body.time,
   LocationId: req.body.LocationId,
   GameTypeId: req.body.GameTypeId,
  })
    .then(function (Game) {
      Game.addUser(req.user.UserId).then(() => {
        res.json(Game);
        // console.log(req.params.id);
      });
    })
    .catch((err) => {
      res.status(401).json(err);
    });
});

// ********************************************************

router.get('/user_schedule', (req, res) => {
  // db.GameTypes.findAll().then((schedule) => res.json(schedule));
  // console.log(res);
  console.log(req);
  db.Game.findAll({
    // where: {
    //   userId: req.params.id,
    //   // include: User,
    // },
    // include: Animal,
  }).then((schedule) => res.json(schedule));
  // console.log(res);
  // res.json('get all games from schedule');
});

// *************************USER SCHEDULE &DATA AND SIGNEDUP PLAYERS *******************************

// Route for getting some data about our user to be used client side
router.get('/user_data', (req, res) => {
  if (!req.user) {
    // The user is not logged in, send back an empty object
    res.json({});
  } else {
    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    res.json({
      username: req.user.username,
      email: req.user.email,
      id: req.user.id,
    });
  }
});

// router to get the list of players signed up for a game so far

router.get('/user_schedule/:id', (req, res) => {
  db.User.findOne({
    include: [
      {
        model: db.Game,
        include: [db.GameTypes, db.Location, db.User],
      },
    ],
    where: {
      id: req.params.id,
    },
  }).then((schedule) => res.json(schedule));
});

module.exports = router;
