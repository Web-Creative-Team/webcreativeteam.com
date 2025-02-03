const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const PCloudToken = process.env.PCLOUD_ACCESS_TOKEN;
const PCloudUploadUrl = "https://api.pcloud.com/uploadfile";

/**
 * Uploads a file to pCloud inside the correct folder.
 * @param {Buffer} fileBuffer - The file data.
 * @param {string} fileName - The name of the file.
 * @param {string} folderName - The target folder (e.g., "herobanner", "blogimages").
 * @returns {Promise<string>} - Returns the permanent file URL.
 */
async function uploadFileToPCloud(fileBuffer, fileName, folderName) {
    // ✅ Correct folder mappings
    const folderMapping = {
        "herobanner": "22300824960",
        "blogimages": "22300838896",  // ✅ Fixed folder ID
    };

    const folderId = folderMapping[folderName];

    if (!folderId) {
        console.error("❌ Invalid folder name provided:", folderName);
        throw new Error("Invalid storage folder!");
    }

    console.log(`🚀 Uploading to pCloud...`);
    console.log(`📂 Folder: ${folderName}`);
    console.log(`🗂 Folder ID: ${folderId}`);
    console.log(`📎 File Name: ${fileName}`);

    // ✅ Prepare FormData
    const formData = new FormData();
    formData.append("file", fileBuffer, fileName);
    formData.append("folderid", folderId);

    try {
        // 🔄 Upload request
        const response = await axios.post(
            `${PCloudUploadUrl}?auth=${PCloudToken}&folderid=${folderId}`,
            formData,
            { headers: { ...formData.getHeaders() } }
        );

        if (response.data.result === 0) {
            console.log("✅ Upload successful:", response.data);
            return `https://filedn.com/lL84jfUjkOJ5JauGvrOlJsV/webcreativeteam/${folderName}/${fileName}`;
        } else {
            throw new Error(`pCloud Upload Error: ${response.data.error}`);
        }
    } catch (error) {
        console.error("❌ Error uploading to pCloud:", error.message);
        throw new Error("Failed to upload file.");
    }
}

module.exports = { uploadFileToPCloud };
