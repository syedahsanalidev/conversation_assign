const mongoose = require('mongoose');
const User  = require('../models/user')
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    from: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    to: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
      participants: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        }
      ],
      message: {
        type: String,
        trim: true,
      },  
}, 
{
    timestamps: true
});
chatSchema.pre(/^find/, function(next) {
    this.populate({
        path:'from',
        select:'name'
    }).populate({
      path: 'to',
      select:'name'
    });
    next();
  });

module.exports = Todo = mongoose.model('Chat', chatSchema);