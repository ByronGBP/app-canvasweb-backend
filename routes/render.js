const express = require('express');
const router = express.Router();
const Painting = require('../models/painting').Painting;

router.get('/:projectID', (req, res, next) => {
  console.log(req.params.projectID);
  Painting.findById((req.params.projectID), (err, painting) => {
    if (err) {
      next(err);}
    res.render('render', { painting });
  });
});

module.exports = router;
