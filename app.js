const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const port = 3000;
const engine = require('ejs-mate');
const Joi = require('joi');
const session = require('express-session');
const flash = require('connect-flash');

const campground = require('./routes/campgrounds');
const reviews = require('./routes/reviews');

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

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//express router handlers
app.use('/campgrounds',campground)
app.use('/campgrounds/:id/review',reviews)

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