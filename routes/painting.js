var express = require('express');
var router = express.Router();
var response = require('../helpers/response');

var Painting = require('../models/painting').Painting;

/* GET users listing. */
router.get('/', function(req, res, next) {
  Painting.find({}, (err, data) => {
    if (err) {
      response.unexpectedError(req, res, err);
      return;
    }
    res.json(data);
  });
});

router.post('/', function(req, res, next) {
  const name = req.body.username;
  const code = req.body.code;
  const ownerId = req.body.ownerId;

  if (!ownerId) {
    return response.unexpectedError(req, res, 'Something wrong while saving.');
  }

  if (!name) {
    return response.unprocessable(req, res, 'Name mandatory.');
  }

  const newPainting = new Painting({
    name,
    code,
    ownerId
  });

  newPainting.save((err) => {
    if (err) {
      return next(err);
    }

    return response.data(req, res, newPainting.asData());
  });
});

router.get('/search', function(req, res, next) {
  if (!req.query.ownerId){
    response.unprocessable(req, res, 'No id in the query.');
    return;
  }

  let ownerId = req.query.ownerId;
  Painting.find({}).populate('ownerId', '_id').exec((err, paintings) => {
    if(err){
      response.unexpectedError(req, res, err);
      return;
    }

    if(!paintings){
      response.notFound(req, res, 'No paintings in database.');
      return;
    }

    paintings = paintings.filter((painting) => {
      if (String(painting.ownerId._id) === ownerId) { return painting; }
      });

    if (paintings.length === 0) {
      response.unprocessable(req, res, `No paintings for id ${ownerId}`);
      return;
    }

    res.json(paintings);
  });

  router.get('/:id', function(req, res, next) {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      response.notFound(res);
      return;
    }
    Painting.findById(req.params.id, (err, data) => {

      if(err){
        response.unexpectedError(req, res, err);
        return;
      }

      if(!data){
        response.notFound(res);
        return;
      }

      res.json(data);
    });
  });
});

module.exports = router;
