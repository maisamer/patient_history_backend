var admin = require("firebase-admin");
const bucket = admin.storage().bucket();

exports.downloadFil = async function (filename) {
    const {Storage} = require('@google-cloud/storage');
    var projectId = "patient-history-12cb8";
    var keyFilename ="C://Users//go//Downloads//patient-history-c41dda1dd688.json";
    const storage = new Storage({projectId, keyFilename});
    return new Promise((resolve, reject) => {
        try {
            const bucket = storage.bucket('patient-history-12cb8.appspot.com');
            const file = bucket.file(filename);
            file.download(function (err, contents) {
                if (err) {
                    console.log(err);
                    reject(err);
                } else
                    console.log('content ', contents);
                    resolve(contents);
                // image
                /*fs.writeFile('image.png', contents,function(err, result){
                    if(err){
                        console.log(err);
                    }else{
                        console.log(result);
                    }
                });*/

            });

        } catch (err) {
            console.error('ERROR:', err);
            reject(err);
        }
    });
};
exports.uploadFileToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        console.log(file);
        let newFileName = `${file.originalname}_${Date.now()}`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            console.log(error);
            reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const url = fileUpload.name;

            resolve(url);
        });

        blobStream.end(file.buffer);
    });
};
