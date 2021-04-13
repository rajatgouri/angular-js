'use strict';

/**
 * Module dependencies.
 */
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// Load Configurations
const config = require('./config/config');
const winston = require('./config/winston');

winston.info('Starting ' + config.app.name + '...');
winston.info('Config loaded: ' + config.NODE_ENV);
winston.debug('Accepted Config:', config);

global.__base = path.join(__dirname, '/');
const app = express();
app.use(bodyParser.json());

// datalog apis
const DataLogs = require('./routes/dataLog');
app.use('/datalog', DataLogs);
// enumConfig apis
const enumConfigs = require('./routes/enumConfig');
app.post('/enumconfig/getForManyTable', enumConfigs.getEnumConfigForManyTable());
app.post('/enumconfig/update', enumConfigs.updateEnumConfig());
const RawQuery = require('./routes/rawQuery');
app.post('/query/custom', RawQuery.submitQuery());
app.get('/query/:id', RawQuery.getQuery());
const QueryLibs = require('./routes/querylibs');
app.use('/querylibs', QueryLibs);

const Home = require('./routes/other/home');
app.use('/home', Home);
/// ////////////
// Projects
/// ////////////
const Projects = require('./routes/other/projects');
app.use('/project', Projects);

/// ////////////
// Inventory
/// ////////////
const ProcurifyCSV = require('./routes/Inventory/InventoryProcurify');
app.use('/ProcurifyCSV', ProcurifyCSV);

/// ////////////
// Research
/// ////////////
const ProteinSummary = require('./routes/proteinEngineering/proteinSummary');
const ConstructRequest = require('./routes/proteinEngineering/constructRequest');
const ConstructStatus = require('./routes/proteinEngineering/constructStatus');
const Plasmids = require('./routes/proteinEngineering/plasmids');
const PlasmidLots = require('./routes/proteinEngineering/plasmidLot');
const ProteinPlasmidMappings = require('./routes/analytical/proteinPlasmidMapping');
const Protein = require('./routes/proteinEngineering/proteins');
const ProteinRequest = require('./routes/proteinEngineering/proteinRequest');
const TransfectionRequest = require('./routes/cellLine/transfectionRequest');
const Transfection = require('./routes/cellLine/transfection');
const ProteinPurification = require('./routes/proteinEngineering/proteinPurification');
const ProteinAnalysisRequest = require('./routes/analytical/proteinAnalysisRequest');
const ProteinAnalysisMappings = require('./routes/analytical/proteinAnalysisMapping');
const ProteinAnalysis = require('./routes/analytical/proteinAnalysis');
const KineticRequest = require('./routes/analytical/kineticRequests');
const BindingData = require('./routes/analytical/bindingData');
const StableCellLine = require('./routes/cellLine/stableCellLine');
const AntigenReagent = require('./routes/proteinEngineering/antigenReagent');
app.use('/proteinSummary', ProteinSummary);
app.use('/plasmids', Plasmids);
app.use('/plasmidLot', PlasmidLots);
app.use('/proteinPlasmidMapping', ProteinPlasmidMappings);
app.use('/constructRequest', ConstructRequest);
app.use('/constructStatus', ConstructStatus);
app.use('/protein', Protein);
app.use('/proteinRequest', ProteinRequest);
app.use('/transfectionRequest', TransfectionRequest);
app.use('/transfection', Transfection);
app.use('/proteinPurification', ProteinPurification);
app.use('/proteinAnalysisMapping', ProteinAnalysisMappings);
app.use('/proteinAnalysisRequest', ProteinAnalysisRequest);
app.use('/proteinAnalysis', ProteinAnalysis);
app.use('/bindingData', BindingData);
app.use('/kineticRequest', KineticRequest);
app.use('/stableCellLine', StableCellLine);
app.use('/antigenReagent', AntigenReagent);
// Domain and Antigen Mappings
const domainMap = require('./routes/proteinEngineering/domainMapping');
app.get('/domain/getmapping', domainMap.getDomainMapping());
app.post('/domain/create', domainMap.createDomainMapping());
app.post('/antigen/create', domainMap.createAntigenClass());
app.post('/domain/delete', domainMap.deleteDomainMapping());
app.post('/antigen/delete', domainMap.deleteAntigenClass());

