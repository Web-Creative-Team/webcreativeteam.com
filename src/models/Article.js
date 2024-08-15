const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({

    articleTitle: {
        type: String,
        required: [true, "Article title is Required"]
    },
    
    articleContent: {
        type: String,
        required: [true, "Article content is Required"]
    },

    articleImage: {
        type: String,
        required: [true, "Article image is required"]
    },

    dateCreated: String

})


const Article = mongoose.model('Article', articleSchema);

module.exports = Article;