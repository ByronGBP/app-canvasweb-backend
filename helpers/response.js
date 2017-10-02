module.exports = {

  notFound: function(res) {
    res.status(404).json({error: 'Not found!'});
  },

  unexpectedError: function(req, res, err) {
    res.status(500).json({error: 'Unexpected error!'});
  },
  
  unauthorized: function(req, res, err){
      res.status(403).json({ message: 'Unauthorized' });

  }
};
