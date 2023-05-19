const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reactions');
const formatDate = require ('../utils/formatDate');

// Schema to create Student model
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

thyoughtsSchema.virtual ('reactionCount').get(function (){
  return this.reaction.max_length;
}) 

const Thoughts = model('Thoughts', thoughtSchema);

module.exports = Thoughts;
