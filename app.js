if(process.env.NODE_ENV !== "production"){
    require('dotenv').config()
}

const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const port = 3000;
const engine = require('ejs-mate');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const ExpressError = require('./utils/ExpressError');

const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users')

const User = require('./models/user')

mongoose.connect('mongodb://127.0.0.1:27017/CampSage')
    .then(() => {
        console.log("CONNECTION OPEN");
    })
    .catch((err) => {
        console.log("OHH NO! ERROR OCCURED")
        console.log(err);
    })

const app = express();

app.engine('ejs', engine);

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')))


app.use(session({
    secret: 'thiswillchange',
    resave: false,
    saveUninitialized: true,
    cookie:{
        //secure:true, was not allowing flash to display messages
        httpOnly:true,
        expires: Date.now() * 1000 * 60 * 60 * 24 * 7,
        maxAge: 7 * 24 * 60 * 60 * 1000
    }
  }))

app.use(flash());

app.use(passport.initialize())
app.use(passport.session())

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})



//express router handlers
app.use('/campgrounds',campgroundRoutes)
app.use('/campgrounds/:id/review',reviewRoutes)
app.use('/',userRoutes)

//fakeuser passport
app.get('/fakeUser',async (req,res) => {
     const user = new User({username:'cat',email:'cat@gmail.com'});
     //for registering pass the instance of a user and a password
     const newUser = await User.register(user,'password')
     //user.register method is coming from passport-local-mongoose dependency
     res.send(newUser)
     
})

//home route
app.get('/',(req,res) => {
    res.render('home')
})
//not found route
app.get('*',(req,res,next) => {
    next(new ExpressError('Page not found',404))
})
//Error handler
app.use((err,req,res,next) => {
    const {status = 500} = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(status).render('error',{err});
})



app.listen(port,()=> {
    console.log(`App listening on ${port}`)
})