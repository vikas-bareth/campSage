const Joi = require('joi')

module.exports.joiCampgroundSchema = Joi.object({
    campgrounds:Joi.object({
        title:Joi.string().max(40).required(),
        location:Joi.string().max(100).required(),
        price:Joi.number().min(0).max(9999).required(),
        image:Joi.string().required(),
        description:Joi.string().max(1000).required()
    }).required()
})
