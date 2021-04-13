(function () {
    'use strict';
    angular
        .module('app.research')
        .controller('ResearchController', ResearchController);
    ResearchController.$inject = ['$scope', '$state', 'SiHttpUtil', '$http'];

    function ResearchController($scope, $state, SiHttpUtil, $http) {
        // console.log("hello Research controller");
        $scope.tableState = {};
        // Dirty hack to workaround Angular/Chosen <select> off by 1 bug.
        // See: https://github.com/leocaseiro/angular-chosen/issues/8
        $scope.$watch(function () {
            return $(".chosen-select option").length;
        }, function (newvalue, oldvalue) {
            if (newvalue !== oldvalue) {
                $(".chosen-select").trigger("chosen:updated");
            }
        });
        $scope.tableState.currentResearchTable = "";
        $scope.switchResearchTable = function () {
            if ($scope.tableState.currentResearchTable) {
                $state.go("app.research." + $scope.tableState.currentResearchTable)
            }
        };
        $scope.UserHash = null;
        $scope.ActiveUserHash = null;
        SiHttpUtil.CacheUserHash().then(function (UserHash) {
            $scope.UserHash = UserHash.complete;
            $scope.ActiveUserHash = UserHash.active;
            $scope.ActiveUserList = UserHash.activeList;
        });

        $scope.trOptions = {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'Transfection Status (Last 2 Months)'
            }
        };

        $scope.proteinOptions = {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'New Proteins (Last 2 Months)'
            }
        };

        $scope.newTrOptions = {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'New TRs (Last 2 Months)'
            }
        };

        $scope.graphColors = SiHttpUtil.GraphColors();

        $scope.colorOverride = { hoverBackgroundColor: $scope.graphColors };

        $scope.countDatasetOverride = [{
            label: 'Plasmids',
            backgroundColor: 'rgba(114,102,186,0.2)',
            borderColor: 'rgba(114,102,186,1)',
            pointBackgroundColor: 'rgba(114,102,186,1)',
            pointBorderColor: '#fff',
        }, {
            label: 'Proteins',
            backgroundColor: 'rgba(35,183,229,0.2)',
            borderColor: 'rgba(35,183,229,1)',
            pointBackgroundColor: 'rgba(35,183,229,1)',
            pointBorderColor: '#fff',
        }, {
            label: 'Transfections',
            backgroundColor: 'rgba(39,194,76,0.2)',
            borderColor: 'rgba(39,194,76,1)',
            pointBackgroundColor: 'rgba(39,194,76,1)',
            pointBorderColor: '#fff',
        }, {
            label: 'Purifications',
            backgroundColor: 'rgba(240,80,80,0.2)',
            borderColor: 'rgba(240,80,80,1)',
            pointBackgroundColor: 'rgba(240,80,80,1)',
            pointBorderColor: '#fff',
        }];

        $scope.countOptions = {
            legend: {
                display: false
            },
            title: {
                display: true,
                text: 'New Entries (Per Week)'
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            hover: {
                mode: 'index',
                intersect: false
            },
        };

        $scope.graphs = function () {
            $http({
                url: SiHttpUtil.helperAPIUrl + "graphapi/",
                method: "GET",
            }).then(function (resp) {
                $scope.countData = {
                    labels: resp.data.countData.dates,
                    data: [
                        resp.data.countData.plasmids,
                        resp.data.countData.proteins,
                        resp.data.countData.transfections,
                        resp.data.countData.purifications
                    ],
                    colors: ['rgba(114,102,186,1)', 'rgba(35,183,229,1)', 'rgba(39,194,76,1)', 'rgba(240,80,80,1)']
                };

                $scope.proteinData = {
                    labels: resp.data.proteinByType.type,
                    data: resp.data.proteinByType.count,
                    // colors: ['rgba(114,102,186,1)', 'rgba(35,183,229,1)', 'rgba(39,194,76,1)', 'rgba(240,80,80,1)']
                };

                $scope.newTrData = {
                    labels: resp.data.newTransfections.project,
                    data: resp.data.newTransfections.count,
                    // colors: ['rgba(114,102,186,1)', 'rgba(35,183,229,1)', 'rgba(39,194,76,1)', 'rgba(240,80,80,1)']
                };

                $scope.trData = {
                    labels: resp.data.trData.labels,
                    data: resp.data.trData.data,
                    colors: resp.data.trData.colors,
                    override: {
                        hoverBackgroundColor: resp.data.trData.colors
                    }
                }

            }, function (err) {
                console.log("fetch graph err:", err);
            });
        }
        $scope.graphs();
        $scope.proteinSummary = function () {
            $http({
                url: SiHttpUtil.helperAPIUrl + "proteinstatus/",
                method: "GET",
            }).then(function (resp) {
                $scope.proteinStatusData = resp.data;
            }, function (err) {
                console.log("fetch graph err:", err);
            });
        }
        $scope.proteinSummary();
    }
})();

//Construct Request Controller
(function () {
    'use strict';

    angular
        .module('app.research')
        .controller('ConstructRequestController', ConstructRequestController);

        ConstructRequestController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$stateParams', '$state'];

    function ConstructRequestController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $stateParams, $state) {
        // Main model.
        $scope.m = {
            tableData: null,
            dtColumns: [],
            getDateOnly: SiUtil.getDateOnly,
            getProgress: SiUtil.progress,
            getFormattedStatus: SiUtil.getFormattedStatus,
            tableName: "constructRequest",
            activeTab: "ViewAllTab",
            op: $stateParams.op,
            id: $stateParams.id,
            sectionNames: ['Links'],
            statuses: ['Pending', 'On Hold', 'Approved', 'In Progress', 'Completed'],
            DtInstCallback: inst => {
                $scope.m.DtInst = inst;
            },
            statusFilter: {
                includePending: true,
                includeApproved: true,
                includeInProg: true,
                includeCompleted: false,
                includeOnHold: false
            },
            RefreshData: () => {
                if ($scope.m.DtInstCallback) {
                    if ($scope.m.DtInst) {
                        $scope.m.DtInst.changeData($scope.m.LoadDataList());
                    } else {
                        $scope.m.LoadDataList();
                    }
                }
            },
            createConstructs: id => {
                if (id) {
                    $state.go("app.research.constructStatus", { op: "create", id: id });
                }
            },
            approveRequest: id => {
                if (!id) {
                    id = $scope.m.currentRowData.id
                }
                SiHttpUtil.UpdateDataEntry({
                    tableName: $scope.m.tableName,
                    id: id,
                    status: "Approved",
                    approvedBy: SiHttpUtil.GetUserId()
                }).then(() => {
                    $scope.m.RefreshData();
                    $scope.m.resetSelection();
                });
            }
        };
        $scope.m.viewForm = SiHttpUtil.InitViewForm($scope.m);
        $scope.tableState.currentTable = $scope.m.tableName;

        $scope.m.getQuery = () => {
            var query = {
                $or: []
            };
            if ($scope.m.statusFilter.includePending) {
                query.$or.push({status: "Pending"})
            }
            if ($scope.m.statusFilter.includeInProg) {
                query.$or.push({status: "In Progress"});
            }
            if ($scope.m.statusFilter.includeOnHold) {
                query.$or.push({status: "On Hold"});
            }
            if ($scope.m.statusFilter.includeCompleted) {
                query.$or.push({status: "Completed"});
            }
            if ($scope.m.statusFilter.includeApproved) {
                query.$or.push({status: "Approved"})
            }
            if (query.$or.length == 0) {
                query = {};
            }
            $scope.m.query = query;
        }
        $scope.m.onStatusChange = function () {
            $scope.m.getQuery();
            $scope.m.RefreshData();
        }


        $scope.m.editForm = {
            data: {},
            show: false,
            submitted: false,
            ui: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            Delete: () => {
                SiHttpUtil.DeleteDataEntry($scope.m.tableName, $scope.m.currentRowData.id).then(() => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.RefreshData();
                });
            },
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                SiHttpUtil.UpdateDataEntry({
                    tableName: $scope.m.tableName,
                    id: $scope.m.editForm.data.id,
                    projectId: $scope.m.editForm.data.projectId,
                    notes: $scope.m.editForm.data.notes,
                    estimatedTimeline: $scope.m.editForm.data.estimatedTimeline.dt,
                    numConstructs: $scope.m.editForm.data.numConstructs,
                    references: $scope.m.editForm.data.references ? angular.toJson($scope.m.editForm.data.references) : null,
                    newSequence: $scope.m.editForm.data.newSequence,
                    status: $scope.m.editForm.data.status
                }).then(resp => {
                    if (resp.status === 200) {
                        $scope.m.editForm.CancelTab();
                        $scope.m.RefreshData();
                        $scope.m.resetSelection();
                    }
                });
            }
        };

        $scope.m.CreateForm = {
            data: {},
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.dp.initDp('CreateForm', 'estimatedTimeline', false);
                $scope.m.activeTab = "ViewAllTab";
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                const RequestEntry = {
                    tableName: $scope.m.tableName,
                    projectId: $scope.m.CreateForm.data.projectId,
                    notes: $scope.m.CreateForm.data.notes,
                    estimatedTimeline: $scope.m.CreateForm.data.estimatedTimeline.dt,
                    numConstructs: $scope.m.CreateForm.data.numConstructs,
                    references: $scope.m.CreateForm.data.references ? angular.toJson($scope.m.CreateForm.data.references) : null,
                    newSequence: $scope.m.CreateForm.data.newSequence,
                };
                SiHttpUtil.CreateTableEntry(RequestEntry)
                    .then(function (resp) {
                        if (resp.status === 200) {
                            $scope.m.CreateForm.ResetTab();
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.SearchByColumn($scope.m.tableName, $scope.m.query).then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp;
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length === 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable($scope.m.tableName, colName),
                                (colName) => SiHttpUtil.dbColumnTranslator($scope.m.tableName, colName),
                                (colName) => SiHttpUtil.hideColumnForTable($scope.m.tableName, colName),
                                SiHttpUtil.tableOrder($scope.m.tableName)
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'projectId'))
                                .renderWith(
                                    SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.ProjectDisplayData.Hash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'notes'))
                                .renderWith(
                                    SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'requestedBy'))
                                .renderWith(
                                    SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'newSequence'))
                                .renderWith(
                                    SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'status'))
                                .renderWith(
                                    SiUtil.ColDisplayers.StatusDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'estimatedTimeline'))
                                .renderWith(
                                    SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'progress'))
                                .renderWith(
                                    SiUtil.ColDisplayers.ProgressDisplayer
                                ),
                            // DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                            //     .renderWith(
                            //         SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                            //     ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith(
                                    SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                        ];

                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                                if ($scope.m.op === "view" && $scope.m.id) {
                                    $scope.m.currentRowData = {
                                        id: $scope.m.id
                                    }
                                    $scope.m.viewDetail();
                                }
                                if ($scope.op === "create") {
                                    $scope.m.activeTab = "CreateTab";
                                }
                            })
                            .withOption('order', [['0', 'desc']])
                    } else {
                        resolve($scope.m.tableData);
                    }
                });
            });
        };

        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.viewForm.show = true;
                SiHttpUtil.FetchOneEntry('constructRequest', $scope.m.currentRowData.id).then(resp => {
                    $scope.m.viewForm.data = angular.copy(resp);
                    $scope.m.viewForm.data.references = angular.fromJson($scope.m.viewForm.data.references);
                });
                $scope.m.viewForm.refInit();
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.editForm.data = angular.copy($scope.m.currentRowData);
                $scope.m.editForm.data.references = angular.fromJson($scope.m.editForm.data.references);
                $scope.m.editForm.data.estimatedTimeline = {
                    dt: $scope.m.editForm.data.estimatedTimeline ? new Date($scope.m.editForm.data.estimatedTimeline): null
                }
                $scope.m.editForm.show = true;
                $scope.m.activeTab = "EditTab";
            }
        };
        $scope.m.loadAll = function () {
            $scope.m.dp = SiUtil.dp.bind($scope.m)();
            $scope.m.dp.initDp('CreateForm', 'estimatedTimeline', false);
            $scope.m.getQuery();
            var CacheProjects = SiHttpUtil.FetchIdNameMapping('project').then(function (resp) {
                $scope.m.ProjectList = resp;
                $scope.m.ProjectDisplayData = SiHttpUtil.GetDependencyList($scope.m.ProjectList);
                $scope.m.ProjectListReady = true;
            });

            var deps = []; // Dependencies.
            deps.push(CacheProjects);
            Promise.all(deps).then(() => {
                $scope.m.LoadDataList();
            });
        };

        $scope.m.loadAll();
    }
})();

//Construct Request Status Controller
(function () {
    'use strict';

    angular
        .module('app.research')
        .controller('ConstructStatusController', ConstructStatusController);

        ConstructStatusController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$stateParams'];

    function ConstructStatusController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $stateParams) {
        // Main model.
        $scope.m = {
            tableData: null,
            dtColumns: [],
            tableName: "constructStatus",
            activeTab: "ViewAllTab",
            op: $stateParams.op,
            id: $stateParams.id,
            sectionNames: ['Links'],
            DtInstCallback: inst => {
                $scope.m.DtInst = inst;
            },
            statusFilter: {
                includeNotCompleted: true,
                includeCompleted: false
            },
            RefreshData: () => {
                if ($scope.m.DtInstCallback) {
                    if ($scope.m.DtInst) {
                        $scope.m.DtInst.changeData($scope.m.LoadDataList());
                    } else {
                        $scope.m.LoadDataList();
                    }
                }
            },
        };
        $scope.m.viewForm = SiHttpUtil.InitViewForm($scope.m);
        $scope.tableState.currentTable = $scope.m.tableName;

        $scope.m.getQuery = () => {
            const query = {
                $or: []
            };
            if ($scope.m.statusFilter.includeNotCompleted) {
                query.$or.push({completed: false});
            }
            if ($scope.m.statusFilter.includeCompleted) {
                query.$or.push({completed: true});
            }
            if ($scope.m.statusFilter.includeOnHold) {
                query.$or.push({onHold: true});
            } else {
                query.onHold = false;
            }
            if (query.$or.length == 0) {
                query = {};
            }
            $scope.m.query = query;
        }
        $scope.m.onStatusChange = function () {
            $scope.m.getQuery();
            $scope.m.RefreshData();
        }


        $scope.m.editForm = {
            data: {},
            show: false,
            submitted: false,
            ui: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            Delete: () => {
                SiHttpUtil.DeleteDataEntry($scope.m.tableName, $scope.m.currentRowData.id).then(() => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.RefreshData();
                });
            },
            assign: () => {
                $scope.m.editForm.data.assignedTo = SiHttpUtil.GetUserId();
            },
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                SiHttpUtil.UpdateDataEntry({
                    tableName: $scope.m.tableName,
                    id: $scope.m.editForm.data.id,
                    constructRequestId: $scope.m.editForm.data.constructRequestId,
                    assignedTo: $scope.m.editForm.data.assignedTo,
                    priority: $scope.m.editForm.data.priority,
                    sequenceReviewed: $scope.m.editForm.data.sequenceReviewed,
                    designed: $scope.m.editForm.data.designed,
                    ordered: $scope.m.editForm.data.ordered,
                    cloned: $scope.m.editForm.data.cloned,
                    maxiprep: $scope.m.editForm.data.maxiprep,
                    sequenceVerified: $scope.m.editForm.data.sequenceVerified,
                    onHold: $scope.m.editForm.data.onHold,
                    status: $scope.m.editForm.data.status,
                    notes: $scope.m.editForm.data.notes,
                    adminNotes: $scope.m.editForm.data.adminNotes,
                }).then((resp) => {
                    if (resp.status === 200) {
                        $scope.m.editForm.CancelTab();
                        $scope.m.RefreshData();
                        $scope.m.resetSelection();
                    }
                });
            }
        };

        $scope.m.CreateForm = {
            data: {},
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.dp.initDp('CreateForm', 'requestDate', true);
                $scope.m.activeTab = "ViewAllTab";
            },
            initTab: choose => {
                const query = { status: ["Approved", "In Progress"] };
                SiHttpUtil.SearchByColumn("constructRequest", query).then(resp => {
                    $scope.m.RequestDisplayData = SiHttpUtil.GetDependencyDisplayItemList(resp);
                    $scope.m.RequestListReady = true;
                    if (choose) {
                        $scope.m.CreateForm.chooseRequest();
                    }
                })
            },
            chooseRequest: () => {
                $scope.m.CreateForm.data.currConstructs = [];
                $scope.m.CreateForm.currRequest = $scope.m.RequestDisplayData.ListHash[$scope.m.CreateForm.data.constructRequestId];
                const toCreate = $scope.m.CreateForm.currRequest.status == 'In Progress' ? 1 : $scope.m.CreateForm.currRequest.numConstructs;
                for (let i = 0; i < toCreate; i++) {
                    $scope.m.CreateForm.data.currConstructs.push({
                        constructRequestId: $scope.m.CreateForm.currRequest.id
                    });
                }
            },
            addEntry: () => {
                $scope.m.CreateForm.data.currConstructs.push({
                    constructRequestId: $scope.m.CreateForm.currRequest.id
                });
            },
            removeEntry: index => {
                $scope.m.CreateForm.data.currConstructs.splice(index, 1);
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                const toCreate = {
                    tableName: $scope.m.tableName,
                    list: $scope.m.CreateForm.data.currConstructs
                };
                const toUpdate = {
                    tableName: "constructRequest",
                    id: $scope.m.CreateForm.data.constructRequestId,
                    status: "In Progress"
                }
                SiHttpUtil.CreateTableEntries(toCreate)
                    .then(function (resp) {
                        if (resp.status === 200) {
                            SiHttpUtil.UpdateDataEntry(toUpdate);
                            $scope.m.CreateForm.ResetTab();
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        $scope.m.BulkEditForm = {
            data: {
                currCRs: []
            },
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.BulkEditForm);
                $scope.m.activeTab = "ViewAllTab";
                $scope.m.BulkEditForm.ResetData();
            },
            updateCurrCRs: onHold => {
                $scope.m.BulkEditForm.data.currCRs = [];
                let query;
                if (onHold) {
                    query = { onHold: true, completed: false };
                } else {
                    query = { assignedTo: $scope.m.BulkEditForm.data.assignedTo, onHold: false, completed: false };
                }
                SiHttpUtil.SearchByColumn('constructStatus', query).then(function (resp) {
                    $scope.m.BulkEditForm.data.currCRs = resp;
                });
            },
            assignedToMe: function () {
                $scope.m.BulkEditForm.data.assignedTo = SiHttpUtil.GetUserId();
                $scope.m.BulkEditForm.updateCurrCRs();
            },
            assign: function (entry) {
                entry.assignedTo = SiHttpUtil.GetUserId();
            },
            ResetData: function () {
                $scope.m.BulkEditForm.data = {
                    currCRs: []
                };
            },
            removeEntry: function (i) {
                $scope.m.BulkEditForm.data.currCRs.splice(i, 1);
            },
            Update: function (entry) {
                const toUpdate = {
                    tableName: "constructStatus",
                    id: entry.id,
                    constructRequestId: entry.constructRequestId,
                    sequenceReviewed: entry.sequenceReviewed,
                    designed: entry.designed,
                    ordered: entry.ordered,
                    cloned: entry.cloned,
                    maxiprep: entry.maxiprep,
                    sequenceVerified: entry.sequenceVerified,
                    onHold: entry.onHold,
                    assignedTo: entry.assignedTo
                }
                SiHttpUtil.UpdateDataEntry(toUpdate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            angular.extend(entry, resp.data.newData);
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.SearchByColumn($scope.m.tableName, $scope.m.query).then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp;
                    if (resp.enums) {
                        var enumList = JSON.parse(resp.enums);
                        $scope.sectionNames = angular.copy(enumList.ENUM_packageSectionName);
                    }
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length === 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable($scope.m.tableName, colName),
                                (colName) => SiHttpUtil.dbColumnTranslator($scope.m.tableName, colName),
                                (colName) => SiHttpUtil.hideColumnForTable($scope.m.tableName, colName),
                                SiHttpUtil.tableOrder($scope.m.tableName)
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'description'))
                                .renderWith(
                                    SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'requestDate'))
                                .renderWith(
                                    SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'sequenceReviewed'))
                                .renderWith(
                                    SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'priority'))
                                .renderWith(
                                    SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'assignedTo'))
                                .renderWith(
                                    SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'designed'))
                                .renderWith(
                                    SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'ordered'))
                                .renderWith(
                                    SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'cloned'))
                                .renderWith(
                                    SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'maxiprep'))
                                .renderWith(
                                    SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'sequenceVerified'))
                                .renderWith(
                                    SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'completed'))
                                .renderWith(
                                    SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'progress'))
                                .renderWith(
                                    SiUtil.ColDisplayers.ProgressDisplayer
                                ),
                            // DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                            //     .renderWith(
                            //         SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                            //     ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith(
                                    SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                        ];

                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                            })
                            .withOption('order', [['0', 'desc']])
                    } else {
                        resolve($scope.m.tableData);
                    }
                });
            });
        };

        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.viewForm.show = true;
                SiHttpUtil.FetchOneEntry('constructStatus', $scope.m.currentRowData.id).then(resp => {
                    $scope.m.viewForm.data = angular.copy(resp);
                    $scope.m.viewForm.data.createdAt = SiUtil.getDateOnly(resp.createdAt);
                    $scope.m.viewForm.data.updatedAt = SiUtil.getDateOnly(resp.updatedAt);

                });
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.editForm.data = angular.copy($scope.m.currentRowData);
                $scope.m.editForm.data.references = angular.fromJson($scope.m.editForm.data.references);
                $scope.m.editForm.data.requestDate = {
                    dt: $scope.m.editForm.data.requestDate ? new Date($scope.m.editForm.data.requestDate): null
                }
                $scope.m.editForm.show = true;
                $scope.m.activeTab = "EditTab";
            }
        };
        $scope.m.loadAll = function () {
            $scope.m.dp = SiUtil.dp.bind($scope.m)();
            $scope.m.getQuery();
            $scope.m.LoadDataList();
            if ($scope.m.op === "create") {
                $scope.m.activeTab = "CreateTab";
                $scope.m.CreateForm.data.constructRequestId = parseInt($scope.m.id);
                $scope.m.CreateForm.initTab(true);
            }
            if ($scope.m.op === "view" && $scope.m.id) {
                $scope.m.currentRowData = {
                    id: $scope.m.id
                }
                $scope.m.viewDetail();
            }
        };

        $scope.m.loadAll();
    }
})();

