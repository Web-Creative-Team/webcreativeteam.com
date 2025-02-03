const axios = require("axios");
const FormData = require("form-data");
require("dotenv").config();

const PCloudToken = process.env.PCLOUD_ACCESS_TOKEN;
const PCloudUploadUrl = "https://api.pcloud.com/uploadfile";
const PCloudFileLinkUrl = "https://api.pcloud.com/getfilelink";

/**
 * Uploads a file to pCloud inside the correct asset folder.
 * @param {Buffer} fileBuffer - The file data.
 * @param {string} fileName - The name of the file.
 * @param {string} assetType - The type of asset (banners, heroBanners, etc.).
 * @returns {Promise<string>} - Returns the **direct file URL** of the uploaded image.
 */
async function uploadFileToPCloud(fileBuffer, fileName, assetType) {
    // ✅ Correct folder IDs
    const folderMapping = {
        "banners": "22300824960",       // ✅ herobanners folder
        "heroBanners": "22300824960",
        "blogImages": "22300729335",
        "servicesImages": "22300729335",
        "templateImages": "22300729335",
    };

    const folderId = folderMapping[assetType] || "22300729335"; // Default folder

    const formData = new FormData();
    formData.append("file", fileBuffer, fileName);
    formData.append("folderid", folderId);  // 🔥 Explicitly set correct folder ID

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
            const fileId = response.data.metadata[0]?.fileid;

            // ✅ Step 2: Generate a **direct file link**
            console.log("Fetching direct file link...");
            const fileLinkResponse = await axios.get(`${PCloudFileLinkUrl}?fileid=${fileId}&auth=${PCloudToken}`);

            if (fileLinkResponse.data.result === 0) {
                const host = fileLinkResponse.data.hosts[0];
                const path = fileLinkResponse.data.path;
                const directUrl = `https://${host}${path}`;  // 🔥 Ensure `https://` is included

                console.log("✅ Direct File URL:", directUrl);
                return directUrl; // 🔥 Return the **corrected direct file link**
            } else {
                throw new Error(`Failed to retrieve direct file link: ${fileLinkResponse.data.error}`);
            }
        } else {
            throw new Error(`pCloud Upload Error: ${response.data.error}`);
        }
    } catch (error) {
        console.error("❌ Error uploading to pCloud:", error.message);
        throw new Error("Failed to upload file.");
    }
}

module.exports = { uploadFileToPCloud };
