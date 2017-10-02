var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.json({Yoo: "This is the F home",
            Get: "Out of here!"});
});

module.exports = router;
