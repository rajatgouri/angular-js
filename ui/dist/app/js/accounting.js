/*This file contains the controllers for the Accounting module
**Accounting Controller -
**Billing Controller - has scopes that check what the active tab is and modifies it behavior on that tab
**
**
**This code was originally copied from the Cell Therapy Controller - to have a base structure and is being added
**      to or modified to meed the needs of Billing
**
*/

//Start of testing for controller for accounting:
//Coping the Cell Therapy Controllers and changing them to accounting
//This is main controller for main accounting pages
// With Coping from Cell Therapy controller, I am adding code from Facilities controllers



(function () {
    'use strict';
    angular
        .module('app.accounting')
        .controller('AccountingController', AccountingController);
        AccountingController.$inject = ['$scope', '$state', 'Global', 'SiHttpUtil'];

    function AccountingController($scope, $state, Global, SiHttpUtil) {
        $scope.global = Global;
        $scope.tableState = {};

        // Fixes the angular chosen off-by-one error
        $scope.$watch(function () {
            return $(".chosen-select option").length;
        }, function (newvalue, oldvalue) {
            if (newvalue !== oldvalue) {
                $(".chosen-select").trigger("chosen:updated");
            }
        });

        $scope.tableState.currentTable = "";
        $scope.switchTable = function () {
            console.log("table:", $scope.tableState.currentTable);
            console.log("table")
            if ($scope.tableState.currentTable) {
                $state.go("app.accounting." + $scope.tableState.currentTable)
            }
        };

        $scope.UserHash = null;
        $scope.ActiveUserHash = null;
        $scope.ActiveUserList = null;
        SiHttpUtil.CacheUserHash().then(function (UserHash) {
            $scope.UserHash = UserHash.complete;
            $scope.ActiveUserHash = UserHash.active;
            $scope.ActiveUserList = UserHash.activeList;
        });

        $scope.m = {};
    };
})();

