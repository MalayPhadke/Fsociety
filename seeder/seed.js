const mongoose = require('mongoose');
const { title } = require('process');
const Society = require('../models/society');
const Post = require('../models/posts');

mongoose.connect('mongodb://localhost:27017/fsoc', {
    useNewUrlParser: true, useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error!"));
db.once('open', () => {
    console.log("Database connected!");
});

const titles = ['Movies', 'TV Shows', 'Sports', 'Music', 'Food']

const seedDb = async() => {
    await Society.deleteMany({});
    // await Post.deleteMany({});

    for(let i=0;i<5;i++){
        const society = new Society({
            title: titles[i],
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro nemo pariatur unde fuga eos nostrum, optio ipsam voluptatem? Consequuntur odit dolorem tempora magnam iusto? Dolore maxime placeat ipsa cupiditate suscipit.",
            headImage: "https://source.unsplash.com/random",
            mod: '62bdd9a959a1941b72139dab',
            members: ['62bddc9ace972c756d58075b'],
            posts: ['62c8721d2bcfb49369392713', '62c8721d2bcfb49369392715', '62c8721d2bcfb49369392717']
        });
        await society.save();
    }

    // for(let i=0;i<3;i++){
    //     const post = new Post({
    //         subject: `Title No${i}`,
    //         textContent: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Non quisquam sapiente dicta cupiditate, excepturi laboriosam delectus dolor, quaerat et exercitationem quidem voluptate quia! Odio rerum laboriosam culpa nulla non corporis.",
    //         postedBy: '62bdd9a959a1941b72139dab',
    //         likes: '62bdd9a959a1941b72139dab'
    //     })
    //     await post.save();
    // }
}

seedDb().then(() => {
    mongoose.connection.close();
})