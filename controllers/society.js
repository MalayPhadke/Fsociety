const Society = require('../models/society');
const Post = require('../models/posts');
const User = require('../models/users');

const check = (arr, id) => {
    let isMember;
    if (arr.indexOf(id) === -1){
        isMember = false;
    }else {
        isMember = true;
    }
    return isMember;
}

module.exports.all = async (req, res) => {
    const all = await Society.find({}).populate('mod');
    res.render('society/all', {all});
}

module.exports.renderNewForm = (req, res) => {
    res.render('society/new');
}

module.exports.createNewSociety = async (req, res) => {
    const new_soc = new Society(req.body.society);
    new_soc.mod = req.user._id;
    await new_soc.save();
    req.flash('success', `Succesfully created new society ${new_soc.title}`)
    res.redirect('/society');
}

module.exports.showSociety = async(req, res) => {
    const soc = await Society.findById(req.params.id).populate({
        path: 'posts', 
        populate: {
            path: 'postedBy'
        },
        options: { sort: {'createdAt': -1}}
    });
    let isMod;
    let isMember = check(soc.members, req.user._id);
    res.render('society/show', {soc, isMember, isMod});
}

module.exports.joinSociety = async (req, res) => {
    const soc = await Society.findByIdAndUpdate(req.params.id, {$push: {members: req.user._id}});
    await soc.save();
    req.flash('success', `Successfully joined ${soc.title}`)
    res.redirect(`/society/${soc._id}`);

}

module.exports.leaveSociety = async (req, res) => {
    const soc = await Society.findByIdAndUpdate(req.params.id, {$pull: {members: req.user._id}});
    await soc.save();
    req.flash('success', `Successfully left ${soc.title}`)
    res.redirect(`/society/${soc._id}`);
}

module.exports.trendingPosts = async (req, res) => {
    const soc = await Society.findById(req.params.id).populate({
        path: 'posts', 
        populate: {
            path: 'postedBy'
        },
        options: { sort: {'likes': -1}}
    });
    let isMod;
    let isMember = check(soc.members, req.user._id);
    res.render('society/show', {soc, isMember, isMod});
}

module.exports.recentPosts = async (req, res) => {
    const soc = await Society.findById(req.params.id).populate({
        path: 'posts', 
        populate: {
            path: 'postedBy'
        },
        options: { sort: {'createdAt': -1}}
    });
    let isMod;
    let isMember = check(soc.members, req.user._id);
    res.render('society/show', {soc, isMember, isMod});
}