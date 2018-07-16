const Activity = require("../models/activity");
const User = require("../models/User");

// Defining methods for the booksController
module.exports = {
  findAll: function(req, res) {
    Activity.find({
      _user: req.user.id
    })
      .sort({ date: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    Activity.find({ id: req.params.id })
      .then(dbModel => {
        res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
  },
  findByType: function(req, res) {
    Activity.find({ type: req.params.type })
      .then(dbModel => {
        res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    const { name, rating, type, saved, id } = req.body;
    const activity = new Activity({
      name,
      rating,
      type,
      saved,
      id,
      _user: req.user.id
    });
    Activity.create(activity)
      .then(dbModel => {
        res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    Activity.findOneAndRemove({ id: req.params.id })
      .then(dbModel => {
        res.json(dbModel);
      })
      .catch(err => res.status(422).json(err));
  }
};
