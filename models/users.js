const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    aboutMe: String,
    profilePhoto: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    friends: {
        requests: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }],
        connected: [{
            type: Schema.Types.ObjectId,
            ref: 'User'
        }]
    }
}, {timestamps: true})

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);