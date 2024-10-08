const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({

    bannerImage: {
        type: String,
        required: [true, "Banner Image is Required"]
    },

    bannerTitle: {
        type: String,
        required: [true, "Banner Slogan is Required"]
    },
    
    bannerSubtitle: {
        type: String,
        required: [true, "Banner Slogan is Required"]
    }

})


const Banner = mongoose.model('Banner', bannerSchema);

module.exports = Banner;