const { GOOGLE_CLOUD_SERVICE } = require("../config/config");

const { Storage } = require('@google-cloud/storage');
const path = require("path");
const storage = new Storage({
    projectId: GOOGLE_CLOUD_SERVICE.projectId,
    keyFilename: GOOGLE_CLOUD_SERVICE.key_path,
});

exports.getPublicUrl = (bucketName, fileName) => `${fileName}`;

exports.copyFileToGCS = (localFilePath, options = {}) => {
    const bucketName = GOOGLE_CLOUD_SERVICE.bucket
    const bucket = storage.bucket(bucketName);
    const fileName = path.basename(localFilePath);
    return bucket.upload(localFilePath, options).then(() => exports.getPublicUrl(bucketName, fileName));
};
