const Society = require('../models/society');
const Post = require('../models/posts');
const User = require('../models/users');

module.exports.renderNewPostForm = (req, res) => {
    const id = req.params.id;
    console.log(req.params.id);
    console.log(id);
    res.render('post/new', {id});
}

module.exports.createNewPost = async (req, res) => {
    const id = req.params.id;
    const soc = await Society.findById(id);
    console.log(req.body);
    const post = new Post(req.body.post);
    post.postedBy = req.user._id;
    soc.posts.push(post);
    console.log(soc);
    await soc.save();
    await post.save();
    res.redirect(`/society/${id}`);
}

module.exports.likePost = async (req, res) => {
    const {id, postId} = req.params;
    const society = await Society.findById(id);
    const post = await Post.findById(postId);
    console.log(post);
    if(post.likes.indexOf(req.user._id) === -1){
        const oldPostIndex = society.posts.indexOf(post);
        console.log(oldPostIndex);
        post.likes.push(req.user._id);
        society.posts[oldPostIndex] = post;
        console.log(society);
        await post.save();
        await society.save();
        req.flash('success', "Liked");
        res.redirect(`/society/${id}`);
    }else {
        req.flash("error", "Already liked this post");
        res.redirect(`/society/${id}`);
    }
}

module.exports.deletePost = async (req, res) => {
    const {id, postId} = req.params;
    const society = await Society.findById(id);
    society.posts.remove(postId);
    society.save();
    const post = await Post.findByIdAndDelete(postId);
    res.redirect(`/society/${id}`);
}