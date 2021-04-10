const express = require('express');
const router = express.Router();

const Thing = require('../models/Thing.model'); // our Thing model

const uploader = require('../config/cloudinary.config'); // basic cloudinary setup

// GET /api/things => Route to list all available Thing elements
router.get('/things', (req, res, next) => {
  Thing.find()
    .then(thingsFromDB => res.status(200).json(thingsFromDB))
    .catch(err => next(err));
});

// POST /api/upload => Route that will receive an image, send it to cloudinary via uploader and return the image URL
router.post('/upload', uploader.single('imageUrl'), (req, res, next) => {
  // console.log('file is: ', req.file)

  if (!req.file) {
    next(new Error('No file uploaded!'));
    return;
  }
  // get secure_url from the file object and save it in the
  // variable 'secure_url', but this can be any name, just make sure you remember to use the same in frontend

  res.json({ secure_url: req.file.path });
});

// POST /api/things/create => Route that will create a new Thing in our database
router.post('/things/create', (req, res, next) => {
  // console.log('body: ', req.body); ==> here we can see that all
  // the fields have the same names as the ones in the model so we can simply pass
  // req.body to the .create() method

  Thing.create(req.body)
    .then(aNewThing => {
      // console.log('Created new thing: ', aNewThing);
      res.status(200).json(aNewThing);
    })
    .catch(err => {
      console.log(err);
      
      next(err)
    });
});

module.exports = router;