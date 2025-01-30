const mongoose = require('mongoose');


const templateSchema = new mongoose.Schema({

    templateImage: {
        type: String,
        required: [true, "Image is required"]
    },

    templateAltAttribute: {
        type: String,
        required: [true, 'Alt attribute is required' ]
    },
    
    templateTitle: {
        type: String,
        required: [true, "Title is required"]
    },

    templateShortDescription: {
        type: String,
        required: [true, "Short description is required"]
    },

    previewLink: {
        type: String,
        required: [true, "Preview link is required"]
    },

})


const Template = mongoose.model('Template', templateSchema);

module.exports = Template;