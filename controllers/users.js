const User = require('../models/users');
const Society = require('../models/society');

module.exports.showRegister = (req, res) => {
    res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;
        const user = new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) {return next(err)};
            req.flash("success", "Welcome to Fsociety");
            res.redirect('/society');
        });
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
}

module.exports.login = (req, res) => {
    res.render('users/home');
}

module.exports.loginUser = (req, res) => {
    req.flash('success', "Welcome Back!");
    const redirectUrl = req.session.returnTo || '/society';
    delete req.session.returnTo;
    res.redirect(redirectUrl);    
}

module.exports.logoutUser = (req, res) => {
    req.logout(err => {
        if(err) {return err};
        req.flash('success', "Goodbye!");
        res.redirect('/');
    });
}

module.exports.customFeed = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId);
    const societies = await Society.find({});
    const userSocieties = []
    for(let society of societies){
        console.log(society.members);
        if(society.members.indexOf(userId) !== -1){
            userSocieties.push(society);
        }
    }
    res.render('users/customFeed', {user, userSocieties});
}

module.exports.profile = async (req, res) => {
    const userId = req.user._id;
    const user = await User.findById(userId).populate({
        path: 'friends',
        populate: {
            path: 'connected'
        }
    }).populate({
        path: 'friends',
        populate: {
            path: 'requests'
        }
    });
    const users = await User.find({username: {$ne: user.username}});
    const reqs = user.friends.requests;
    const friends = user.friends.connected;
    if(req.query.search){
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        User.find({"username": regex}, function(err, foundUsers){
            if(err){
                console.log("Error", err);
            }else{
                res.render('users/profile', {user, reqs, friends, users: foundUsers});
            }
        })
    }else{
        res.render('users/profile', {user, reqs, friends, users: users});
    }

}

module.exports.showUser = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).populate({
        path: 'friends',
        populate: {
            path: 'connected'
        }
    });
    const friends = user.friends.connected;
    res.render('users/explore', {user, friends});
}

module.exports.acceptRequest = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    const currentUser = await User.findById(req.user._id);
    // console.log(currentUser._id, user._id);
    user.friends.connected.push(req.user._id);
    currentUser.friends.connected.push(user._id);
    currentUser.friends.requests.remove(user._id);
    user.save();
    currentUser.save();
    req.flash('success', `${user.username} is now your friend!`)
    res.redirect('/profile');
}

module.exports.sendRequest = async (req, res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if(user.friends.connected.indexOf(req.user._id) !== -1){
        req.flash('error', `${user.username} is already your friend!`)
        return res.redirect(`/profile/${id}`);
    }
    user.friends.requests.push(req.user._id);
    user.save();
    console.log(user.friends);
    req.flash('success', `Request sent to ${user.username}`);
    res.redirect(`/profile/${id}`);
}

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};