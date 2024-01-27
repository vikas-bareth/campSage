const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');

mongoose.connect('mongodb://127.0.0.1:27017/CampSage')
    .then(() => {
        console.log("CONNECTION OPEN");
    })
    .catch((err) => {
        console.log("OHH NO! ERROR OCCURED")
        console.log(err);
    })
const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i=0; i<30; i++){
        const randomCity = Math.floor(Math.random() * 60);
        const randomPrice = Math.floor(Math.random() * 130 + 10);
        const camp = new Campground({
            author:'65a57d87613db661d5544850',
            title:`${cities[randomCity].title}`,
            location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
            geometry: { type: 'Point', coordinates: [ cities[randomCity].longitude,cities[randomCity].latitude] },
            price:randomPrice,
            description:'Discover tranquility at Whispering Pines Campground, a hidden gem in a pristine forest. Set up camp under towering trees, beside a babbling brook, or choose a snug cabin. Explore winding trails leading to secret clearings and hidden waterfalls.',
            images:[
                {
                    url: 'https://res.cloudinary.com/dyxkk7ptw/image/upload/v1705991957/CampSage/dcoao3ai4kcketmvws0h.jpg',
                    filename: 'CampSage/dcoao3ai4kcketmvws0h',
                  },
                {
                  url: 'https://res.cloudinary.com/dyxkk7ptw/image/upload/v1705991955/CampSage/wd3rfrvn72rnczxhilpz.jpg',
                  filename: 'CampSage/wd3rfrvn72rnczxhilpz',
                }
              ]
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})


