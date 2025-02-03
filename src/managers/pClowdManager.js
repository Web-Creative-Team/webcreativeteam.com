const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const PCloudToken = process.env.PCLOUD_ACCESS_TOKEN;
const PCloudUploadUrl = "https://api.pcloud.com/uploadfile";

// 🔥 Set the base URL for permanent image links
const mainImageURL = "https://filedn.com/lL84jfUjkOJ5JauGvrOlJsV/webcreativeteam";

/**
 * Uploads a file to pCloud inside the correct asset folder.
 * @param {Buffer} fileBuffer - The file data.
 * @param {string} fileName - The name of the file.
 * @param {string} assetType - The type of asset (banners, heroBanners, etc.).
 * @returns {Promise<string>} - Returns the **stable image URL**.
 */
async function uploadFileToPCloud(fileBuffer, fileName, assetType) {
    // ✅ Define folder names based on asset type
    const folderMapping = {
        "banners": { id: "22300824960", name: "herobanner" }, // ✅ herobanners folder
        "heroBanners": { id: "22300824960", name: "herobanner" },
        "blogImages": { id: "22300729335", name: "blogimages" },
        "servicesImages": { id: "22300729335", name: "servicesimages" },
        "templateImages": { id: "22300729335", name: "templateimages" },
    };

    const folderData = folderMapping[assetType] || { id: "22300729335", name: "misc" };
    const folderId = folderData.id;
    const folderName = folderData.name;

    const formData = new FormData();
    formData.append("file", fileBuffer, fileName);
    formData.append("folderid", folderId);

    try {
        console.log("Uploading file to pCloud...");
        console.log("Auth Token:", PCloudToken);
        console.log("Folder ID:", folderId);

        // ✅ Step 1: Upload the file
        const response = await axios.post(`${PCloudUploadUrl}?auth=${PCloudToken}&folderid=${folderId}`, formData, {
            headers: { ...formData.getHeaders() },
        });

        if (response.data.result === 0) {
            console.log("✅ Upload successful:", response.data);

            // ✅ Construct the **permanent URL**
            const finalURL = `${mainImageURL}/${folderName}/${fileName}`;
            console.log("✅ Final Image URL:", finalURL);

            return finalURL; // 🔥 Return the corrected stable link
        } else {
            throw new Error(`pCloud Upload Error: ${response.data.error}`);
        }
    } catch (error) {
        console.error("❌ Error uploading to pCloud:", error.message);
        throw new Error("Failed to upload file.");
    }
}

module.exports = { uploadFileToPCloud };
