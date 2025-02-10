const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    bannerImage: {
        type: String,
        required: [true, "Banner Image is Required"]
    },
    bannerTitle: {
        type: String,
        required: [true, "Моля въведете слоган!"],
        match: [/^[\p{L}0-9\s\-\.,!?%$&@]+$/u, "Използване на забранени символи!"],
        minLength: [3, "Слоганът е твърде кратък!"],
        maxLength: [40, "Слоганът е твърде дълъг!"]
    },
    bannerSubtitle: {
        type: String,
        required: [true, "Моля въведете кратко изречение!"],
        match: [/^[\p{L}0-9\s\-\.,!?%$&@]+$/u, "Използване на забранени символи!"],
        minLength: [3, "Текстът е твърде кратък!"],
        maxLength: [80, "Текстът е твърде дълъг!"]
    },
    storageFolder: { 
        type: String, 
        default: "herobanner",  
        required: true
    }
});

const Banner = mongoose.model('Banner', bannerSchema);
module.exports = Banner;
