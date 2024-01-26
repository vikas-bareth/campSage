const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
// const User = require('./user');

const imageSchema = new Schema({
    url:String,
    filename:String
})

imageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload','/upload/w_200');
})

const CampgroundSchema = new Schema({
    title: {
        type:String,
        required:true
    },
    images: [imageSchema],
    price: {
        type:Number,
        required:true
    },
    description: {
        type:String,
        required:true
    },
    location: {
        type:String,
        required:true
    },
    geometry: {
        type: {
          type: String, // Don't do `{ location: { type: String } }`
          enum: ['Point'], // 'location.type' must be 'Point'
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }
      },
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})

CampgroundSchema.post('findOneAndDelete',async function(doc){
    if(doc){
        await Review.deleteMany({_id:{$in:doc.reviews}})
    }
})

module.exports = mongoose.model('Campground',CampgroundSchema);