const Template = require('../models/Template');

exports.getAll = async () => {
    let templates = await Template.find({}).lean();
    return templates;
}

exports.create = (templateData) => Template.create(templateData);