(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('PlasmidsController', PlasmidsController);
    PlasmidsController.$inject = ['$scope', 'DTOptionsBuilder',
        'DTColumnBuilder', 'SiUtil', '$stateParams', 'SiHttpUtil', 'DTColumnDefBuilder'
    ];

    function PlasmidsController($scope, DTOptionsBuilder, DTColumnBuilder, SiUtil, $stateParams, SiHttpUtil, DTColumnDefBuilder) {
        $scope.m = {};
        $scope.m.tableName = "plasmids"
        $scope.tableState.currentResearchTable = "plasmids";
        $scope.m.activeTab = "ViewAllTab";
        $scope.m.dtColumns = [];
        $scope.m.tableData = null;
        $scope.op = $stateParams.op;
        $scope.opId = $stateParams.id;
        $scope.dateFormat = date => {
            return date.split('T')[0].replace(/-/g, '');
        }

        $scope.markerClick = function(event, marker){
            $scope.$apply(function(){
                $scope.selectedmarker = marker;
            });
        }

        $scope.dismissPopup = function(){
            $scope.selectedmarker = null;
        }

        $scope.m.statusFilter = {
            includeComplete: false,
            includeNotComplete: false,
        }

        $scope.m.onStatusChange = function () {
            var table = $('#plasmids').DataTable();
            var val = [];
            if ($scope.m.statusFilter.includeComplete) {
                val.push(true);
            }
            if ($scope.m.statusFilter.includeNotComplete) {
                val.push(false);
            }
            table
                .columns(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'completed'))
                .search(val.join('|'), true, false)
                .draw();
        }

        $scope.m.updateStatus = function () {
            SiHttpUtil.UpdateDataEntry({
                tableName: $scope.m.tableName,
                id: $scope.m.currentRowData.id,
                completed: true,
                updatedAt: $scope.m.currentRowData.updatedAt
            }).then(resp => {
                if (resp.status == 200) {
                    $scope.m.RefreshData()
                    SiHttpUtil.tableRowResetSelection($scope.m);
                }
            });
        };

        $scope.m.loadRequestDetails = (plasmidEntry) => {
            if (plasmidEntry.constructStatusId) {
                SiHttpUtil.FetchOneEntry("constructStatus", plasmidEntry.constructStatusId).then(resp => {
                    plasmidEntry.description = resp.description;
                    plasmidEntry.projectId = resp.ConstructRequest.requestProject.id;
                });
            } else {
                plasmidEntry.description = null;
                plasmidEntry.projectId = null;
            }
        };

        $scope.m.loadRequestList = () => {
            SiHttpUtil.FetchIdNameMapping("constructStatus").then(resp => {
                $scope.m.ConstructStatusDisplayData = SiHttpUtil.GetDependencyList(resp);
                $scope.m.ConstructListReady = true;
            })
        };

        $scope.m.BulkCreateForm = {
            data: {
                plasmidsToAdd: []
            },
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.BulkCreateForm);
                $scope.m.BulkCreateForm.data = {};
                $scope.m.BulkCreateForm.data.plasmidsToAdd = [];
            },
            addEntry: function () {
                $scope.m.BulkCreateForm.data.plasmidsToAdd.push({});
            },
            removeEntry: function (index) {
                $scope.m.BulkCreateForm.data.plasmidsToAdd.splice(index, 1);
            },
            copyData: function (column) {
                var len = $scope.m.BulkCreateForm.data.plasmidsToAdd.length;
                var entry = $scope.m.BulkCreateForm.data.plasmidsToAdd[0][column];
                for (var i = 0; i < len; i++) {
                    $scope.m.BulkCreateForm.data.plasmidsToAdd[i][column] = entry;
                }
            },
            parseCSV: function () {
                var formData = new FormData;
                $scope.m.ShowImportBtn = false;
                formData.append('file', document.getElementById('file').files[0]);
                SiHttpUtil.POSTRequest(SiHttpUtil.helperAPIUrl + "parsePlasmidData/", formData).then(function (resp) {
                    SiHttpUtil.NotifyOk("Please review data changes");
                    var curr;
                    for (var i = 0; i < resp.length; i++) {
                        curr = resp[i];
                        $scope.m.BulkCreateForm.data.plasmidsToAdd.push({
                            projectId: parseInt(curr.projectId),
                            description: curr.description,
                            ENUM_vector: curr.vector,
                            ENUM_bacteria: curr.bacteria,
                            ENUM_plasmidTag: curr.plasmidTag,
                            ENUM_mammalian: curr.selectionMarker
                        });
                    }
                }, function (err) {
                    SiHttpUtil.NotifyOperationErr("CSV Parse Error");
                    $scope.m.ShowImportBtn = true;
                });
            },
            SubmitTab: function () {
                $scope.m.BulkCreateForm.submitted = true;
                if (!$scope.m.BulkCreateForm.ui.validate.$valid) {
                    console.error($scope.m.BulkCreateForm.ui.validate);
                    return;
                }

                var newEntries = [];
                for (var i = 0; i < $scope.m.BulkCreateForm.data.plasmidsToAdd.length; i++) {
                    var temp = {};
                    temp.projectId = $scope.m.BulkCreateForm.data.plasmidsToAdd[i].projectId,
                    temp.description = $scope.m.BulkCreateForm.data.plasmidsToAdd[i].description;
                    temp.ENUM_vector = $scope.m.BulkCreateForm.data.plasmidsToAdd[i].ENUM_vector;
                    temp.ENUM_bacteria = $scope.m.BulkCreateForm.data.plasmidsToAdd[i].ENUM_bacteria;
                    temp.ENUM_plasmidTag = $scope.m.BulkCreateForm.data.plasmidsToAdd[i].ENUM_plasmidTag;
                    temp.ENUM_mammalian = $scope.m.BulkCreateForm.data.plasmidsToAdd[i].ENUM_mammalian;
                    temp.constructStatusId = $scope.m.BulkCreateForm.data.plasmidsToAdd[i].constructStatusId;
                    newEntries.push(temp);
                }
                var toCreate = {
                    tableName: "plasmids",
                    list: newEntries
                }

                SiHttpUtil.CreateTableEntries(toCreate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.BulkCreateForm.ResetTab();
                            $scope.m.activeTab = "ViewAllTab";
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        $scope.m.BulkLotCreate = {
            data: {
                lotsToAdd: []
            },
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.BulkLotCreate);
                $scope.m.BulkLotCreate.data.lotsToAdd = [];
            },
            copyData: function (column) {
                var len = $scope.m.BulkCreateForm.data.plasmidsToAdd.length;
                var entry = $scope.m.BulkCreateForm.data.plasmidsToAdd[0][column];
                for (var i = 0; i < len; i++) {
                    $scope.m.BulkCreateForm.data.plasmidsToAdd[i][column] = entry;
                }
            },
            dpOpen: function ($event, input) {
                $event.preventDefault();
                $event.stopPropagation();
                input.opened = !(input.opened);
            },
            initTab: () => {
                SiHttpUtil.FetchIdNameMapping('plasmids').then(resp => {
                    $scope.m.BulkLotCreate.plasmids = SiHttpUtil.GetDependencyList(resp);
                });
            },
            addEntry: function () {
                $scope.m.BulkLotCreate.data.lotsToAdd.push({
                    prepDate: {
                        dt: new Date()
                    },
                    operator: SiHttpUtil.GetUserId()
                });
            },
            removeEntry: function (index) {
                $scope.m.BulkLotCreate.data.lotsToAdd.splice(index, 1);
            },
            parseCSV: function () {
                var formData = new FormData;
                $scope.m.ShowImportBtn = false;
                formData.append('file', document.getElementById('lot').files[0]);
                SiHttpUtil.POSTRequest(SiHttpUtil.helperAPIUrl + "parsePlasmidLotData/", formData).then(function (resp) {
                    SiHttpUtil.NotifyOk("Please review data changes");
                    for (let i = 0; i < resp.length; i++) {
                        const curr = resp[i];
                        $scope.m.BulkLotCreate.data.lotsToAdd.push({
                            plasmidId: parseInt(curr.plasmidId),
                            prepDate: {
                                dt: new Date(curr.prepDate)
                            },
                            orderRef: curr.orderRef,
                            concentration: curr.concentration,
                            volume: curr.volume,
                            operator: curr.operator,
                            notes: curr.notes
                        });
                    }
                }, function (err) {
                    SiHttpUtil.NotifyOperationErr("CSV Parse Error");
                    $scope.m.ShowImportBtn = true;
                });
            },
            SubmitTab: () => {
                $scope.m.BulkLotCreate.submitted = true;
                if (!$scope.m.BulkLotCreate.ui.validate.$valid) {
                    console.error($scope.m.BulkLotCreate.ui.validate);
                    return;
                }

                const newEntries = [];
                for (let i = 0; i < $scope.m.BulkLotCreate.data.lotsToAdd.length; i++) {
                    const temp = {
                        prepDate: $scope.m.BulkLotCreate.data.lotsToAdd[i].prepDate.dt,
                        plasmidId: $scope.m.BulkLotCreate.data.lotsToAdd[i].plasmidId,
                        orderRef: $scope.m.BulkLotCreate.data.lotsToAdd[i].orderRef,
                        concentration: $scope.m.BulkLotCreate.data.lotsToAdd[i].concentration,
                        originalVolume: $scope.m.BulkLotCreate.data.lotsToAdd[i].volume,
                        volume: $scope.m.BulkLotCreate.data.lotsToAdd[i].volume,
                        operator: $scope.m.BulkLotCreate.data.lotsToAdd[i].operator,
                        notes: $scope.m.BulkLotCreate.data.lotsToAdd[i].notes,
                    };
                    newEntries.push(temp);
                }
                var toCreate = {
                    tableName: "plasmidLot",
                    list: newEntries
                }

                SiHttpUtil.CreateTableEntries(toCreate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.BulkLotCreate.ResetTab();
                            $scope.m.activeTab = "ViewAllTab";
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        $scope.m.ValidateBulkCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.BulkCreateForm.ui.validate,
                $scope.m.BulkCreateForm.submitted, FieldName, Type);
        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.DtInstCallback = function (inst) {
            $scope.m.DtInst = inst;
        };
        SiHttpUtil.InitRowClick($scope);
        $scope.m.InitFileHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope, 'file');
        $scope.m.InitLotHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope, 'lot');

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.refreshPlasmids());
                } else {
                    $scope.m.refreshPlasmids().then(function () {
                        $scope.m.dataReady = true;
                        $scope.$digest();
                    });
                }
            }
        };

        $scope.m.refreshPlasmids = function () {
            return SiHttpUtil.FetchTableEntries('plasmids').then(function (resp) {
                return new Promise(function (resolve, reject) {
                    if (resp.enums) {
                        var enums = JSON.parse(resp.enums);
                        $scope.enums = enums;
                        $scope.vectors = enums.ENUM_vector;
                        $scope.plasmidTags = enums.ENUM_plasmidTag;
                        $scope.bacterias = enums.ENUM_bacteria;
                        $scope.mammalians = enums.ENUM_mammalian;
                    }
                    $scope.m.tableData = resp.records;
                    $scope.plasmidProteinPairs = resp.plasmidProteinPairs;
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('plasmid', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('plasmid', colName)
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'projectId'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.ProjectDisplayData.Hash)
                                )
                                .withOption('type', 'natural')
                                .withOption('defaultContent', ''),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'completed'))
                                .renderWith(
                                SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'description'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                )
                        ];

                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.plasmidsReady = true;
                                if ($scope.op == "view" && $scope.opId) {
                                    var records = $scope.m.tableData;
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.opId) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.viewPlasmidDetail();
                                }
                                if ($scope.op == "create") {
                                   $scope.m.activeTab = "CreateTab";
                                }
                            });
                    }
                }, function (error) {
                    console.log("plasmids get error:", error);
                });
            });
        };

        $scope.m.viewForm = SiHttpUtil.InitViewForm($scope.m);

        $scope.m.CreateForm = {
            data: {},
            ui: {},
            submitted: false,
            ResetTab: function () {
                $scope.m.plasmidListToAdd = [];
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.dp.initDp('CreateForm', 'requestDate', true);
                $scope.m.activeTab = "ViewAllTab";
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                var references = [];
                if ($scope.m.CreateForm.data.geneiousUrn) {
                    references = [{
                        section: "Geneious Links",
                        name: "Plasmid Sequence",
                        url: $scope.m.CreateForm.data.geneiousUrn
                    }];
                }
                const PlasmidEntry = {
                    tableName: "plasmids",
                    description: $scope.m.CreateForm.data.description,
                    constructStatusId: $scope.m.CreateForm.data.constructStatusId,
                    projectId: $scope.m.CreateForm.data.projectId,
                    ENUM_vector: $scope.m.CreateForm.data.plasmidVector,
                    ENUM_bacteria: $scope.m.CreateForm.data.plasmidBac,
                    ENUM_mammalian: $scope.m.CreateForm.data.plasmidMam,
                    ENUM_plasmidTag: $scope.m.CreateForm.data.plasmidTag,
                    references: angular.toJson(references)
                }

                SiHttpUtil.CreateTableEntry(PlasmidEntry).then(function (resp) {
                    if (resp.status == 200) {
                        $scope.m.CreateForm.ResetTab();
                        $scope.m.RefreshData();
                        SiHttpUtil.ResetStateParams();
                    }
                });
            }
        };

        $scope.m.editForm = {
            show: false,
            submitted: false,
            ui: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                if ($scope.m.editForm.PlasmidLots) {
                    for (let i = 0; i < $scope.m.editForm.PlasmidLots.length; i++) {
                        const curr = $scope.m.editForm.PlasmidLots[i];
                        curr.prepDate = curr.prepDate.dt;
                    }
                }
                SiHttpUtil.UpdateDataEntry({
                    tableName: $scope.m.tableName,
                    id: $scope.m.editForm.plasmidId,
                    name: $scope.m.editForm.plasmidName,
                    description: $scope.m.editForm.plasmidDesc,
                    projectId: $scope.m.editForm.plasmidProj,
                    proteinId: $scope.m.editForm.proteinId,
                    ENUM_vector: $scope.m.editForm.plasmidVector,
                    ENUM_bacteria: $scope.m.editForm.plasmidBac,
                    ENUM_mammalian: $scope.m.editForm.plasmidMam,
                    ENUM_plasmidTag: $scope.m.editForm.plasmidTag,
                    updatedAt: $scope.m.editForm.updatedAt,
                    reprep: $scope.m.editForm.reprep,
                    references: angular.toJson($scope.m.editForm.RefLinkList.data),
                    lots: $scope.m.editForm.PlasmidLots
                }).then((resp) => {
                    if (resp.status == 200) {
                        $scope.m.editForm.CancelTab();
                        $scope.m.RefreshData();
                        $scope.m.resetSelection();
                    }
                });
            },
            addLot: () => {
                $scope.m.editForm.PlasmidLots.push({
                    prepDate: {
                        dt: new Date()
                    }
                });
            },
            removeLot: index => {
                if ($scope.m.editForm.PlasmidLots[index].id) {
                    $scope.m.editForm.PlasmidLots[index].isDeleted = true;
                } else {
                    $scope.m.editForm.PlasmidLots.splice(index, 1);
                }
            },
            dpFormat: "yyyyMMdd",
            dpOpen: function ($event, input) {
                $event.preventDefault();
                $event.stopPropagation();
                input.opened = !(input.opened);
            },
            Delete: () => {
                if ($scope.m.currentRowData) {
                    SiHttpUtil.DeleteDataEntry("plasmids", $scope.m.editForm.plasmidId).then(function (resp) {
                        $scope.m.activeTab = "ViewAllTab";
                        $scope.m.editForm.show = false;
                        $scope.m.resetSelection();
                        $scope.m.RefreshData();
                    }, function (err) {
                        console.log("delete entry error:", err);
                    });
                }
            }
        };

        $scope.editPlasmid = function () {
            if ($scope.m.currentRowData) {
                $scope.m.editForm.show = true;
                $scope.m.activeTab = "EditTab";
                SiHttpUtil.FetchOneEntry('plasmids', $scope.m.currentRowData.id).then(resp => {
                    $scope.m.editForm.PlasmidLots = resp.PlasmidLots;
                    for (let i = 0; i < resp.PlasmidLots.length; i++) {
                        resp.PlasmidLots[i].prepDate = {
                            dt: new Date(resp.PlasmidLots[i].prepDate)
                        };
                    }
                });
                $scope.m.editForm.plasmidName = $scope.m.currentRowData.name;
                $scope.m.editForm.reprep = $scope.m.currentRowData.reprep;
                $scope.m.editForm.plasmidDesc = $scope.m.currentRowData.description;
                $scope.m.editForm.plasmidProj = $scope.m.currentRowData.projectId;
                $scope.m.editForm.plasmidVector = $scope.m.currentRowData.ENUM_vector;
                $scope.m.editForm.concentration = $scope.m.currentRowData.concentration;
                $scope.m.editForm.plasmidTag = $scope.m.currentRowData.ENUM_plasmidTag;
                $scope.m.editForm.plasmidMam = $scope.m.currentRowData.ENUM_mammalian;
                $scope.m.editForm.plasmidBac = $scope.m.currentRowData.ENUM_bacteria;
                $scope.m.editForm.plasmidId = $scope.m.currentRowData.id;
                $scope.m.editForm.updatedAt = $scope.m.currentRowData.updatedAt;

                $scope.m.editForm.RefLinkList = {
                    nameList: $scope.enums.ENUM_plasmidSectionName,
                    data: JSON.parse($scope.m.currentRowData.references) || []
                };

            }
        };

        $scope.m.refreshPlasmidData = entryId => {
            SiHttpUtil.RefreshPlasmidData(entryId).then(resp => {
                SiHttpUtil.FetchOneEntry('plasmids', $scope.m.currentRowData.id).then(resp => {
                    $scope.m.viewForm.annotations = resp.PlasmidAnnotations;
                    $scope.m.viewForm.data = resp.PlasmidDatum;
                });
            }, err => {
                SiHttpUtil.NotifyOperationErr(err);
            })
        }

        $scope.viewPlasmidDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.viewForm.show = true;
                $scope.m.activeTab = "ViewDetail";
                SiHttpUtil.FetchOneEntry('plasmids', $scope.m.currentRowData.id).then(resp => {
                    $scope.m.viewForm.proteins = resp.Proteins;
                    $scope.m.viewForm.lots = resp.PlasmidLots;
                    $scope.m.viewForm.annotations = resp.PlasmidAnnotations;
                    $scope.m.viewForm.data = resp.PlasmidDatum;
                    $scope.m.viewForm.construct = resp.ConstructStatus;
                });
                $scope.m.viewForm.id = $scope.m.currentRowData.id;
                $scope.m.viewForm.plasmidName = $scope.m.currentRowData.name;
                $scope.m.viewForm.plasmidDesc = $scope.m.currentRowData.description;
                $scope.m.viewForm.projectId = $scope.m.currentRowData.projectId;
                $scope.m.viewForm.plasmidVector = $scope.m.currentRowData.ENUM_vector;
                $scope.m.viewForm.plasmidTag = $scope.m.currentRowData.ENUM_plasmidTag;
                $scope.m.viewForm.plasmidMam = $scope.m.currentRowData.ENUM_mammalian;
                $scope.m.viewForm.plasmidBac = $scope.m.currentRowData.ENUM_bacteria;
                $scope.m.viewForm.concentration = $scope.m.currentRowData.concentration;
                $scope.m.viewForm.plasmidId = $scope.m.currentRowData.id;
                $scope.m.viewForm.createdBy = $scope.m.currentRowData.createdBy;
                $scope.m.viewForm.updatedBy = $scope.m.currentRowData.updatedBy;
                $scope.m.viewForm.createdAt = SiUtil.getDateOnly($scope.m.currentRowData.createdAt);
                $scope.m.viewForm.updatedAt = SiUtil.getDateOnly($scope.m.currentRowData.updatedAt);
                $scope.selectedSectionList = $scope.enums.ENUM_plasmidSectionName;
                $scope.m.viewForm.referenceArray = JSON.parse($scope.m.currentRowData.references);
                for (var key in $scope.m.viewForm.referenceArray) {
                    if ($scope.m.viewForm.referenceArray[key].section == "Geneious Links") {
                        $scope.m.viewForm.referenceArray[key].url = "geneious:/\/urn=" + $scope.m.viewForm.referneceArray[key].url;
                    }
                }
            }
        };

        $scope.m.loadAll = function () {
            $scope.m.dp = SiUtil.dp.bind($scope.m)();
            $scope.m.dp.initDp('CreateForm', 'requestDate', true);
            var CacheProjects = SiHttpUtil.FetchIdNameMapping('project').then(function (resp) {
                $scope.m.ProjectList = resp;
                $scope.m.ProjectDisplayData = SiHttpUtil.GetDependencyList($scope.m.ProjectList);
                $scope.m.ProjectListReady = true;
            });

            var deps = []; // Dependencies.
            deps.push(CacheProjects);
            Promise.all(deps).then(values => {
                $scope.m.refreshPlasmids();
            });
        };

        $scope.m.loadAll();
    }
})();
(function () {
    'use strict';
    angular
        .module('app.research')
        .controller('ProteinsController', ProteinsController);
    ProteinsController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$http', 'Global', '$stateParams', '$timeout'];

    function ProteinsController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $http, Global, $stateParams, $timeout) {
        // Main model.
        $scope.global = Global;
        $scope.m = {
            tableName: "protein",
            activeTab: "ViewAllTab",
            tableData: null,
            plasmidListToAdd: []
        };
        $scope.tableState.currentResearchTable = "proteins";
        $scope.op = $stateParams.op;
        $scope.id = $stateParams.id;

        $scope.m.tree_handler = function (branch) {
            if (branch.label != "No Associated Data") {
                $scope.selectedUrl = "#!/app/research/" + branch.data.tableurl + "?op=view&id=" + branch.data.id;
                $scope.selectedItem = branch.label;
            }
        };
        $scope.m.treedata = [];
        // Tree uses python helper API
        $scope.m.loadTree = function () {
            $http({
                url: SiHttpUtil.helperAPIUrl + "proteintree/" + $scope.m.viewForm.id,
                method: "GET"
            }).then(function (response) {
                $scope.m.treedata = response.data;
                if ($scope.m.treedata.length == 0) {
                    $scope.m.treedata = [{
                        label: "No Associated Data"
                    }];
                }
            })
        };

        $scope.m.fetchPlasmids = () => {
            SiHttpUtil.FetchIdNameMapping('plasmids').then(function (resp) {
                $scope.m.PlasmidList = resp;
                $scope.m.PlasmidDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.PlasmidList);
                $scope.m.PlasmidListReady = true;
            });
        }

        $scope.m.viewForm = {
            show: false,
            submitted: false,
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.viewForm)
        };
        $scope.m.editForm = {
            show: false,
            submitted: false,
            data: {},
            ui: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                var RefLinkListJson = angular.toJson($scope.m.editForm.RefLinkList.data);
                SiHttpUtil.UpdateDataEntry({
                    tableName: "protein",
                    id: $scope.m.editForm.data.id,
                    projectId: $scope.m.editForm.projectId,
                    ENUM_moleculeType: $scope.m.editForm.ENUM_moleculeType,
                    description: $scope.m.editForm.data.description,
                    molecularWeight: $scope.m.editForm.molecularWeight,
                    molarExtCoefficient: $scope.m.editForm.molarExtCoefficient,
                    pI: $scope.m.editForm.pI,
                    references: RefLinkListJson,
                    updatedAt: $scope.m.editForm.updatedAt
                }).then((resp) => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.RefreshData();
                    $scope.m.resetSelection();
                });
            },
            Delete: () => {
                if ($scope.m.currentRowData) {
                    SiHttpUtil.DeleteDataEntry("protein", $scope.m.editForm.data.id).then(function (resp) {
                        $scope.m.activeTab = "ViewAllTab";
                        $scope.m.editForm.show = false;
                        $scope.m.resetSelection();
                        $scope.m.RefreshData();
                    }, function (err) {
                        console.log("delete entry error:", err);
                    });
                }
            }
        };
        $scope.m.CreateForm = {
            data: {},
            ui: {},
            submitted: false,
            ResetTab: function () {
                $scope.m.plasmidListToAdd = [];
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.activeTab = "ViewAllTab";
            },
            initTab: () => {
                $scope.m.fetchPlasmids();
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if ($scope.m.plasmidListToAdd.length < 1) {
                    SiHttpUtil.NotifyOperationErr("At least one plasmid needs to be added when creating protein.")
                } else {
                    if (!$scope.m.CreateForm.ui.validate.$valid) {
                        console.error($scope.m.CreateForm.ui.validate);
                        return;
                    }
                    var ProteinEntry = {
                        tableName: "protein",
                        projectId: $scope.m.CreateForm.data.ProjectId,
                        plasmidList: $scope.m.plasmidListToAdd,
                        description: $scope.m.CreateForm.data.Description,
                        name: $scope.m.CreateForm.data.ProteinName,
                        rank: $scope.m.CreateForm.data.ProteinRank,
                        molecularWeight: $scope.m.CreateForm.data.molecularWeight,
                        molarExtCoefficient: $scope.m.CreateForm.data.molarExtCoefficient,
                        pI: $scope.m.CreateForm.data.pI,
                        typeCode: $scope.m.CreateForm.data.ProteinTypeCode,
                        ENUM_moleculeType: $scope.m.CreateForm.data.ProteinMoleculeType
                    };

                    SiHttpUtil.CreateTableEntry(ProteinEntry)
                        .then(function (resp) {
                            // console.log("created", resp);
                            if (resp.status == 200) {
                                $scope.m.CreateForm.ResetTab();
                                $scope.m.RefreshData();
                            }
                        });
                }
            }
        };

        $scope.m.BulkCreateForm = {
            data: {
                proteinsToAdd: []
            },
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.BulkCreateForm);
                $scope.m.BulkCreateForm.data = {};
                $scope.m.BulkCreateForm.data.proteinsToAdd = [];
            },
            addEntry: function () {
                $scope.m.BulkCreateForm.data.proteinsToAdd.push({});
            },
            removeEntry: function (index) {
                $scope.m.BulkCreateForm.data.proteinsToAdd.splice(index, 1);
            },
            copyData: function (column) {
                var len = $scope.m.BulkCreateForm.data.proteinsToAdd.length;
                var entry = $scope.m.BulkCreateForm.data.proteinsToAdd[0][column];
                for (var i = 0; i < len; i++) {
                    $scope.m.BulkCreateForm.data.proteinsToAdd[i][column] = entry;
                }
            },
            SubmitTab: function () {
                $scope.m.BulkCreateForm.submitted = true;
                if (!$scope.m.BulkCreateForm.ui.validate.$valid) {
                    console.error($scope.m.BulkCreateForm.ui.validate);
                    return;
                }

                var newEntries = [];
                for (var i = 0; i < $scope.m.BulkCreateForm.data.proteinsToAdd.length; i++) {
                    const temp = {};
                    const curr = $scope.m.BulkCreateForm.data.proteinsToAdd[i];
                    temp.projectId = curr.projectId;
                    temp.description = curr.description;
                    temp.ENUM_moleculeType = curr.ENUM_moleculeType;
                    temp.molecularWeight = curr.molecularWeight;
                    temp.molarExtCoefficient = curr.molarExtCoefficient;
                    temp.pI = curr.pI;
                    if (curr.dna1 == curr.dna2) {
                        SiHttpUtil.NotifyOperationErr("Entry # " + (i + 1) + " has the same plasmid");
                        return;
                    }
                    temp.plasmidList = [curr.dna1, curr.dna2];
                    newEntries.push(temp);
                }
                var toCreate = {
                    tableName: "protein",
                    list: newEntries
                }

                SiHttpUtil.CreateTableEntries(toCreate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.BulkCreateForm.ResetTab();
                            $scope.m.activeTab = "ViewAllTab";
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        $scope.m.Mappings = {
            data: {},
            loadData: () => {
                SiHttpUtil.FetchIdNameMapping("domain").then(resp => {
                    $scope.m.Mappings.domainMappings = resp.domainMappings || [];
                    $scope.m.Mappings.antigenClasses = resp.antigenClasses || [];
                })
            },
            removeEntry: (type, id) => {
                SiHttpUtil.DeleteDataEntry(type, id).then(resp => {
                    $scope.m.Mappings.loadData();
                })
            },
            addEntry: type => {
                const data = {
                    tableName: type
                }
                if (type === 'domain') {
                    data.domain = $scope.m.Mappings.data.domainName;
                    data.antigen = $scope.m.Mappings.data.antigenName;
                    data.fto = $scope.m.Mappings.data.fto;
                } else if (type === 'antigen') {
                    data.antigen = $scope.m.Mappings.data.antigenClassName;
                    data.class = $scope.m.Mappings.data.class;
                } else {
                    return;
                }
                SiHttpUtil.CreateTableEntry(data).then(resp => {
                    $scope.m.Mappings.loadData();
                }, err => {
                    SiHttpUtil.NotifyOperationErr("Error");
                })
                $scope.m.Mappings.data = {};
            }
        }

        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateBulkCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.BulkCreateForm.ui.validate,
                $scope.m.BulkCreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.addPlasmid = function (plasmidId) {
            if ($scope.m.plasmidListToAdd.indexOf(plasmidId) > -1) {
                SiHttpUtil.NotifyOperationErr("Plasmid " + plasmidId + " Already added. Cannot be added again.")
            } else {
                $scope.m.plasmidListToAdd.push(plasmidId);
            }
        }
        $scope.removePlasmid = function (index) {
            $scope.m.plasmidListToAdd.splice(index, 1);
        }

        $scope.m.DtInstCallback = function (inst) {
            console.log("dt:", inst);
            $scope.m.DtInst = inst;
        };

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.LoadProteinList());
                } else {
                    $scope.m.LoadProteinList();
                }
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.dtColumns = [];

        $scope.m.LoadProteinList = function () {
            return SiHttpUtil.FetchTableEntries('protein').then(function (resp) {
                return new Promise(function (resolve, reject) {
                    if (resp.enums) {
                        var enumList = JSON.parse(resp.enums);
                        $scope.enums = enumList;
                        $scope.molecuTypes = enumList.ENUM_moleculeType || [];
                    }
                    $scope.m.tableData = resp.records;
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('protein', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('protein', colName),
                                (colName) => SiHttpUtil.hideColumnForTable('protein', colName),
                                SiHttpUtil.tableOrder('protein')
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),

                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'description'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                )
                        ];


                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                                if ($scope.op == "view" && $scope.id) {
                                    var records = $scope.m.tableData;
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.id) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.m.viewDetail();
                                }
                                if ($scope.op == "create") {
                                    var records = $scope.m.tableData;
                                    $scope.m.activeTab = "CreateTab";
                                }
                            }).withOption('order', [[10, 'desc']])
                    }
                });
            });
        };

        $scope.m.renderSequence = (plasmid) => {
            const seq = new Sequence(plasmid.PlasmidDatum.aaSequence);
            $timeout(function () {
                seq.render('#plasmid' + plasmid.id, {
                    'charsPerLine': 60,
                    'search': true,
                    'badge': false,
                    'title': 'Sequence'
                });
                const coverage = [];
                const colors = SiHttpUtil.GraphColors();
                const start = plasmid.PlasmidDatum.aaSeqStart;
                const end = plasmid.PlasmidDatum.aaSeqEnd;
                let last;
                if (plasmid.PlasmidAnnotations && start) {
                    for (let i = 0; i < plasmid.PlasmidAnnotations.length; i++) {
                        const curr = plasmid.PlasmidAnnotations[i];
                        if (curr.start <= end && curr.start >= start) {
                            if (!last ||
                                (curr.start >= last.start && curr.start >= last.end)
                            ) {
                                coverage.push({
                                    start: Math.round((curr.start - start)/3),
                                    end: Math.round((curr.end - start)/3),
                                    color: curr.description.includes("linker") ? "black" : colors[i % (colors.length - 1)],
                                    underscore: curr.description.includes("linker"),
                                    tooltip: curr.description
                                });
                                last = curr;
                            }
                        }
                    }
                }
                seq.coverage(coverage);
            }, 0);

        }

        $scope.m.refreshPlasmidData = entryId => {
            SiHttpUtil.RefreshPlasmidData(entryId).then(resp => {
                SiHttpUtil.FetchOneEntry('protein', $scope.m.currentRowData.id).then(resp => {
                    $scope.m.viewForm.Plasmids = resp.Plasmids;
                });
            }, err => {
                SiHttpUtil.NotifyOperationErr(err);
            })
        }

        // Copy model to views.
        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.viewForm.show = true;
                $scope.m.activeTab = "DetailTab";
                SiHttpUtil.FetchOneEntry('protein', $scope.m.currentRowData.id).then(resp => {
                    $scope.m.viewForm.Plasmids = resp.Plasmids;
                });
                $scope.m.viewForm.id = $scope.m.currentRowData.id;
                $scope.m.viewForm.proteinName = $scope.m.currentRowData.name;
                $scope.m.treedata = [];
                $scope.selectedUrl = null;
                $scope.selectedItem = null;
                $scope.m.viewForm.description = $scope.m.currentRowData.description;
                $scope.m.viewForm.projectId = $scope.m.currentRowData.projectId;
                $scope.m.viewForm.ENUM_moleculeType = $scope.m.currentRowData.ENUM_moleculeType;
                $scope.m.viewForm.createdBy = $scope.UserHash[$scope.m.currentRowData.createdBy];
                $scope.m.viewForm.updatedBy = $scope.UserHash[$scope.m.currentRowData.updatedBy];
                $scope.m.viewForm.createdAt = SiUtil.getDateOnly($scope.m.currentRowData.createdAt);
                $scope.m.viewForm.updatedAt = SiUtil.getDateOnly($scope.m.currentRowData.updatedAt);
                $scope.selectedSectionList = $scope.enums.ENUM_proteinSectionName;
                $scope.m.viewForm.molecularWeight = $scope.m.currentRowData.molecularWeight;
                $scope.m.viewForm.molarExtCoefficient = $scope.m.currentRowData.molarExtCoefficient;
                $scope.m.viewForm.pI = $scope.m.currentRowData.pI;
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.activeTab = "EditTab";
                SiHttpUtil.FetchOneEntry('protein', $scope.m.currentRowData.id).then(resp => {
                    $scope.m.editForm.Plasmids = resp.Plasmids;
                });
                $scope.m.fetchPlasmids();
                $scope.m.editForm.data.id = $scope.m.currentRowData.id;
                $scope.m.editForm.proteinName = $scope.m.currentRowData.name;
                $scope.m.editForm.data.description = $scope.m.currentRowData.description;
                $scope.m.editForm.projectId = $scope.m.currentRowData.projectId;
                $scope.m.editForm.ENUM_moleculeType = $scope.m.currentRowData.ENUM_moleculeType;
                $scope.m.editForm.updatedAt = $scope.m.currentRowData.updatedAt;
                $scope.m.editForm.molecularWeight = $scope.m.currentRowData.molecularWeight;
                $scope.m.editForm.molarExtCoefficient = $scope.m.currentRowData.molarExtCoefficient;
                $scope.m.editForm.pI = $scope.m.currentRowData.pI;

                $scope.m.editForm.RefLinkList = {
                    data: JSON.parse($scope.m.currentRowData.references) || [],
                    nameList: $scope.enums.ENUM_proteinSectionName
                }
                $scope.m.editForm.show = true;
            }
        };

        $scope.addPlasProPair = function (id) {
            if ($scope.m.editForm.Plasmids.map(entry => entry.id).indexOf(id) > -1) {
                SiHttpUtil.NotifyOperationErr("Duplicate plasmid cannot be added.")
            } else {
                $scope.submitted = true;
                SiHttpUtil.CreateTableEntry(
                    {
                        tableName: "proteinPlasmidMapping",
                        proteinId: $scope.m.editForm.data.id,
                        plasmidId: id
                    }).then((resp) => {
                        if (resp.status == 200) {
                            $scope.m.LoadProteinList();
                            $scope.recordTab = 0;
                            $scope.m.editForm.Plasmids.push({
                                id: id,
                                name: $scope.m.PlasmidDisplayData.ListHash[id].name,
                                description: $scope.m.PlasmidDisplayData.ListHash[id].description,
                            });
                        }
                    });
            }
        };

        $scope.removePlasProPair = function (id) {
            if ($scope.m.editForm.Plasmids.map(entry => entry.id).indexOf(id) < 0) {
                SiHttpUtil.NotifyOperationErr("No such plasmid cannot be added.")
            } else {
                $scope.submitted = true;
                $http({
                    url: $scope.global.gateway + "/deleteEntry",
                    method: "POST",
                    data: {
                        tableName: "proteinPlasmidMapping",
                        proteinId: $scope.m.editForm.data.id,
                        plasmidId: id
                    }
                }).then((resp) => {
                    SiHttpUtil.NotifyMsgByCode(resp, "Delete Plasmid Protein Pair")
                        .then(() => {
                            //$scope.m.editForm.cancelTab();
                            $scope.m.LoadProteinList();
                            $scope.recordTab = 0;
                            var idx = $scope.m.editForm.Plasmids.map(entry => entry.id).indexOf(id);
                            if (idx > -1) {
                                $scope.m.editForm.Plasmids.splice(idx, 1);
                            }
                        });
                });
            }
        };

        var LoadProjectList = SiHttpUtil.FetchIdNameMapping('project').then(function (resp) {
            $scope.m.ProjectList = resp;
            $scope.m.ProjectDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.ProjectList);
            $scope.m.ProjectListReady = true;
        });

        var deps = []; // Dependencies.
        deps.push(LoadProjectList);
        Promise.all(deps).then(values => {
            $scope.m.LoadProteinList();
        });
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('TransfectionRequestsController', TransfectionRequestsController);
    TransfectionRequestsController.$inject = ['$scope', 'DTOptionsBuilder',
        'DTColumnBuilder', 'SiUtil', '$state', 'SiHttpUtil', 'DTColumnDefBuilder', '$stateParams'
    ];

    function TransfectionRequestsController($scope, DTOptionsBuilder, DTColumnBuilder, SiUtil, $state, SiHttpUtil, DTColumnDefBuilder, $stateParams) {
        $scope.m = {
            tableName: "transfectionRequest",
            activeTab: "ViewAllTab",
            dtColumns: [],
            tableData: null
        };
        $scope.op = $stateParams.op;
        $scope.opId = $stateParams.id;
        $scope.tableState.currentResearchTable = "transfectionRequests";
        $scope.m.createFromPlasmid = false;
        $scope.m.createOptions = [
            {
                "value": 1,
                "text": "Create From Plasmid"
            },
            {
                "value": 2,
                "text": "Create From Protein"
            },
        ];

        $scope.m.statusFilter = {
            includePending: true,
            includeApproved: true,
            includeProgress: true,
            includePurification: true,
            includeComplete: false,
            includeFailed: false
        }

        $scope.m.getQuery = () => {
            var query = {
                $or: []
            };
            if ($scope.m.statusFilter.includePending) {
                query.$or.push({requestStatus: 'Pending'});
            }
            if ($scope.m.statusFilter.includeApproved) {
                query.$or.push({requestStatus: 'Approved'});
            }
            if ($scope.m.statusFilter.includeProgress) {
                query.$or.push({requestStatus: 'In Progress'});
            }
            if ($scope.m.statusFilter.includePurification) {
                query.$or.push({requestStatus: 'In Purification'});
            }
            if ($scope.m.statusFilter.includeComplete) {
                query.$or.push({requestStatus: 'Completed'});
            }
            if ($scope.m.statusFilter.includeFailed) {
                query.$or.push({requestStatus: 'Failed'});
            }
            if (query.$or.length == 0) {
                query = {};
            }
            $scope.m.query = query;
        }

        $scope.m.onStatusChange = function () {
            $scope.m.getQuery();
            $scope.m.RefreshData();
        }

        $scope.m.viewForm = SiHttpUtil.InitViewForm($scope.m);

        $scope.m.CreateForm = {
            data: {},
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.activeTab = "ViewAllTab";
                $scope.m.dp.initDp('CreateForm', 'requestedDate', false);
                $scope.m.dp.initDp('CreateForm', 'requestedHarvestDate', false);
            },
            changePurify: () => {
                SiUtil.GetPurificationTagMethod($scope.m.CreateForm.data.proteinId, $scope.transfectionTags, $scope.transfectionPurificationMethods).then(result => {
                    $scope.m.CreateForm.data.transfectionTag = result.tag;
                    $scope.m.CreateForm.data.methods = angular.copy(result.methods);
                });
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                var TREntry = {
                    tableName: "transfectionRequest",
                    proteinId: $scope.m.CreateForm.data.proteinId,
                    ENUM_transfectionTag: $scope.m.CreateForm.data.purifyOrNot ? $scope.m.CreateForm.data.transfectionTag : null,
                    ENUM_transfectionScale: $scope.m.CreateForm.data.transfectionScale,
                    ENUM_transfectionType: $scope.m.CreateForm.data.transfectionType,
                    ENUM_transfectionCellLine: $scope.m.CreateForm.data.transfectionCellLine,
                    ENUM_transfectionPurificationMethod: $scope.m.CreateForm.data.purifyOrNot ? $scope.m.CreateForm.data.transfectionPurificationMethod: null,
                    purifyOrNot: $scope.m.CreateForm.data.purifyOrNot ? $scope.m.CreateForm.data.purifyOrNot : "No",
                    bufferExchange: $scope.m.CreateForm.data.transfectionBufferExchange ? $scope.m.CreateForm.data.transfectionBufferExchange : "No",
                    requesterNotes: $scope.m.CreateForm.data.requesterNotes,
                    requestedDate: $scope.m.CreateForm.data.requestedDate.dt,
                    requestedHarvestDate: $scope.m.CreateForm.data.requestedHarvestDate.dt
                };

                SiHttpUtil.CreateTableEntry(TREntry).then(function (resp) {
                    if (resp.status == 200) {
                        $scope.m.CreateForm.ResetTab();
                        $scope.m.RefreshData();
                        SiHttpUtil.ResetStateParams();
                    }
                });
            }
        };
        $scope.m.editForm = {
            show: false,
            submitted: false,
            ui: {},
            data: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.EditForm.ui.validate);
                    return;
                }
                SiHttpUtil.UpdateDataEntry({
                    id: $scope.m.editForm.id,
                    tableName: "transfectionRequest",
                    ENUM_transfectionScale: $scope.m.editForm.transfectionScale,
                    ENUM_transfectionType: $scope.m.editForm.transfectionType,
                    ENUM_transfectionCellLine: $scope.m.editForm.transfectionCellLine,
                    purifyOrNot: $scope.m.editForm.transfectionPurifyOrNot,
                    ENUM_transfectionPurificationMethod: $scope.m.editForm.transfectionPurifyOrNot == 'Yes' ? $scope.m.editForm.transfectionPurificationMethod : null,
                    bufferExchange: $scope.m.editForm.transfectionPurifyOrNot == 'Yes' ? $scope.m.editForm.transfectionBufferExchange : null,
                    ENUM_transfectionTag: $scope.m.editForm.transfectionPurifyOrNot == 'Yes' ? $scope.m.editForm.transfectionRequestTags : null,
                    requesterNotes: $scope.m.editForm.requesterNotes,
                    notes: $scope.m.editForm.notes,
                    requestedDate: $scope.m.editForm.transfectionPurifyOrNot == 'No' ? $scope.m.editForm.data.requestedDate.dt : null,
                    requestedHarvestDate: $scope.m.editForm.transfectionPurifyOrNot == 'No' ? $scope.m.editForm.data.requestedHarvestDate.dt : null,
                    updatedAt: $scope.m.editForm.updatedAt
                }).then(resp => {
                    if (resp.status == 200) {
                        $scope.m.editForm.CancelTab();
                        $scope.m.RefreshData();
                        $scope.m.resetSelection();
                    }
                });
            }
        };
        $scope.m.BulkCreateForm = {
            data: {
                requestsToAdd: [],
                requestsToAddNoPur: []
            },
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.BulkCreateForm);
                $scope.m.BulkCreateForm.data = {};
                $scope.m.BulkCreateForm.data.requestsToAdd = [];
                $scope.m.BulkCreateForm.data.requestsToAddNoPur = [];
            },
            addEntry: function (form) {
                if (form === "requestsToAddNoPur") {
                    $scope.m.BulkCreateForm.data[form].push({
                        requestedDate: {},
                        requestedHarvestDate: {}
                    });
                } else {
                    $scope.m.BulkCreateForm.data[form].push({});
                }
            },
            removeEntry: function (form, index) {
                $scope.m.BulkCreateForm.data[form].splice(index, 1);
            },
            dpOpen: function ($event, input) {
                $event.preventDefault();
                $event.stopPropagation();
                input.opened = !(input.opened);
            },
            copyData: function (form, column, date) {
                const len = $scope.m.BulkCreateForm.data[form].length;
                const entry = $scope.m.BulkCreateForm.data[form][0][column];
                for (var i = 0; i < len; i++) {
                    if (date) {
                        $scope.m.BulkCreateForm.data[form][i][column].dt = entry.dt;
                    } else {
                        $scope.m.BulkCreateForm.data[form][i][column] = entry;
                    }
                }
            },
            changeProtein: (entry) => {
                SiUtil.GetPurificationTagMethod(entry.proteinId, $scope.transfectionTags, $scope.transfectionPurificationMethods).then(result => {
                    entry.transfectionTag = result.tag;
                    entry.methods = angular.copy(result.methods);
                });
            },
            SubmitTab: function () {
                $scope.m.BulkCreateForm.submitted = true;
                if (!$scope.m.BulkCreateForm.ui.validate.$valid) {
                    console.error($scope.m.BulkCreateForm.ui.validate);
                    return;
                }
                if ($scope.m.BulkCreateForm.data.requestsToAdd.length == 0 && $scope.m.BulkCreateForm.data.requestsToAddNoPur.length == 0) {
                    SiHttpUtil.NotifyOperationErr("Must add at least one request");
                    return;
                }
                const TREntry = function () {
                    return {
                        ENUM_transfectionType: $scope.m.BulkCreateForm.data.transfectionType,
                        ENUM_transfectionCellLine: $scope.m.BulkCreateForm.data.transfectionCellLine,
                    }
                }

                const newEntries = [];
                let i;
                for (i = 0; i < $scope.m.BulkCreateForm.data.requestsToAdd.length; i++) {
                    const temp = TREntry();
                    temp.purifyOrNot = "Yes",
                    temp.proteinId = $scope.m.BulkCreateForm.data.requestsToAdd[i].proteinId;
                    temp.ENUM_transfectionTag = $scope.m.BulkCreateForm.data.requestsToAdd[i].transfectionTag;
                    temp.ENUM_transfectionPurificationMethod = $scope.m.BulkCreateForm.data.requestsToAdd[i].transfectionPurificationMethod;
                    temp.requesterNotes = $scope.m.BulkCreateForm.data.requestsToAdd[i].requesterNotes;
                    temp.bufferExchange = $scope.m.BulkCreateForm.data.requestsToAdd[i].bufferExchange ? $scope.m.BulkCreateForm.data.requestsToAdd[i].bufferExchange : "No";
                    temp.ENUM_transfectionScale = $scope.m.BulkCreateForm.data.requestsToAdd[i].transfectionScale;
                    newEntries.push(temp);
                }
                for (i = 0; i < $scope.m.BulkCreateForm.data.requestsToAddNoPur.length; i++) {
                    const temp = TREntry();
                    temp.purifyOrNot = "No",
                    temp.proteinId = $scope.m.BulkCreateForm.data.requestsToAddNoPur[i].proteinId;
                    temp.requestedDate = $scope.m.BulkCreateForm.data.requestsToAddNoPur[i].requestedDate.dt;
                    temp.requestedHarvestDate = $scope.m.BulkCreateForm.data.requestsToAddNoPur[i].requestedHarvestDate.dt;
                    temp.requesterNotes = $scope.m.BulkCreateForm.data.requestsToAddNoPur[i].requesterNotes;
                    temp.ENUM_transfectionScale = $scope.m.BulkCreateForm.data.requestsToAddNoPur[i].transfectionScale;
                    temp.bufferExchange = "No";
                    newEntries.push(temp);
                }
                const toCreate = {
                    tableName: "transfectionRequest",
                    list: newEntries
                }

                SiHttpUtil.CreateTableEntries(toCreate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.BulkCreateForm.ResetTab();
                            $scope.m.activeTab = "ViewAllTab";
                            $scope.m.RefreshData();
                        }
                    });

            }
        };
        $scope.m.BulkEditForm = {
            data: {
                currTRs: []
            },
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.BulkEditForm);
                $scope.m.activeTab = "ViewAllTab";
                $scope.m.BulkEditForm.data = {
                    currTRs: []
                };
            },
            updateCurrTRs: function () {
                $scope.m.BulkEditForm.data.currTRs = [];
                var query = { requestStatus: $scope.m.BulkEditForm.data.requestStatus, bulkEdit: true };
                SiHttpUtil.SearchByColumn('transfectionRequest', query).then(function (resp) {
                    $scope.m.BulkEditForm.data.currTRs = resp.records;
                });
            },
            ResetData: function () {
                $scope.m.BulkEditForm.data = {
                    currTRs: []
                };
            },
            removeEntry: function (i) {
                $scope.m.BulkEditForm.data.currTRs.splice(i, 1);
            },
            SubmitTab: function () {
                $scope.m.BulkEditForm.submitted = true;
                if (!$scope.m.BulkEditForm.ui.validate.$valid) {
                    console.error($scope.m.BulkEditForm.ui.validate);
                    return;
                }
                var updateEntries = [];
                for (var i = 0; i < $scope.m.BulkEditForm.data.currTRs.length; i++) {
                    var currEntry = {
                        id: $scope.m.BulkEditForm.data.currTRs[i].id,
                        dnaReady: $scope.m.BulkEditForm.data.currTRs[i].dnaReady,
                        notes: $scope.m.BulkEditForm.data.currTRs[i].notes,
                        updatedAt: $scope.m.BulkEditForm.data.currTRs[i].updatedAt
                    }
                    if ($scope.m.BulkEditForm.data.currTRs[i].approved) {
                        currEntry.requestStatus = "Approved";
                        currEntry.approvedBy = SiHttpUtil.GetUserId()
                    };
                    updateEntries.push(currEntry);
                }
                var toUpdate = {
                    tableName: "transfectionRequest",
                    list: updateEntries
                }
                SiHttpUtil.UpdateDataEntries(toUpdate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.BulkEditForm.ResetTab();
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        $scope.m.ValidateBulkCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.BulkCreateForm.ui.validate,
                $scope.m.BulkCreateForm.submitted, FieldName, Type);
        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.plasmidListToAdd = [];
        $scope.m.plasmidTrqPairs = [];
        $scope.m.plasmidProteinPairs = [];

        $scope.addPlasmid = function (plasmidId) {
            if ($scope.m.plasmidListToAdd.indexOf(plasmidId) > -1) {
                SiHttpUtil.NotifyOperationErr("Plasmid " + plasmidId + " Already added. Cannot be added again.")
            } else {
                $scope.m.plasmidListToAdd.push(plasmidId);
            }
        }
        $scope.removePlasmid = function (index) {
            $scope.m.plasmidListToAdd.splice(index, 1);
        }

        $scope.createTransfectionSelected = function () {
            SiHttpUtil.FetchIdNameMapping('plasmids').then(function (resp) {
                $scope.m.PlasmidList = resp;
                $scope.m.PlasmidDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.PlasmidList);
                $scope.m.PlasmidListReady = true;
            });
            SiHttpUtil.FetchIdNameMapping('project').then(function (resp) {
                $scope.m.ProjectList = resp;
                $scope.m.ProjectDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.ProjectList);
                $scope.m.ProjectListReady = true;
            });
            $scope.m.CreateForm.data.plasmidsReady = [];
            SiHttpUtil.FetchEnumList(['proteins']).then(function (resp) {
                if (resp) {
                    $scope.molecuTypes = resp.ENUM_moleculeType;
                }
            }, function (err) {
                console.log(err);
            });
        }

        $scope.m.DtInstCallback = function (inst) {
            $scope.m.DtInst = inst;
        };
        SiHttpUtil.InitRowClick($scope);

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.refreshTransfectionRequests());
                } else {
                    $scope.m.refreshTransfectionRequests();
                }
            }
        };

        $scope.m.refreshTransfectionRequests = function () {
            return SiHttpUtil.SearchByColumn('transfectionRequest', $scope.m.query).then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp.records;
                    if (resp.enums) {
                        var enums = JSON.parse(resp.enums);
                        $scope.transfectionTags = enums.ENUM_transfectionTag;
                        $scope.transfectionScales = enums.ENUM_transfectionScale;
                        $scope.transfectionTypes = enums.ENUM_transfectionType;
                        $scope.transfectionCellLines = enums.ENUM_transfectionCellLine;
                        $scope.transfectionPurificationMethods = enums.ENUM_transfectionPurificationMethod;
                    }

                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('transfectionRequest', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('transfectionRequest', colName)
                            );
                        }
                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'proteinId'))
                                .renderWith(
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.ProteinDisplayData.Hash)
                                )
                                .withOption('type', 'natural'),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'requesterId'))
                                .renderWith(
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith(
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'requestStatus'))
                                .renderWith(
                                SiUtil.ColDisplayers.StatusDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'requesterNotes'))
                                .renderWith(
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'notes'))
                                .renderWith(
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                .renderWith(
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                        ];
                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.transfectionsReady = true;
                            }
                        );
                    } else {
                        resolve($scope.m.tableData);
                    }
                }, function (error) {
                    console.log("transfections get error:", error);
                });
            });
        };

        $scope.m.resetCreateOption = function () {
            $scope.m.CreateForm.data = {};
        }

        $scope.submitProteinCreateForm = function () {
            if ($scope.m.plasmidListToAdd.length < 1) {
                SiHttpUtil.NotifyOperationErr("At least one plasmid needs to be added when creating protein.")
            } else if ($scope.m.CreateForm.data.ProjectId == undefined) {
                SiHttpUtil.NotifyOperationErr("project cannot be empty when creating protein.")
            } else if ($scope.m.CreateForm.data.ProjectId == undefined) {
                SiHttpUtil.NotifyOperationErr("project cannot be empty when creating protein.")
            } else if ($scope.m.CreateForm.data.ProteinMoleculeType == undefined) {
                SiHttpUtil.NotifyOperationErr("protein molecule type cannot be empty when creating protein.")
            } else if ($scope.m.CreateForm.data.Description == undefined) {
                SiHttpUtil.NotifyOperationErr("protein description cannot be empty when creating protein.")
            } else {
                var ProteinEntry = {
                    tableName: "protein",
                    projectId: $scope.m.CreateForm.data.ProjectId,
                    plasmidList: $scope.m.plasmidListToAdd.join(';'),
                    description: $scope.m.CreateForm.data.Description,
                    ENUM_moleculeType: $scope.m.CreateForm.data.ProteinMoleculeType
                };

                SiHttpUtil.CreateTableEntry(ProteinEntry)
                    .then(function (resp) {
                        // console.log("created", resp);
                        //SiHttpUtil.NotifyOk("Protein " + resp.data.name + " is created successfully");
                        if (resp.status == 200) {
                            $scope.m.CreateForm.data.proteinName = resp.data.name;
                            $scope.m.CreateForm.data.proteinId = resp.data.id;
                            $scope.m.plasmidListToAdd = [];
                        }
                    });
            }
        }

        $scope.updateTRStatus = function (status) {
            SiHttpUtil.UpdateDataEntry(
                {
                    id: $scope.m.editForm.id,
                    tableName: "transfectionRequest",
                    requestStatus: status,
                    updatedAt: $scope.m.editForm.updatedAt
                }
            ).then(function (response) {
                $scope.m.RefreshData();
                $scope.m.activeTab = "ViewAllTab";
                $scope.m.editForm.show = false;
                $scope.m.resetSelection();
            }, function (error) {
                console.error("updateEntry error:", error);
            });
        };
        $scope.m.approveReq = function () {
            SiHttpUtil.UpdateDataEntry(
                {
                    id: $scope.m.currentRowData.id,
                    tableName: "transfectionRequest",
                    requestStatus: "Approved",
                    approvedBy: SiHttpUtil.GetUserId(),
                    updatedAt: $scope.m.currentRowData.updatedAt
                }
            ).then(function (response) {
                $scope.m.RefreshData();
                $scope.m.resetSelection();
            }, function (error) {
                console.error("updateEntry error:", error);
            });
        };
        $scope.m.dnaReady = function () {
            SiHttpUtil.UpdateDataEntry(
                {
                    id: $scope.m.currentRowData.id,
                    tableName: "transfectionRequest",
                    dnaReady: "Yes",
                    updatedAt: $scope.m.currentRowData.updatedAt
                }
            ).then(function (response) {
                $scope.m.RefreshData();
                $scope.m.resetSelection();
            }, function (error) {
                console.error("updateEntry error:", error);
            });
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.editForm.show = true;
                $scope.m.activeTab = "EditTab";
                $scope.m.editForm.id = $scope.m.currentRowData.id;
                $scope.m.editForm.name = $scope.m.currentRowData.name;
                $scope.m.editForm.proteinId = $scope.m.currentRowData.proteinId;
                $scope.m.editForm.transfectionRequestTags = $scope.m.currentRowData.ENUM_transfectionTag;
                $scope.m.editForm.transfectionScale = $scope.m.currentRowData.ENUM_transfectionScale;
                $scope.m.editForm.transfectionType = $scope.m.currentRowData.ENUM_transfectionType;
                $scope.m.editForm.transfectionCellLine = $scope.m.currentRowData.ENUM_transfectionCellLine;
                $scope.m.editForm.transfectionPurifyOrNot = $scope.m.currentRowData.purifyOrNot;
                $scope.m.editForm.transfectionPurificationMethod = $scope.m.currentRowData.ENUM_transfectionPurificationMethod;
                $scope.m.editForm.transfectionBufferExchange = $scope.m.currentRowData.bufferExchange;
                $scope.m.editForm.data.requestedDate.dt = ($scope.m.currentRowData.requestedDate) ? new Date($scope.m.currentRowData.requestedDate) : null;
                $scope.m.editForm.data.requestedHarvestDate.dt = ($scope.m.currentRowData.requestedHarvestDate) ? new Date($scope.m.currentRowData.requestedHarvestDate) : null;
                $scope.m.editForm.requesterNotes = $scope.m.currentRowData.requesterNotes;
                $scope.m.editForm.notes = $scope.m.currentRowData.notes;
                $scope.m.editForm.requestStatus = $scope.m.currentRowData.requestStatus;
                $scope.m.editForm.requesterId = $scope.m.currentRowData.requesterId;
                $scope.m.editForm.updatedAt = $scope.m.currentRowData.updatedAt;
            }
        };
        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.viewForm.show = true;
                $scope.m.activeTab = "DetailTab";
                SiHttpUtil.FetchOneEntry('transfectionRequest', $scope.m.currentRowData.id).then(resp => {
                    $scope.m.viewForm.data = resp;
                    $scope.m.viewForm.data.createdAt = SiUtil.getDateOnly(resp.createdAt);
                    $scope.m.viewForm.data.updatedAt = SiUtil.getDateOnly(resp.updatedAt);
                    $scope.m.viewForm.data.requestedDate = SiUtil.getDateOnly(resp.requestedDate);
                    $scope.m.viewForm.data.requestedHarvestDate = SiUtil.getDateOnly(resp.requestedHarvestDate);
                });
            }
        };
        $scope.m.deleteTransfectionRequest = () => {
            if ($scope.m.currentRowData) {
                if ($scope.m.editForm.requesterId != SiHttpUtil.GetUserId()) {
                    SiHttpUtil.NotifyOperationErr("Cannot delete someone else's transfection request");
                    return;
                }
                SiHttpUtil.DeleteDataEntry("transfectionRequest", $scope.m.editForm.id).then(function (resp){
                    $scope.m.activeTab = "ViewAllTab";
                    $scope.m.editForm.show = false;
                    $scope.m.RefreshData();
                }, function (err) {
                    console.log("delete entry error:", err);
                });
            }
        };
        $scope.m.newTransfectionFromRequest = function () {
            if ($scope.m.currentRowData) {
                $state.go("app.research.transfections", { op: "create", id: $scope.m.currentRowData.id });
            }
        };
        $scope.m.duplicateTransfectionReq = function () {
            if ($scope.m.currentRowData) {
                $scope.m.CreateForm.data.createOption = 2;
                $scope.m.CreateForm.data.proteinId = $scope.m.currentRowData.proteinId;
                $scope.m.CreateForm.data.transfectionTag = $scope.m.currentRowData.ENUM_transfectionTag;
                $scope.m.CreateForm.data.transfectionScale = $scope.m.currentRowData.ENUM_transfectionScale;
                $scope.m.CreateForm.data.transfectionType = $scope.m.currentRowData.ENUM_transfectionType;
                $scope.m.CreateForm.data.transfectionCellLine = $scope.m.currentRowData.ENUM_transfectionCellLine;
                $scope.m.CreateForm.data.transfectionPurifyOrNot = $scope.m.currentRowData.purifyOrNot;
                $scope.m.CreateForm.data.transfectionMolecularWeight = $scope.m.currentRowData.molecularWeight;
                $scope.m.CreateForm.data.transfectionMolarExtCoefficient = $scope.m.currentRowData.molarExtCoefficient;
                $scope.m.CreateForm.data.transfectionPl = $scope.m.currentRowData.pl;
                $scope.m.CreateForm.data.transfectionPurificationMethod = $scope.m.currentRowData.ENUM_transfectionPurificationMethod;
                $scope.m.CreateForm.data.transfectionBufferExchange = $scope.m.currentRowData.bufferExchange;
                $scope.m.CreateForm.data.requesterNotes = $scope.m.currentRowData.requesterNotes;
                $scope.m.activeTab = "CreateTab";
            }
        };

        $scope.m.loadAll = function () {
            $scope.m.dp = SiUtil.dp.bind($scope.m)();
            $scope.m.dp.initDp('CreateForm', 'requestedDate', false);
            $scope.m.dp.initDp('CreateForm', 'requestedHarvestDate', false);
            $scope.m.dp.initDp('editForm', 'requestedDate', false);
            $scope.m.dp.initDp('editForm', 'requestedHarvestDate', false);
            var CacheProtein = SiHttpUtil.FetchIdNameMapping('protein').then(function (resp) {
                $scope.m.ProteinList = resp;
                $scope.m.ProteinDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.ProteinList);
                $scope.m.ProteinListReady = true;
            });
            var deps = [];
            deps.push(CacheProtein);
            $scope.m.getQuery();
            Promise.all(deps).then(values => {
                $scope.m.refreshTransfectionRequests();
                if ($scope.op === "view" && $scope.opId) {
                    $scope.m.currentRowData = {
                        id: $scope.opId
                    }
                    $scope.m.viewDetail();
                }
                if ($scope.op == "create") {
                    $scope.m.activeTab = "CreateTab";
                }
            });
        }
        $scope.m.loadAll();
    }
})();

