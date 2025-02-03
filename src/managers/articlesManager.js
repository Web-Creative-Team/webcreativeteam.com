const Article = require('../models/Article');

exports.getAll = async () => {
    return await Article.find({}).lean();
};

exports.getOne = (articleId) => {
    return Article.findById(articleId).lean();
};

exports.create = (articleData) => {
    return Article.create(articleData);
};

exports.edit = async (articleId, articleData) => {
    return await Article.findByIdAndUpdate(articleId, articleData, { new: true });
};

exports.delete = (articleId) => {
    return Article.findByIdAndDelete(articleId);
};
