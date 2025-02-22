const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    articleTitle: {
        type: String,
        required: [true, "Title is required!"],
        minLength: [3, "The title is too short!"],
        maxLength: [80, "The title is too long!"],
        match: [/^[\p{L}0-9\s\-\., - – |!?%$&@„“‘’(){}\[\]:;\/\\_=\+\*#^~`]+$/u, "The Article title contains invalid characters!"],  
    },

    articleImage: {
        type: String,
        required: [true, "Image is required!"],
    },

    articleThumbnailImage: {
        type: String,
        required: [true, "Thumbnail Image is required!"],
    },

    articleAlt: { 
        type: String, 
        required: [true, "Alt text is required!"],
        match: [/^[\p{L}0-9\s\-\., - – |!?%$&@„“‘’(){}\[\]:;\/\\_=\+\*#^~`]+$/u, "The Alt text contains invalid characters!"], 
        maxLength: [30, "The Alt text could be 30 characters long maximum"]
    }, 

    articleContent: {
        type: String,
        required: [true, "Content is required!"],
        match: [/^[\p{L}0-9\s\-\., - – |!?%$&@„“‘’(){}\[\]:;\/\\_=\+\*#^~`]+$/u, "The Article Content contains invalid characters!"], 

    },

    articleMetaTitle: {
        type: String,
        required: [true, "Meta Title is required!"],
        match: [/^[\p{L}0-9\s\-\., - – |!?%$&@„“‘’]+$/u, "The Meta Title contains invalid characters!"], 
        maxLength: [70, "The Meta Title could be 70 characters long maximum"]
    },

    articleMetaDescription: {
        type: String,
        required: [true, "Meta Description is required!"],
        match: [/^[\p{L}0-9\s\-\., - – |!?%$&@„“‘’(){}\[\]:;\/\\_=\+\*#^~`]+$/u, "The Meta Description contains invalid characters!"], 
        maxLength: [160, "The Meta Describtion could be 160 characters long maximum"]
    },

    dateCreated: String, 
    
    storageFolder: { 
        type: String, 
        default: "blogimages",
    }
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;

