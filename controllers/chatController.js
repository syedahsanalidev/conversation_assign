const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Chat = require("../models/chat");
const User = require('../models/user')
const APIFeatures = require("../utils/apiFeatures");
const mongoose = require('mongoose');
var _ = require('lodash');

exports.createChat = catchAsync(async (req, res, next) => {
  let { message, from, to } = req.body;
  if (!message || !from || !to) {
    return next(new AppError("Message,From and To are required fields", 400));
  }
  let participants = [from, to];
  const sender = mongoose.Types.ObjectId.isValid(from)
  const reciever = mongoose.Types.ObjectId.isValid(to)
  if (!sender || !reciever) {
    return next(new AppError("Invalid document id of sender or reciever", 404));
  }

  let doc = await Chat.create({ ...req.body, participants });
  doc = await doc
    .populate({
      path: "from",
      select: "name",
    })
    .populate({
      path: "to",
      select: "name",
    })
    .execPopulate();

  res.status(200).json({
    status: "Success",
    data: { chat: {from:doc.from,to:doc.to,message:doc.message,created_at:doc.createdAt}, message: "message sent successfully" },
  });
});

exports.getAllChats = catchAsync(async (req, res, next) => {
  const { from, to } = req.query;
  if (!from || !to) {
    return next(new AppError("From and To are required fields", 400));
  }
  
  const sender = mongoose.Types.ObjectId.isValid(from)
  const reciever = mongoose.Types.ObjectId.isValid(to)
  if (!sender || !reciever) {
    return next(new AppError("Invalid document id of sender or reciever", 404));
  }
console.log(sender,reciever)
  const chats = await Chat.find({  "from" : { "$in": [from, to] },
  "to" : { "$in": [from, to] } })
    .sort({ _id: -1 })
    .select("-_id -participants -updatedAt -__v");
  res.status(200).json({
    status: "Success",
    data: { chats },
  });
});

exports.getAllChatsByUserID = catchAsync(async (req, res, next) => {
  const { user } = req.params;
  if (!user) {
    return next(new AppError("User ID  is required field", 400));
  }
  
  const sender = mongoose.Types.ObjectId.isValid(user)
  if (!sender) {
    return next(new AppError("Invalid document id of sender or reciever", 404));
  }
  const chats = await Chat.find({  "from" : { "$in": [user] } })
    .sort({ _id: -1 })
    .select("-_id -participants -updatedAt -__v");
    
    var output = _.groupBy(chats, function(entry) { return entry.from + ',' + entry.to; });
  res.status(200).json({
    status: "Success",
    data: { output },
  });
});
