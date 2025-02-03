const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    bannerImage: {
        type: String,
        required: [true, "Banner Image is Required"]
    },
    bannerTitle: {
        type: String,
        required: [true, "Banner Title is Required"]
    },
    bannerSubtitle: {
        type: String,
        required: [true, "Banner Subtitle is Required"]
    },
    storageFolder: { 
        type: String, 
        default: "herobanner",  // ✅ Ensures banners always get saved in 'herobanner'
        required: true
    }
});

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;
