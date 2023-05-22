const { ObjectId } = require('mongoose').Types;
const { Thoughts, User } = require('../models');


module.exports = {
  // Get all thoughtss
  async getThoughts(req, res) {
    try {
      const thoughts = await Thoughts.find();

      const thoughtsObj = {
        thoughts,
 
      };

      res.json(thoughtsObj);
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // Get a single thoughts
  async getSingleThought(req, res) {
    try {
      const thoughts = await Thoughts.findOne({ _id: req.params.thoughtsId })
        .select('-__v');

      if (!thoughts) {
        return res.status(404).json({ message: 'No thoughts with that ID' })
      }

      res.json({
        thoughts,
        grade: await grade(req.params.thoughtsId),
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json(err);
    }
  },
  // create a new thoughts
  async createThought(req, res) {
    try {
      const thoughts = await Thoughts.create(req.body);
      const userRecords = await User.findOneAndUpdate(
        {username:req.body.username},
        {$push:{thoughts: thoughts._id}},
        {new:true})
        console.log(userRecords)
      res.json({thoughts,userRecords});
    } catch (err) {
      console.log(err)
      res.status(500).json(err);
    }
  },
  // Delete a thoughts and remove them from the user
  async deleteThought(req, res) {
    try {
      const thoughts = await Thoughts.findOneAndRemove({ _id: req.params.thoughtsId });

      if (!thoughts) {
        return res.status(404).json({ message: 'No such thoughts exists' });
      }

      const user = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtsId },
        { $pull: { thoughts: req.params.thoughtsId } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          message: 'Thoughts deleted, but no users found',
        });
      }

      res.json({ message: 'Thoughts successfully deleted' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // Add an reaction to a thoughts
  async addReaction(req, res) {
    console.log('You are adding an reaction');
    console.log(req.body);

    try {
      const thoughts = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reaction: req.body } },
        { runValidators: true, new: true }
      );

      if (!thoughts) {
        return res
          .status(404)
          .json({ message: 'No thoughts found with that ID :(' });
      }

      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Remove reaction from a thoughts
  async removeReaction(req, res) {
    try {
      const thoughts = await Thoughts.findOneAndUpdate(
        { _id: req.params.thoughtsId },
        { $pull: { reaction: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thoughts) {
        return res
          .status(404)
          .json({ message: 'No thoughts found with that ID :(' });
      }

      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