(function () {
    'use strict';

    angular
        .module('app.research')
        .controller('TransfectionsController', TransfectionsController);

    TransfectionsController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$stateParams', '$state'];

    function TransfectionsController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $stateParams, $state) {
        // Main model.
        $scope.m = {};
        $scope.tableState.currentResearchTable = "transfections";
        $scope.m.tableName = "transfection";
        $scope.m.activeTab = "ViewAllTab";
        $scope.m.tableData = null;
        $scope.m.plasmidProteinPairs = [];
        $scope.m.TRList = [];
        $scope.m.TRListReady = false;
        $scope.m.TRDisplayData = {};
        $scope.m.PlasmidList = [];
        $scope.m.PlasmidListReady = false;
        $scope.m.PlasmidDisplayData = {};
        $scope.m.EnumList = [];
        $scope.m.EnumListReady = false;
        $scope.molecuTypes = [];
        $scope.m.plasmidListToAdd = [];
        $scope.op = $stateParams.op;
        $scope.id = $stateParams.id;

        $scope.m.trListToAdd = [];
        $scope.m.addTR = function (trId) {
            if (!trId) {
                SiHttpUtil.NotifyOperationErr("Please choose a transfection request");
            } else if ($scope.m.trListToAdd.indexOf(trId) > -1) {
                SiHttpUtil.NotifyOperationErr("Transfection Request " + trId + " Already added. Cannot be added again.")
            } else {
                $scope.m.trListToAdd.push(trId);
                $scope.m.CreateForm.data.transfectionDate.dt = ($scope.m.TRDisplayData.ListHash[trId].requestedDate) ? new Date($scope.m.TRDisplayData.ListHash[trId].requestedDate) : new Date();
                $scope.m.CreateForm.data.harvestDate.dt = ($scope.m.TRDisplayData.ListHash[trId].requestedHarvestDate) ? new Date($scope.m.TRDisplayData.ListHash[trId].requestedHarvestDate) : null;
            }
        }
        $scope.m.removeTR = function (index) {
            $scope.m.trListToAdd.splice(index, 1);
            $scope.m.CreateForm.data.transfectionDate.dt = new Date();
            $scope.m.CreateForm.data.harvestDate.dt = null;
        }

        $scope.m.statusFilter = {
            includeProgress: false,
            includePurification: false,
            includeComplete: false,
            includeFailed: false,
        }

        $scope.m.onStatusChange = function () {
            var table = $('#example').DataTable();
            var val = [];
            if ($scope.m.statusFilter.includeProgress) {
                val.push('Progress');
            }
            if ($scope.m.statusFilter.includePurification) {
                val.push('Purification');
            }
            if ($scope.m.statusFilter.includeComplete) {
                val.push('Completed');
            }
            if ($scope.m.statusFilter.includeFailed) {
                val.push('Failed');
            }
            table
                .columns(3) // Changed because of reorder function
                .search(val.join('|'), true, false)
                .draw();
        }

        $scope.m.viewForm = {
            data: {},
            show: false,
            submitted: false,
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.viewForm)
        };
        $scope.m.editForm = {
            data: {},
            show: false,
            submitted: false,
            ui: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                SiHttpUtil.UpdateDataEntry({
                    tableName: "transfection",
                    id: $scope.m.editForm.id,
                    transfectionDate: $scope.m.editForm.data.transfectionDate.dt,
                    harvestDate: $scope.m.editForm.data.harvestDate.dt,
                    octetTiter: $scope.m.editForm.octetTiter,
                    transfectionNotes: $scope.m.editForm.transfectionNotes,
                    approved: ($scope.m.editForm.approved) ? $scope.m.editForm.approved : "No",
                    updatedAt: $scope.m.editForm.updatedAt
                }).then((resp) => {
                    if ($scope.m.editForm.data.harvestDate.dt != null && $scope.m.editForm.approved == "Yes" && $scope.m.editForm.requestStatus == "In Progress") {
                        SiHttpUtil.UpdateDataEntry(
                            {
                                id: $scope.m.editForm.trqId,
                                tableName: "transfectionRequest",
                                requestStatus: "In Purification",
                                updatedAt: $scope.m.TRDisplayData.ListHash[$scope.m.editForm.trqId].updatedAt
                            }
                        ).then(function (response) {
                            if (resp.status == 200) {
                                SiHttpUtil.CreateTableEntry(
                                    {
                                        transfectionId: $scope.m.editForm.id,
                                        ColumnPurificationData: [],
                                        SECData: [],
                                        tableName: "proteinPurification",
                                    }
                                ).then(function (response) {
                                    $scope.m.editForm.CancelTab();
                                    $scope.m.loadAll();
                                    $scope.m.resetSelection();
                                    $scope.m.RefreshData();
                                }, function (error) {
                                    console.error("updateEntry error:", error);
                                });
                            }
                        }, function (error) {
                            console.error("updateEntry error:", error);
                        });
                    } else {
                        $scope.m.editForm.CancelTab();
                        $scope.m.loadAll();
                        $scope.m.resetSelection();
                        $scope.m.RefreshData();
                    }
                });
            },
            DeleteTransfection: () => {
                if ($scope.m.currentRowData) {
                    if ($scope.m.editForm.createdBy != SiHttpUtil.GetUserId()) {
                        SiHttpUtil.NotifyOperationErr("Cannot delete someone else's transfection");
                        return;
                    }
                    if (!$scope.m.editForm.transfectionNotes || $scope.m.editForm.transfectionNotes == "") {
                        SiHttpUtil.NotifyOperationErr("Please add removal reason in the notes section");
                        return;
                    }
                    SiHttpUtil.DeleteDataEntry("transfection", $scope.m.editForm.id).then(function (resp){
                        SiHttpUtil.DeleteDataEntry("transfectionRequest", $scope.m.editForm.trqId).then(function (resp){
                            $scope.m.activeTab = "ViewAllTab";
                            $scope.m.editForm.show = false;
                            $scope.m.RefreshData();
                        }, function (err) {
                            console.log("delete tr error:", err);
                        });
                    }, function (err) {
                        console.log("delete transfection error:", err);
                    });
                }
            },
            UpdateTrStatus: function (status) {
                SiHttpUtil.UpdateDataEntry(
                    {
                        id: $scope.m.editForm.trqId,
                        tableName: "transfectionRequest",
                        requestStatus: status,
                        updatedAt: $scope.m.TRDisplayData.ListHash[$scope.m.editForm.trqId].updatedAt
                    }
                ).then(function (response) {
                    $scope.m.loadAll();
                    $scope.m.editForm.requestStatus = status;
                }, function (error) {
                    console.error("updateEntry error:", error);
                });
            },
        };
        $scope.m.CreateForm = {
            data: {
                pendingRequests: {},
            },
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.trListToAdd = [];
                $scope.m.dp.initDp('CreateForm', 'transfectionDate', true);
                $scope.m.dp.initDp('CreateForm', 'harvestDate', false);
                $scope.m.CreateForm.data.pendingRequests = {};
                $scope.m.activeTab = "ViewAllTab";
            },
            initTab: function () {
                for (var tr in $scope.m.TRDisplayData.Hash) {
                    if ($scope.m.TRDisplayData.ListHash[tr].requestStatus == 'Approved') {
                        $scope.m.CreateForm.data.pendingRequests[tr] = $scope.m.TRDisplayData.Hash[tr] + ' - ' + $scope.m.TRDisplayData.ListHash[tr].protein;
                    }
                }
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                function TransfectionEntry() {
                    return {
                        //tableName: "transfection",
                        //trqId: $scope.m.CreateForm.data.trqId,
                        transfectionDate: $scope.m.CreateForm.data.transfectionDate.dt,
                        harvestDate: $scope.m.CreateForm.data.harvestDate.dt,
                        transfectionNotes: $scope.m.CreateForm.data.transfectionNotes,
                    }
                };
                var newEntries = [];
                for (var i = 0; i < $scope.m.trListToAdd.length; i++) {
                    var temp = TransfectionEntry();
                    temp.trqId = $scope.m.trListToAdd[i];
                    newEntries.push(temp);
                }
                var toCreate = {
                    tableName: "transfection",
                    list: newEntries
                }

                SiHttpUtil.CreateTableEntries(toCreate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.CreateForm.ResetTab();
                            $scope.m.RefreshData();
                            $scope.m.loadAll();
                        }
                    });
            }
        };

        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.dp = SiUtil.dp.bind($scope.m)();
        $scope.m.dp.initDp('CreateForm', 'transfectionDate', true);
        $scope.m.dp.initDp('CreateForm', 'harvestDate', false);
        $scope.m.dp.initDp('editForm', 'harvestDate', true);

        $scope.m.DtInstCallback = function (inst) {
            console.log("dt:", inst);
            $scope.m.DtInst = inst;
        };

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                // NOTE(ww): DtInst could undefined when creating first data entry.
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.LoadTransfectionList());
                } else {
                    $scope.m.LoadTransfectionList().then(function () {
                        $scope.m.dataReady = true;
                        $scope.$digest();
                    });
                }
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.dtColumns = [];

        $scope.m.LoadTransfectionList = function () {
            return SiHttpUtil.FetchTableEntries('transfection').then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp.records;

                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {

                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('transfection', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('transfection', colName),
                                (colName) => SiHttpUtil.hideColumnForTable('transfection', colName),
                                SiHttpUtil.tableOrder('transfection')
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'trqId'))
                                .renderWith(
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.TRDisplayData.Hash)
                                )
                                .withOption('type', 'natural'),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                .renderWith(
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'transfectionNotes'))
                                .renderWith(
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'TransfectionRequest.requestStatus'))
                                .renderWith(SiUtil.ColDisplayers.FixJoinDisplay('TransfectionRequest.requestStatus', SiUtil.getFormattedStatus)),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'TransfectionRequest.Protein.name'))
                                .renderWith(SiUtil.ColDisplayers.FixJoinDisplay('TransfectionRequest.Protein.name')),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'TransfectionRequest.Protein.ENUM_moleculeType'))
                                .renderWith(SiUtil.ColDisplayers.FixJoinDisplay('TransfectionRequest.Protein.ENUM_moleculeType')),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'transfectionDate'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'harvestDate'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                )
                        ];
                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                                if ($scope.op == "view" && $scope.id) {
                                    var records = $scope.m.tableData;
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.id) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.m.viewDetail();
                                }
                                if ($scope.op == "create") {
                                    var records = $scope.m.tableData;
                                    if ($scope.id) $scope.m.addTR($scope.id);
                                    $scope.m.activeTab = "CreateTab";
                                }
                            });
                    }
                });
            });
        };

        // Copy model to views.
        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.viewForm.name = $scope.m.currentRowData.name;
                $scope.m.viewForm.description = $scope.m.currentRowData.approved;
                $scope.m.viewForm.trqId = $scope.m.currentRowData.trqId;
                $scope.m.viewForm.proteinId = $scope.m.currentRowData['TransfectionRequest.Protein.id'];
                $scope.m.viewForm.protein = $scope.m.currentRowData['TransfectionRequest.Protein.name'];
                $scope.m.viewForm.proteinMoleculeType = $scope.m.currentRowData['TransfectionRequest.Protein.ENUM_moleculeType'];
                $scope.m.viewForm.requestStatus = $scope.m.currentRowData['TransfectionRequest.requestStatus'];
                $scope.m.viewForm.createdBy = $scope.UserHash[$scope.m.currentRowData.createdBy];
                $scope.m.viewForm.updatedBy = $scope.UserHash[$scope.m.currentRowData.updatedBy];
                $scope.m.viewForm.createdAt = SiUtil.getDateOnly($scope.m.currentRowData.createdAt);
                $scope.m.viewForm.transfectionDate = SiUtil.getDateOnly($scope.m.currentRowData.transfectionDate);
                $scope.m.viewForm.updatedAt = SiUtil.getDateOnly($scope.m.currentRowData.updatedAt);
                $scope.m.viewForm.harvestDate = SiUtil.getDateOnly($scope.m.currentRowData.harvestDate);
                $scope.m.viewForm.transfectionNotes = $scope.m.currentRowData.transfectionNotes;
                $scope.m.viewForm.octetTiter = $scope.m.currentRowData.octetTiter;
                $scope.m.viewForm.approved = $scope.m.currentRowData.approved;
                $scope.m.viewForm.show = true;
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.activeTab = "EditTab";
                $scope.m.editForm.id = $scope.m.currentRowData.id;
                $scope.m.editForm.name = $scope.m.currentRowData.name;
                $scope.m.editForm.trqId = $scope.m.currentRowData.trqId;
                $scope.m.editForm.requestStatus = $scope.m.currentRowData['TransfectionRequest.requestStatus'];
                $scope.m.editForm.data.transfectionDate = {
                    dt: $scope.m.currentRowData.transfectionDate ? new Date($scope.m.currentRowData.transfectionDate) : null
                };
                $scope.m.editForm.data.harvestDate.dt = $scope.m.currentRowData.harvestDate == null ? null : new Date($scope.m.currentRowData.harvestDate);
                $scope.m.editForm.octetTiter = $scope.m.currentRowData.octetTiter;
                $scope.m.editForm.approved = $scope.m.currentRowData.approved;
                $scope.m.editForm.transfectionNotes = $scope.m.currentRowData.transfectionNotes;
                $scope.m.editForm.createdBy = $scope.m.currentRowData.createdBy;
                $scope.m.editForm.updatedAt = $scope.m.currentRowData.updatedAt;
                $scope.m.editForm.show = true;

            }
        };

        $scope.m.loadAll = function () {
            var CacheTR = SiHttpUtil.FetchIdNameMapping('transfectionRequest').then(function (resp) {
                $scope.m.TRList = resp;
                $scope.m.TRDisplayData = SiHttpUtil.GetDependencyList($scope.m.TRList);
                $scope.m.TRListReady = true;
            });

            var deps = []; // Dependencies.
            deps.push(CacheTR);
            Promise.all(deps).then(values => {
                $scope.m.LoadTransfectionList();
            });
        };

        $scope.m.loadAll();

        $scope.m.newEntry = function () {
            if ($scope.m.currentRowData) {
                var transNum = $scope.m.currentRowData.id;
                $state.go("app.research.proteinPurification", { op: "create", id: transNum });
            }
        };
    }
})();

