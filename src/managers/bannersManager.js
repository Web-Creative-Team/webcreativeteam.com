// bannersManager.js
const Banner = require('../models/Banner');

exports.getAll = async () => {
    return await Banner.find({}).lean();
};

exports.getOne = async (bannerId) => {
    return await Banner.findById(bannerId);
};

exports.create = (bannerData) => {
    return Banner.create(bannerData);
};

exports.edit = async (bannerId, bannerData) => {
    return await Banner.findByIdAndUpdate(bannerId, bannerData, { new: true });
};

exports.delete = (bannerId) => {
    return Banner.findByIdAndDelete(bannerId);
};