/// ////////////
// ADE
/// ////////////
const ADESummary = require('./routes/antibodyDiscovery/adeSummary');
app.use('/adeSummary', ADESummary);
// B Cell Culture
const Activation = require('./routes/antibodyDiscovery/activation');
const Sort = require('./routes/antibodyDiscovery/sort');
const BCCPlate = require('./routes/antibodyDiscovery/bCCPlate');
const BCellSource = require('./routes/antibodyDiscovery/bCellSource');
const MixCondition = require('./routes/antibodyDiscovery/mixCondition');
const SupernatentPlate = require('./routes/antibodyDiscovery/supernatentPlate');
app.use('/activation', Activation);
app.use('/bCellSource', BCellSource);
app.use('/mixCondition', MixCondition);
app.use('/sort', Sort);
app.use('/bCCPlate', BCCPlate);
app.use('/supernatentPlate', SupernatentPlate);
// Molecular Biology
const WellRescue = require('./routes/antibodyDiscovery/wellRescue');
const CloningSequence = require('./routes/antibodyDiscovery/cloningSequence');
const DiscoveryPlasmid = require('./routes/antibodyDiscovery/discoveryPlasmid');
const HumanizationPlasmid = require('./routes/antibodyDiscovery/humanizationPlasmid');
const DiscoveryTransfection = require('./routes/antibodyDiscovery/discoveryTransfection');
const HumanizationTransfection = require('./routes/antibodyDiscovery/humanizationTransfection');
app.use('/wellRescue', WellRescue);
app.use('/cloningSequence', CloningSequence);
app.use('/discoveryPlasmid', DiscoveryPlasmid);
app.use('/discoveryTransfection', DiscoveryTransfection);
app.use('/humanizationTransfection', HumanizationTransfection);
app.use('/humanizationPlasmid', HumanizationPlasmid);
const ADTransfectionRequest = require('./routes/antibodyDiscovery/adTransfectionRequest');
app.use('/adTransfectionRequest', ADTransfectionRequest);

/// ////////////
// PD
/// ////////////
// Cell Line
const CellLineExperiment = require('./routes/cellLine/cellLineExperiment');
const CellLineHarvest = require('./routes/cellLine/cLDHarvest');
const CellLinePurification = require('./routes/cellLine/cellLinePurification');
const CellLinePackage = require('./routes/cellLine/cellLinePackage');
app.use('/cellLineExperiment', CellLineExperiment);
app.use('/cellLineHarvest', CellLineHarvest);
app.use('/cellLinePackage', CellLinePackage);
app.use('/cellLinePurification', CellLinePurification);
// Bioreactor
const CellExpansionData = require('./routes/bioreactor/cellExpansionData');
const CellExpansion = require('./routes/bioreactor/cellExpansion');
const BioreactorExperiment = require('./routes/bioreactor/bioreactorExperiment');
const Bioreactor = require('./routes/bioreactor/bioreactor');
const BioreactorCondition = require('./routes/bioreactor/bioreactorCondition');
const BioreactorChemData = require('./routes/bioreactor/bioreactorChemData');
const BioreactorChemDataImport = require('./routes/bioreactor/bioreactorChemDataImport');
const BioreactorVCDData = require('./routes/bioreactor/bioreactorVCDData');
const BioreactorVCDDataImport = require('./routes/bioreactor/bioreactorVCDDataImport');
const BioreactorPurification = require('./routes/bioreactor/bioreactorPurification');
const BioreactorAnalytics = require('./routes/bioreactor/bioreactorAnalytics');
const PDAnalytics = require('./routes/analytical/pdAnalytics');
const PDAnalysisRequest = require('./routes/analytical/pdAnalysisRequest');
app.use('/cellExpansion', CellExpansion);
app.use('/cellExpansionData', CellExpansionData);
app.use('/bioreactorExperiment', BioreactorExperiment);
app.use('/bioreactor', Bioreactor);
app.use('/bioreactorCondition', BioreactorCondition);
app.use('/bioreactorChemData', BioreactorChemData);
app.use('/bioreactorChemDataImport', BioreactorChemDataImport);
app.use('/bioreactorVCDData', BioreactorVCDData);
app.use('/bioreactorVCDDataImport', BioreactorVCDDataImport);
app.use('/bioreactorPurification', BioreactorPurification);
app.use('/bioreactorAnalytic', BioreactorAnalytics);
app.use('/pdAnalysisRequest', PDAnalysisRequest);
app.use('/pdAnalysis', PDAnalytics);