//Research
//ProteinPurificationController
(function () {
    'use strict';

    angular
        .module('app.research')
        .controller('ProteinPurificationController', ProteinPurificationController);

    ProteinPurificationController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$stateParams'];

    function ProteinPurificationController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $stateParams) {
        // Main model.
        $scope.m = {};
        $scope.tableState.currentResearchTable = "proteinPurification";
        $scope.m.tableName = "proteinPurification";
        $scope.m.activeTab = "ViewAllTab";
        $scope.m.tableData = null;
        $scope.op = $stateParams.op;
        $scope.id = $stateParams.id;
        $scope.getDateOnly = SiUtil.getDateOnly;

        $scope.m.TransfectionList = [];
        $scope.m.TransfectionListReady = false;
        $scope.m.TransfectionDisplayData = {};

        $scope.molecuTypes = [];
        $scope.m.plasmidListToAdd = [];

        $scope.updateTransfectionRequest = function (id, status) {
            SiHttpUtil.UpdateDataEntry(
                {
                    id: id,
                    tableName: "transfectionRequest",
                    requestStatus: status,
                    updatedAt: $scope.m.editForm.trUpdatedAt
                }
            ).then(function (response) {
                $scope.m.RefreshData();
                $scope.m.updateTRData(id);
            }, function (error) {
                console.error("updateEntry error:", error);
            });
        };
        $scope.m.updateTRData = function (id) {
            SiHttpUtil.FetchOneEntry('transfectionRequest', id).then(function (response) {
                $scope.m.editForm.requestStatus = response.data.requestStatus;
                $scope.m.editForm.trUpdatedAt = response.data.updatedAt;
            }, function (error) {
                console.error("updateEntry error:", error);
            });
        };

        $scope.m.summaryForm = {
            data: {},
            dataReady: false,
            initTab: () => {
                $scope.m.dp.initDp('summaryForm', 'startDate', true);
                $scope.m.dp.initDp('summaryForm', 'endDate', true);
                $scope.m.summaryForm.data.startDate.dt.setDate($scope.m.summaryForm.data.endDate.dt.getDate() - 7);
            },
            dtInstance: {},
            dtOptions: DTOptionsBuilder.newOptions()
                .withDisplayLength(25)
                .withButtons([
                    {
                        extend: 'colvis',
                        text: 'Columns'
                    },
                    {
                        extend: 'excelHtml5',
                        filename: 'export',
                        text: 'Export Excel'
                    },
                    {
                        extend: 'print',
                        title: "",
                        text: 'Print',
                        exportOptions: {
                            columns: ':visible'
                        }
                    }
                ]),
            getData: () => {
                var query = {
                    'summary': true,
                    'startDate': $scope.m.summaryForm.data.startDate.dt,
                    'endDate': $scope.m.summaryForm.data.endDate.dt
                };
                SiHttpUtil.SearchByColumn('proteinPurification', query).then(resp => {
                    $scope.m.summaryForm.results = resp;
                    if (resp.length > 0) $scope.m.summaryForm.dataReady = true;
                });
            }
        };

        $scope.m.viewForm = {
            data: {},
            show: false,
            submitted: false,
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.viewForm)
        };
        $scope.m.editForm = {
            data: {},
            show: false,
            submitted: false,
            ui: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            SubmitTab: () => {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                for (var i = 0; i < $scope.m.editForm.SECData.length; i++) {
                    var curr = $scope.m.editForm.SECData[i];
                    curr.date = curr.date.dt;
                }
                for (var i = 0; i < $scope.m.editForm.MALSData.length; i++) {
                    var curr = $scope.m.editForm.MALSData[i];
                    curr.date = curr.date.dt;
                }
                for (var i = 0; i < $scope.m.editForm.DLSData.length; i++) {
                    var curr = $scope.m.editForm.DLSData[i];
                    curr.date = curr.date.dt;
                }
                for (var i = 0; i < $scope.m.editForm.cIEFData.length; i++) {
                    var curr = $scope.m.editForm.cIEFData[i];
                    curr.date = curr.date.dt;
                }
                SiHttpUtil.UpdateDataEntry({
                    tableName: "proteinPurification",
                    id: $scope.m.editForm.id,
                    purificationDate: $scope.m.editForm.data.purificationDate.dt,
                    purifiedBy: $scope.m.editForm.purifiedBy,
                    finalConcentration: $scope.m.editForm.finalConcentration,
                    finalVolume: $scope.m.editForm.finalVolume,
                    volumeRemaining: $scope.m.editForm.volumeRemaining,
                    BEX: $scope.m.editForm.BEX || "N",
                    notes: $scope.m.editForm.notes,
                    ColumnPurificationData: $scope.m.editForm.ColumnPurificationData,
                    SECData: $scope.m.editForm.SECData,
                    MALSData: $scope.m.editForm.MALSData,
                    DLSData: $scope.m.editForm.DLSData,
                    cIEFData: $scope.m.editForm.cIEFData,
                    updatedAt: $scope.m.editForm.updatedAt,
                }).then((resp) => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.RefreshData();
                    $scope.m.resetSelection();
                });
            }
        };

        $scope.m.CreateForm = {
            data: {
                ColumnPurificationData: [],
                SECData: []
            },
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.activeTab = "ViewAllTab";
                $scope.m.CreateForm.data.ColumnPurificationData = [];
                $scope.m.CreateForm.data.SECData = [];
            },
            initTab: () => {
                $scope.m.initTransfections();
                $scope.m.CreateForm.data.purifiedBy = SiHttpUtil.GetUserId();
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                if (!$scope.m.CreateForm.data.ColumnPurificationData.length) {
                    SiHttpUtil.NotifyOperationErr("Must add at least one column entry");
                    return;
                }
                for (var i = 0; i < $scope.m.CreateForm.data.SECData.length; i++) {
                    var curr = $scope.m.CreateForm.data.SECData[i];
                    curr.date = curr.date.dt;
                }
                var ProteinPurificationEntry = {
                    tableName: "proteinPurification",
                    transfectionId: $scope.m.CreateForm.data.transfectionId,
                    purificationDate: $scope.m.CreateForm.data.purificationDate.dt,
                    purifiedBy: $scope.m.CreateForm.data.purifiedBy,
                    finalConcentration: $scope.m.CreateForm.data.finalConcentration,
                    finalVolume: $scope.m.CreateForm.data.finalVolume,
                    volumeRemaining: $scope.m.CreateForm.data.volumeRemaining,
                    BEX: $scope.m.CreateForm.data.BEX,
                    notes: $scope.m.CreateForm.data.notes,
                    ColumnPurificationData: $scope.m.CreateForm.data.ColumnPurificationData,
                    SECData: $scope.m.CreateForm.data.SECData
                };

                SiHttpUtil.CreateTableEntry(ProteinPurificationEntry)
                    .then(function (resp) {
                        //SiHttpUtil.NotifyOk("ProteinPurification " + resp.data.name + " is created successfully");
                        if (resp.status == 200) {
                            $scope.m.CreateForm.ResetTab();
                            $scope.m.RefreshData();
                        }
                    });
            },
        };

        $scope.m.dpOpen = function ($event, form, i) {
            $event.preventDefault();
            $event.stopPropagation();
            form.SECData[i].date.opened = !(form.SECData[i].date.opened);
        };

        $scope.m.initTransfections = () => {
            SiHttpUtil.FetchIdNameMapping('transfection').then(function (resp) {
                $scope.m.TransfectionList = resp;
                $scope.m.TransfectionDisplayData = SiHttpUtil.GetDependencyList($scope.m.TransfectionList);
                $scope.m.TransfectionListReady = true;
            });
        };

        $scope.m.addColumnData = form => {
            var entry = {};
            if (form.ColumnPurificationData.length == 0) {
                entry.notes = "First Step";
            }
            form.ColumnPurificationData.push(entry);
        };

        $scope.m.addData = (form, type) => {
            form[type].push({
                analyzedBy: SiHttpUtil.GetUserId(),
                date: {
                    dt: new Date(),
                    opened: false
                }
            });
        };

        $scope.m.removeData = (form, index, edit) => {
            if (edit) {
                form[index].isDeleted = true;
            } else {
                form.splice(index, 1);
            }
        };

        $scope.m.copyData = (form, element) => {
            var toCopy = form.ColumnPurificationData[0][element];
            for (var i =0; i < form.ColumnPurificationData.length; i++) {
                form.ColumnPurificationData[i][element] = toCopy;
            }
        };

        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.dp = SiUtil.dp.bind($scope.m)();

        $scope.m.DtInstCallback = function (inst) {
            console.log("dt:", inst);
            $scope.m.DtInst = inst;
            $scope.m.onStatusChange();
        };

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                // NOTE(ww): DtInst could undefined when creating first data entry.
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.LoadProteinPurificationList());
                } else {
                    $scope.m.LoadProteinPurificationList().then(function () {
                        $scope.m.dataReady = true;
                        $scope.$digest();
                    });
                }
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.statusFilter = {
            includePurification: true,
            includeComplete: true,
            includeFailed: false,
        }

        $scope.m.onStatusChange = function () {
            var table = $('#example').DataTable();
            var val = [];
            if ($scope.m.statusFilter.includePurification) {
                val.push('Purification');
            }
            if ($scope.m.statusFilter.includeComplete) {
                val.push('Completed');
            }
            if ($scope.m.statusFilter.includeFailed) {
                val.push('Failed');
            }
            table
                .columns(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'requestStatus'))
                .search(val.join('|'), true, false)
                .draw();
        }

        $scope.m.dtColumns = [];

        $scope.m.LoadProteinPurificationList = function () {
            return SiHttpUtil.FetchTableEntries('proteinPurification').then(function (resp) {
                // Support chaining to pass on to datatables..
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp.records;
                    if (resp.enums) {
                        var enumList = JSON.parse(resp.enums);
                        $scope.columnTypes = enumList.ENUM_proteinColumnType;
                        $scope.stepTypes = enumList.ENUM_proteinStepType;
                        $scope.SECTypes = enumList.ENUM_proteinSECTypes;
                    }
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {

                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('proteinPurification', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('proteinPurification', colName),
                                (colName) => SiHttpUtil.hideColumnForTable('proteinPurification', colName),
                                SiHttpUtil.tableOrder('proteinPurification')
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'purifiedBy'))
                                .renderWith(
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'notes'))
                                .renderWith(
                                SiUtil.ColDisplayers.DescriptionDisplayer
                            ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'Transfection.octetTiter'))
                                .renderWith(
                                SiUtil.ColDisplayers.FixJoinDisplay('Transfection.octetTiter')
                                ).notVisible(),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'Transfection.name'))
                                .renderWith(
                                SiUtil.ColDisplayers.FixJoinDisplay('Transfection.name')
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'Transfection.TransfectionRequest.Protein.molecularWeight'))
                                .renderWith(
                                SiUtil.ColDisplayers.FixJoinDisplay('Transfection.TransfectionRequest.Protein.molecularWeight')
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'Transfection.TransfectionRequest.requestStatus'))
                                .renderWith(
                                SiUtil.ColDisplayers.FixJoinDisplay('Transfection.TransfectionRequest.requestStatus', SiUtil.getFormattedStatus)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'Transfection.TransfectionRequest.Protein.name'))
                                .renderWith(
                                SiUtil.ColDisplayers.FixJoinDisplay('Transfection.TransfectionRequest.Protein.name')
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'Transfection.TransfectionRequest.Protein.ENUM_moleculeType'))
                                .renderWith(
                                SiUtil.ColDisplayers.FixJoinDisplay('Transfection.TransfectionRequest.Protein.ENUM_moleculeType')
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith(
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'purificationDate'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                )
                        ];

                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);

                                $scope.m.dataReady = true;
                                if ($scope.op == "view" && $scope.id) {
                                    var records = $scope.m.tableData;
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.id) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.m.viewDetail();
                                }
                                if ($scope.op == "create") {
                                    var records = $scope.m.tableData;
                                    if ($scope.id) $scope.m.CreateForm.data.transfectionId = $scope.id;
                                    $scope.m.activeTab = "CreateTab";
                                }
                            });
                    }
                });
            });
        };

        // Copy model to views.
        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                SiHttpUtil.FetchOneEntry('proteinPurification', $scope.m.currentRowData.id).then( resp => {
                    $scope.m.viewForm.SECData = resp.SECData || [];
                    $scope.m.viewForm.ColumnPurificationData = resp.ColumnPurificationData || [];
                    $scope.m.viewForm.DLSData = resp.DLSData || [];
                    $scope.m.viewForm.MALSData = resp.MALSData || [];
                    $scope.m.viewForm.cIEFData = resp.cIEFData || [];
                    $scope.m.viewForm.BindingData = resp.BindingData || [];
                    $scope.m.viewForm.Transfection = resp.Transfection;
                    $scope.m.viewForm.recoveries = [];
                    for (var i = 0; i < resp.ColumnPurificationData.length; i++) {
                        var currPurification = resp.ColumnPurificationData[i];
                        var mass1, mass2, recovery;
                        if (i == 0) {
                            mass1 = currPurification.loadMass;
                            mass2 = currPurification.elutionMass;
                            recovery = 100 * mass2/mass1;
                        } else {
                            mass1 = currPurification.elutionMass;
                            recovery = 100 * mass1/mass2;
                        }
                        $scope.m.viewForm.recoveries.push(recovery);
                    }
                    if (resp.ColumnPurificationData.length) {
                        $scope.m.viewForm.finalRecovery = 100 * $scope.m.viewForm.finalMass / resp.ColumnPurificationData[0].elutionMass;
                    } else {
                        $scope.m.viewForm.finalRecovery = null;
                    }
                });
                $scope.m.viewForm.name = $scope.m.currentRowData.name;
                $scope.m.viewForm.transfectionId = $scope.m.currentRowData.transfectionId;
                $scope.m.viewForm.createdBy = $scope.UserHash[$scope.m.currentRowData.createdBy];
                $scope.m.viewForm.updatedBy = $scope.UserHash[$scope.m.currentRowData.updatedBy];
                $scope.m.viewForm.createdAt = SiUtil.getDateOnly($scope.m.currentRowData.createdAt);
                $scope.m.viewForm.updatedAt = SiUtil.getDateOnly($scope.m.currentRowData.updatedAt);
                $scope.m.viewForm.purificationDate = $scope.m.currentRowData.purificationDate == null ? null : SiUtil.getDateOnly($scope.m.currentRowData.purificationDate);
                $scope.m.viewForm.purifiedBy = $scope.UserHash[$scope.m.currentRowData.purifiedBy];
                $scope.m.viewForm.finalConcentration = $scope.m.currentRowData.finalConcentration;
                $scope.m.viewForm.finalVolume = $scope.m.currentRowData.finalVolume;
                $scope.m.viewForm.volumeRemaining = $scope.m.currentRowData.volumeRemaining;
                $scope.m.viewForm.volumeRemainingPer = 100 * $scope.m.viewForm.volumeRemaining / $scope.m.viewForm.finalVolume;
                $scope.m.viewForm.finalMass = $scope.m.viewForm.finalVolume * $scope.m.viewForm.finalConcentration;

                $scope.m.viewForm.pI = $scope.m.currentRowData['Transfection.TransfectionRequest.Protein.pI'];
                // $scope.m.viewForm.proteinId = $scope.m.currentRowData['Transfection.TransfectionRequest.Protein.id'];
                // $scope.m.viewForm.protein = $scope.m.currentRowData['Transfection.TransfectionRequest.Protein.name'];
                $scope.m.viewForm.status = SiUtil.getFormattedStatus($scope.m.currentRowData['Transfection.TransfectionRequest.requestStatus']);
                $scope.m.viewForm.nanoDrop = $scope.m.currentRowData['Transfection.TransfectionRequest.Protein.nanoDrop'];
                $scope.m.viewForm.titer = $scope.m.currentRowData['Transfection.octetTiter'];
                $scope.m.viewForm.notes = $scope.m.currentRowData.notes;
                $scope.m.viewForm.BEX = $scope.m.currentRowData.BEX;
                $scope.m.viewForm.show = true;
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.activeTab = "EditTab";
                $scope.m.editForm.id = $scope.m.currentRowData.id;
                SiHttpUtil.FetchOneEntry('proteinPurification', $scope.m.currentRowData.id).then( resp => {
                    $scope.m.editForm.SECData = resp.SECData;
                    $scope.m.editForm.ColumnPurificationData = resp.ColumnPurificationData;
                    $scope.m.editForm.MALSData = resp.MALSData;
                    $scope.m.editForm.cIEFData = resp.cIEFData;
                    $scope.m.editForm.DLSData = resp.DLSData;
                    for (var i = 0; i < resp.DLSData.length; i++) {
                        $scope.m.editForm.DLSData[i].date = {
                            dt: $scope.m.editForm.DLSData[i].date ? new Date($scope.m.editForm.DLSData[i].date) : new Date()
                        }
                    }
                    for (var i = 0; i < resp.SECData.length; i++) {
                        $scope.m.editForm.SECData[i].date = {
                            dt: $scope.m.editForm.SECData[i].date ? new Date($scope.m.editForm.SECData[i].date) : new Date()
                        }
                    }
                    for (var i = 0; i < resp.MALSData.length; i++) {
                        $scope.m.editForm.MALSData[i].date = {
                            dt: $scope.m.editForm.MALSData[i].date ? new Date($scope.m.editForm.MALSData[i].date) : new Date()
                        }
                    }
                    for (var i = 0; i < resp.cIEFData.length; i++) {
                        $scope.m.editForm.cIEFData[i].date = {
                            dt: $scope.m.editForm.cIEFData[i].date ? new Date($scope.m.editForm.cIEFData[i].date) : new Date()
                        }
                    }
                });
                $scope.m.editForm.name = $scope.m.currentRowData.name;
                $scope.m.editForm.transfectionId = $scope.m.currentRowData.transfectionId;
                $scope.m.editForm.data.purificationDate.dt = $scope.m.currentRowData.purificationDate == null ? null : new Date($scope.m.currentRowData.purificationDate)
                $scope.m.editForm.purifiedBy = $scope.m.currentRowData.purifiedBy ? $scope.m.currentRowData.purifiedBy : SiHttpUtil.GetUserId();
                $scope.m.editForm.finalConcentration = $scope.m.currentRowData.finalConcentration;
                $scope.m.editForm.finalVolume = $scope.m.currentRowData.finalVolume;
                $scope.m.editForm.volumeRemaining = $scope.m.currentRowData.volumeRemaining;
                $scope.m.editForm.BEX = $scope.m.currentRowData.BEX;
                $scope.m.editForm.notes = $scope.m.currentRowData.notes;

                $scope.m.editForm.updatedAt = $scope.m.currentRowData.updatedAt;
                $scope.m.editForm.requestStatus = $scope.m.currentRowData['Transfection.TransfectionRequest.requestStatus'];
                $scope.m.editForm.transfection = $scope.m.currentRowData['Transfection.name'];
                $scope.m.editForm.transfectionRequest = $scope.m.currentRowData['Transfection.TransfectionRequest.name'];
                $scope.m.editForm.trId = $scope.m.currentRowData['Transfection.TransfectionRequest.id'];
                $scope.m.editForm.trUpdatedAt = $scope.m.currentRowData['Transfection.TransfectionRequest.updatedAt'];
                $scope.m.editForm.show = true;

            }
        };

        $scope.m.loadAll = function () {
            $scope.m.dp.initDp('CreateForm', 'purificationDate', true);
            $scope.m.dp.initDp('editForm', 'purificationDate', true);
            var deps = []; // Dependencies.
            Promise.all(deps).then(values => {
                $scope.m.LoadProteinPurificationList();
            });
        };

        $scope.m.loadAll();

    }
})();

