const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reactions');
const formatDate = require ('../utils/formatDate');

const thoughtsSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      min_length: 1,
      max_length: 280,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      get: timestamp=> formatDate(timestamp),
    },
    username: {
      type: String,
      required: true,
    },
    reaction: [reactionSchema],
  },
  {
    toJSON: {
      getters: true,
    },
    id:false,
  }
);

thoughtsSchema.virtual ('reactionCount').get(function (){
  return this.reaction.length;
}) 

const Thoughts = model('Thoughts', thoughtsSchema);

module.exports = Thoughts;
