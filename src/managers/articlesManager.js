const Article = require('../models/Article');

exports.getAll = async () => {
let articles = Article.find({}).lean();
return articles;
}

exports.create = (articleData)=> Article.create(articleData);

exports.getOne = (articleId)=> Article.findById(articleId).lean();

exports.edit = (articleId, articleData)=> Article.findByIdAndUpdate(articleId, articleData);

exports.delete = (articleId) => Article.findByIdAndDelete(articleId);