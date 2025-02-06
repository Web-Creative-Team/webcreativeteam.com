const Article = require('../models/Article');

exports.getAllSorted = async () => {
    return await Article.find({}).sort({ dateCreated: -1 }).lean(); // 🔥 Sort by newest first
};

exports.getAll = async () => {
    return await Article.find({}).lean();
};

exports.getOne = (articleId) => {
    return Article.findById(articleId).lean();
};

exports.create = (articleData) => {
    return Article.create(articleData);
};

exports.edit = (articleId, articleData) => {
    return Article.findByIdAndUpdate(articleId, articleData, { new: true, runValidators: true });
};

exports.delete = (articleId) => {
    return Article.findByIdAndDelete(articleId);
};