//Research
//AnalyticalSecController
(function () {
    'use strict';

    angular
        .module('app.research')
        .controller('AnalyticalSecController', AnalyticalSecController);

    AnalyticalSecController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$stateParams'];

    function AnalyticalSecController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $stateParams) {
        // Main model.
        $scope.m = {};
        $scope.tableState.currentResearchTable = "analyticalSec";
        $scope.m.tableName = "analyticalSec";
        $scope.m.activeTab = "ViewAllTab";
        $scope.m.tableData = null
        $scope.sectionNames = [];
        $scope.op = $stateParams.op;
        $scope.id = $stateParams.id;

        $scope.m.viewForm = {
            data: {},
            show: false,
            submitted: false,
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.viewForm)
        };
        $scope.m.editForm = {
            data: {},
            show: false,
            submitted: false,
            ui: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                var RefLinkListJson = angular.toJson($scope.m.editForm.RefLinkList.data);
                SiHttpUtil.UpdateDataEntry({
                    tableName: "analyticalSec",
                    id: $scope.m.editForm.id,
                    firstStepPOI: $scope.m.editForm.firstStepPOI,
                    firstStepHMW: $scope.m.editForm.firstStepHMW,
                    firstStepLMW: $scope.m.editForm.firstStepLMW,
                    finalStepPOI: $scope.m.editForm.finalStepPOI,
                    finalStepHMW: $scope.m.editForm.finalStepHMW,
                    finalStepLMW: $scope.m.editForm.finalStepLMW,
                    ASECNote: $scope.m.editForm.ASECNote,
                    references: RefLinkListJson,
                    updatedAt: $scope.m.editForm.updatedAt
                }).then((resp) => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.RefreshData();
                    $scope.m.resetSelection();
                });
            }
        };

        $scope.m.CreateForm = {
            data: {
                RefLinkList: {
                    data: [],
                    nameList: $scope.sectionNames
                }
            },
            ui: {},
            submitted: false,
            initTab: function () {
                $scope.m.CreateForm.data.RefLinkList.nameList = $scope.enums.ENUM_ASECSectionName;
            },
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.dp.initDp('CreateForm', 'ASECDate', true);
                $scope.m.activeTab = "ViewAllTab";
                $scope.m.CreateForm.data.RefLinkList = {
                    data: [],
                    nameList: $scope.sectionNames
                }
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                var TransfectionEntry = {
                    tableName: "analyticalSec",
                    proteinPurificationId: $scope.m.CreateForm.data.proteinPurificationId,
                    ASECDate: $scope.m.CreateForm.data.ASECDate.dt,
                    firstStepPOI: $scope.m.CreateForm.data.firstStepPOI,
                    firstStepHMW: $scope.m.CreateForm.data.firstStepHMW,
                    firstStepLMW: $scope.m.CreateForm.data.firstStepLMW,
                    finalStepPOI: $scope.m.CreateForm.data.finalStepPOI,
                    finalStepHMW: $scope.m.CreateForm.data.finalStepHMW,
                    finalStepLMW: $scope.m.CreateForm.data.finalStepLMW,
                    ASECNote: $scope.m.CreateForm.data.ASECNote
                };
                if ($scope.m.CreateForm.data.RefLinkList.data.length > 0) {
                    var RefLinkListJson = angular.toJson($scope.m.CreateForm.data.RefLinkList.data);
                    TransfectionEntry['references'] = RefLinkListJson;
                }

                SiHttpUtil.CreateTableEntry(TransfectionEntry)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.CreateForm.ResetTab();
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        $scope.m.BulkCreateForm = {
            data: {
                aSECsToAdd: [],
                purificationList: []
            },
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.BulkCreateForm);
                $scope.m.activeTab = "ViewAllTab";
                $scope.m.BulkCreateForm.data = {};
                $scope.m.BulkCreateForm.data.aSECsToAdd = [];
                $scope.m.BulkCreateForm.data.purificationList = [];
                $scope.m.dp.initDp('BulkCreateForm', 'ASECDate', true);
            },
            SubmitTab: function () {
                $scope.m.BulkCreateForm.submitted = true;
                if (!$scope.m.BulkCreateForm.ui.validate.$valid) {
                    console.error($scope.m.BulkCreateForm.ui.validate);
                    return;
                }
                var ASECEntry = function () {
                    return {
                        ASECDate: $scope.m.BulkCreateForm.data.ASECDate.dt,
                    }
                }

                var newEntries = [];
                for (var i = 0; i < $scope.m.BulkCreateForm.data.aSECsToAdd.length; i++) {
                    var temp = ASECEntry();
                    temp.proteinPurificationId = $scope.m.BulkCreateForm.data.aSECsToAdd[i].proteinPurificationId;
                    temp.firstStepPOI = $scope.m.BulkCreateForm.data.aSECsToAdd[i].firstStepPOI;
                    temp.firstStepHMW = $scope.m.BulkCreateForm.data.aSECsToAdd[i].firstStepHMW;
                    temp.firstStepLMW = $scope.m.BulkCreateForm.data.aSECsToAdd[i].firstStepLMW;
                    temp.finalStepPOI = $scope.m.BulkCreateForm.data.aSECsToAdd[i].finalStepPOI;
                    temp.finalStepHMW = $scope.m.BulkCreateForm.data.aSECsToAdd[i].finalStepHMW;
                    temp.finalStepLMW = $scope.m.BulkCreateForm.data.aSECsToAdd[i].finalStepLMW;
                    temp.ASECNote = $scope.m.BulkCreateForm.data.aSECsToAdd[i].notes;
                    newEntries.push(temp);
                }
                var toCreate = {
                    tableName: "analyticalSec",
                    list: newEntries
                }

                SiHttpUtil.CreateTableEntries(toCreate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.BulkCreateForm.ResetTab();
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        $scope.addASEC = function (proteinPurificationId) {
            if ($scope.m.BulkCreateForm.data.purificationList.indexOf(proteinPurificationId) > -1) {
                SiHttpUtil.NotifyOperationErr("Purification already added. Cannot be added again.")
            } else {
                var tempEntry = {
                    proteinPurificationId: proteinPurificationId,
                }
                $scope.m.BulkCreateForm.data.aSECsToAdd.push(tempEntry);
                $scope.m.BulkCreateForm.data.purificationList.push(proteinPurificationId);
            }
        };

        $scope.removeASEC = function (index) {
            $scope.m.BulkCreateForm.data.aSECsToAdd.splice(index, 1);
            $scope.m.BulkCreateForm.data.purificationList.splice(index, 1);
        }

        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateBulkCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.BulkCreateForm.ui.validate,
                $scope.m.BulkCreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.dp = SiUtil.dp.bind($scope.m)();
        $scope.m.dp.initDp('CreateForm', 'ASECDate', true);
        $scope.m.dp.initDp('BulkCreateForm', 'ASECDate', true);

        $scope.m.DtInstCallback = function (inst) {
            console.log("dt:", inst);
            $scope.m.DtInst = inst;
        };

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                // NOTE(ww): DtInst could undefined when creating first data entry.
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.LoadDataList());
                } else {
                    $scope.m.LoadDataList().then(function () {
                        $scope.m.dataReady = true;
                        $scope.$digest();
                    });
                }
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.dtColumns = [];

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.FetchTableEntries('analyticalSec').then(function (resp) {
                // Support chaining to pass on to datatables..
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp.records;
                    $scope.enums = JSON.parse(resp.enums);
                    $scope.sectionNames = $scope.enums.ENUM_analysisSectionName;
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {

                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('analyticalSec', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('analyticalSec', colName),
                                (colName) => SiHttpUtil.hideColumnForTable('analyticalSec', colName),
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'proteinPurificationId'))
                                .renderWith(
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.DependencyDisplayData.Hash)
                                )
                                .withOption('type', 'natural'),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith(
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'ASECDate'))
                                .renderWith(
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'ASECNote'))
                                .renderWith(
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                        ];

                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                                if ($scope.op == "view" && $scope.id) {
                                    var records = $scope.m.tableData;
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.id) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.m.viewDetail();
                                }
                                if ($scope.op == "create") {
                                    $scope.m.activeTab = "CreateTab";
                                }
                            });
                    }
                });
            });
        };

        $scope.m.loadTableData = function () {
            $scope.m.LoadDataList();
        };

        // Copy model to views.
        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.viewForm.name = $scope.m.currentRowData.name;
                $scope.m.viewForm.proteinPurificationId = $scope.m.currentRowData.proteinPurificationId;

                $scope.m.viewForm.createdBy = $scope.UserHash[$scope.m.currentRowData.createdBy];
                $scope.m.viewForm.updatedBy = $scope.UserHash[$scope.m.currentRowData.updatedBy];
                $scope.m.viewForm.createdAt = SiUtil.getDateOnly($scope.m.currentRowData.createdAt);
                $scope.m.viewForm.updatedAt = SiUtil.getDateOnly($scope.m.currentRowData.updatedAt);

                $scope.m.viewForm.ASECDate = SiUtil.getDateOnly($scope.m.currentRowData.ASECDate);
                $scope.m.viewForm.firstStepPOI = $scope.m.currentRowData.firstStepPOI;
                $scope.m.viewForm.firstStepHMW = $scope.m.currentRowData.firstStepHMW;
                $scope.m.viewForm.firstStepLMW = $scope.m.currentRowData.firstStepLMW;
                $scope.m.viewForm.finalStepPOI = $scope.m.currentRowData.finalStepPOI;
                $scope.m.viewForm.finalStepHMW = $scope.m.currentRowData.finalStepHMW;
                $scope.m.viewForm.finalStepLMW = $scope.m.currentRowData.finalStepLMW;
                $scope.m.viewForm.ASECNote = $scope.m.currentRowData.ASECNote;

                $scope.selectedSectionList = $scope.enums.ENUM_ASECSectionName;
                $scope.m.viewForm.referenceArray = JSON.parse($scope.m.currentRowData.references);

                $scope.m.viewForm.show = true;
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editForm.RefLinkList = {};
        $scope.m.editForm.RefLinkList.data = [];
        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.activeTab = "EditTab";
                $scope.m.editForm.id = $scope.m.currentRowData.id;
                $scope.m.editForm.name = $scope.m.currentRowData.name;
                $scope.m.editForm.proteinPurificationId = $scope.m.DependencyDisplayData.Hash[$scope.m.currentRowData.proteinPurificationId];

                $scope.m.editForm.ASECDate = SiUtil.getDateOnly($scope.m.currentRowData.ASECDate);
                $scope.m.editForm.firstStepPOI = $scope.m.currentRowData.firstStepPOI;
                $scope.m.editForm.firstStepHMW = $scope.m.currentRowData.firstStepHMW;
                $scope.m.editForm.firstStepLMW = $scope.m.currentRowData.firstStepLMW;
                $scope.m.editForm.finalStepPOI = $scope.m.currentRowData.finalStepPOI;
                $scope.m.editForm.finalStepHMW = $scope.m.currentRowData.finalStepHMW;
                $scope.m.editForm.finalStepLMW = $scope.m.currentRowData.finalStepLMW;
                $scope.m.editForm.ASECNote = $scope.m.currentRowData.ASECNote;
                $scope.m.editForm.updatedAt = $scope.m.currentRowData.updatedAt;

                $scope.m.editForm.RefLinkList = {
                    data: JSON.parse($scope.m.currentRowData.references) || [],
                    nameList: $scope.enums.ENUM_ASECSectionName
                };

                $scope.m.editForm.show = true;
            }
        };

        $scope.m.DependencyList = [];
        $scope.m.DependencyListReady = false;
        $scope.m.DependencyDisplayData = {};

        var CacheDependency = SiHttpUtil.FetchIdNameMapping('proteinPurification').then(function (resp) {
            $scope.m.DependencyList = resp;
            $scope.m.DependencyDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.DependencyList);

            $scope.m.DependencyListReady = true;
        });

        var deps = []; // Dependencies.
        deps.push(CacheDependency);
        Promise.all(deps).then(values => {
            $scope.m.LoadDataList();
        });
    }
})();

//Research
//StableCellLineController
(function () {
    'use strict';

    angular
        .module('app.research')
        .controller('StableCellLineController', StableCellLineController);

    StableCellLineController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$stateParams'];

    function StableCellLineController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $stateParams) {
        // Main model.
        $scope.m = {};
        $scope.tableState.currentResearchTable = "stableCellLine";
        $scope.m.tableName = "stableCellLine";
        $scope.m.activeTab = "ViewAllTab";
        $scope.m.tableData = null;
        $scope.op = $stateParams.op;
        $scope.id = $stateParams.id;

        $scope.m.viewForm = {
            data: {},
            show: false,
            submitted: false,
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.viewForm)
        };
        $scope.m.editForm = {
            data: {},
            show: false,
            submitted: false,
            ui: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                var RefLinkListJson = angular.toJson($scope.m.editForm.RefLinkList.data);
                SiHttpUtil.UpdateDataEntry({
                    tableName: "stableCellLine",
                    id: $scope.m.editForm.id,
                    ENUM_parentalCellLine: $scope.m.editForm.ENUM_parentalCellLine,
                    ENUM_transfectionMethod: $scope.m.editForm.ENUM_transfectionMethod,
                    ENUM_selectionMarker: $scope.m.editForm.ENUM_selectionMarker,
                    transfectionDate: $scope.m.editForm.data.transfectionDate.dt,
                    proteinId: $scope.m.editForm.proteinId,
                    plasmidId: $scope.m.editForm.plasmidId,
                    proteinAlias: $scope.m.editForm.proteinAlias,
                    programId: $scope.m.editForm.programId,
                    updatedAt: $scope.m.editForm.updatedAt,
                    references: RefLinkListJson
                }).then(resp => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.RefreshData();
                    $scope.m.resetSelection();
                });
            },
            Delete: () => {
                SiHttpUtil.DeleteDataEntry('stableCellLine', $scope.m.editForm.id).then(resp => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.RefreshData();
                    $scope.m.resetSelection();
                });
            }
        };
        // $scope.m.CreateTransfection = () => SiHttpUtil.CreateTableEntry()
        $scope.m.CreateForm = {
            data: {},
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.activeTab = "ViewAllTab";
            },
            initTab: function () {
                SiHttpUtil.FetchIdNameMapping('plasmids').then(function (resp) {
                    $scope.m.PlasmidList = resp;
                    $scope.m.PlasmidDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.PlasmidList);
                    $scope.m.PlasmidListReady = true;
                });
                SiHttpUtil.FetchIdNameMapping('protein').then(function (resp) {
                    $scope.m.ProteinList = resp;
                    $scope.m.ProteinDisplayData = SiHttpUtil.GetDependencyList($scope.m.ProteinList);
                    $scope.m.ProteinListReady = true;
                });
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                var NewEntry = {
                    tableName: "stableCellLine",
                    transfectionDate: $scope.m.CreateForm.data.transfectionDate.dt,
                    ENUM_parentalCellLine: $scope.m.CreateForm.data.ENUM_parentalCellLine,
                    plasmidId: $scope.m.CreateForm.data.plasmidId,
                    ENUM_transfectionMethod: $scope.m.CreateForm.data.ENUM_transfectionMethod,
                    ENUM_selectionMarker: $scope.m.CreateForm.data.ENUM_selectionMarker,
                    proteinAlias: $scope.m.CreateForm.data.proteinAlias,
                    proteinId: $scope.m.CreateForm.data.proteinId,
                    programId: $scope.m.CreateForm.data.programId
                };

                SiHttpUtil.CreateTableEntry(NewEntry)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.CreateForm.ResetTab();
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.dp = SiUtil.dp.bind($scope.m)();
        $scope.m.dp.initDp('CreateForm', 'transfectionDate', true);
        $scope.m.dp.initDp('editForm', 'transfectionDate', false);

        $scope.m.DtInstCallback = function (inst) {
            console.log("dt:", inst);
            $scope.m.DtInst = inst;
        };

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                // NOTE(ww): DtInst could undefined when creating first data entry.
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.LoadDataList());
                } else {
                    $scope.m.LoadDataList().then(function () {
                        $scope.m.dataReady = true;
                        $scope.$digest();
                    });
                }
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.dtColumns = [];

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.FetchTableEntries('stableCellLine').then(function (resp) {
                // Support chaining to pass on to datatables..
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp.records;
                    if (resp.enums) {
                        var enumList = JSON.parse(resp.enums);
                        $scope.enums = enumList;
                        $scope.parentalCellLines = enumList.ENUM_parentalCellLine;
                        $scope.transfectionMethods = enumList.ENUM_transfectionMethod;
                        $scope.selectionMarkers = enumList.ENUM_selectionMarker;
                    }
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {

                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('stableCellLine', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('stableCellLine', colName),
                                (colName) => SiHttpUtil.hideColumnForTable('stableCellLine', colName),
                                SiHttpUtil.tableOrder('stableCellLine')
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                .renderWith(
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith(SiUtil.ColDisplayers.ShortDateDisplayer),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'transfectionDate'))
                                .renderWith(SiUtil.ColDisplayers.ShortDateDisplayer),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'Plasmid.name'))
                                .withOption('type', 'natural')
                                .renderWith(SiUtil.ColDisplayers.FixJoinDisplay('Plasmid.name')),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'Plasmid.description'))
                                .notVisible()
                                .renderWith(SiUtil.ColDisplayers.FixJoinDisplay('Plasmid.description')),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'Protein.name'))
                                .renderWith(SiUtil.ColDisplayers.FixJoinDisplay('Protein.name')),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'Protein.description'))
                                .notVisible()
                                .renderWith(SiUtil.ColDisplayers.FixJoinDisplay('Protein.description')),
                        ];

                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                                if ($scope.op == "view" && $scope.id) {
                                    var records = $scope.m.tableData;
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.id) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.m.viewDetail();
                                }
                            });
                    }
                });
            });
        };

        $scope.m.loadTableData = function () {
            $scope.m.LoadDataList();
        };

        // Copy model to views.
        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.viewForm.name = $scope.m.currentRowData.name;

                $scope.m.viewForm.createdBy = $scope.UserHash[$scope.m.currentRowData.createdBy];
                $scope.m.viewForm.updatedBy = $scope.UserHash[$scope.m.currentRowData.updatedBy];
                $scope.m.viewForm.createdAt = SiUtil.getDateOnly($scope.m.currentRowData.createdAt);
                $scope.m.viewForm.updatedAt = SiUtil.getDateOnly($scope.m.currentRowData.updatedAt);

                $scope.m.viewForm.transfectionDate = SiUtil.getDateOnly($scope.m.currentRowData.transfectionDate);
                $scope.m.viewForm.ENUM_parentalCellLine = $scope.m.currentRowData.ENUM_parentalCellLine;
                $scope.m.viewForm.plasmidId = $scope.m.currentRowData.plasmidId;
                $scope.m.viewForm.plasmid = $scope.m.currentRowData['Plasmid.name'];
                $scope.m.viewForm.protein = $scope.m.currentRowData['Protein.name'];
                $scope.m.viewForm.plasmidDescription = $scope.m.currentRowData['Plasmid.description'];
                $scope.m.viewForm.proteinDescription = $scope.m.currentRowData['Protein.description'];
                $scope.m.viewForm.proteinId = $scope.m.currentRowData.proteinId;
                $scope.m.viewForm.proteinAlias = $scope.m.currentRowData.proteinAlias;
                $scope.m.viewForm.ENUM_transfectionMethod = $scope.m.currentRowData.ENUM_transfectionMethod;
                $scope.m.viewForm.ENUM_selectionMarker = $scope.m.currentRowData.ENUM_selectionMarker;
                $scope.m.viewForm.programId = $scope.m.currentRowData.programId;

                $scope.selectedSectionList = $scope.enums.ENUM_stableCellSectionName;
                $scope.m.viewForm.referneceArray = JSON.parse($scope.m.currentRowData.references);
                for (var key in $scope.m.viewForm.referneceArray) {
                    if ($scope.m.viewForm.referneceArray[key].section == "Geneious Links") {
                        $scope.m.viewForm.referneceArray[key].url = "geneious:/\/urn=" + $scope.m.viewForm.referneceArray[key].url;
                    }
                }

                $scope.m.viewForm.show = true;
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.activeTab = "EditTab";
                $scope.m.editForm.id = $scope.m.currentRowData.id;
                $scope.m.editForm.name = $scope.m.currentRowData.name;

                $scope.m.editForm.data.transfectionDate.dt = ($scope.m.currentRowData.transfectionDate) ? new Date($scope.m.currentRowData.transfectionDate) : null;
                $scope.m.editForm.ENUM_parentalCellLine = $scope.m.currentRowData.ENUM_parentalCellLine;
                $scope.m.editForm.plasmidId = $scope.m.currentRowData.plasmidId;
                $scope.m.editForm.proteinId = $scope.m.currentRowData.proteinId;
                $scope.m.editForm.proteinAlias = $scope.m.currentRowData.proteinAlias;
                $scope.m.editForm.ENUM_transfectionMethod = $scope.m.currentRowData.ENUM_transfectionMethod;
                $scope.m.editForm.ENUM_selectionMarker = $scope.m.currentRowData.ENUM_selectionMarker;
                $scope.m.editForm.programId = $scope.m.currentRowData.programId;
                $scope.m.editForm.updatedAt = $scope.m.currentRowData.updatedAt;

                $scope.m.editForm.RefLinkList = {
                    data: JSON.parse($scope.m.currentRowData.references) || [],
                    nameList: $scope.enums.ENUM_stableCellSectionName
                }
                $scope.m.editForm.show = true;

            }
        };

        $scope.m.LoadDataList();
    }
})();

