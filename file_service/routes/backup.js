'use strict';

const fs = require('fs');
const winston = require(global.__base + 'config/winston');
const mongoose = require('mongoose');
const { Readable } = require('stream');
const path = require('path');
const mongoDriver = mongoose.mongo;

module.exports = {
    backupAll: () => {
        return function (req, res) {
            req.app.locals.gfs.find({}).toArray((err, files) => {
                if (err) {
                    res.json(err);
                    return;
                }
                for (let i = 0; i < files.length; i++) {
                    const currFile = files[i];

                    const readStream = req.app.locals.gfs.openDownloadStream(currFile._id);
                    const subfolder = currFile.metadata.tableName ? currFile.metadata.tableName : 'Unknown';
                    const fileName = currFile.filename ? currFile.filename : 'Unknown' + i;
                    const dir = path.join(global.__base, 'backup', subfolder, fileName);
                    ensureDirectoryExistence(dir);
                    const writeStream = fs.createWriteStream(dir);
                    readStream.pipe(writeStream);
                }
                res.status(200).json('ok');
            });
        };
    }
};

function ensureDirectoryExistence (filePath) {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
}
