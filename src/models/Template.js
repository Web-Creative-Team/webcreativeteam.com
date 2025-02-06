const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    templateImage: {
        type: String,
        required: [true, "Image is required"]
    },
    templateAltAttribute: {
        type: String, 
        required: [true, "Alt text is required!"],
        match: [/^[\p{L}0-9\s\-\.,!?%$&@]+$/u, "Използване на забранени символи!"], 
        maxLength: [20, "Alt текстът може да бъде максимум 20 символа"] 
    },
    templateTitle: {
        type: String,
        required: [true, "Title is required"],
        match: [/^[\p{L}0-9\s\-\.,!?%$&@]+$/u, "Използване на забранени символи!"], 
        maxLength: [25, "Заглавието може да бъде максимум 25 символа"]
    },
    templateShortDescription: {
        type: String,
        required: [true, "Short description is required"],
        match: [/^[\p{L}0-9\s\-\.,!?%$&@]+$/u, "Използване на забранени символи!"], 
        maxLength: [50, "Краткото описание може да бъде максимум 50 символа"]
    },
    previewLink: {
        type: String,
        required: [true, "Preview link is required"],
        match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, "Невалиден формат за линк"],
    },
    storageFolder: { 
        type: String, 
        default: "templateimages"  
    }
});

const Template = mongoose.model('Template', templateSchema);
module.exports = Template;