//Research
//ProteinAnalysisRequest Controller
(function () {
    'use strict';

    angular
        .module('app.research')
        .controller('ProteinAnalysisRequestController', ProteinAnalysisRequestController);

    ProteinAnalysisRequestController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$stateParams'];

    function ProteinAnalysisRequestController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $stateParams) {
        // Main model.
        $scope.m = {};
        $scope.tableState.currentResearchTable = "proteinAnalysisRequest";
        $scope.m.tableName = "proteinAnalysisRequest";
        $scope.m.activeTab = "ViewAllTab";
        $scope.m.methodListToAdd = [];
        $scope.m.methodListVolumes = [];
        $scope.m.bulkVolumes = [];
        $scope.m.tableData = null;
        $scope.m.calculateSubmissionVolume = SiHttpUtil.CalculateSubmissionVolume;
        $scope.m.GetMinConcentrationNeeded = SiHttpUtil.GetMinConcentrationNeeded;
        $scope.op = $stateParams.op;
        $scope.id = $stateParams.id;
        $scope.m.analysisRequestToAdd = [];

        $scope.addPurification = function (purificationId, method) {
            if ($scope.m.analysisRequestToAdd.indexOf(purificationId) > -1) {
                SiHttpUtil.NotifyOperationErr("Purification " + purificationId + " already added. Cannot be added again.")
            } else {
                $scope.m.BulkCreateForm.data.proteinConcentrations.push($scope.m.DependencyDisplayData.ListHash[purificationId].finalConcentration);
                $scope.m.analysisRequestToAdd.push(purificationId);
                var sampleConc = $scope.m.DependencyDisplayData.ListHash[purificationId].finalConcentration
                $scope.m.BulkCreateForm.data.concentrationOverride.push(null);
                if (SiHttpUtil.GetMinConcentrationNeeded(method) <= sampleConc) {
                    $scope.m.bulkVolumes.push(SiHttpUtil.CalculateSubmissionVolume(method, sampleConc))
                } else {
                    $scope.m.bulkVolumes.push(0)
                }
            }
        }
        $scope.removePurification = function (index) {
            $scope.m.analysisRequestToAdd.splice(index, 1);
            $scope.m.bulkVolumes.splice(index, 1);
            $scope.m.BulkCreateForm.data.concentrationOverride.splice(index, 1);
            $scope.m.BulkCreateForm.data.proteinConcentrations.splice(index, 1);
        }
        $scope.updateVolume = function (index) {
            var conc = $scope.m.BulkCreateForm.data.concentrationOverride[index];
            $scope.m.BulkCreateForm.data.proteinConcentrations[index] = conc;
            $scope.m.bulkVolumes[index] = SiHttpUtil.CalculateSubmissionVolume($scope.m.BulkCreateForm.data.method, conc);
        }

        $scope.updateBulkCalculations = function () {
            var method = $scope.m.BulkCreateForm.data.method;
            for (var i = 0; i < $scope.m.analysisRequestToAdd.length; i++) {
                if ($scope.m.GetMinConcentrationNeeded(method) <= $scope.m.BulkCreateForm.data.proteinConcentrations[i]) {
                    $scope.m.bulkVolumes[i] = SiHttpUtil.CalculateSubmissionVolume(method, $scope.m.BulkCreateForm.data.proteinConcentrations[i])
                } else {
                    $scope.m.bulkVolumes[i] = 0;
                }
            }
        }

        $scope.addMethod = function (list, volumes, sampleConc, method) {
            if (list.indexOf(method) > -1) {
                SiHttpUtil.NotifyOperationErr("Method " + method + " Already added. Cannot be added again.")
            } else {
                list.push(method);
                if (SiHttpUtil.GetMinConcentrationNeeded(method) <= sampleConc) {
                    volumes.push(SiHttpUtil.CalculateSubmissionVolume(method, sampleConc))
                } else {
                    volumes.push(0)
                }
            }
        };
        $scope.removeMethod = function (list, volumes, index) {
            list.splice(index, 1);
            volumes.splice(index, 1);
        };

        $scope.m.statusFilter = {
            includeComplete: false,
            includeSubmitted: false
        }
        $scope.m.onStatusChange = function () {
            var table = $('#example').DataTable();
            var val = [];
            if ($scope.m.statusFilter.includeSubmitted) {
                val.push('Submitted');
            }
            if ($scope.m.statusFilter.includeComplete) {
                val.push('Completed');
            }
            table
                .columns(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'status'))
                .search(val.join('|'), true, false)
                .draw();
        }
        $scope.m.updateCalculations = function () {
            $scope.m.CreateForm.data.purifiedProtein = $scope.m.DependencyDisplayData.ListHash[$scope.m.CreateForm.data.proteinPurificationId].finalConcentration;
            $scope.m.CreateForm.data.proteinConcentration = $scope.m.CreateForm.data.purifiedProtein || $scope.m.CreateForm.data.concentrationOverride;
            $scope.m.CreateForm.data.reactionVolume = 50 / $scope.m.CreateForm.data.proteinConcentration;
            for (var i = 0; i < $scope.m.methodListToAdd.length; i++) {
                if ($scope.m.GetMinConcentrationNeeded($scope.m.methodListToAdd[i]) <= $scope.m.CreateForm.data.proteinConcentration) {
                    $scope.m.methodListVolumes[i] = SiHttpUtil.CalculateSubmissionVolume($scope.m.methodListToAdd[i], $scope.m.CreateForm.data.proteinConcentration)
                } else {
                    $scope.m.methodListVolumes[i] = 0;
                }
            }
            if ($scope.m.methodListToAdd.length > 0) {
                $scope.m.updateTotal();
            }
        }
        $scope.m.updateTotal = function () {
            $scope.m.CreateForm.data.totalSubmissionVolume = $scope.m.methodListVolumes.reduce(function (a, b) { return a + b });
        }

        $scope.m.viewForm = {
            data: {},
            show: false,
            submitted: false,
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.viewForm)
        };
        $scope.m.editForm = {
            data: {},
            show: false,
            submitted: false,
            ui: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                if ($scope.m.editForm.methodList.length < 1) {
                    SiHttpUtil.NotifyOperationErr("At least one method needs to be added.")
                } else {
                    SiHttpUtil.UpdateDataEntry({
                        tableName: "proteinAnalysisRequest",
                        id: $scope.m.editForm.id,
                        concentrationOverride: $scope.m.editForm.concentrationOverride,
                        methods: $scope.m.editForm.methodList.join(', '),
                        notes: $scope.m.editForm.notes,
                        updatedAt: $scope.m.editForm.updatedAt
                    }).then((resp) => {
                        //SiHttpUtil.NotifyOk("Transfection " + $scope.m.editForm.id + " is updated successfully");
                        $scope.m.editForm.CancelTab();
                        $scope.m.RefreshData();
                        $scope.m.resetSelection();
                    });
                }
            },
            deleteRequest: function() {
                SiHttpUtil.DeleteDataEntry("proteinAnalysisRequest", $scope.m.editForm.id).then(resp => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.RefreshData();
                    $scope.m.resetSelection();
                })
            }
        };

        $scope.m.CreateForm = {
            data: {},
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.activeTab = "ViewAllTab";
                $scope.m.methodListToAdd = [];
                $scope.m.methodListVolumes = [];
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                if ($scope.m.methodListToAdd.length < 1) {
                    SiHttpUtil.NotifyOperationErr("At least one method needs to be added.")
                } else {
                    var NewEntry = {
                        tableName: "proteinAnalysisRequest",
                        proteinPurificationId: $scope.m.CreateForm.data.proteinPurificationId,
                        concentrationOverride: $scope.m.CreateForm.data.concentrationOverride,
                        methods: $scope.m.methodListToAdd.join(', '),
                        notes: $scope.m.CreateForm.data.notes
                    };
                    SiHttpUtil.CreateTableEntry(NewEntry).then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.CreateForm.ResetTab();
                            $scope.m.RefreshData();
                        }
                    });
                }
            }
        };

        $scope.m.BulkCreateForm = {
            data: {
                concentrationOverride: [],
                proteinConcentrations: []
            },
            ui: {},
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.BulkCreateForm);
                $scope.m.activeTab = "ViewAllTab";
                $scope.m.bulkVolumes = [];
                $scope.m.analysisRequestToAdd = [];
                $scope.m.BulkCreateForm.concentrationOverride = [];
                $scope.m.BulkCreateForm.proteinConcentrations = [];
            },
            SubmitTab: function () {
                $scope.m.BulkCreateForm.submitted = true;
                if (!$scope.m.BulkCreateForm.ui.validate.$valid) {
                    console.error($scope.m.BulkCreateForm.ui.validate);
                    return;
                }
                function AnalysisRequestEntry() {
                    return {
                        //proteinPurificationId: $scope.m.CreateForm.data.proteinPurificationId,
                        //concentrationOverride: $scope.m.CreateForm.data.concentrationOverride,
                        methods: $scope.m.BulkCreateForm.data.method,
                        notes: $scope.m.BulkCreateForm.data.notes
                    }
                };
                var newEntries = [];
                for (var i = 0; i < $scope.m.analysisRequestToAdd.length; i++) {
                    var temp = AnalysisRequestEntry();
                    temp.proteinPurificationId = $scope.m.analysisRequestToAdd[i];
                    temp.concentrationOverride = $scope.m.BulkCreateForm.data.concentrationOverride[i];
                    newEntries.push(temp);
                }
                var toCreate = {
                    tableName: "proteinAnalysisRequest",
                    list: newEntries
                }

                SiHttpUtil.CreateTableEntries(toCreate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.BulkCreateForm.ResetTab();
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        $scope.m.ExportForm = {
            data: {},
            show: false,
            submitted: false,
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.viewForm),
            SubmitTab: function () {
                $scope.m.ExportForm.submitted = true;
                if (!$scope.m.ExportForm.ui.validate.$valid) {
                    console.error($scope.m.ExportForm.ui.validate);
                    return;
                }
                var columns = {
                    requestorUserId: $scope.m.ExportForm.data.requestorId,
                    methods: $scope.m.ExportForm.data.method,
                    sampleSubmissionDate: $scope.m.ExportForm.data.date.dt,
                    status: "Submitted"
                }
                if (!columns.requestorUserId && !columns.methods && !columns.sampleSubmissionDate) {
                    SiHttpUtil.NotifyOperationErr("At least one filter needs to be provided");
                } else {
                    $scope.m.RefreshExportData(columns);
                }
            }
        };
        $scope.m.RefreshExportData = (columns) => {
            if ($scope.m.DtExportInstCallback) {
                if ($scope.m.BulkExportData) {
                    $scope.m.DtExportInst.changeData($scope.m.initExportData(columns));
                } else {
                    $scope.m.initExportData(columns);
                }
            }
        };

        $scope.m.dtColumnsExport = [];
        $scope.m.initExportData = function (query) {
            return SiHttpUtil.SearchByColumn('proteinAnalysisRequest', query).then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.BulkExportData = resp.records;
                    if ($scope.m.BulkExportData) {
                        for (var j = 0; j < $scope.m.BulkExportData.length; j++) {
                            $scope.m.BulkExportData[j]['proteinConcentration'] = null;
                            $scope.m.BulkExportData[j]['submissionVolume'] = null;
                            $scope.m.BulkExportData[j]['reactionVolume'] = null;
                            if ($scope.m.BulkExportData[j].proteinPurificationId != null) {
                                var currP = $scope.m.DependencyDisplayData.ListHash[$scope.m.BulkExportData[j].proteinPurificationId];
                                $scope.m.BulkExportData[j]['proteinConcentration'] = $scope.m.BulkExportData[j].concentrationOverride || currP.purifiedProtein;
                                if ($scope.m.BulkExportData[j]['methods'] == "HPLC SEC" || $scope.m.BulkExportData[j]['methods'] == "MALS") {
                                    $scope.m.BulkExportData[j]['reactionVolume'] = Math.round((50 / $scope.m.BulkExportData[j]['proteinConcentration']) * 100) / 100
                                } else
                                    $scope.m.BulkExportData[j]['reactionVolume'] = "N/A";
                                $scope.m.BulkExportData[j]['submissionVolume'] = Math.round(SiHttpUtil.CalculateSubmissionVolume($scope.m.BulkExportData[j]['methods'], $scope.m.BulkExportData[j]['proteinConcentration']) * 100) / 100;
                            }
                        }

                        if ($scope.m.dtColumnsExport.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumnsExport, $scope.m.BulkExportData,
                                (colName) => SiHttpUtil.omitColumnForTable('proteinAnalysisRequestExport', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('proteinAnalysisRequest', colName));
                        }

                        $scope.m.dtColDefsExport = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumnsExport, 'name'))
                                .withOption('type', 'natural'),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumnsExport, 'proteinPurificationId'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.DependencyDisplayData.Hash)
                                )
                                .withOption('type', 'natural'),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumnsExport, 'requestorUserId'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumnsExport, 'sampleSubmissionDate'))
                                .renderWith(
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumnsExport, 'notes'))
                                .notVisible(),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumnsExport, 'methods'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                        ];
                        if ($scope.m.ExportForm.data.method != "HPLC SEC" && $scope.m.ExportForm.data.method != "MALS" && $scope.m.ExportForm.data.method) {
                            $scope.m.dtColDefsExport.push(
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumnsExport, 'reactionVolume'))
                                    .notVisible(),
                            )
                        }

                        $scope.m.dtOptionsExport = SiHttpUtil.initDtOptions($scope.m.dtColumnsExport, $scope.m.BulkExportData, $scope.m.bulkRowCallback,
                            function () {
                                resolve($scope.m.BulkExportData);
                                $scope.m.exportDataReady = true;
                            }).withColReorderOrder([0, 1, 3, 5, 6, 8, 7, 2, 4]);
                    }
                })
            })
        };
        $scope.m.DtExportInstCallback = function (inst) {
            console.log("dt:", inst);
            $scope.m.DtExportInst = inst;
        };

        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateBulkCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.BulkCreateForm.ui.validate,
                $scope.m.BulkCreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.dp = SiUtil.dp.bind($scope.m)();
        $scope.m.dp.initDp('ExportForm', 'date', false);

        $scope.m.DtInstCallback = function (inst) {
            console.log("dt:", inst);
            $scope.m.DtInst = inst;
        };

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                // NOTE(ww): DtInst could undefined when creating first data entry.
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.LoadDataList());
                } else {
                    $scope.m.LoadDataList().then(function () {
                        $scope.m.dataReady = true;
                        $scope.$digest();
                    });
                }
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.dtColumns = [];

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.FetchTableEntries('proteinAnalysisRequest').then(function (resp) {
                // Support chaining to pass on to datatables..
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp.records;
                    if (resp.enums) {
                        var enumList = JSON.parse(resp.enums);
                        $scope.methods = enumList.ENUM_method;
                    }
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {

                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('proteinAnalysisRequest', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('proteinAnalysisRequest', colName));
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'proteinPurificationId'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.DependencyDisplayData.Hash)
                                )
                                .withOption('type', 'natural'),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'concentrationOverride'))
                                .notVisible(),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'requestorUserId'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'sampleSubmissionDate'))
                                .renderWith(
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'notes'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'methods'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'status'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.StatusDisplayer
                                )
                        ];

                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                                if ($scope.op == "view" && $scope.id) {
                                    var records = $scope.m.tableData;
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.id) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.m.viewDetail();
                                }
                                if ($scope.op == "create") {
                                    var records = $scope.m.tableData;
                                    $scope.m.activeTab = "CreateTab";
                                }
                            });
                    }
                });
            });
        };

        $scope.m.loadTableData = function () {
            $scope.m.LoadDataList();
        };

        // Copy model to views.
        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.viewForm.name = $scope.m.currentRowData.name;
                $scope.m.viewForm.proteinPurificationId = $scope.m.currentRowData.proteinPurificationId;

                $scope.m.viewForm.createdBy = $scope.UserHash[$scope.m.currentRowData.createdBy];
                $scope.m.viewForm.updatedBy = $scope.UserHash[$scope.m.currentRowData.updatedBy];
                $scope.m.viewForm.createdAt = SiUtil.getDateOnly($scope.m.currentRowData.createdAt);
                $scope.m.viewForm.updatedAt = SiUtil.getDateOnly($scope.m.currentRowData.updatedAt);

                $scope.m.viewForm.id = $scope.m.currentRowData.id;
                $scope.m.viewForm.methodList = $scope.m.currentRowData.methods.split(",").map(str => str.trim());
                $scope.m.viewForm.notes = $scope.m.currentRowData.notes;

                $scope.m.viewForm.sampleSubmissionDate = SiUtil.getDateOnly($scope.m.currentRowData.sampleSubmissionDate);
                $scope.m.viewForm.status = $scope.m.currentRowData.status;
                $scope.m.viewForm.requestorUser = $scope.UserHash[$scope.m.currentRowData.requestorUserId];
                $scope.m.viewForm.concentrationOverride = $scope.m.currentRowData.concentrationOverride;
                $scope.m.viewForm.purifiedProtein = $scope.m.viewForm.concentrationOverride ||
                    $scope.m.DependencyDisplayData.ListHash[$scope.m.viewForm.proteinPurificationId].finalConcentration ||
                    0;
                $scope.m.viewForm.transfectionId = $scope.m.DependencyDisplayData.ListHash[$scope.m.viewForm.proteinPurificationId].transfectionId;
                $scope.m.viewForm.reactionVolume = 50 / $scope.m.viewForm.purifiedProtein;
                $scope.m.viewForm.methodListVolumes = [];
                for (var i = 0; i < $scope.m.viewForm.methodList.length; i++) {
                    if (SiHttpUtil.GetMinConcentrationNeeded($scope.m.viewForm.methodList[i]) <= $scope.m.viewForm.purifiedProtein) {
                        $scope.m.viewForm.methodListVolumes.push(SiHttpUtil.CalculateSubmissionVolume($scope.m.viewForm.methodList[i], $scope.m.viewForm.purifiedProtein));
                    } else {
                        $scope.m.viewForm.methodListVolumes.push(0);
                    }
                }
                $scope.m.viewForm.totalSubmissionVolume = $scope.m.viewForm.methodListVolumes.reduce(function (a, b) { return a + b });

                $scope.m.viewForm.currT = null;
                $scope.m.viewForm.nanoDrop = null;
                $scope.m.viewForm.currP = null;

                if ($scope.m.viewForm.transfectionId) {
                    SiHttpUtil.FetchOneEntry('transfection', $scope.m.viewForm.transfectionId).then((resp) => {
                        $scope.m.viewForm.currT = resp.data;
                        if ($scope.m.viewForm.currT.trqId) {
                            SiHttpUtil.FetchOneEntry("transfectionRequest", $scope.m.viewForm.currT.trqId).then((resp) => {
                                $scope.m.viewForm.nanoDrop = resp.data.molarExtCoefficient == null ? null : (resp.data.molarExtCoefficient / resp.data.molecularWeight) * 10;
                                if (resp.data.proteinId) {
                                    SiHttpUtil.FetchOneEntry("protein", resp.data.proteinId).then((resp) => {
                                        $scope.m.viewForm.currP = resp.data;
                                    })
                                }
                            })
                        }
                    });
                }
                SiHttpUtil.FetchOneEntry("proteinAnalysisMapping", $scope.m.viewForm.id).then((resp) => {
                    $scope.m.viewForm.analysisList = resp.data;
                });
                $scope.m.viewForm.show = true;
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.activeTab = "EditTab";
                $scope.m.editForm.name = $scope.m.currentRowData.name;
                $scope.m.editForm.proteinPurificationId = $scope.m.currentRowData.proteinPurificationId;
                $scope.m.editForm.id = $scope.m.currentRowData.id;

                $scope.m.editForm.concentrationOverride = $scope.m.currentRowData.concentrationOverride;
                $scope.m.editForm.concentrationOverrideOrg = $scope.m.currentRowData.concentrationOverride;
                $scope.m.editForm.methodList = $scope.m.currentRowData.methods.split(",").map(str => str.trim());
                $scope.m.editForm.notes = $scope.m.currentRowData.notes;
                $scope.m.editForm.updatedAt = $scope.m.currentRowData.updatedAt;

                $scope.m.editForm.sampleSubmissionDate = SiUtil.getDateOnly($scope.m.currentRowData.sampleSubmissionDate);
                $scope.m.editForm.status = $scope.m.currentRowData.status;
                $scope.m.editForm.requestorUserId = $scope.m.currentRowData.requestorUserId;

                $scope.m.editForm.show = true;
            }
        };

        $scope.m.DependencyList = [];
        $scope.m.DependencyListReady = false;
        $scope.m.DependencyDisplayData = {};

        var CacheDependency = SiHttpUtil.FetchTableEntries('proteinPurification').then(function (resp) {
            $scope.m.DependencyList = resp.records;
            $scope.m.DependencyDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.DependencyList);
            $scope.m.DependencyListReady = true;
        });

        var deps = []; // Dependencies.
        deps.push(CacheDependency);
        Promise.all(deps).then(values => {
            $scope.m.LoadDataList();
        });
    }
})();

