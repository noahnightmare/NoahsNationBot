const { model, Schema } = require('mongoose');

let stickySchema = new Schema({
    Message: { type: String },
    ChannelID: { type: String },
    LastMessage: { type: String },
    LastMessageID: { type: String },
    MaxCount: { type: Number, default: 1},
    CurrentCount: { type: Number, default: 0},
})

module.exports = model("stickySchema", stickySchema);