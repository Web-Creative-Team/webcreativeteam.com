const Banner = require('../models/Banner');

exports.getAll = async () => {
    let banners = await Banner.find({}).lean();
    return banners;
}

exports.getOne = async (bannerId) => await Banner.findById(bannerId)

exports.create = (bannerData) => Banner.create(bannerData)

exports.edit = (bannerId, bannerData)=> Banner.findByIdAndUpdate(bannerId, bannerData);

exports.delete = (bannerId) => Banner.findByIdAndDelete(bannerId);