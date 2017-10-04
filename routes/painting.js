const express = require('express');
const router = express.Router();
const ObjectId = require('mongodb').ObjectID;

const response = require('../helpers/response');

const Painting = require('../models/painting').Painting;

//TODO:- Refactor this bunch of crap!
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
  const name = req.body.name;
  const code = req.body.code;
  const ownerId = ObjectId(req.body.ownerId);

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
      response.notFound(req, res, `No project with id ${req.params.id}`);
      return;
    }

    res.json(data);
  });
});

router.post('/:id', function(req, res, next) {
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    response.notFound(req, res, 'No ID');
    return;
  }
  const id = req.body.id;
  const name = req.body.name;
  const code = req.body.code;
  const ownerId = ObjectId(req.body.ownerId);

  if (!ownerId) {
    return response.unexpectedError(req, res, 'Something wrong while saving.');
  }

  if (!name) {
    return response.unprocessable(req, res, 'Name mandatory.');
  }

  const newPainting = new Painting({
    _id: id,
    name,
    code,
    ownerId
  });
  Painting.findByIdAndUpdate(req.params.id, newPainting, (err, data) => {

    if(err){
      response.unexpectedError(req, res, "This is the error monkey!");
      return;
    }

    if(!data){
      response.notFound(res);
      return;
    }
    res.json(newPainting);
  });
});

module.exports = router;