/// ////////////
// IO
/// ////////////
const Reagents = require('./routes/other/reagent');
const Tasks = require('./routes/other/task');
app.use('/reagent', Reagents);
app.use('/task', Tasks);

/// ////////////
// CT
/// ////////////
const CellSource = require('./routes/cellTherapy/cellSource');
const Donor = require('./routes/cellTherapy/donor');
const CTExperiments = require('./routes/cellTherapy/ctExperiment');
const CTVessel = require('./routes/cellTherapy/ctVessel');
const CTVesselType = require('./routes/cellTherapy/ctVesselType');
const CTFreeze = require('./routes/cellTherapy/ctFreeze');
const CellThaw = require('./routes/cellTherapy/ctThaw');
app.use('/cellSource', CellSource);
app.use('/donor', Donor);
app.use('/ctExperiment', CTExperiments);
app.use('/ctVessel', CTVessel);
app.use('/ctVesselType', CTVesselType);
app.use('/ctFreeze', CTFreeze);
app.use('/ctThaw', CellThaw);

/// ////////////
// Facilities
/// ////////////
const Facilities = require('./routes/other/facilities');
const Reservation = require('./routes/other/reservation');
const Instruments = require('./routes/other/instruments');
app.post('/equipment/get', Facilities.getEquipment());
app.get('/equipment/getlist', Facilities.getEquipmentList());
app.post('/equipment/create', Facilities.createEquipment());
app.post('/equipment/update', Facilities.updateEquipment());
app.post('/equipment/delete', Facilities.deleteEquipment());
app.post('/circuit/get', Facilities.getCircuit());
app.get('/circuit/getlist', Facilities.getCircuitList());
app.post('/circuit/create', Facilities.createCircuit());
app.post('/circuit/update', Facilities.updateCircuit());
app.post('/circuit/delete', Facilities.deleteCircuit());
app.post('/circuit/searchByColumn', Facilities.searchCircuit());
app.use('/reservation', Reservation);
app.use('/instrument', Instruments);
const FreezerProLog = require('./routes/other/FreezerProLog');
app.use('/FreezerProLog', FreezerProLog);

// Other
const ViCell = require('./routes/instrumentData/vicell');
const Akta = require('./routes/instrumentData/akta');
const Nanodrop = require('./routes/instrumentData/nanodrop');
const pHMeter = require('./routes/instrumentData/pHMeter');
const Osmo = require('./routes/instrumentData/osmo');
app.use('/nanodropData', Nanodrop);
app.use('/viCellData', ViCell);
app.use('/aktaData', Akta);
app.use('/nanodropData', Nanodrop);
app.use('/pHData', pHMeter);
app.use('/osmoData', Osmo);

/// ////////////
// Accounting
/// ////////////
const AccountingStatements = require('./routes/accounting/AccountingStatements');
app.use('/AccountingStatements', AccountingStatements);
const BoaStatements = require('./routes/accounting/BoaStatements');
app.use('/BoaStatements', BoaStatements);
const ProcurifyStatements = require('./routes/accounting/ProcurifyStatements');
app.use('/ProcurifyStatements', ProcurifyStatements);
const TimePerProject = require('./routes/accounting/TimePerProject');
app.use('/TimePerProject', TimePerProject);

const TimeSpentCategories = require('./routes/other/TimeSpentCategories');
app.use('/TimeSpentCategories', TimeSpentCategories);
const PayPeriods = require('./routes/other/PayPeriods');
app.use('/PayPeriods', PayPeriods);

// Start the app by listening on <port>
app.listen(config.PORT, config.IP);
winston.info('Express app started on port ' + config.PORT);
module.exports = app;
