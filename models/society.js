const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const societySchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type:String
    },
    headImage: {
        type:String
    },
    members: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    mod: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, 
    posts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Post'
        }
    ]
}, {timestamps: true});

module.exports = mongoose.model('Society', societySchema);