const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    rating:{
        type:Number,
        required:true
    },
    body:{
        type:String,
        required:true
    }
})

module.exports = mongoose.model('Review',reviewSchema);

