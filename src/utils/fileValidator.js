const path = require("path");

/**
 * Validates if the uploaded file is a **real** image.
 * @param {Object} file - The file object from multer.
 * @returns {Promise<boolean>} - Returns `true` if the file is an actual image, otherwise `false`.
 */
async function isValidImage(file) {
    if (!file) return false;

    // ✅ Dynamically import `file-type` (fixes CommonJS issue)
    const { fileTypeFromBuffer } = await import("file-type");

    // ✅ Allowed MIME types (Strict Security)
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"];

    // ✅ Allowed file extensions (Secondary Check)
    const allowedExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"];

    // Detect actual file type from buffer
    const fileTypeDetected = await fileTypeFromBuffer(file.buffer);
    if (!fileTypeDetected) return false; // File type couldn't be determined (fake file)

    const fileTypeMIME = fileTypeDetected.mime;
    const fileName = file.originalname.toLowerCase();
    const fileExtension = path.extname(fileName).toLowerCase();

    // ✅ Check if MIME type is valid
    const isMimeValid = allowedMimeTypes.includes(fileTypeMIME);

    // ✅ Check if file extension is valid
    const isExtensionValid = allowedExtensions.includes(fileExtension);

    return isMimeValid && isExtensionValid;
}

module.exports = { isValidImage };
