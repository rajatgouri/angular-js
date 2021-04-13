'use strict';

// Deprecated

var express = require('express');
var router = express.Router();
var db = require(__base + 'config/sequelize');
var winston = require(__base + 'config/winston');
var sequelize = require('sequelize');

router.createCLAnalytics = function () {
  return function (req, res) {
    res.header('Access-Control-Allow-Origin', "*");

    if (!req.body) {
      res.status(400).json({ error: 'Empty payload when createCLAnalytics' });
      return;
    }
    var reqBody = req.body;
    reqBody.createdBy = reqBody.userId;
    reqBody.updatedBy = reqBody.userId;

    db.EnumConfig.find({ where: { tableName: 'cellLineAnalytics' }, raw: true }).then(function (enumConfig) {
      if (enumConfig) {
        var currProp = JSON.parse(enumConfig.properties);
        for (var fieldName in reqBody) {
          if (reqBody.hasOwnProperty(fieldName)) {
            if (fieldName.startsWith("ENUM_")) {
              var value = reqBody[fieldName];
              if (value) {
                var enumList = currProp[fieldName];
                if (enumList.indexOf(value) < 0) {
                  res.status(403).json({ error: fieldName + ' value out of range : ' + enumList.join(';') });
                  return;
                }
              }
            }
          }
        }
      }

      db.CLAnalytics.create(reqBody).then(function (result) {
        if (reqBody.SECData) {
          for (var i = 0; i < reqBody.SECData.length; i++) {
            var currEntry = reqBody.SECData[i];
            currEntry.cellLineAnalyticId = result.id;
            currEntry.createdBy = reqBody.createdBy;
            currEntry.updatedBy = reqBody.updatedBy;
            db.SECData.create(currEntry);
          }
        }
        res.status(200).json(result);
      }, function (rejectedPromiseError) {
        //TODO : proper status code
        if (rejectedPromiseError.name == "SequelizeForeignKeyConstraintError") {
          res.status(403).json({ error: rejectedPromiseError.index + ' value out of range' });
          return;
        }
        res.status(500).json({ error: rejectedPromiseError });
        return;
      });

    }, function (rejectedPromiseError) {
      res.status(500).json({ error: 'db', yousend: reqBody, dbsays: rejectedPromiseError });
    });
  }
};


router.updateCLAnalytics = function () {
  return function (req, res) {
    res.header('Access-Control-Allow-Origin', "*");

    if (!req.body) {
      res.status(400).json({ error: 'Empty payload when updateCLAnalytics' });
      return;
    }
    var reqBody = req.body;

    // console.log("updating with body:", reqBody);
    db.CLAnalytics.update(reqBody, { where: { id: reqBody.id } }).then(function (CLAnalytics) {
      if (reqBody.SECData) {
        for (var i = 0; i < reqBody.SECData.length; i++) {
          var currEntry = reqBody.SECData[i];
          currEntry.updatedBy = reqBody.updatedBy;
          if (currEntry.id) {
            db.SECData.update(currEntry, { where: { id: currEntry.id } });
          // New entry to create
          } else {
            currEntry.cellLineAnalyticId = reqBody.id;
            currEntry.createdBy = reqBody.updatedBy;
            db.SECData.create(currEntry);
          }
        }
      }
      res.status(200).json({ message: "updated" });
    }, function (err) {
      // console.log("update error in updateCLAnalytics:", err);
      res.status(500).json({ error: err });
    });
  }
};

