const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({
    subject: {
        type: String,
        required: true
    },
    imageContent: {
        type: String
    },
    textContent: {
        type: String
    },
    postedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {timestamps: true});

module.exports = mongoose.model("Post", postSchema);