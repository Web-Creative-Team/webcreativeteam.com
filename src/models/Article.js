const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({

    articleTitle: {
        type: String,
        required: [true, "Title is required!"]
    },
        
    articleImage: {
        type: String,
        required: [true, "Image is required!"]
    },

    articleContent: {
        type: String,
        required: [true, "Content is required!"]
    },

    articleMetaTitle:{
        type: String,
        required: [true, "Meta Title is required!"]
    },

    articleMetaDescription:{
        type: String,
        required: [true, "Meta Description is required!"]
    },

    dateCreated: String

})


const Article = mongoose.model('Article', articleSchema);

module.exports = Article;