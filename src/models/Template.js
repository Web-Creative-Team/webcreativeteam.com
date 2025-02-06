const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
    templateImage: {
        type: String,
        required: [true, "Image is required"]
    },
    templateAltAttribute: {
        type: String, 
        required: [true, "Alt text is required!"],
        match: [/^[\p{L}0-9\s\-\.,!?%$&@]+$/u, "The Alt text contains invalid characters!"], 
        maxLength: [20, "The Alt text could be 20 characters long maximum"] 
    },
    templateTitle: {
        type: String,
        required: [true, "Title is required"],
        match: [/^[\p{L}0-9\s\-\.,!?%$&@]+$/u, "The Alt text contains invalid characters!"], 
        maxLength: [25, "The title could be 25 characters long maximum"]

    },
    templateShortDescription: {
        type: String,
        required: [true, "Short description is required"],
        maxLength: [50, "The Short Describtion could be 50 characters long maximum"]

    },
    previewLink: {
        type: String,
        required: [true, "Preview link is required"],
        match: [/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/, "Invalid URL format"],
    },
    storageFolder: { 
        type: String, 
        default: "templateimages"  // ✅ Corrected storage folder field
    }
});

const Template = mongoose.model('Template', templateSchema);
module.exports = Template;
