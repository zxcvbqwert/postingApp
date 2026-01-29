// /index.js

if(process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const flash = require('connect-flash');
const passport = require('passport');
const LocalStratergy = require('passport-local');
const ExpressError = require('./utils/ExpressError');
const User = require('./models/users');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');

const mongoDBURL = process.env.MONGO_DB_URL;
mongoose.connect(mongoDBURL);
mongoose.connection.on('error', err => { console.log('MongoDB connection error:', err); });
mongoose.connection.once('open', () => { console.log('MongoDB connection open.'); });

const app = express();

app.set('view engine', 'ejs');
app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
const store = MongoStore.create({ mongoUrl: mongoDBURL, secret: process.env.SECRET });
const sessionConfig = {
	store,
	secret: process.env.SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		// secure: true
	}
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

app.get('/', (req, res) => {
	res.render('home');
});

app.use('/', userRoutes);
app.use('/posts', postRoutes);
app.use('/posts/:id/comments', commentRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => { console.log(`Listening  on http://127.0.0.1:${port}`); });