//Accounting
//Project Billing Controller
(function () {
    'use strict';
    angular
        .module('app.accounting')
        .controller('accBillingController', accBillingController);

        accBillingController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$http', 'Global', '$stateParams', '$timeout'];

    function accBillingController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $http, Global, $stateParams, $timeout) {
        // Main model.
        //start of origninal controller for Billing
        $scope.m = {
            getDateTime: SiUtil.getDateTime
        };

        $scope.m.AccountingStatements = {
            DtInstCallback: inst => {
                $scope.m.AccountingStatements.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            initData: () => {
                SiHttpUtil.FetchTableEntries('AccountingStatements').then(resp => {
                    $scope.m.AccountingStatements.tableData = resp.records;
                    if ($scope.m.AccountingStatements.tableData && $scope.m.AccountingStatements.tableData.length > 0) {
                        if ($scope.m.AccountingStatements.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.AccountingStatements.dtColumns, $scope.m.AccountingStatements.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('AccountingStatements', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('AccountingStatements', colName)
                            );
                        }
                        $scope.m.AccountingStatements.dtColDefs = [

                        ];
                        $scope.m.AccountingStatements.dtOptions = SiHttpUtil.initDtOptions($scope.m.AccountingStatements.dtColumns, $scope.m.AccountingStatements.tableData, $scope.m.AccountingStatements.rowCallback,
                            function () {
                                $scope.m.AccountingStatements.dataReady = true;
                                resolve($scope.m.AccountingStatements.tableData);
                            }).withOption('order', [['0', 'desc']]);
                    }
                });
            }
        }
        $scope.m.BoaStatements = {
            DtInstCallback: inst => {
                $scope.m.BoaStatements.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],

            initData: () => {
                SiHttpUtil.FetchTableEntries('BoaStatements').then(resp => {
                    $scope.m.BoaStatements.tableData = resp.records;
                    if ($scope.m.BoaStatements.tableData && $scope.m.BoaStatements.tableData.length > 0) {
                        if ($scope.m.BoaStatements.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.BoaStatements.dtColumns, $scope.m.BoaStatements.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('BoaStatements', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('BoaStatements', colName)
                            );
                        }
                        $scope.m.BoaStatements.dtColDefs = [

                        ];
                        $scope.m.BoaStatements.dtOptions = SiHttpUtil.initDtOptions($scope.m.BoaStatements.dtColumns, $scope.m.BoaStatements.tableData, $scope.m.BoaStatements.rowCallback,
                            function () {
                                $scope.m.BoaStatements.dataReady = true;
                                resolve($scope.m.BoaStatements.tableData);
                            }).withOption('order', [['0', 'desc']]);
                    }
                });
            },
            RefreshData: () => {
                if ($scope.m.DtInstCallback) {
                    if ($scope.m.BoaStatements.DtInst) {
                        $scope.m.activeTab = "BoaStatements";
                        $scope.m.BoaStatements.DtInst.changeData($scope.m.BoaStatements.initData());
                        $scope.m.dataReady = true;
                        $scope.$digest();
                    } else {
                        $scope.m.activeTab = "BoaStatements";
                        $scope.m.initData().then(function () {
                            $scope.m.dataReady = true;
                            $scope.$digest();
                        });
                    }
                }
            },
            viewForm: {
                CancelTab: () => {
                    $scope.m.activeTab = "BoaStatements";
                    $scope.m.BoaStatements.viewForm.show = false;
                    $scope.m.BoaStatements.RefreshData();

                }
            },
            data: {
                toAdd: []
            },
            ui: {},
            submitted: false,

            upload: () => {
                $scope.m.activeTab = "BoaStatementsImportTab";
                $scope.m.BoaStatements.viewForm.show = true;

            }
        }

        $scope.m.ProcurifyStatements = {
            DtInstCallback: inst => {
                $scope.m.ProcurifyStatements.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            //Different tabs associated with Procurify - Main table & Upload
            initData: () => {
                SiHttpUtil.FetchTableEntries('ProcurifyStatements').then(resp => {
                    $scope.m.ProcurifyStatements.tableData = resp.records;
                    if ($scope.m.ProcurifyStatements.tableData && $scope.m.ProcurifyStatements.tableData.length > 0) {
                        if ($scope.m.ProcurifyStatements.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.ProcurifyStatements.dtColumns, $scope.m.ProcurifyStatements.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('ProcurifyStatements', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('ProcurifyStatements', colName)
                            );
                        }
                        $scope.m.ProcurifyStatements.dtColDefs = [

                        ];
                        $scope.m.ProcurifyStatements.dtOptions = SiHttpUtil.initDtOptions($scope.m.ProcurifyStatements.dtColumns, $scope.m.ProcurifyStatements.tableData, $scope.m.ProcurifyStatements.rowCallback,
                            function () {
                                $scope.m.ProcurifyStatements.dataReady = true;
                                resolve($scope.m.ProcurifyStatements.tableData);
                            }).withOption('order', [['0', 'desc']]);
                    }
                });
            },
            RefreshData: () => {
                if ($scope.m.DtInstCallback) {
                    if ($scope.m.ProcurifyStatements.DtInst) {
                        $scope.m.activeTab = "ProcurifyStatements";
                        $scope.m.ProcurifyStatements.DtInst.changeData($scope.m.ProcurifyStatements.initData());
                        $scope.m.dataReady = true;
                        $scope.$digest();
                    } else {
                        $scope.m.activeTab = "ProcurifyStatements";
                        $scope.m.initData().then(function () {
                            $scope.m.dataReady = true;
                            $scope.$digest();
                        });
                    }
                }
            },
            viewForm: {
                CancelTab: () => {
                    $scope.m.activeTab = "ProcurifyStatements";
                    $scope.m.ProcurifyStatements.viewForm.show = false;
                    $scope.m.ProcurifyStatements.RefreshData();

                }
            },
            ui: {},
            submitted: false,

            upload: () => {
                $scope.m.activeTab = "ProcurifyStatementsImportTab";
                $scope.m.ProcurifyStatements.viewForm.show = true;
            }
        }//end of Procurify Table

        $scope.m.Import = {
            dataBOA: {
                lotsToAdd: []
            },
            dataProcurify: {
                lotsToAdd: []
            },
            ui: {},
            submitted: false,


            ResetTabBOA: function () {
                SiHttpUtil.ResetForm($scope.m.Import);
                $scope.m.Import.dataBOA.lotsToAdd = [];
            },
            dpOpenBOA: function ($event, input) {
                $event.preventDefault();
                $event.stopPropagation();
                input.opened = !(input.opened);
            },
            parseCSVBOA: function () {
                //console.log("do i get here");
                var formData = new FormData;
                formData.append('file', document.getElementById('fileBOA').files[0]);
                SiHttpUtil.POSTRequest(SiHttpUtil.helperAPIUrl + "parseBoaStatement/", formData).then(function (resp) {
                    SiHttpUtil.NotifyOk("Bank of America Statement Uploaded Successfully");
                    var curr;
                    console.log(resp)
                    for( let i = 0; i < resp.length; i++ ){
                        const curr = resp[i];
                        $scope.m.Import.dataBOA.lotsToAdd.push({
                            PurchaseDate: curr.PurchaseDate,
                            Description: curr.Description,
                            Amount: curr.Amount,
                            Department: curr.Department,
                            ItemType: curr.ItemType,
                            PONumber: curr.PONumber
                        });
                        console.log($scope.m.Import.dataBOA.lotsToAdd)
                    }
                    $scope.m.Import.SubmitTabBOA();
                    $scope.m.ShowImportBtn = false;
                }, function (err) {
                    SiHttpUtil.NotifyOperationErr("BOA CSV Parse Error");
                    $scope.m.ShowImportBtn = true;
                });

            },
            SubmitTabBOA: function () {
                $scope.m.Import.submitted = true;
                if (!$scope.m.Import.ui.validate.$valid) {
                //    console.error($scope.m.BulkLotCreate.ui.validate);
                    return;
                }

                var newEntries = [];
                for (var i = 0; i < $scope.m.Import.dataBOA.lotsToAdd.length; i++) {
                    const temp = {};
                    temp.PurchaseDate = $scope.m.Import.dataBOA.lotsToAdd[i].PurchaseDate,
                    temp.Description  = $scope.m.Import.dataBOA.lotsToAdd[i].Description,
                    temp.Amount = $scope.m.Import.dataBOA.lotsToAdd[i].Amount,
                    temp.Department = $scope.m.Import.dataBOA.lotsToAdd[i].Department,
                    temp.ItemType = $scope.m.Import.dataBOA.lotsToAdd[i].ItemType,
                    temp.PONumber = $scope.m.Import.dataBOA.lotsToAdd[i].PONumber

                    newEntries.push(temp);
                }

                var toCreate = {
                    tableName: "BoaStatements",
                    list: newEntries
                }

                SiHttpUtil.CreateTableEntries(toCreate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.Import.ResetTab();
                            //$scope.m.activeTab = "ViewAllTab";
                            $scope.m.RefreshData();
                        }
                    });

            },

            addEntryProcurify: function () {
                $scope.m.Import.dataProcurify.lotsToAdd.push({});
                //console.log("addEntry: " + $scope.m.BulkLotCreate.data.lotsToAdd)
            },
            removeEntryProcurify: function (index) {
                $scope.m.Import.dataProcurify.lotsToAdd.splice(index, 1);
            },
            ResetTabProcurify: function () {
                SiHttpUtil.ResetForm($scope.m.Import);
                $scope.m.Import.dataProcurify.lotsToAdd = [];
            },
            dpOpenProcurify: function ($event, input) {
                $event.preventDefault();
                $event.stopPropagation();
                input.opened = !(input.opened);
            },
            addEntryProcurify: function () {
                $scope.m.Import.dataProcurify.lotsToAdd.push({});
                //console.log("addEntry: " + $scope.m.BulkLotCreate.data.lotsToAdd)
            },
            removeEntryProcurify: function (index) {
                $scope.m.Import.dataProcurify.lotsToAdd.splice(index, 1);
            },
            parseCSVprocurify: function () {
                //console.log("do i get here");
                var formData = new FormData;
                formData.append('file', document.getElementById('fileProcurify').files[0]);
                SiHttpUtil.POSTRequest(SiHttpUtil.helperAPIUrl + "parseProcurifyStatement/", formData).then(function (resp) {
                    SiHttpUtil.NotifyOk("Procurify Statement Uploaded Successfully");
                    console.log(resp)
                    var curr;
                    for( let i = 0; i < resp.length; i++ ){
                        const curr = resp[i];
                        $scope.m.Import.dataProcurify.lotsToAdd.push({
                            OrderID: curr.OrderID,
                            LineNumber: curr.LineNumber,
                            Requester: curr.Requester,
                            SubmittedDate: curr.SubmittedDate,
                            LastModified: curr.ArchiveRecord,
                            RecievedDate: curr.Comment,
                            POID: curr.POID,
                            PurchasedDate: curr.PurchasedDate,
                            ApprovalDate: curr.ApprovalDate,
                            Approver: curr.Approver,
                            DueDate: curr.DueDate,
                            InvoiceDate: curr.InvoiceDate,
                            Vendor: curr.Vendor,
                            Item: curr.Item,
                            SKU: curr.SKU,
                            Quantity: curr.Quantity,
                            Unit: curr.Unit,
                            UnitCost: curr.UnitCost,
                            Currency: curr.Currency,
                            LineCost: curr.LineCost,
                            Status: curr.Status,
                            Location: curr.Location,
                            LocationID: curr.LocationID,
                            Department: curr.Department,
                            DepartmentID: curr.DepartmentID,
                            AccountCode: curr.AccountCode,
                            AccountDescription: curr.AccountDescription,
                            Note: curr.Note,
                            External_ID: curr.External_ID,
                            Project: curr.Project,
                            AdditionalProjects: curr.AdditionalProjects
                        });
                        console.log($scope.m.Import.dataProcurify.lotsToAdd)
                    }
                    $scope.m.Import.SubmitTabProcurify();
                    $scope.m.ShowImportBtn = false;
                }, function (err) {
                    SiHttpUtil.NotifyOperationErr("Procurify Statement CSV Parse Error");
                    $scope.m.ShowImportBtn = true;
                });

            },
            SubmitTabProcurify: function () {
                $scope.m.Import.submitted = true;
                if (!$scope.m.Import.ui.validate.$valid) {
                //    console.error($scope.m.BulkLotCreate.ui.validate);
                    return;
                }

                var newEntries = [];
                for (var i = 0; i < $scope.m.Import.dataProcurify.lotsToAdd.length; i++) {
                    const temp = {};
                    temp.OrderID = $scope.m.Import.dataProcurify.lotsToAdd[i].OrderID,
                    temp.LineNumber = $scope.m.Import.dataProcurify.lotsToAdd[i].LineNumber,
                    temp.Requester = $scope.m.Import.dataProcurify.lotsToAdd[i].Requester,
                    temp.SubmittedDate = $scope.m.Import.dataProcurify.lotsToAdd[i].SubmittedDate,
                    temp.LastModified = $scope.m.Import.dataProcurify.lotsToAdd[i].LastModified,
                    temp.RecievedDate = $scope.m.Import.dataProcurify.lotsToAdd[i].RecievedDate,
                    temp.POID = $scope.m.Import.dataProcurify.lotsToAdd[i].POID,
                    temp.PurchasedDate = $scope.m.Import.dataProcurify.lotsToAdd[i].PurchasedDate,
                    temp.ApprovalDate = $scope.m.Import.dataProcurify.lotsToAdd[i].ApprovalDate,
                    temp.Approver = $scope.m.Import.dataProcurify.lotsToAdd[i].Approver,
                    temp.DueDate = $scope.m.Import.dataProcurify.lotsToAdd[i].DueDate,
                    temp.InvoiceDate = $scope.m.Import.dataProcurify.lotsToAdd[i].InvoiceDate,
                    temp.Vendor = $scope.m.Import.dataProcurify.lotsToAdd[i].Vendor,
                    temp.Item = $scope.m.Import.dataProcurify.lotsToAdd[i].Item,
                    temp.SKU = $scope.m.Import.dataProcurify.lotsToAdd[i].SKU,
                    temp.Quantity = $scope.m.Import.dataProcurify.lotsToAdd[i].Quantity,
                    temp.Uni = $scope.m.Import.dataProcurify.lotsToAdd[i].Unit,
                    temp.UnitCost = $scope.m.Import.dataProcurify.lotsToAdd[i].UnitCost,
                    temp.Currency = $scope.m.Import.dataProcurify.lotsToAdd[i].Currency,
                    temp.LineCost = $scope.m.Import.dataProcurify.lotsToAdd[i].LineCost,
                    temp.Status = $scope.m.Import.dataProcurify.lotsToAdd[i].Status,
                    temp.Location = $scope.m.Import.dataProcurify.lotsToAdd[i].Location,
                    temp.LocationID = $scope.m.Import.dataProcurify.lotsToAdd[i].LocationID,
                    temp.Department = $scope.m.Import.dataProcurify.lotsToAdd[i].Department,
                    temp.DepartmentID = $scope.m.Import.dataProcurify.lotsToAdd[i].DepartmentID,
                    temp.AccountCode = $scope.m.Import.dataProcurify.lotsToAdd[i].AccountCode,
                    temp.AccountDescription = $scope.m.Import.dataProcurify.lotsToAdd[i].AccountDescription,
                    temp.Note = $scope.m.Import.dataProcurify.lotsToAdd[i].Note,
                    temp.External_ID = $scope.m.Import.dataProcurify.lotsToAdd[i].External_ID,
                    temp.Project = $scope.m.Import.dataProcurify.lotsToAdd[i].Project,
                    temp.AdditionalProjects = $scope.m.Import.dataProcurify.lotsToAdd[i].AdditionalProjects

                    newEntries.push(temp);
                }

                var toCreate = {
                    tableName: "ProcurifyStatements",
                    list: newEntries
                }

                SiHttpUtil.CreateTableEntries(toCreate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.Import.ResetTab();
                            //$scope.m.activeTab = "ViewAllTab";
                            $scope.m.RefreshData();
                        }
                    });
            }
        }

        $scope.m.DtInstCallback = function (inst) {
            console.log("dt:", inst);
            $scope.m.DtInst = inst;
        };
        SiHttpUtil.InitRowClick($scope);
        //$scope.m.InitHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope);

        $scope.m.dtColumns = [];

        SiHttpUtil.InitRowClick($scope);
        $scope.m.InitBoaHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope, 'fileBOA');
        $scope.m.InitProcurifyHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope, 'fileProcurify');

        $scope.m.AccountingStatements.initData();
        SiHttpUtil.InitRowClick($scope, 'BoaStatements');
        SiHttpUtil.InitRowClick($scope, 'ProcurifyStatements');

    }//end of accBilling Controller
})();