//Research
//ProteinAnalysis Controller
(function () {
    'use strict';

    angular
        .module('app.research')
        .controller('ProteinAnalysisController', ProteinAnalysisController);

    ProteinAnalysisController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$stateParams', '$state', '$http', 'Global'];

    function ProteinAnalysisController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $stateParams, $state, $http, Global) {
        // Main model.
        $scope.global = Global;
        $scope.m = {};
        $scope.tableState.currentResearchTable = "proteinAnalysis";
        $scope.m.tableName = "proteinAnalysis";
        $scope.m.activeTab = "ViewAllTab";
        $scope.m.tableData = null;
        $scope.op = $stateParams.op;
        $scope.id = $stateParams.id;
        $scope.getDateOnly = SiUtil.getDateOnly;
        $scope.m.dataOnly = ['DLS','cIEF', 'MALS'];

        $scope.m.requestListToAdd = [];
        $scope.m.addAssociation = function (form, id) {
            if (form.proteinPurificationsToAdd.indexOf(id) > -1) {
                return;
            } else {
                form.proteinPurificationsToAdd.push(id);
            }
        };

        $scope.m.addPurification = function (form, id) {
            if (form.proteinPurifications.indexOf(id) > -1 || form.proteinPurificationsToAdd.indexOf(id) > -1) {
                SiHttpUtil.NotifyOperationErr("Purification already added");
            } else {
                form.proteinPurifications.push(id);
                $scope.m.addAssociation(form, id);
            }
        }

        $scope.m.addRequest = function (form, id) {
            if (form.proteinAnalysisRequests.indexOf(id) > -1) {
                SiHttpUtil.NotifyOperationErr("Request already added. Cannot be added again.");
            } else {
                form.proteinAnalysisRequests.push(id);
                var proteinPurificationId = $scope.m.ProteinAnalysisRequestDisplayData.ListHash[id].ProteinPurification.id;
                $scope.m.addAssociation(form, proteinPurificationId);
            }
        };

        $scope.m.removeAssociation = function (list, id) {
            list.splice(list.indexOf(id), 1);
            $scope.m.CreateForm.data.proteinPurificationsToAdd.splice($scope.m.CreateForm.data.proteinPurificationsToAdd.indexOf(id), 1);
        };
        $scope.m.addSECData = list => {
            if (list.length == 0) {
                for (var i = 0; i < $scope.m.CreateForm.data.proteinPurificationsToAdd.length; i++) {
                    list.push({
                        date: {
                            dt: new Date(),
                            opened: false
                        },
                        analyzedBy: SiHttpUtil.GetUserId(),
                        type: "Stability",
                        proteinPurificationId: $scope.m.CreateForm.data.proteinPurificationsToAdd[i]
                    })
                }
            } else {
                list.push({
                    date: {
                        dt: new Date(),
                        opened: false
                    },
                    analyzedBy: SiHttpUtil.GetUserId(),
                    type: "Stability"
                });
            }
        };

        $scope.m.removeData = (list, index) => {
            list.splice(index, 1);
        };

        $scope.m.initAnalysisRequests = () => {
            var query = { status: 'Submitted' };
            SiHttpUtil.SearchByColumn('proteinAnalysisRequest', query).then(function (resp) {
                $scope.m.ProteinAnalysisRequestList = resp;
                $scope.m.ProteinAnalysisRequestDisplayData = SiHttpUtil.GetDependencyList($scope.m.ProteinAnalysisRequestList);
                $scope.m.ProteinAnalysisRequestListReady = true;
            });
            SiHttpUtil.FetchIdNameMapping('proteinPurification').then(function (resp) {
                $scope.m.ProteinPurificationList = resp;
                $scope.m.ProteinPurificationDisplayData = SiHttpUtil.GetDependencyList($scope.m.ProteinPurificationList);
                $scope.m.ProteinPurificationListReady = true;
            });
            SiHttpUtil.FetchEnumList('proteinAnalysisRequests').then(function (resp) {
                $scope.m.analysisMethods = resp.ENUM_method;
                $scope.m.secTypes = resp.ENUM_secondarySECType;
            });
        };

        $scope.m.viewForm = {
            data: {},
            show: false,
            submitted: false,
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.viewForm)
        };
        $scope.m.editForm = {
            data: {},
            show: false,
            submitted: false,
            ui: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                SiHttpUtil.UpdateDataEntry({
                    tableName: "proteinAnalysis",
                    id: $scope.m.editForm.id,
                    notes: $scope.m.editForm.notes,
                    method: $scope.m.editForm.method,
                    updatedAt: $scope.m.editForm.updatedAt,
                    references: $scope.m.editForm.references ? angular.toJson($scope.m.editForm.references) : null
                }).then((resp) => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.loadAll();
                    $scope.m.resetSelection();
                    $scope.m.RefreshData();

                });
            },
        };

        $scope.m.CreateForm = {
            data: {
                proteinPurifications: [],
                proteinPurificationsToAdd: [],
                proteinAnalysisRequests: []
            },
            ui: {},
            submitted: false,
            initTab: function () {
                $scope.m.initAnalysisRequests();
            },
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.CreateForm.data.proteinPurifications = [];
                $scope.m.CreateForm.data.proteinPurificationsToAdd = [];
                $scope.m.CreateForm.data.proteinAnalysisRequests = [];
                $scope.m.activeTab = "ViewAllTab";
                $scope.m.initAnalysisRequests();
            },
            dpOpen: function ($event, input) {
                $event.preventDefault();
                $event.stopPropagation();
                input.opened = !(input.opened);
            },
            addData: function (form) {
                if (!$scope.m.CreateForm.data[form]) {
                    $scope.m.CreateForm.data[form] = [];
                }
                const entry = {
                    date: {
                        dt: new Date()
                    },
                    analyzedBy: SiHttpUtil.GetUserId()
                }
                $scope.m.CreateForm.data[form].push(entry);
            },
            removeData: function (form, index) {
                $scope.m.CreateForm.data[form].splice(index, 1);
            },
            copyData: function (form, column, date) {
                const len = $scope.m.CreateForm.data[form].length;
                const data = $scope.m.CreateForm.data[form][0][column];
                const entry = date ? data.dt : data;
                for (let i = 0; i < len; i++) {
                    if (date) {
                        $scope.m.CreateForm.data[form][i][column].dt = entry;
                    } else {
                        $scope.m.CreateForm.data[form][i][column] = entry;
                    }
                }
            },
            parseCSV: function () {
                var formData = new FormData;
                $scope.m.ShowImportBtn = false;
                if ($scope.m.CreateForm.data.method == "HPLC SEC") {
                    $scope.m.CreateForm.data.SECData = [];
                    $scope.m.CreateForm.data.proteinPurificationsToAdd = [];
                    $scope.m.CreateForm.data.proteinPurifications = [];
                    formData.append('file', document.getElementById('sec').files[0]);
                    SiHttpUtil.POSTRequest(SiHttpUtil.helperAPIUrl + "parsePurSECData/", formData).then(function (resp) {
                        SiHttpUtil.NotifyOk("Please review data changes");
                        for (var i = 0; i < resp.length; i++) {
                            const curr = resp[i];
                            $scope.m.CreateForm.data.proteinPurificationsToAdd.push(parseInt(curr.proteinPurificationId));
                            $scope.m.CreateForm.data.proteinPurifications.push(parseInt(curr.proteinPurificationId));
                            $scope.m.CreateForm.data.SECData.push({
                                proteinPurificationId: parseInt(curr.proteinPurificationId),
                                mp: parseFloat(curr.mp),
                                lmw: parseFloat(curr.lmw),
                                hmw: parseFloat(curr.hmw),
                                date: {
                                    dt: new Date(curr.date),
                                    opened: false
                                },
                                analyzedBy: parseInt(curr.analyzedBy),
                                instrument: curr.instrument,
                                type: "Stability"
                            });
                        }
                    }, function (err) {
                        SiHttpUtil.NotifyOperationErr("CSV Parse Error");
                        $scope.m.ShowImportBtn = true;
                    });
                } else if ($scope.m.CreateForm.data.method == "DLS") {
                    $scope.m.CreateForm.data.DLSData = [];
                    formData.append('file', document.getElementById('dls').files[0]);
                    SiHttpUtil.POSTRequest(SiHttpUtil.helperAPIUrl + "parseDLSData/", formData).then(function (resp) {
                        SiHttpUtil.NotifyOk("Please review data changes");
                        for (var i = 0; i < resp.length; i++) {
                            const curr = resp[i];
                            $scope.m.CreateForm.data.DLSData.push({
                                proteinPurificationId: parseInt(curr.proteinPurificationId),
                                diameter: parseFloat(curr.diamater),
                                pd: parseFloat(curr.pd),
                                molecularWeight: parseFloat(curr.molecularWeight),
                                aggregate: parseFloat(curr.aggregate),
                                meltingTemp: parseFloat(curr.meltingTemp),
                                analyzedBy: SiHttpUtil.GetUserId(),
                                date: {
                                    dt: new Date(),
                                    opened: false
                                }
                            });
                        }
                    }, function (err) {
                        SiHttpUtil.NotifyOperationErr("CSV Parse Error");
                        $scope.m.ShowImportBtn = true;
                    });
                } else if ($scope.m.CreateForm.data.method == "MALS") {
                    $scope.m.CreateForm.data.MALSData = [];
                    formData.append('file', document.getElementById('mals').files[0]);
                    SiHttpUtil.POSTRequest(SiHttpUtil.helperAPIUrl + "parseMALSData/", formData).then(function (resp) {
                        SiHttpUtil.NotifyOk("Please review data changes");
                        for (var i = 0; i < resp.length; i++) {
                            const curr = resp[i];
                            $scope.m.CreateForm.data.MALSData.push({
                                proteinPurificationId: parseInt(curr.proteinPurificationId),
                                peakNum: parseInt(curr.peakNum),
                                massFraction: parseFloat(curr.massFraction),
                                molecularWeight: parseFloat(curr.molecularWeight),
                                uncertainty: parseFloat(curr.uncertainty),
                                analyzedBy: SiHttpUtil.GetUserId(),
                                date: {
                                    dt: new Date(),
                                    opened: false
                                }
                            });
                        }
                    }, function (err) {
                        SiHttpUtil.NotifyOperationErr("CSV Parse Error");
                        $scope.m.ShowImportBtn = true;
                    });
                } else if ($scope.m.CreateForm.data.method == "cIEF") {
                    $scope.m.CreateForm.data.cIEFData = [];
                    formData.append('file', document.getElementById('cIEF').files[0]);
                    SiHttpUtil.POSTRequest(SiHttpUtil.helperAPIUrl + "parseCIEFData/", formData).then(function (resp) {
                        SiHttpUtil.NotifyOk("Please review data changes");
                        for (var i = 0; i < resp.length; i++) {
                            const curr = resp[i];
                            $scope.m.CreateForm.data.cIEFData.push({
                                proteinPurificationId: parseInt(curr.proteinPurificationId),
                                mp: parseFloat(curr.mp),
                                rangeHigh: parseFloat(curr.rangeHigh),
                                rangeLow: parseFloat(curr.rangeLow),
                                sharp: curr.sharp,
                                analyzedBy: SiHttpUtil.GetUserId(),
                                date: {
                                    dt: new Date(),
                                    opened: false
                                }
                            });
                        }
                    }, function (err) {
                        SiHttpUtil.NotifyOperationErr("CSV Parse Error");
                        $scope.m.ShowImportBtn = true;
                    });
                }
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                const dataLists = ['SECData', 'DLSData', 'MALSData', 'cIEFData', 'CESDSData', 'ThermalData'];
                const formatted = {};
                for (let i = 0; i < dataLists.length; i++) {
                    const currList = dataLists[i];
                    if ($scope.m.CreateForm.data[currList] && $scope.m.CreateForm.data[currList].length) {
                        formatted[currList] = [];
                        for (let j = 0; j < $scope.m.CreateForm.data[currList].length; j++) {
                            const entry = $scope.m.CreateForm.data[currList][j];
                            // CE-SDS and Thermal Data add to purificationsToAdd
                            if (i > 3) {
                                $scope.m.CreateForm.data.proteinPurificationsToAdd.push(entry.proteinPurificationId);
                            }
                            entry.date = entry.date.dt;
                            formatted[currList].push(entry);
                        }
                    }
                }

                if ($scope.m.CreateForm.data.proteinPurificationsToAdd.length == 0
                    && !$scope.m.dataOnly.includes($scope.m.CreateForm.data.method)) {
                    SiHttpUtil.NotifyOperationErr("No purifications linked. Check form.")
                    return;
                }

                const NewEntry = {
                    tableName: "proteinAnalysis",
                    proteinPurifications: $scope.m.CreateForm.data.proteinPurificationsToAdd,
                    method: $scope.m.CreateForm.data.method,
                    SECData: formatted.SECData,
                    DLSData: formatted.DLSData,
                    MALSData: formatted.MALSData,
                    cIEFData: formatted.cIEFData,
                    ThermalData: formatted.ThermalData,
                    CESDSData: formatted.CESDSData,
                    notes: $scope.m.CreateForm.data.notes
                };
                if ($scope.m.CreateForm.data.references &&
                    ($scope.m.CreateForm.data.references.files.length ||
                    $scope.m.CreateForm.data.references.links.length)) {
                    NewEntry.references = angular.toJson($scope.m.CreateForm.data.references);
                }
                SiHttpUtil.CreateTableEntry(NewEntry).then(function (resp) {
                    if (resp.status == 200) {
                        $scope.m.CreateForm.ResetTab();
                        $scope.m.RefreshData();
                    }
                });
            }
        };

        $scope.m.dp = SiUtil.dp.bind($scope.m)();

        $scope.m.InitSECHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope, 'sec');
        $scope.m.InitDLSHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope, 'dls');
        $scope.m.InitMALSHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope, 'mals');
        $scope.m.InitCIEFHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope, 'cIEF');

        $scope.m.updateProteinAnalysisRequest = (requestId, status) => {
            SiHttpUtil.UpdateDataEntry(
                {
                    id: requestId,
                    tableName: "proteinAnalysisRequest",
                    status: status,
                    updatedAt: $scope.m.ProteinAnalysisRequestDeisplayData.ListHash[requestId].updatedAt
                }
            ).then(function (response) {
                $scope.m.loadAll();
            }, function (error) {
                console.error("updateEntry error:", error);
            });
        }

        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.DtInstCallback = function (inst) {
            console.log("dt:", inst);
            $scope.m.DtInst = inst;
        };

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.LoadProteinAnalysisList());
                } else {
                    $scope.m.LoadProteinAnalysisList().then(function () {
                        $scope.m.dataReady = true;
                        $scope.$digest();
                    });
                }
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.dtColumns = [];

        $scope.m.LoadProteinAnalysisList = function () {
            return SiHttpUtil.FetchTableEntries('proteinAnalysis').then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp.records;
                    $scope.enums = JSON.parse(resp.enums);
                    $scope.sectionNames = $scope.enums.ENUM_analysisSectionName;
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('proteinAnalysis', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('proteinAnalysis', colName),
                                (colName) => SiHttpUtil.hideColumnForTable('proteinAnalysis', colName),
                                SiHttpUtil.tableOrder('proteinAnalysis')
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'notes'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'purifications'))
                                .renderWith(
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith( //CreatedAt.
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                        ];
                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                                if ($scope.op == "view" && $scope.id) {
                                    var records = $scope.m.tableData;
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.id) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.m.viewDetail();
                                }
                                if ($scope.op == "create") {
                                    $scope.m.activeTab = "CreateTab";
                                }
                            });
                    }
                });
            });
        };

        // Copy model to views.
        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                SiHttpUtil.FetchOneEntry('proteinAnalysis', $scope.m.currentRowData.id).then(function(resp) {
                    $scope.m.viewForm.ProteinPurifications = resp.ProteinPurifications;
                });
                $scope.m.viewForm.name = $scope.m.currentRowData.name;
                $scope.m.viewForm.method = $scope.m.currentRowData.method;

                $scope.m.viewForm.createdBy = $scope.UserHash[$scope.m.currentRowData.createdBy];
                $scope.m.viewForm.updatedBy = $scope.UserHash[$scope.m.currentRowData.updatedBy];
                $scope.m.viewForm.createdAt = SiUtil.getDateOnly($scope.m.currentRowData.createdAt);
                $scope.m.viewForm.updatedAt = SiUtil.getDateOnly($scope.m.currentRowData.updatedAt);
                $scope.m.viewForm.references = angular.fromJson($scope.m.currentRowData.references);
                $scope.m.viewForm.refInit();

                $scope.m.viewForm.notes = $scope.m.currentRowData.notes;
                $scope.m.viewForm.show = true;
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.initAnalysisRequests();
                $scope.m.activeTab = "EditTab";
                $scope.m.editForm.id = $scope.m.currentRowData.id;
                $scope.m.editForm.name = $scope.m.currentRowData.name;
                $scope.m.editForm.method = $scope.m.currentRowData.method;
                $scope.m.editForm.references = angular.fromJson($scope.m.currentRowData.references);
                $scope.m.editForm.notes = $scope.m.currentRowData.notes;
                $scope.m.editForm.updatedAt = $scope.m.currentRowData.updatedAt;

                $scope.m.editForm.show = true;
            }
        };

        $scope.m.loadAll = function () {
            var deps = []; // Dependencies.
            Promise.all(deps).then(values => {
                $scope.m.LoadProteinAnalysisList();
            });
        };

        $scope.m.loadAll();
    }
})();

//Research
//ProteinSummaryController Controller
(function () {
    'use strict';

    angular
        .module('app.research')
        .controller('ProteinSummaryController', ProteinSummaryController);

    ProteinSummaryController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', '$http', 'SiUtil', '$uibModal', '$state', '$stateParams'];

    function ProteinSummaryController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, $http, SiUtil, $uibModal, $state, $stateParams) {
        // Main model.
        $scope.m = {};
        $scope.tableState.currentResearchTable = "proteinSummary";
        $scope.m.tableName = "proteinSummary";
        $scope.m.activeTab = "ViewAllTab";
        $scope.m.tableData = null;
        $scope.id = $stateParams.id;
        $scope.op = $stateParams.op;
        $scope.getDateOnly = SiUtil.getDateOnly;
        $scope.getFormattedStatus = SiUtil.getFormattedStatus;

        $scope.m.viewForm = {
            tree_handler: function (branch) {
                if (branch.label != "No Associated Data") {
                    $scope.m.viewForm.selectedUrl = "#!/app/research/" + branch.data.tableurl + "?op=view&id=" + branch.data.id;
                    $scope.m.viewForm.selectedItem = branch.label;
                }
            },
            treeControl: {},
            treedata: [],
            data: {},
            loadTree: function () {
                $http({
                    url: SiHttpUtil.helperAPIUrl + "proteintree/" + $scope.m.viewDetail.id,
                    method: "GET"
                }).then(function (response) {
                    $scope.m.viewForm.treedata = response.data;
                    if ($scope.m.viewForm.treedata.length == 0) {
                        $scope.m.viewForm.treedata = [{
                            label: "No Associated Data"
                        }];
                        $scope.m.viewForm.treeControl.expand_all();
                    }
                })
            },
        };

        $scope.m.dp = SiUtil.dp.bind($scope.m)();

        $scope.m.DtInstCallback = function (inst) {
            console.log("dt:", inst);
            $scope.m.DtInst = inst;
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.dtColumns = [];

        $scope.m.statusFilter = {
            includePurified: false,
            includeNotPurified: false,
        }

        $scope.m.onStatusChange = function () {
            var table = $('#proteinSummary').DataTable();
            var val = [];
            if ($scope.m.statusFilter.includePurified) {
                val.push('^(?!(Not)).*Purified');
            }
            if ($scope.m.statusFilter.includeNotPurified) {
                val.push('Not Purified');
            }
            table
                .columns(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'purified'))
                .search(val.join('|'), true, false)
                .draw();
        }

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.FetchTableEntries('proteinSummary').then(function (response) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = response.records;
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('proteinSummary', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('proteinSummary', colName),
                                (colName) => SiHttpUtil.hideColumnForTable('proteinSummary', colName));
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'transfections'))
                                .withOption("type", "natural")
                                .renderWith(
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'purifications'))
                                .withOption("type", "natural")
                                .renderWith(
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'description'))
                                .renderWith(
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'purificationDate'))
                                .renderWith(
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'projectDescription'))
                                .notVisible(),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'plasmidDescription'))
                                .notVisible(),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'purified'))
                                .renderWith(
                                SiUtil.ColDisplayers.StatusDisplayer
                                ),
                        ];

                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                                if ($scope.op == "view" && $scope.id) {
                                    var records = $scope.m.tableData;
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.id) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.m.viewDetail();
                                }
                            }).withButtons([
                                {
                                    extend: 'colvis',
                                    text: 'Columns'
                                },
                                {
                                    extend: 'csv',
                                    filename: 'export',
                                    text: 'Export CSV'
                                },
                                {
                                    extend: 'excelHtml5',
                                    filename: 'export',
                                    text: 'Export Excel'
                                },
                                {
                                    extend: 'print',
                                    title: "",
                                    text: 'Print',
                                    exportOptions: {
                                        columns: ':visible'
                                    }
                                },
                                {
                                    text: '<i class="fas fa-sync"></i>',
                                    action: function (e, dt, node, config) {
                                        $scope.m.RefreshData();
                                    }
                                }
                            ]
                        );
                    }
                })
            })
        };

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.LoadDataList());
                } else {
                    $scope.m.LoadDataList().then(function () {
                        $scope.m.dataReady = true;
                        $scope.$digest();
                    });
                }
            }
        };

        // Copy model to views.
        $scope.m.viewDetail = function () {
            var modalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                templateUrl: 'viewDetails.html',
                size: 'lg',
                controller: function ($scope) {
                    $scope.m.close = function () {
                        modalInstance.close();
                    };
                    if ($scope.m.currentRowData) {
                        $scope.m.viewDetail.id = $scope.m.currentRowData.id;
                        $state.go('app.research.proteinSummary', { op: 'view', id: $scope.m.viewDetail.id }, {
                            notify: false,
                            reload: false,
                            location: 'replace',
                        });
                        SiHttpUtil.FetchOneEntry('proteinSummary', $scope.m.viewDetail.id).then(resp => {
                            $scope.m.viewForm.data = angular.copy(resp)
                        })
                        $scope.m.viewForm.treedata = [];
                        $scope.m.viewForm.selectedUrl = null;
                        $scope.m.viewForm.selectedItem = null;
                        $scope.m.viewForm.loadTree();
                    }
                }
            });
            modalInstance.result.then(function () {
                $state.go('app.research.proteinSummary', {}, {notify:false, inherit: false});
            }, function () {
                $state.go('app.research.proteinSummary', {}, {notify:false, inherit: false});
            });
        };

        $scope.m.LoadDataList();
    }
})();

//Research
//Protein Inventory Controller
(function () {
    'use strict';

    angular
        .module('app.research')
        .controller('ProteinRequestController', ProteinRequestController);

        ProteinRequestController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$stateParams'];

    function ProteinRequestController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $stateParams) {
        // Main model.
        $scope.m = {
            tableData: []
        };
        $scope.tableState.currentResearchTable = "proteinRequest";
        $scope.m.activeTab = "ViewAllTab";
        $scope.op = $stateParams.op;
        $scope.id = $stateParams.id;

        $scope.m.statusFilter = {
            includeSubmitted: true,
            includeCompleted: false,
            includeDenied: false
        }

        $scope.m.getQuery = () => {
            var query = {
                $or: []
            };
            if ($scope.m.statusFilter.includeSubmitted) {
                query.$or.push({requestStatus: 'Submitted'});
            }
            if ($scope.m.statusFilter.includeCompleted) {
                query.$or.push({requestStatus: 'Completed'});
            }
            if ($scope.m.statusFilter.includeDenied) {
                query.$or.push({requestStatus: 'Denied'});
            }
            if (query.$or.length == 0) {
                query = {};
            }
            $scope.m.query = query;
        }

        $scope.m.onStatusChange = function () {
            $scope.m.getQuery();
            $scope.m.RefreshData();
        }

        $scope.m.viewForm = SiHttpUtil.InitViewForm($scope.m);

        $scope.m.editForm = {
            show: false,
            submitted: false,
            ui: {},
            data: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            DenyReq: () => {
                SiHttpUtil.UpdateDataEntry({
                    tableName: "proteinRequest",
                    id: $scope.m.currentRowData.id,
                    denied: true,
                    requestStatus: "Denied",
                    updatedAt: $scope.m.editForm.data.updatedAt
                }).then((resp) => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.RefreshData();
                    $scope.m.resetSelection();
                });
            },
            DeleteReq: () => {
                if (SiHttpUtil.GetUserId() === $scope.m.editForm.data.createdBy) {
                    SiHttpUtil.DeleteDataEntry("proteinRequest", $scope.m.currentRowData.id).then(resp => {
                        $scope.m.editForm.CancelTab();
                        $scope.m.RefreshData();
                        $scope.m.resetSelection();
                    });
                } else {
                    SiHttpUtil.NotifyOperationErr("You can only delete your own request");
                    return;
                }
            },
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.EditForm.ui.validate);
                    return;
                }
                SiHttpUtil.UpdateDataEntry({
                    tableName: "proteinRequest",
                    id: $scope.m.editForm.data.id,
                    massAmount: $scope.m.editForm.data.massAmount,
                    volumeAmount: $scope.m.editForm.data.volumeAmount,
                    notes: $scope.m.editForm.data.notes,
                    updatedAt: $scope.m.editForm.data.updatedAt
                }).then((resp) => {
                    if (resp.status == 200) {
                        $scope.m.editForm.CancelTab();
                        $scope.m.RefreshData();
                        $scope.m.resetSelection();
                    }
                });
            }
        };
        $scope.m.CreateFulfillmentForm = {
            data: {},
            show: false,
            requestsToUpdate: [],
            requestIds: [],
            submitted: false,
            ui: {},
            CancelTab: () => {
                SiHttpUtil.HideTab($scope.m, $scope.m.CreateFulfillmentForm),
                SiHttpUtil.ResetForm($scope.m.CreateFulfillmentForm);
                $scope.m.CreateFulfillmentForm.requestsToUpdate = [];
                $scope.m.CreateFulfillmentForm.requestIds = [];
            },
            initTab: () => {
                SiHttpUtil.SearchByColumn('proteinRequest', { requestStatus: 'Submitted' }).then(function (resp) {
                    $scope.m.RequestList = resp;
                    $scope.m.RequestDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.RequestList);
                    $scope.m.RequestListReady = true;
                });
            },
            addAll: () => {
                for (var i = 0; i < $scope.m.RequestList.length; i++) {
                    $scope.m.CreateFulfillmentForm.addEntry($scope.m.RequestList[i].id)
                }
            },
            addEntry: reqId => {
                if ($scope.m.CreateFulfillmentForm.requestIds.indexOf(reqId) != -1) {
                    SiHttpUtil.NotifyOperationErr("Request already added");
                    return;
                }
                // Get related purifications from protein
                let query = {proteinId: $scope.m.RequestDisplayData.ListHash[reqId].proteinId};
                var entry = {
                    requestStatus: "Completed",
                    fulfillment: true,
                    id: reqId,
                    proteinPurificationId: $scope.m.RequestDisplayData.ListHash[reqId].proteinPurificationId,
                    volumeUsed: $scope.m.RequestDisplayData.ListHash[reqId].volumeRequested,
                    notes: $scope.m.RequestDisplayData.ListHash[reqId].notes,
                    updatedAt: $scope.m.RequestDisplayData.ListHash[reqId].updatedAt
                }
                SiHttpUtil.SearchByColumn('proteinRequest', query).then(resp => {
                    entry.purificationList = SiHttpUtil.GetDependencyDisplayItemList(resp);
                });
                $scope.m.CreateFulfillmentForm.requestsToUpdate.push(entry);
                $scope.m.CreateFulfillmentForm.requestIds.push(reqId);
            },
            removeEntry: index => {
                $scope.m.CreateFulfillmentForm.requestsToUpdate.splice(index, 1);
                $scope.m.CreateFulfillmentForm.requestIds.splice(index, 1);
            },
            SubmitTab: () => {
                $scope.m.CreateFulfillmentForm.submitted = true;
                if (!$scope.m.CreateFulfillmentForm.ui.validate.$valid) {
                    console.error($scope.m.CreateFulfillmentForm.ui.validate);
                    return;
                }

                SiHttpUtil.UpdateDataEntries({
                    tableName: "proteinRequest",
                    list: $scope.m.CreateFulfillmentForm.requestsToUpdate
                }).then((resp) => {
                    $scope.m.CreateFulfillmentForm.CancelTab();
                    $scope.m.RefreshData();
                });
            }
        };

        $scope.m.CreateRequestForm = {
            data: {},
            ui: {},
            requestsToAdd: [],
            submitted: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateRequestForm);
                $scope.m.CreateRequestForm.requestsToAdd = [];
                $scope.m.activeTab = "ViewAllTab";
            },
            initTab: () => {
                SiHttpUtil.SearchByColumn('proteinRequest', {proteins: 'purified'}).then(function (resp) {
                    $scope.m.ProteinList = resp;
                    $scope.m.ProteinDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.ProteinList);
                    $scope.m.ProteinListReady = true;
                });
                SiHttpUtil.SearchByColumn('proteinRequest', {purifications: 'yes'}).then(function (resp) {
                    $scope.m.PurificationList = resp;
                    $scope.m.PurificationDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.PurificationList);
                    $scope.m.PurificationListReady = true;
                });
            },
            refreshPurifications: () => {
                var query = {proteinId: $scope.m.CreateRequestForm.data.proteinId};
                SiHttpUtil.SearchByColumn('proteinRequest', query).then(resp => {
                    $scope.m.CreateRequestForm.purificationList = resp;
                });
                $scope.m.CreateRequestForm.data.purificationPreference = null;
            },
            addEntry: type => {
                var volumeAmount, massAmount, purificationId, proteinId, concentration;
                if (type == "protein") {
                    proteinId = $scope.m.CreateRequestForm.data.proteinId;
                    purificationId = $scope.m.CreateRequestForm.data.purificationPreference.id;
                    concentration = $scope.m.CreateRequestForm.data.purificationPreference.finalConcentration;
                    volumeAmount = $scope.m.CreateRequestForm.data.pref1Volume;
                    massAmount = $scope.m.CreateRequestForm.data.pref1Mass;
                } else if (type == "purification") {
                    purificationId = $scope.m.CreateRequestForm.data.purificationId;
                    proteinId = $scope.m.PurificationDisplayData.ListHash[purificationId].Transfection.TransfectionRequest.Protein.id;
                    concentration = $scope.m.PurificationDisplayData.ListHash[purificationId].finalConcentration;
                    volumeAmount = $scope.m.CreateRequestForm.data.pref2Volume;
                    massAmount = $scope.m.CreateRequestForm.data.pref2Mass;
                }
                if (!volumeAmount && !massAmount) return;
                if (volumeAmount && massAmount) return;
                $scope.m.CreateRequestForm.requestsToAdd.push({
                    proteinPurificationId: purificationId,
                    proteinId: proteinId,
                    concentration: concentration,
                    massAmount: massAmount,
                    volumeAmount: volumeAmount,
                    requestStatus: "Submitted"
                });
                $scope.m.CreateRequestForm.data = {};
            },
            removeEntry: index => {
                $scope.m.CreateRequestForm.requestsToAdd.splice(index, 1);
            },
            SubmitTab: function () {
                $scope.m.CreateRequestForm.submitted = true;
                if (!$scope.m.CreateRequestForm.ui.validate.$valid) {
                    console.error($scope.m.CreateRequestForm.ui.validate);
                    return;
                }
                if ($scope.m.CreateRequestForm.requestsToAdd.length == 0) {
                    SiHttpUtil.NotifyOperationErr("Must add a request");
                    return;
                }
                var ProteinRequestEntry = {
                    tableName: "proteinRequest",
                    list: $scope.m.CreateRequestForm.requestsToAdd
                };
                SiHttpUtil.CreateTableEntries(ProteinRequestEntry)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.CreateRequestForm.ResetTab();
                            $scope.m.RefreshData();
                        }
                    });
            },
        };

        $scope.m.copyData = (form, element) => {
            var toCopy = form[0][element];
            for (var i =0; i < form.length; i++) {
                form[i][element] = toCopy;
            }
        };

        $scope.m.ValidateCreateRequestInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateRequestForm.ui.validate,
                $scope.m.CreateRequestForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.dp = SiUtil.dp.bind($scope.m)();

        $scope.m.DtInstCallback = function (inst) {
            console.log("dt:", inst);
            $scope.m.DtInst = inst;
        };

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.LoadDataList());
                } else {
                    $scope.m.LoadDataList();
                }
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.dtColumns = [];

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.SearchByColumn('proteinRequest', $scope.m.query).then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp;
                    if (resp.enums) {
                        var enumList = JSON.parse(resp.enums);
                    }
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('proteinRequest', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('proteinRequest', colName),
                                (colName) => SiHttpUtil.hideColumnForTable('proteinRequest', colName),
                                SiHttpUtil.tableOrder('proteinRequest')
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'notes'))
                                .renderWith(
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'requestStatus'))
                                .renderWith(
                                SiUtil.ColDisplayers.StatusDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                .renderWith(
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith(
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                        ];

                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                                if ($scope.op == "view" && $scope.id) {
                                    var records = $scope.m.tableData;
                                    for (var i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.id) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.m.viewDetail();
                                }
                                if ($scope.op == "create") {
                                    var records = $scope.m.tableData;
                                    if ($scope.id) $scope.m.CreateForm.data.transfectionId = $scope.id;
                                    $scope.m.activeTab = "CreateTab";
                                }
                            });
                    } else {
                        resolve($scope.m.tableData);
                    }
                });
            });
        };

        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.viewForm.show = true;
                $scope.m.viewForm.data = angular.copy($scope.m.currentRowData);
                $scope.m.viewForm.data.createdAt = SiUtil.getDateOnly($scope.m.viewForm.data.createdAt);
                $scope.m.viewForm.data.updatedAt = SiUtil.getDateOnly($scope.m.viewForm.data.updatedAt);
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.activeTab = "EditTab";
                $scope.m.editForm.data = angular.copy($scope.m.currentRowData);
                $scope.m.editForm.show = true;

            }
        };

        $scope.m.loadAll = function () {
            var deps = [];
            $scope.m.getQuery();
            Promise.all(deps).then(values => {
                $scope.m.LoadDataList();
            });
        };

        $scope.m.loadAll();
    }
})();

