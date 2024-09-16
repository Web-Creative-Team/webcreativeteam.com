const Template = require('../models/Template');

exports.getAll = async () => {
    let templates = await Template.find({}).lean();
    return templates;
}

exports.getOne = async (templateId) => await Template.findById(templateId)

exports.create = (templateData) => Template.create(templateData);

exports.edit = (templateId, templateData) => Template.findByIdAndUpdate(templateId, templateData);

exports.delete = (templateId) => Template.findByIdAndDelete(templateId)