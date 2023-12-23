const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {descriptors, places} = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/CampSage')
    .then(() => {
        console.log("CONNECTION OPEN");
    })
    .catch((err) => {
        console.log("OHH NO! ERROR OCCURED")
        console.log(err);
    })

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<20; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const randomPrice = Math.floor(Math.random() * 130 + 10);
        const camp = new Campground({
            image:'https://source.unsplash.com/collection/483251',
            title:`${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            price:randomPrice,
            description:'Discover tranquility at Whispering Pines Campground, a hidden gem in a pristine forest. Set up camp under towering trees, beside a babbling brook, or choose a snug cabin. Explore winding trails leading to secret clearings and hidden waterfalls.'
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})


