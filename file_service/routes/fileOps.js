'use strict';

const fs = require('fs');
const winston = require(global.__base + 'config/winston');
const mongoose = require('mongoose');
const { Readable } = require('stream');
const mongoDriver = mongoose.mongo;

module.exports = {
    deleteEntry: () => {
        return function (req, res) {
            if (!req.params.id) {
                res.status(400).json({ error: 'Empty payload when deleteEntry' });
                return;
            }
            const fileId = mongoDriver.ObjectId(req.params.id);
            req.app.locals.gfs.delete(fileId, function (err) {
                if (err) {
                    winston.error('file deletion failed', err);
                    res.status(400).json({ error: 'file deletion failed' });
                    return;
                }
                res.status(200).json(req.params.id + 'deleted');
            });
        };
    },
    getEntry: () => {
        return function (req, res) {
            if (!req.params.id) {
                res.status(400).json({ error: 'Empty payload when getEntry' });
                return;
            }
            const fileId = mongoDriver.ObjectId(req.params.id);
            req.app.locals.gfs.find({ _id: fileId }).toArray((err, files) => {
                if (err) {
                    res.json(err);
                    return;
                }
                if (files.length > 0) {
                    const mime = files[0].contentType;
                    const fileName = files[0].filename;
                    res.set('Content-Disposition', 'inline; filename=' + fileName);
                    res.set('Content-Type', mime);
                    const readStream = req.app.locals.gfs.openDownloadStream(fileId);
                    readStream.pipe(res);
                } else {
                    res.json('File not found');
                }
            });
        };
    },
    createEntry: () => {
        return function (req, res) {
            if (!req.body) {
                res.status(400).json({ error: 'Empty request body' });
                return;
            }
            if (!req.body.userId) {
                res.status(400).json({ error: 'Empty user id' });
                return;
            }
            if (!req.files.file) {
                res.status(400).json({ error: 'File not provided' });
                return;
            }

            const file = req.files.file;
            const fileStream = new Readable();
            fileStream.push(file.data);
            fileStream.push(null);

            const writeStream = req.app.locals.gfs.openUploadStream(file.name, {
                contentType: file.mimetype,
                metadata: {
                    uploadedBy: req.body.userId,
                    notes: req.body.notes,
                    tableName: req.body.tableName
                }
            });
            fileStream.pipe(writeStream)
                .on('finish', result => {
                    const msg = { fileId: result._id, fileName: result.filename };
                    winston.info('file created: ' + JSON.stringify(msg));
                    res.status(200).json(msg);
                })
                .on('error', err => {
                    winston.error('file creation failed', err);
                    res.status(400).json({ error: 'File creation failed' });
                });
        };
    }
};
