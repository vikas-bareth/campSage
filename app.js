const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const port = 3000;
const engine = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const Joi = require('joi');
const { joiCampgroundSchema } = require('./schemas');

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
// app.use(express.static('public'))

const validateCampground = (req,res,next) => {
    const {error } = joiCampgroundSchema.validate(req.body)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new Error(msg,400)
    } else{
        next();
    }
}


app.get('/',(req,res) => {
    res.render('home')
})

app.get('/campgrounds',catchAsync(async (req,res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index',{campgrounds})
}))

app.get('/campgrounds/new', (req,res) =>{
    res.render('campgrounds/new')
})

app.post('/campgrounds',validateCampground, catchAsync(async (req,res,next) => {
    const campground = new Campground(req.body.campgrounds)
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

app.get('/campgrounds/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    res.render('campgrounds/show',{campground})
}))

app.get('/campgrounds/:id/edit',catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit',{campground})
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async(req,res) => {
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,req.body.campgrounds,{new:true});
    res.redirect(`/campgrounds/${campground._id}`)
   
}))

app.delete('/campgrounds/:id', catchAsync(async(req,res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.get('*',(req,res,next) => {
    next(new ExpressError('Page not found',404))
})

app.use((err,req,res,next) => {
    const {status = 500} = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(status).render('error',{err});
})

app.listen(port,()=> {
    console.log(`App listening on ${port}`)
})