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

exports.validateAndUpdate = async (bannerId, bannerData) => {
    let banner = await Banner.findById(bannerId);

    if (!banner) {
        throw new Error("Banner not found.");
    }

    // ✅ Apply new values, but let Mongoose handle validation
    banner.bannerTitle = bannerData.bannerTitle;
    banner.bannerSubtitle = bannerData.bannerSubtitle;
    if (bannerData.bannerImage) {
        banner.bannerImage = bannerData.bannerImage;
    }

    // ✅ Validate before saving
    await banner.validate();
    return banner.save();
};

