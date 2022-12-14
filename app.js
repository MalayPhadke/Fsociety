const express = require('express');
const app = express();
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const mongoose = require('mongoose');
const ExpressError = require('./utils/ExpressError');
const userRoutes = require('./routes/users');
const societyRoutes = require('./routes/society');
const postRoutes = require('./routes/posts');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const passportLocal = require('passport-local');
const User = require('./models/users');

mongoose.connect('mongodb://localhost:27017/fsoc', {
    useNewUrlParser: true, useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error!"));
db.once('open', () => {
    console.log("Database connected!");
});

app.use(express.urlencoded({ extended : true}))
app.use(express.json())

app.use(methodOverride('_method'))
app.engine('ejs', ejsmate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const sessionOptions = { 
    //name: "session",
    secret: "Mysecret", 
    resave: false, 
    saveUninitialized: true, 
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000*60*60*24*7,
        maxAge: 1000*60*60*24*7
    }
}
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
app.use('/', userRoutes);
app.use('/society', societyRoutes);
app.use('/:id/post', postRoutes);

app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found', 404));
})
app.use((err, req, res, next) => {
    const {status=500} = err;
    if(!err.message) err.message = "Something went Wrong!";
    res.status(status).render('error', {err});
})
app.listen(3000, () => {
    console.log("Listening on port 3000")
})
