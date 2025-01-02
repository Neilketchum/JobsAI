const { Storage } = require('@google-cloud/storage');
const { BUCKET_NAME } = require('../constants/constants');

const storage = new Storage();
const bucketName = BUCKET_NAME;

module.exports = { storage, bucketName };
