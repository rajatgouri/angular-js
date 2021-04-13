'use strict';

const express = require('express');
const router = express.Router();
// const winston = require(global.__base + 'config/winston');
const db = require(global.__base + 'config/sequelize');
const common = require('../common');

const model = 'Protein';

const getCriteria = {
    include: [{
        model: db.Plasmid,
        attributes: ['id', 'name', 'description', 'ENUM_plasmidTag'],
        include: [
            {
                model: db.PlasmidData
            },
            {
                model: db.PlasmidAnnotation,
                attributes: ['description', 'type', 'start', 'end']
            }
        ]
    }],
    order: [
        [{ model: db.Plasmid }, { model: db.PlasmidAnnotation }, 'start', 'ASC']
    ]
};

const getListCriteria = {
    where: { isDeleted: false },
    attributes: {
        include: [
            [db.Sequelize.literal('CONCAT_WS(" x ", `ProteinAntigen`.pos1Antigen, `ProteinAntigen`.pos2Antigen, `ProteinAntigen`.pos3Antigen, `ProteinAntigen`.pos4Antigen)'), 'antigen'],
            [db.Sequelize.literal('ROUND(`Protein`.molarExtCoefficient / `Protein`.molecularWeight * 10, 2)'), 'nanodrop']
        ]
    },
    include: [{
        model: db.ProteinAntigen,
        attributes: []
    }]
};

const getMappingAttrs = ['id', 'name', 'description'];

router.post('/get', common.getEntry(model, getCriteria));
router.post('/create', create);
router.post('/update', update);
router.post('/delete', common.deleteEntry(model));
router.get('/getlist', common.getList(model, 'proteins', getListCriteria));
router.get('/getmapping', common.getNameMapping(model, getMappingAttrs));
router.post('/searchByProject', searchByProject);

function update (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when update protein' });
        return;
    }
    const rb = req.body;
    if (!rb.userId) {
        res.status(400).json({ error: 'Invalid userId when update protein' });
        return;
    }
    if (!rb.id) {
        res.status(400).json({ error: 'empty id when update protein' });
        return;
    }

    if (!rb.updatedAt) {
        res.status(400).json({ error: 'empty updatedAt when update protein' });
        return;
    }

    if (!rb.projectId) {
        res.status(400).json({ error: 'empty projectId when update protein' });
        return;
    }

    db.Protein.findOne({ where: { id: rb.id } }).then(function (protein) {
        if (!protein) {
            res.status(404).json({ error: 'the protein is not found' });
            return;
        }
        const originalUpdatedAt = new Date(protein.updatedAt);
        const currentUpdatedAt = new Date(rb.updatedAt);
        if (originalUpdatedAt.valueOf() !== currentUpdatedAt.valueOf()) {
            res.status(403).json({ error: 'conflict' });
            return;
        }

        let typeCode = protein.typeCode;
        if (protein.projectId === rb.projectId && protein.ENUM_moleculeType === rb.ENUM_moleculeType) {
            db.Protein.update({
                description: rb.description,
                updatedBy: rb.userId,
                molecularWeight: rb.molecularWeight,
                molarExtCoefficient: rb.molarExtCoefficient,
                pI: rb.pI,
                references: rb.references
            }, { where: { id: rb.id } }).then(
                function () {
                    res.status(200).json({ message: 'ok' });
                },
                function (err) {
                    res.status(500).json({ error: { source: 'db', yousend: rb, dbsays: err } });
                }
            );
        } else {
            typeCode = getProteinTypeShorthand(rb.ENUM_moleculeType);
            db.Protein.findAll({
                where: { projectId: rb.projectId, typeCode: typeCode },
                order: [['rank', 'DESC']],
                limit: 1
            }).then(function (result) {
                let rank = 1;
                if (result && result.length > 0) {
                    rank = parseInt(result[0].rank) + 1;
                }
                const name = 'SI-' + rb.projectId + typeCode + rank;
                db.Protein.update({
                    rank: rank,
                    projectId: rb.projectId,
                    typeCode: typeCode,
                    ENUM_moleculeType: rb.ENUM_moleculeType,
                    description: rb.description,
                    molecularWeight: rb.molecularWeight,
                    molarExtCoefficient: rb.molarExtCoefficient,
                    pI: rb.pI,
                    name: name,
                    updatedBy: rb.userId
                }, { where: { id: rb.id } }).then(
                    function () {
                        res.status(200).json({ message: 'ok' });
                    },
                    function (err) {
                        res.status(500).json({ error: { source: 'db', yousend: rb, dbsays: err } });
                    }
                );
            }, function (err) {
                res.status(500).json({ error: { source: 'db', yousend: rb, dbsays: err } });
            });
        }
    },
    function (err) {
        res.status(500).json({ error: { source: 'db', yousend: rb, dbsays: err } });
    });
}

