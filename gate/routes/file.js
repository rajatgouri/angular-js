'use strict';

const winston = require(global.__base + 'config/winston');
const asyncRequest = require('request');
const config = require(global.__base + 'config/config');
const fileDomain = config.domain.file;

module.exports = {
    uploadFile: (req, res) => {
        const forwardOptions = {
            method: req.method,
            url: fileDomain + 'upload',
            formData: {
                file: {
                    value: Buffer.from(req.files.file.data),
                    options: {
                        filename: req.files.file.name
                    }
                },
                userId: req.userId,
                tableName: req.body.tableName,
                notes: req.body.notes
            }
        };
        asyncRequest(forwardOptions).pipe(res);
    },
    downloadFile: (req, res) => {
        asyncRequest(fileDomain + 'download/' + req.body.fileId).pipe(res);
    },
    viewFile: (req, res) => {
        if (!req.params.id) {
            res.status(400).json({ error: 'Empty payload when getEntry' });
            return;
        }
        asyncRequest(fileDomain + 'download/' + req.params.id).pipe(res);
    }
};
