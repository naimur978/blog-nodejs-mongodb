const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const moment = require('moment');

// Create Comment Schema
const CommentSchema = new Schema({
    name: { 
        type: String, 
        trim: true, 
        index: true 
    },
    email: { 
        type: String, 
        trim: true, 
        required: true 
    },
    message: { 
        type: String, 
        trim: true, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Add virtual property for relative time display
CommentSchema.virtual("commentAddedSince").get(function() {
    return moment(this.createdAt).fromNow();
});

// Create the model
const Comment = mongoose.model('Comment', CommentSchema);

// Export the model
module.exports = Comment;