function create (req, res) {
    if (!req.body) {
        res.status(400).json({ error: 'Empty payload when createProtein' });
        return;
    }
    const rb = req.body;

    if (!rb.plasmidList) {
        res.status(400).json({ error: 'Invalid plasmidList when createProtein' });
        return;
    }
    const plasimidArray = rb.plasmidList;
    if (plasimidArray.length < 1) {
        res.status(400).json({ error: 'Invalid plasmidList when createProtein' });
        return;
    }

    db.EnumConfig.find({ where: { tableName: 'proteins' }, raw: true }).then(function (enumConfig) {
        const currProp = JSON.parse(enumConfig.properties);
        for (const fieldName in rb) {
            if (fieldName.startsWith('ENUM_')) {
                const value = rb[fieldName];
                if (value) {
                    const enumList = currProp[fieldName];
                    if (enumList.indexOf(value) < 0) {
                        res.status(403).json({ error: fieldName + ' value out of range : ' + enumList.join(';') });
                        return;
                    }
                }
            }
        }

        const typeCode = getProteinTypeShorthand(rb.ENUM_moleculeType);

        db.Protein.findAll({
            where: { projectId: rb.projectId, typeCode: typeCode },
            order: [['rank', 'DESC']],
            limit: 1
        }).then(function (result) {
            let rank = 1;
            if (result && result.length > 0) {
                rank = parseInt(result[0].rank) + 1;
            }
            rb.typeCode = typeCode;
            rb.rank = rank;
            rb.name = 'SI-' + rb.projectId + typeCode + rank;
            db.Protein.create({
                name: rb.name,
                projectId: rb.projectId,
                rank: rb.rank,
                typeCode: rb.typeCode,
                ENUM_moleculeType: rb.ENUM_moleculeType,
                description: rb.description,
                molecularWeight: rb.molecularWeight,
                molarExtCoefficient: rb.molarExtCoefficient,
                pI: rb.pI,
                createdBy: rb.userId,
                updatedBy: rb.userId
            }).then(function (createResult) {
                const plasmidMap = plasimidArray.map(plasmid => {
                    return {
                        plasmidId: plasmid,
                        proteinId: createResult.id,
                        createdBy: rb.userId,
                        updatedBy: rb.userId
                    };
                });
                db.ProteinPlasmidMapping.bulkCreate(plasmidMap);
                res.status(200).json(createResult);
                // async.each(plasimidArray, function (plasmidId, callback) {
                //     if (plasmidId) {
                //         const mapping = {
                //             plasmidId: plasmidId,
                //             proteinId: createResult.id,
                //             createdBy: rb.userId,
                //             updatedBy: rb.userId
                //         };
                //         db.ProteinPlasmidMapping.create(mapping).then(() => {
                //             callback();
                //         }, function (rejectedPromiseError) {
                //             winston.error('create mapping Failed: ', rejectedPromiseError);
                //             callback();
                //         });
                //     } else {
                //         callback();
                //     }
                // }, function (err) {
                //     if (err) {
                //         res.status(500).json({ error: 'cannot create plasmid protein mappings' });
                //         return;
                //     }
                //     res.status(200).json(createResult);
                // });
            }, function (rejectedPromiseError) {
                if (rejectedPromiseError.name === 'SequelizeForeignKeyConstraintError') {
                    res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
                    return;
                }
                res.status(500).json({ error: rejectedPromiseError });
            });
        }, function (err) {
            res.status(500).json({ error: { source: 'db', yousend: rb, dbsays: err } });
        });
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: 'db', yousend: rb, dbsays: rejectedPromiseError });
    });
}

function searchByProject (req, res) {
    const body = req.body;

    const criteria = {
        where: {
            isDeleted: false,
            projectId: body.projectId
        },
        attributes: [
            'id', 'name', 'description', 'ENUM_moleculeType', 'molecularWeight', 'molarExtCoefficient', 'pI', 'createdBy'
        ]
    };

    db.Protein.findAll(criteria).then(function (Protein) {
        res.json(Protein);
    }, function (rejectedPromiseError) {
        res.status(500).json({ error: rejectedPromiseError });
    });
}

function getProteinTypeShorthand (ProteinType) {
    const moleculeTypeShorthand = {
        // "Control": "C",
        'Reagent': 'R',
        'Bispecific': 'X',
        'Trispecific': 'X',
        'Tetraspecific': 'E',
        'scFv-Fc': 'SF',
        'mAb': 'C',
        'Fc-scFv': 'FS',
        'Humanized': 'H',
        'Other': '?'
    };

    if (ProteinType in moleculeTypeShorthand) {
        return moleculeTypeShorthand[ProteinType];
    }
    return '?';
}

module.exports = router;
