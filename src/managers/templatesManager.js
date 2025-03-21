const Template = require('../models/Template');

exports.getAll = async () => {
    return await Template.find({}).lean();
};

exports.getOne = async (templateId) => {
    return await Template.findById(templateId);
};

exports.create = (templateData) => {
    return Template.create(templateData);
};

exports.edit = async (templateId, templateData) => {
    return await Template.findOneAndUpdate(
        { _id: templateId }, // Query by ID
        templateData, 
        { new: true, runValidators: true, context: "query" } // Ensure validators run
    );
};

exports.delete = (templateId) => {
    return Template.findByIdAndDelete(templateId);
};