router.getCLAnalyticsList = function () {
  return function (req, res) {
    var result = {};
    var currentTable = 'cellLineAnalytics'
    result['tableName'] = currentTable;

    db.CLAnalytics.findAll({
      where: { isDeleted: false },
      include: [
        {
          model: db.CellLinePurification,
          attributes: [],
          include: [{
            model: db.CLDHarvest,
            attributes: ['name', 'wellName'],
            include: [{
              model: db.CellLineExperiment,
              attributes: [],
              as: 'experiment',
              include: [{
                model: db.StableCellLine,
                attributes: [],
                include: [{
                  model: db.Protein,
                  attributes: [],
                  include: [{
                    model: db.Project,
                    attributes: ['name']
                  }]
                }]
              }]
            }]
          }]
        }, {
          model: db.SECData,
          attributes: [
            [sequelize.fn('GROUP_CONCAT', sequelize.literal('SECData.type SEPARATOR ", "')), 'type'],
            [sequelize.fn('GROUP_CONCAT', sequelize.literal('SECData.mp SEPARATOR ", "')), 'mp'],
            [sequelize.fn('GROUP_CONCAT', sequelize.literal('SECData.hmw SEPARATOR ", "')), 'hmw'],
          ],
          where: { isDeleted: false },
          required: false,
        },
      ],
      order: [
        [ {model: db.CellLinePurification}, 'cLDHarvestId' , 'DESC']
      ],
      group: 'id',
      raw: true,
    }).then(function (CLAnalytics) {
      result['records'] = CLAnalytics;
      db.EnumConfig.find({ where: { tableName: "cellLineAnalytics" } }).then(function (enumConfig) {
        result['enums'] = null;
        if (enumConfig) {
          result['enums'] = enumConfig.properties;
        }
        res.json(result);
        return;
      }, function (rejectedPromiseError) {
        //TODO : proper status code
        res.status(500).json({ error: 'getEnumConfig Failed. Please check db' });
        return;
      });
    }, function (rejectedPromiseError) {
      //TODO : proper status code
      res.status(500).json({ error: 'getCLAnalyticsList Failed. Please check db' });
      return;
    });
  }
};

router.getNameMapping = function () {
  return function (req, res) {
    db.CLAnalytics.findAll({
      attributes: ['id', 'name'],
      where: { isDeleted: false }
    }).then(function (CLAnalytics) {
      res.status(200).json(CLAnalytics);
    }, function (rejectedPromiseError) {
      res.status(500).json({ error: 'getNameMapping Failed. Please check db' });
      return;
    });
  }
};

// Delete is merely mark the CLAnalytics deleted, and really don't delete it.
router.deleteCLAnalytics = function () {
  return function (req, res) {
    res.header('Access-Control-Allow-Origin', "*");
    if (!req.body) {
      res.status(400).json({ error: 'Empty payload when deleteCLAnalytics' });
      return;
    }
    var reqBody = req.body;

    var option = {};
    if (!reqBody.id) {
      res.status(400).json({ error: 'missing id when deleteCLAnalytics' });
      return;
    }

    db.CLAnalytics.find({ where: { id: reqBody.id } }).then(function (result) {
      var newCLAnalytics = {};
      newCLAnalytics.isDeleted = "1";

      db.CLAnalytics.update(newCLAnalytics, { where: { id: reqBody.id } }).then(function (result) {
        res.status(200).json({ message: "deleted" });
      }, function (err) {
        res.status(500).json({ error: err });
      });
    }, function (err) {
      console.log("err:", err);
      res.status(400).json("deleteCLAnalytics: id not found");
      return;
    });
  }
};

router.getCLAnalytics = function () {
  return function (req, res) {
    res.header('Access-Control-Allow-Origin', "*");

    if (!req.body) {
      res.status(400).json({ error: 'Empty payload when getCLAnalytics' });
      return;
    }
    var reqBody = req.body;

    if (!reqBody.id) {
      res.status(400).json({ error: 'Invalid CLAnalytics id when getCLAnalytics' });
      return;
    }

    db.CLAnalytics.findOne({ 
      where: { id: reqBody.id },
      include: [{
        model: db.SECData,
        where: { isDeleted: false },
        required: false
      }]
    }).then(function (CLAnalytics) {
      if (CLAnalytics) {
        res.status(200).json(CLAnalytics);
      } else {
        res.status(400).json({ error: 'no CLAnalytics id exists' });
      }
    }, function (err) {
      console.log("find err:", err);
      res.status(500).json({ error: 'get CLAnalytics failed. Find id error.' });
    });
  }
};


module.exports = router;