//Binding Data Controller
(function () {
    'use strict';

    angular
        .module('app.research')
        .controller('ProteinBindingDataController', ProteinBindingDataController);

        ProteinBindingDataController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$stateParams'];

    function ProteinBindingDataController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $stateParams) {
        // Main model.
        $scope.m = {
            tableData: null,
            dtColumns: [],
            tableName: "bindingData",
            activeTab: "ViewAllTab",
            op: $stateParams.op,
            id: $stateParams.id,
            DtInstCallback: inst => {
                $scope.m.DtInst = inst;
            },
            RefreshData: () => {
                if ($scope.m.DtInstCallback) {
                    if ($scope.m.DtInst) {
                        $scope.m.DtInst.changeData($scope.m.LoadDataList());
                    } else {
                        $scope.m.LoadDataList();
                    }
                }
            },
        };
        $scope.dl = SiHttpUtil.DownloadFile;

        $scope.getDateOnly = SiUtil.getDateOnly;
        $scope.m.viewForm = SiHttpUtil.InitViewForm($scope.m);
        $scope.tableState.currentTable = $scope.m.tableName;
        $scope.m.InitFileHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope, 'file');

        $scope.m.editForm = {
            data: {},
            show: false,
            submitted: false,
            ui: {},
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            Delete: () => {
                SiHttpUtil.DeleteDataEntry($scope.m.tableName, $scope.m.currentRowData.id).then(() => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.RefreshData();
                });
            },
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.EditForm.ui.validate);
                    return;
                }
                SiHttpUtil.UpdateDataEntry({
                    tableName: $scope.m.tableName,
                    id: $scope.m.editForm.data.id,
                    requesterId: $scope.m.editForm.data.requesterId,
                    requestDate: $scope.m.editForm.data.requestDate.dt,
                    priority: $scope.m.editForm.data.priority,
                    sequenceReviewed: $scope.m.editForm.data.sequenceReviewed,
                    designed: $scope.m.editForm.data.designed,
                    cloned: $scope.m.editForm.data.cloned,
                    maxiprep: $scope.m.editForm.data.maxiprep,
                    verified: $scope.m.editForm.data.verified,
                }).then((resp) => {
                    if (resp.status === 200) {
                        $scope.m.editForm.CancelTab();
                        $scope.m.RefreshData();
                    }
                });
            }
        };

        $scope.m.CreateForm = {
            data: {},
            ui: {},
            submitted: false,
            initTab: () => {
                $scope.m.dp.initDp('CreateForm', 'requestDate', true);
                SiHttpUtil.FetchIdNameMapping('plasmids').then(resp => {
                    $scope.m.PlasmidList = resp;
                    $scope.m.PlasmidDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.PlasmidList);
                })
            },
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.dp.initDp('CreateForm', 'requestDate', true);
                $scope.m.activeTab = "ViewAllTab";
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                const RequestEntry = {
                    tableName: $scope.m.tableName,
                    plasmidId: $scope.m.CreateForm.data.plasmidId,
                    requesterId: $scope.m.CreateForm.data.requesterId,
                    requestDate: $scope.m.CreateForm.data.requestDate.dt,
                    priority: $scope.m.CreateForm.data.priority,
                };
                SiHttpUtil.CreateTableEntry(RequestEntry)
                    .then(function (resp) {
                        if (resp.status === 200) {
                            $scope.m.CreateForm.ResetTab();
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        $scope.m.UploadForm = {
            data: {
                BindingData: []
            },
            ui: {},
            submitted: false,
            initTab: () => {
                SiHttpUtil.FetchIdNameMapping('proteinPurification').then(resp => {
                    $scope.m.PurificationDisplayData = SiHttpUtil.GetDependencyDisplayItemList(resp);
                });
                SiHttpUtil.FetchIdNameMapping('transfection').then(resp => {
                    $scope.m.TransfectionDisplayData = SiHttpUtil.GetDependencyDisplayItemList(resp);
                });
            },
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.UploadForm);
                $scope.m.UploadForm.data.BindingData = [];
                $scope.m.activeTab = "ViewAllTab";
            },
            removeEntry: index => {
                $scope.m.UploadForm.data.BindingData.splice(index, 1);
            },
            parseCSV: function () {
                var formData = new FormData;
                $scope.m.ShowImportBtn = false;
                formData.append('file', document.getElementById('file').files[0]);
                formData.append('option', $scope.m.UploadForm.option);
                SiHttpUtil.POSTRequest(SiHttpUtil.helperAPIUrl + "parseBindingData/", formData).then(function (resp) {
                    SiHttpUtil.NotifyOk("Please review data changes");
                    for (let i = 0; i < resp.length; i++) {
                        const curr = resp[i];
                        $scope.m.UploadForm.data.BindingData.push({
                            purificationId: parseInt(curr.purificationId),
                            transfectionId: parseInt(curr.transfectionId),
                            type: $scope.m.UploadForm.option == 'Loading' ? 'Affinity' : 'Avidity',
                            sensorType: curr.sensorType,
                            sensorId: curr.sensorId,
                            loadingSensorId: curr.loadingSensorId,
                            concentration: parseFloat(curr.concentration),
                            response: parseFloat(curr.response),
                            kd: parseFloat(curr.kd),
                            kdError: parseFloat(curr.kdError),
                            kon: parseFloat(curr.kon),
                            konError: parseFloat(curr.konError),
                            kdis: parseFloat(curr.kdis),
                            kdisError: parseFloat(curr.kdisError),
                            rMax: parseFloat(curr.rMax),
                            rMaxError: parseFloat(curr.rMaxError),
                            kobs: parseFloat(curr.kobs),
                            req: parseFloat(curr.req),
                            fullX2: parseFloat(curr.fullX2),
                            fullR2: parseFloat(curr.fullR2),
                            fittingType: curr.fittingType,
                            modelType: curr.modelType,
                            instrumentType: curr.instrumentType,
                            associationStart: curr.associationStart,
                            associationEnd: curr.associationEnd,
                            disassociationStart: curr.disassociationStart,
                            disassociationEnd: curr.disassociationEnd,
                            startDate: new Date(curr.startDate)
                        });
                    }
                }, function (err) {
                    SiHttpUtil.NotifyOperationErr("CSV Parse Error: " + err);
                    $scope.m.ShowImportBtn = true;
                });
            },
            SubmitTab: function () {
                $scope.m.UploadForm.submitted = true;
                if (!$scope.m.UploadForm.ui.validate.$valid) {
                    console.error($scope.m.UploadForm.ui.validate);
                    return;
                }
                SiHttpUtil.UploadFile($scope.m.tableName, 'file')
                    .then(resp => {
                        const bindingData = $scope.m.UploadForm.data.BindingData.map(o => {o.references = angular.toJson([resp.data]); return o;});
                        const RequestEntry = {
                            tableName: $scope.m.tableName,
                            list: bindingData
                        };
                        SiHttpUtil.CreateTableEntries(RequestEntry)
                            .then(function (resp) {
                                if (resp.status === 200) {
                                    $scope.m.UploadForm.ResetTab();
                                    $scope.m.RefreshData();
                                }
                            });
                    }, err => {
                        console.error(err);
                        return;
                    });
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.FetchTableEntries($scope.m.tableName).then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp.records;
                    if (resp.enums) {
                        var enumList = JSON.parse(resp.enums);
                        $scope.sectionNames = angular.copy(enumList.ENUM_packageSectionName);
                    }
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length === 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable($scope.m.tableName, colName),
                                (colName) => SiHttpUtil.dbColumnTranslator($scope.m.tableName, colName),
                                (colName) => SiHttpUtil.hideColumnForTable($scope.m.tableName, colName),
                                SiHttpUtil.tableOrder($scope.m.tableName)
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'purification'))
                                .withOption('type', 'natural'),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'realResponse'))
                                .renderWith(
                                    SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'lowResponse'))
                                .renderWith(
                                    SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'kd'))
                                .renderWith(
                                    SiUtil.ColDisplayers.ExponentialDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'kon'))
                                .renderWith(
                                    SiUtil.ColDisplayers.ExponentialDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'kdis'))
                                .renderWith(
                                    SiUtil.ColDisplayers.ExponentialDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'startDate'))
                                .renderWith(
                                    SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                .renderWith(
                                    SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith(
                                    SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                        ];

                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                                if ($scope.m.op === "view" && $scope.m.id) {
                                    const records = $scope.m.tableData;
                                    for (let i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.m.id) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.m.viewDetail();
                                }
                                if ($scope.op === "create") {
                                    $scope.m.activeTab = "CreateTab";
                                }
                            })
                            .withOption('order', [['1', 'desc']])
                    } else {
                        resolve($scope.m.tableData);
                    }
                });
            });
        };

        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.viewForm.show = true;
                $scope.m.viewForm.data = angular.copy($scope.m.currentRowData);
                $scope.m.viewForm.data.createdAt = SiUtil.getDateOnly($scope.m.viewForm.data.createdAt);
                $scope.m.viewForm.data.startDate = SiUtil.getDateTime($scope.m.viewForm.data.startDate);
                $scope.m.viewForm.data.updatedAt = SiUtil.getDateOnly($scope.m.viewForm.data.updatedAt);
                $scope.m.viewForm.data.referenceArray = angular.fromJson($scope.m.viewForm.data.references);
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.editForm.data = angular.copy($scope.m.currentRowData);
                $scope.m.editForm.data.requestDate = {
                    dt: $scope.m.editForm.data.requestDate ? new Date($scope.m.editForm.data.requestDate): null
                }
                $scope.m.editForm.show = true;
                $scope.m.activeTab = "EditTab";
            }
        };
        $scope.m.dp = SiUtil.dp.bind($scope.m)();
        $scope.m.LoadDataList();
    }
})();

// Octet Analysis Request
(function () {
    'use strict';
    angular
        .module('app.research')
        .controller('KineticRequestsController', KineticRequestsController);

    KineticRequestsController.$inject = ['$scope', 'SiHttpUtil', 'DTColumnDefBuilder', 'SiUtil', '$stateParams'];

    function KineticRequestsController($scope, SiHttpUtil, DTColumnDefBuilder, SiUtil, $stateParams) {
        // Main model.
        $scope.m = {
            tableData: null,
            dtColumns: [],
            tableName: "kineticRequest",
            activeTab: "ViewAllTab",
            op: $stateParams.op,
            id: $stateParams.id,
            statusFilter: {
                includeSubmitted: true,
                includeCompleted: false
            },
            DtInstCallback: inst => {
                $scope.m.DtInst = inst;
            },
            RefreshData: () => {
                if ($scope.m.DtInstCallback) {
                    if ($scope.m.DtInst) {
                        $scope.m.DtInst.changeData($scope.m.LoadDataList());
                    } else {
                        $scope.m.LoadDataList();
                    }
                }
            }
        };

        $scope.m.getQuery = () => {
            var query = {
                expProgress: {
                    $or: {}
                }
            };
            if ($scope.m.statusFilter.includeSubmitted) {
                query.expProgress.$or.$ne = "Done";
            }
            if ($scope.m.statusFilter.includeCompleted) {
                query.expProgress.$or.$eq = "Done";
            }
            $scope.m.query = query;
        }
        $scope.m.onStatusChange = function () {
            $scope.m.getQuery();
            $scope.m.RefreshData();
        }

        $scope.getDateOnly = SiUtil.getDateOnly;
        $scope.m.viewForm = SiHttpUtil.InitViewForm($scope.m);
        $scope.tableState.currentTable = $scope.m.tableName;

        $scope.m.editForm = {
            data: {},
            show: false,
            submitted: false,
            ui: {},
            assign: () => {
                $scope.m.editForm.data.assignedTo = SiHttpUtil.GetUserId()
            },
            CancelTab: () => SiHttpUtil.HideTab($scope.m, $scope.m.editForm),
            Delete: () => {
                SiHttpUtil.DeleteDataEntry($scope.m.tableName, $scope.m.currentRowData.id).then(() => {
                    $scope.m.editForm.CancelTab();
                    $scope.m.RefreshData();
                });
            },
            SubmitTab: function () {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                const toCreate = {
                    tableName: $scope.m.tableName,
                    id: $scope.m.editForm.data.id,
                    type: $scope.m.editForm.data.type,
                    fullKinetics: $scope.m.editForm.data.fullKinetics,
                    otherSample: $scope.m.editForm.data.otherSample,
                    epitopeBinning: $scope.m.editForm.data.epitopeBinning,
                    quantitation: $scope.m.editForm.data.quantitation,
                    taskNotes: $scope.m.editForm.data.taskNotes,
                    methodDevProgress: $scope.m.editForm.data.methodDevProgress,
                    expProgress: $scope.m.editForm.data.expProgress,
                    expType: $scope.m.editForm.data.expType,
                    assignedTo: $scope.m.editForm.data.assignedTo,
                    timeline: $scope.m.editForm.data.timeline,
                    updatedAt: $scope.m.editForm.data.updatedAt
                }
                if ($scope.m.editForm.data.approved) {
                    toCreate.approvalDate = new Date();
                    toCreate.approvedBy = SiHttpUtil.GetUserId();
                }
                SiHttpUtil.UpdateDataEntry(toCreate).then((resp) => {
                    if (resp.status == 200) {
                        $scope.m.editForm.CancelTab();
                        $scope.m.RefreshData();
                        $scope.m.resetSelection();
                    }
                });
            }
        };
        $scope.m.CreateForm = {
            data: {
                purificationsToAdd: [],
                transfectionsToAdd: [],
                cellLinesToAdd: [],
                bioreactorsToAdd: [],
                transfectionsToAdd: [],
                testAntigens: []
            },
            ui: {},
            submitted: false,
            ResetTab: function (createAnother) {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.CreateForm.data.purificationsToAdd = [],
                $scope.m.CreateForm.data.transfectionsToAdd = [],
                $scope.m.CreateForm.data.cellLinesToAdd = [],
                $scope.m.CreateForm.data.bioreactorsToAdd = [],
                $scope.m.CreateForm.data.testAntigens = []
                if (!createAnother) {
                    $scope.m.activeTab = "ViewAllTab";
                }
                $scope.m.dp.initDp('CreateForm', 'approvalDate', false);
            },
            initTab: () => {
                SiHttpUtil.FetchIdNameMapping("proteinPurification").then(resp => {
                    $scope.m.PurificationDisplayData = SiHttpUtil.GetDependencyDisplayItemList(resp);
                });
                SiHttpUtil.FetchIdNameMapping("transfection").then(resp => {
                    $scope.m.TransfectionDisplayData = SiHttpUtil.GetDependencyDisplayItemList(resp);
                });
                SiHttpUtil.FetchIdNameMapping("cellLinePurification").then(resp => {
                    $scope.m.CellLineDisplayData = SiHttpUtil.GetDependencyDisplayItemList(resp);
                });
                SiHttpUtil.FetchIdNameMapping("bioreactorPurification").then(resp => {
                    $scope.m.BioreactorDisplayData = SiHttpUtil.GetDependencyDisplayItemList(resp);
                });
                SiHttpUtil.FetchIdNameMapping('antigenReagent').then(resp => {
                    $scope.m.AntigenDisplayData = SiHttpUtil.GetDependencyDisplayItemList(resp);
                });
            },
            addEntry: (list, id) =>{
                if (list.indexOf(id) != -1) {
                    SiHttpUtil.NotifyOperationErr("item already added");
                    return;
                }
                list.push(id);
            },
            removeEntry: (list, index) => {
                list.splice(index, 1);
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                if (!$scope.m.CreateForm.data.testAntigens.length && !$scope.m.CreateForm.data.taskNotes) {
                    SiHttpUtil.NotifyOperationErr("Must add at least one test antigen or add notes");
                    return;
                }
                if (!$scope.m.CreateForm.data.purificationsToAdd.length && !$scope.m.CreateForm.data.transfectionsToAdd.length
                     && !$scope.m.CreateForm.data.cellLinesToAdd.length && !$scope.m.CreateForm.data.bioreactorsToAdd.length
                     && !$scope.m.CreateForm.data.otherSample) {
                    SiHttpUtil.NotifyOperationErr("Must add at least one test antibody");
                    return;
                }
                const toCreate = {
                    tableName: $scope.m.tableName,
                    purificationsToAdd: $scope.m.CreateForm.data.purificationsToAdd,
                    transfectionsToAdd: $scope.m.CreateForm.data.transfectionsToAdd,
                    cellLinesToAdd: $scope.m.CreateForm.data.cellLinesToAdd,
                    bioreactorsToAdd: $scope.m.CreateForm.data.bioreactorsToAdd,
                    otherSample: $scope.m.CreateForm.data.otherSample,
                    type: $scope.m.CreateForm.data.type || "Both",
                    fullKinetics: $scope.m.CreateForm.data.fullKinetics,
                    quantitation: $scope.m.CreateForm.data.quantitation,
                    epitopeBinning: $scope.m.CreateForm.data.epitopeBinning,
                    testAntigens: $scope.m.CreateForm.data.testAntigens,
                    taskNotes: $scope.m.CreateForm.data.taskNotes,
                    methodDevProgress: "N/A",
                    expProgress: "Submitted",
                }

                SiHttpUtil.CreateTableEntry(toCreate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.CreateForm.ResetTab($scope.m.CreateForm.data.another);
                            $scope.m.RefreshData();
                        }
                    });
            }
        };

        $scope.m.antigenList = {
            data: {},
            loadData: () => {
                SiHttpUtil.FetchTableEntries('antigenReagent').then(resp => {
                    $scope.m.antigenList.tableData = resp.records;
                });
                SiHttpUtil.FetchIdNameMapping('protein').then(resp => {
                    $scope.m.antigenList.proteins = resp;
                });
            },
            removeEntry: id => {
                SiHttpUtil.DeleteDataEntry('antigenReagent', id).then(resp => {
                    $scope.m.antigenList.loadData();
                });
            },
            addEntry: () => {
                const toAdd = {
                    tableName: 'antigenReagent',
                    name: $scope.m.antigenList.data.name,
                    proteinId: $scope.m.antigenList.data.proteinId,
                    vendor: $scope.m.antigenList.data.vendor,
                    catalogId: $scope.m.antigenList.data.catalogId
                }
                SiHttpUtil.CreateTableEntry(toAdd).then(() => {
                    $scope.m.antigenList.loadData();
                    $scope.m.antigenList.data = {};
                })
            },
            undelete: entry => {
                const toUpdate = {
                    tableName: 'antigenReagent',
                    id: entry.id,
                    isDeleted: false
                }
                SiHttpUtil.UpdateDataEntry(toUpdate).then(() => {
                    $scope.m.antigenList.loadData();
                })

            }
        }

        SiHttpUtil.InitRowClick($scope);

        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.SearchByColumn($scope.m.tableName, $scope.m.query).then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp;
                    // if (resp.enums) {
                    //     var enumList = JSON.parse(resp.enums);
                    // }
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length === 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable($scope.m.tableName, colName),
                                (colName) => SiHttpUtil.dbColumnTranslator($scope.m.tableName, colName),
                                (colName) => SiHttpUtil.hideColumnForTable($scope.m.tableName, colName),
                                SiHttpUtil.tableOrder($scope.m.tableName)
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'fullKinetics'))
                                .renderWith(
                                SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'quantitation'))
                                .renderWith(
                                SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'epitopeBinning'))
                                .renderWith(
                                SiUtil.ColDisplayers.CheckDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'assignedTo'))
                                .renderWith(
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                .renderWith(
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith(
                                SiUtil.ColDisplayers.ShortDateDisplayer
                                ),
                        ];

                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                                if ($scope.m.op === "view" && $scope.m.id) {
                                    const records = $scope.m.tableData;
                                    for (let i = 0; i < records.length; i++) {
                                        if (records[i].id == $scope.m.id) {
                                            $scope.m.currentRowData = records[i];
                                            break;
                                        }
                                    }
                                    $scope.m.viewDetail();
                                }
                                if ($scope.op === "create") {
                                    $scope.m.activeTab = "CreateTab";
                                }
                            });
                    } else {
                        resolve($scope.m.tableData);
                    }
                });
            });
        };

        // Copy model to views.
        $scope.m.viewDetail = function () {
            if ($scope.m.currentRowData) {
                SiHttpUtil.FetchOneEntry($scope.m.tableName, $scope.m.currentRowData.id).then(resp => {
                    $scope.m.viewForm.Antigens = resp.AntigenReagents;
                    $scope.m.viewForm.ProteinPurifications = resp.ProteinPurifications;
                    $scope.m.viewForm.Transfections = resp.Transfections;
                    $scope.m.viewForm.BioreactorPurifications = resp.BioreactorPurifications;
                    $scope.m.viewForm.CLPurifications = resp.CellLinePurifications;
                    $scope.m.viewForm.BioreactorPurifications = resp.BioreactorPurifications.map(purification => {
                        purification.proteins = _.uniqBy(purification.Bioreactors.map(reactor => {
                            return reactor.CLDHarvest.experiment.StableCellLine.Protein;
                        }), 'id');
                        return purification;
                    })
                });
                $scope.m.viewForm.data = angular.copy($scope.m.currentRowData);
                $scope.m.viewForm.data.approvalDate = SiUtil.getDateOnly($scope.m.currentRowData.approvalDate);
                $scope.m.viewForm.data.createdAt = SiUtil.getDateOnly($scope.m.currentRowData.createdAt);
                $scope.m.viewForm.data.updatedAt = SiUtil.getDateOnly($scope.m.currentRowData.updatedAt);
                $scope.m.viewForm.show = true;
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                SiHttpUtil.FetchOneEntry($scope.m.tableName, $scope.m.currentRowData.id).then(resp => {
                    $scope.m.editForm.Antigens = resp.AntigenReagents;
                    $scope.m.editForm.ProteinPurifications = resp.ProteinPurifications;
                    $scope.m.editForm.Transfections = resp.Transfections;
                });
                $scope.m.editForm.data = angular.copy($scope.m.currentRowData);
                $scope.m.editForm.data.approvalDate = {
                    dt: $scope.m.currentRowData.approvalDate == null ? null : new Date($scope.m.currentRowData.approvalDate)
                };
                $scope.m.editForm.show = true;
                $scope.m.activeTab = "EditTab";
            }
        };

        $scope.m.dp = SiUtil.dp.bind($scope.m)();

        $scope.m.loadAll = function () {
            $scope.m.getQuery();
            $scope.m.dp.initDp('CreateForm', 'approvalDate', true);
            $scope.m.LoadDataList();
        }

        $scope.m.loadAll();
    }
})();