//Accounting
//Project Staffing Controller
(function () {
    'use strict';

    angular
        .module('app.accounting')
        .controller('ProjectStaffing', ProjectStaffing);

        ProjectStaffing.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$http', 'Global', '$stateParams', '$timeout'];

    function ProjectStaffing($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $http, Global, $stateParams, $timeout) {
        // Main model.
        $scope.global = Global;
        $scope.m = {
            tableName: "TimePerProject",
            activeTab: "ViewAllTab",
            tableData: null,
            TimeListToAdd: []
        };

        //$scope.tableState.currentTable = $scope.m.tableName;
        $scope.op = $stateParams.op;
        $scope.id = $stateParams.id;

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

        $scope.m.timeCategory = {
            includeProject: false,
            includeAdmin: false,
        }

        $scope.m.onStatusChange = function () {
            var table = $('#TimePerProject').DataTable();
            var val = [];
            if ($scope.m.timeCategory.includeProject) {
                val.push('Project');
            }
            if ($scope.m.timeCategory.includeAdmin) {
                val.push('Administration');
            }
            table
                .columns(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'ProjectID')) // Changed because of reorder function
                .search(val.join('|'), true, false)
                .draw();
        }
        $scope.m.dtColumns = [];

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.FetchTableEntries($scope.m.tableName).then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp.records;
                    if (resp.enums) {
                        var enumList = JSON.parse(resp.enums);
                    }
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length === 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable($scope.m.tableName, colName),
                                (colName) => SiHttpUtil.dbColumnTranslator($scope.m.tableName, colName),
                                (colName) => SiHttpUtil.hideColumnForTable($scope.m.tableName, colName),
                            );
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'ProjectID'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.ProjectDisplayData.Hash)
                                )
                                .withOption('type', 'natural')
                                .withOption('defaultContent', ''),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'PayPeriodID'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.PayPeriodsDisplayData.Hash)
                                )
                                .withOption('type', 'natural')
                                .withOption('defaultContent', ''),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'TimeCat'))
                                .renderWith( // Operator.
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.TimeSpentCategoriesDisplayData.Hash)
                                )
                                .withOption('type', 'natural')
                                .withOption('defaultContent', ''),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                .renderWith( //createdBy
                                SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdAt'))
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
                                        $scope.m.viewDetail();
                                    }
                                    $scope.m.viewDetail();
                                }
                            }).withOption('order', [['0', 'desc']]);
                    } else {
                        resolve($scope.m.tableData);
                    }
                })
            });
        }
        var LoadTimeSpentCategoriesList = SiHttpUtil.FetchIdNameMapping('TimeSpentCategories').then(function (resp) {
            $scope.m.TimeSpentCategoriesList = resp;
            $scope.m.TimeSpentCategoriesDisplayData = SiHttpUtil.GetDependencyList($scope.m.TimeSpentCategoriesList);
            $scope.m.TimeSpentCategoriesListReady = true;
        });
        var LoadProjectList = SiHttpUtil.FetchIdNameMapping('project').then(function (resp) {
            $scope.m.ProjectList = resp;
            $scope.m.ProjectDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.ProjectList);
            $scope.m.ProjectListReady = true;
        });
        var LoadPayPeriodsList = SiHttpUtil.FetchIdNameMapping('PayPeriods').then(function (resp) {
            $scope.m.PayPeriodsList = resp;
            $scope.m.PayPeriodsDisplayData = SiHttpUtil.GetDependencyDisplayItemList($scope.m.PayPeriodsList);
            $scope.m.PayPeriodsListReady = true;
        })


        var deps = []; // Dependencies.
        deps.push(LoadTimeSpentCategoriesList);
        deps.push(LoadProjectList);
        deps.push(LoadPayPeriodsList);
        Promise.all(deps).then(values => {
            $scope.m.LoadDataList();
        });
        $scope.m.LoadDataList();

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
                var len = $scope.m.BulkLotCreate.data.lotsToAdd.length;
                var entry = $scope.m.BulkLotCreate.data.lotsToAdd[0][column];
                for (var i = 0; i < len; i++) {
                    $scope.m.BulkLotCreate.data.lotsToAdd[i][column] = entry;
                }
            },
            dpOpen: function ($event, input) {
                $event.preventDefault();
                $event.stopPropagation();
                input.opened = !(input.opened);
            },
            addEntry: function () {
                $scope.m.BulkLotCreate.data.lotsToAdd.push({});
                //console.log("addEntry: " + $scope.m.BulkLotCreate.data.lotsToAdd)
            },
            removeEntry: function (index) {
                $scope.m.BulkLotCreate.data.lotsToAdd.splice(index, 1);
            },

            parseCSV: function () {
                //console.log("do i get here");
                var formData = new FormData;
                formData.append('file', document.getElementById('file').files[0]);
                SiHttpUtil.POSTRequest(SiHttpUtil.helperAPIUrl + "parsePayPeriodData/", formData).then(function (resp) {
                    SiHttpUtil.NotifyOk("Please review data changes");
                    var curr;
                    for( let i = 0; i < resp.length; i++ ){
                        const curr = resp[i];
                        $scope.m.BulkLotCreate.data.lotsToAdd.push({
                            name: curr.name,
                            endDate: curr.endDate
                        });
                        console.log($scope.m.BulkLotCreate.data.lotsToAdd)
                    }

                    $scope.m.ShowImportBtn = false;
                    console.log("Parse: Does it get here?");
                }, function (err) {
                    SiHttpUtil.NotifyOperationErr("CSV Parse Error");
                    $scope.m.ShowImportBtn = true;
                });

            },
            SubmitTab: function () {
                $scope.m.BulkLotCreate.submitted = true;
                if (!$scope.m.BulkLotCreate.ui.validate.$valid) {
                //    console.error($scope.m.BulkLotCreate.ui.validate);
                    return;
                }

                var newEntries = [];
                for (var i = 0; i < $scope.m.BulkLotCreate.data.lotsToAdd.length; i++) {
                    const temp = {};
                    //console.log($scope.m.BulkLotCreate.data.lotsToAdd[i].name);
                    temp.name = $scope.m.BulkLotCreate.data.lotsToAdd[i].name;
                    temp.endDate = $scope.m.BulkLotCreate.data.lotsToAdd[i].endDate;

                    newEntries.push(temp);
                }

                var toCreate = {
                    tableName: "PayPeriods",
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
        }

        $scope.m.InitHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope);

    }
})();



