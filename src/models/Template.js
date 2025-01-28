const mongoose = require('mongoose');


const templateSchema = new mongoose.Schema({

    templateImage: {
        type: String,
        required: [true, "Template image is required"]
    },

    templateTitle: {
        type: String,
        required: [true, "Template title is required"]
    },

    templateShortDescription: {
        type: String,
        required: [true, "Short description for the template is required"],
        min: 10,
        max: 50
    },

    previewLink: {
        type: String,
        required: [true, "Link for the preview is required"]
    },

    templateAltAttribute: {
        type: String,
        reqquired: [true, 'Attribute "alt" is required' ]
    }
    


})


const Template = mongoose.model('Template', templateSchema);

module.exports = Template;