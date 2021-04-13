(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('LandingHomeController', LandingHomeController);
    LandingHomeController.$inject = ['$scope', '$http', 'Global', 'SiUtil', 'SiHttpUtil', '$uibModal'];

    function LandingHomeController($scope, $http, Global, SiUtil, SiHttpUtil, $uibModal) {
        $scope.global = Global;
        $scope.tableHistory = [];
        $scope.tableHistoryDisplayList = [];
        $scope.transfectionRequestList = [];
        $scope.m = {
            getDateOnly: SiUtil.getDateOnly,
            UserHash: null,
            getDateTime: SiUtil.getDateTime
        };
        SiHttpUtil.CacheUserHash().then(function (UserHash) {
            $scope.m.UserHash = UserHash.complete;
        });

        // Fixes the angular chosen off by one error
        $scope.$watch(function () {
            return $(".chosen-select option").length;
        }, function (newvalue, oldvalue) {
            if (newvalue !== oldvalue) {
                $(".chosen-select").trigger("chosen:updated");
            }
        });

        //ToDo: map from table name to url
        $scope.tableToUrl = function (tableName) {
            switch (tableName) {
                case "constructRequest":
                    return $scope.global.domain + "/#!/app/research/constructRequest";
                case "plasmids":
                    return $scope.global.domain + "/#!/app/research/plasmids";
                case "project":
                    return $scope.global.domain + "/#!/app/projects/";
                case "protein":
                    return $scope.global.domain + "/#!/app/research/proteins";
                case "proteinSummary":
                    return $scope.global.domain + "/#!/app/research/proteinSummary";
                case "proteinRequest":
                    return $scope.global.domain + "/#!/app/research/proteinRequest";
                case "transfectionRequest":
                    return $scope.global.domain + "/#!/app/research/transfectionRequests";
                case "transfection":
                    return $scope.global.domain + "/#!/app/research/transfections";
                case "proteinPurification":
                    return $scope.global.domain + "/#!/app/research/proteinPurification";
                case "analyticalSec":
                    return $scope.global.domain + "/#!/app/research/analyticalSec";
                case "stableCellLine":
                    return $scope.global.domain + "/#!/app/research/stableCellLine";
                case "proteinAnalysis":
                    return $scope.global.domain + "/#!/app/research/proteinAnalysis";
                case "proteinAnalysisRequest":
                    return $scope.global.domain + "/#!/app/research/proteinAnalysisRequest";
                case "activation":
                    return $scope.global.domain + "/#!/app/ade/activation";
                case "bCellSource":
                    return $scope.global.domain + "/#!/app/ade/bCellSource";
                case "mixCondition":
                    return $scope.global.domain + "/#!/app/ade/mixCondition";
                case "bCCPlate":
                    return $scope.global.domain + "/#!/app/ade/bCCPlate";
                case "supernatentPlate":
                    return $scope.global.domain + "/#!/app/ade/supernatentPlate";
                case "sort":
                    return $scope.global.domain + "/#!/app/ade/supernatentPlate";
                case "discoveryTransfection":
                    return $scope.global.domain + "/#!/app/ade/discoveryTransfection";
                case "humanizationTransfection":
                    return $scope.global.domain + "/#!/app/ade/humanizationTransfection";
                case "discoveryPlasmid":
                    return $scope.global.domain + "/#!/app/ade/discoveryPlasmid";
                case "humanizationPlasmid":
                    return $scope.global.domain + "/#!/app/ade/humanizationPlasmid";
                case "wellRescue":
                    return $scope.global.domain + "/#!/app/ade/wellRescue";
                case "cloningAndSequence":
                    return $scope.global.domain + "/#!/app/ade/cloningAndSequence";
                case "cellLineExperiment":
                    return $scope.global.domain + "/#!/app/pd/cellLineExperiment";
                case "cellLineHarvest":
                    return $scope.global.domain + "/#!/app/pd/cellLineHarvest";
                case "cellLinePurification":
                    return $scope.global.domain + "/#!/app/pd/cellLinePurification";
                case "cellLineAnalytic":
                    return $scope.global.domain + "/#!/app/pd/cellLineAnalytic";
                case "bioreactorExperiment":
                    return $scope.global.domain + "/#!/app/pd/bioreactorExperiment";
                case "bioreactorCondition":
                    return $scope.global.domain + "/#!/app/pd/bioreactorCondition";
                case "bioreactor":
                    return $scope.global.domain + "/#!/app/pd/bioreactor";
                case "bioreactorChemData":
                    return $scope.global.domain + "/#!/app/pd/bioreactorChemData";
                case "bioreactorVCDData":
                    return $scope.global.domain + "/#!/app/pd/bioreactorVCDData";
                case "bioreactorPurification":
                    return $scope.global.domain + "/#!/app/pd/bioreactorPurification";
                case "bioreactorAnalytic":
                    return $scope.global.domain + "/#!/app/pd/bioreactorAnalytic";
                case "enumconfig":
                    return $scope.global.domain + "/#!/app/research/enums";
                case "querylibs":
                    return $scope.global.domain + "/#!/app/query";
                //case "BoaStatements":
                //    return $scope.global.domain + "/#!/app/accounting/projectBilling";
            }
            return "javascript:void(0);";
        };

        $scope.graphs = function () {
            $scope.m.widgets.data.overviewGraph = {
                trOptions: {
                    legend: {
                        display: false
                    },
                    title: {
                        display: true,
                        text: 'Transfection Status (Last 2 Months)'
                    }
                },
                countDatasetOverride: [{
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
                }],
                countOptions:{
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
                }
            };

            $http.get(SiHttpUtil.helperAPIUrl + "graphapi/").then(function (resp) {
                $scope.m.widgets.data.overviewGraph.countData = {
                    labels: resp.data.countData.dates,
                    data: [
                        resp.data.countData.plasmids,
                        resp.data.countData.proteins,
                        resp.data.countData.transfections,
                        resp.data.countData.purifications
                    ],
                    colors: ['rgba(114,102,186,1)', 'rgba(35,183,229,1)', 'rgba(39,194,76,1)', 'rgba(240,80,80,1)']
                }
                $scope.m.widgets.data.overviewGraph.trData = {
                    labels: resp.data.trData.labels,
                    data: resp.data.trData.data,
                    colors: resp.data.trData.colors,
                    override: {
                        hoverBackgroundColor: resp.data.trData.colors
                    }
                }
                $scope.m.widgets.data.overviewGraph.leaderboard = resp.data.leaderboard;
            }, function (err) {
                console.log("fetch graph data from helper api err:", err);
            });
        }

        $scope.m.defaultDashboard = () => {
            return {
                row1: [{
                    type: 'overviewGraph',
                    hideTitle: true
                }],
                row2: {
                    col1: [{
                        type: 'latestActivities',
                    }],
                    col2: [],
                    col3: []
                },
                row3: []
            }
        };

        $scope.m.widgets = {
            friendlyMap: {
                latestActivities: "Latest Activities",
                tableau: "Tableau Dashboard",
                overviewGraph: "Overview Graph",
                myConstructs: "My Constructs",
                text: "Custom Text",
                constructsAwaiting: "Awaiting Construct Requests",
                octetRequestsAwaiting: "Awaiting Octet Analysis Requests",
                myEvents: "My Events",
                adTransfectionsAwaiting: "Pending AD TRs",
                pendingTRs: "Pending TRs",
                approvedTRs: "Approved TRs",
                inTransfection: "In Transfection",
                inPurification: "In Purification"
            },
            editEnabled: false,
            data: {},
            types: ['overviewGraph', 'latestActivities', 'tableau', 'myConstructs', 'constructsAwaiting',
                'octetRequestsAwaiting', 'myEvents', 'adTransfectionsAwaiting', 'pendingTRs', 'approvedTRs',
                'inTransfection', 'inPurification', 'text'
            ],
            getName: widget => {
                return widget.name || $scope.m.widgets.friendlyMap[widget.type];
            },
            edit: {
                data: {},
                ui: {},
                open: (group, index) => {
                    $scope.m.widgets.edit.data = group[index];
                    const modalInstance = $uibModal.open({
                        animation: true,
                        scope: $scope,
                        templateUrl: 'editWidget.html',
                        size: 'lg',
                        // windowClass: 'exl',
                        controller: function ($scope) {
                            $scope.m.widgets.edit.close = function () {
                                modalInstance.close();
                                $scope.m.widgets.edit.ResetTab();
                            };
                        }
                    });
                    modalInstance.result.then(function () {
                        $scope.m.widgets.edit.ResetTab();
                    }, function () {
                        $scope.m.widgets.edit.ResetTab();
                    });
                },
                ResetTab: function () {
                    SiHttpUtil.ResetForm($scope.m.widgets.edit);
                },
                submit: () => {
                    $scope.m.widgets.edit.submitted = true;
                    if (!$scope.m.widgets.edit.ui.validate.$valid) {
                        console.error($scope.m.widgets.edit.ui.validate);
                        return;
                    }
                    $scope.m.widgets.edit.close();
                }
            },
            remove: (group, index) => {
                group.splice(index, 1);
            }
        }
        $scope.m.widgets.layout = Global.preferences.homeLayout ? angular.fromJson(Global.preferences.homeLayout) : $scope.m.defaultDashboard();

        $scope.m.getDashboard = () => {
            const widgets = _.union($scope.m.widgets.layout.row1.map(w => w.type),
                                    $scope.m.widgets.layout.row2.col1.map(w => w.type),
                                    $scope.m.widgets.layout.row2.col2.map(w => w.type),
                                    $scope.m.widgets.layout.row2.col3.map(w => w.type),
                                    $scope.m.widgets.layout.row3.map(w => w.type));
            if (widgets.includes("overviewGraph")) {
                $scope.graphs();
            }
            SiHttpUtil.FetchOneEntry('home', widgets).then(resp => {
                Object.assign($scope.m.widgets.data, resp);
                if (resp.latestActivities) {
                    const history = resp.latestActivities.tableHistories ? angular.fromJson(resp.latestActivities.tableHistories) : [];
                    $scope.m.widgets.data.latestActivities = history.map(entry => {
                        return {
                            table: SiUtil.dbTableTranslator(entry.tableName),
                            ReadableTimestamp: SiUtil.getReadableTimestamp(entry.time),
                            url: $scope.tableToUrl(entry.tableName)
                        }
                    }).reverse();
                }
            })
        }

        $scope.m.getDashboard();
        $scope.m.addWidget = {
            data: {},
            ui: {},
            open: (row) => {
                $scope.m.addWidget.data.row = row;
                const modalInstance = $uibModal.open({
                    animation: true,
                    scope: $scope,
                    templateUrl: 'addWidget.html',
                    size: 'lg',
                    // windowClass: 'exl',
                    controller: function ($scope) {
                        $scope.m.addWidget.close = function () {
                            modalInstance.close();
                            $scope.m.addWidget.ResetTab();
                        };
                    }
                });
                modalInstance.result.then(function () {
                    $scope.m.addWidget.ResetTab();
                }, function () {
                    $scope.m.addWidget.ResetTab();
                });
            },
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.addWidget);
            },
            submit: () => {
                $scope.m.addWidget.submitted = true;
                if (!$scope.m.addWidget.ui.validate.$valid) {
                    console.error($scope.m.addWidget.ui.validate);
                    return;
                }
                const newEntry = {
                    type: $scope.m.addWidget.data.type,
                    hideTitle: $scope.m.addWidget.data.hideTitle
                }
                if (newEntry.type === 'tableau') {
                    newEntry.name = $scope.m.addWidget.data.name;
                    newEntry.height = $scope.m.addWidget.data.height;
                    newEntry.dashboardName = $scope.m.addWidget.data.dashboardName;
                    newEntry.showToolbar = $scope.m.addWidget.data.showToolbar || 'no';
                }
                if (newEntry.type === 'text') {
                    newEntry.text = $scope.m.addWidget.data.text;
                }
                $scope.m.addWidget.data.row.push(newEntry);
                $scope.m.addWidget.close();
            }
        }


        $scope.m.saveDashboard = () => {
            $scope.m.widgets.editEnabled = false;
            SiHttpUtil.UpdateDataEntry({
                tableName: 'home',
                layout: angular.toJson($scope.m.widgets.layout)
            });
            $scope.m.getDashboard();
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('EmailController', EmailController);
    EmailController.$inject = ['$scope', '$http', 'Global', 'SiUtil', 'SiHttpUtil', '$uibModal'];

    function EmailController($scope, $http, Global, SiUtil, SiHttpUtil, $uibModal) {
        
        $scope.global = Global;
        $scope.templates = [];
        
        $scope.m = {
            getDateOnly: SiUtil.getDateOnly,
            UserHash: null,
            getDateTime: SiUtil.getDateTime
        };
      

      
        $http.get(Global.gateway + '/getCompleteEmailList').then(function (resp) {
                
            $scope.m.widgets.data = resp.data.templates;
        }, function (err) {
            console.log("fetch Emails data from helper api err:", err);
        });

       

        $scope.m.defaultDashboard = () => {
            return {
                row1: [{
                    type: 'overviewGraph',
                    hideTitle: true
                }],
                row2: {
                    col1: [{
                        type: 'latestActivities',
                    }],
                    col2: [],
                    col3: []
                },
                row3: []
            }
        };

        $scope.m.widgets = {
           
            data: {},
        }


        $scope.m.addWidget = {
            data: {},
            ui: {},
           
        }


       

    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('DocumentController', DocumentController);
    DocumentController.$inject = ['$scope', '$http', 'Global', 'SiUtil', '$uibModal'];

    function DocumentController($scope, $http, Global, SiUtil, $uibModal) {
        $scope.global = Global;
        $scope.fetchResearchIssues = function () {
            $http({
                url: "https://jira.systimmune.net/rest/api/2/search?jql=project=LIMS+AND+resolution=Unresolved+AND+Labels=Research&fields=*none&maxResults=-1",
                method: "GET",
            }).then(function (resp) {
                $scope.researchIssues = resp.data.total;
            }, function (err) {
                console.log("fetch issues err:", err);
            });
        };
        $scope.fetchResearchIssues();
        $scope.fetchADEIssues = function () {
            $http({
                url: "https://jira.systimmune.net/rest/api/2/search?jql=project=LIMS+AND+resolution=Unresolved+AND+Labels=ADE&fields=*none&maxResults=-1",
                method: "GET",
            }).then(function (resp) {
                $scope.ADEIssues = resp.data.total;
            }, function (err) {
                console.log("fetch issues err:", err);
            });
        };
        $scope.fetchADEIssues();
        $scope.fetchPDIssues = function () {
            $http({
                url: "https://jira.systimmune.net/rest/api/2/search?jql=project=LIMS+AND+resolution=Unresolved+AND+Labels=PD&fields=*none&maxResults=-1",
                method: "GET",
            }).then(function (resp) {
                $scope.pdIssues = resp.data.total;
            }, function (err) {
                console.log("fetch issues err:", err);
            });
        };
        $scope.fetchPDIssues();
        $scope.fetchGeneralIssues = function () {
            $http({
                url: "https://jira.systimmune.net/rest/api/2/search?jql=project=LIMS+AND+resolution=Unresolved+AND+Labels=General&fields=*none&maxResults=-1",
                method: "GET",
            }).then(function (resp) {
                $scope.generalIssues = resp.data.total;
            }, function (err) {
                console.log("fetch issues err:", err);
            });
        };
        $scope.fetchGeneralIssues();

        $scope.fetchIssues = function (release) {
            $http({
                url: "https://jira.systimmune.net/rest/api/2/search?jql=project=LIMS+AND+fixVersion=" + release + "&fields=summary,reporter&maxResults=-1",
                method: "GET",
            }).then(function (resp) {
                console.log(resp)
                return resp.data.issues;
            }, function (err) {
                console.log("fetch issues err:", err);
            });
        }
        $scope.viewDetail = {};
        $scope.viewIssues = function (type, data) {
            var modalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                templateUrl: 'viewDetails.html',
                size: 'lg',
                controller: function ($scope) {
                    $scope.close = function () {
                        modalInstance.close();
                    };
                    var url;
                    if (type == "section") {
                        url = "https://jira.systimmune.net/rest/api/2/search?jql=project=LIMS+AND+(fixVersion+in+unreleasedVersions()+OR+fixVersion+is+EMPTY+OR+resolution=Unresolved)+AND+labels=" + data + "&fields=summary,reporter,components,status&maxResults=-1";
                    } else if (type == "release") {
                        url = "https://jira.systimmune.net/rest/api/2/search?jql=project=LIMS+AND+fixVersion=" + data + "&fields=summary,reporter,components,status&maxResults=-1";
                    }
                    $http({
                        url: url,
                        method: "GET"
                    }).then(function (resp) {
                        $scope.viewDetail.data = resp.data.issues;
                    }, function (err) {
                        console.log("fetch issues err:", err);
                    });
                    $scope.viewDetail.type = data;
                }
            });
        };

        $scope.viewSprint = function () {
            $scope.viewSprintDetail = {
                "new": [],
                "indeterminate": [],
                "done": [],
            }
            var modalInstance = $uibModal.open({
                animation: true,
                scope: $scope,
                templateUrl: 'viewSprint.html',
                size: 'lg',
                controller: function ($scope) {
                    $scope.close = function () {
                        modalInstance.close();
                    };
                    var url = "https://jira.systimmune.net/rest/api/2/search?jql=project=LIMS+AND+(fixVersion+in+unreleasedVersions()+OR+fixVersion+is+EMPTY+OR+resolution=Unresolved)+AND+sprint+in+openSprints()&fields=summary,reporter,components,status&maxResults=-1";
                    $http({
                        url: url,
                        method: "GET"
                    }).then(function (resp) {
                        var issues = resp.data.issues;
                        for (var i = 0; i < issues.length; i++) {
                            var type = issues[i].fields.status.statusCategory.key;
                            $scope.viewSprintDetail[type].push(issues[i]);
                        }
                    }, function (err) {
                        console.log("fetch issues err:", err);
                    });
                }
            });
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('app.facilities')
        .controller('FacilitiesController', FacilitiesController);
    FacilitiesController.$inject = ['$scope', 'SiHttpUtil'];

    function FacilitiesController($scope, SiHttpUtil) {
        // Fixes the angular chosen off by one error
        $scope.$watch(function () {
            return $(".chosen-select option").length;
        }, function (newvalue, oldvalue) {
            if (newvalue !== oldvalue) {
                $(".chosen-select").trigger("chosen:updated");
            }
        });
        $scope.UserHash = null;
        $scope.ActiveUserHash = null;
        $scope.ActiveUserList = null;
        SiHttpUtil.CacheUserHash().then(function (UserHash) {
            $scope.UserHash = UserHash.complete;
            $scope.ActiveUserHash = UserHash.active;
            $scope.ActiveUserList = UserHash.activeList;
        });
    }
})();
(function () {
    'use strict';
    angular
        .module('app.facilities')
        .controller('SchedulingController', SchedulingController);
        SchedulingController.$inject = ['$scope', 'SiHttpUtil', '$compile', '$localStorage', '$uibModal', 'SiUtil'];

    function SchedulingController($scope, SiHttpUtil, $compile, $localStorage, $uibModal, SiUtil) {
        // Main model
        $scope.m = {
            tableName: "reservation",
            activeTab: "CalendarTab",
            getDateTime: SiUtil.getDateTime
        };
        /* Render Tooltip */
        $scope.eventRender = function( event, element, view ) {
            element.attr({
                'uib-popover': event.project + '\n' + $scope.UserHash[event.assignedTo],
                'popover-title': event.instrument, 'popover-trigger': "'mouseenter'"});
            $compile(element)($scope);
        };
        // Sample resize and drop events
        // $scope.alertOnDrop = function(event, delta, revertFunc, jsEvent, ui, view){
        //     $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
        // };
        // $scope.alertOnResize = function(event, delta, revertFunc, jsEvent, ui, view ){
        //     $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
        // };
        $scope.m.calendar = {
            instrumentListFilter: null,
            events: [],
            refreshEvents: () => {
                const colorGroup = String($scope.m.calendar.colorGroup);
                const groups = {};
                const query = { instrumentId: $scope.m.calendar.instrumentListFilter };
                SiHttpUtil.SearchByColumn($scope.m.tableName, query).then(resp => {
                    $scope.m.instrumentGroups.map((group, index) => groups[group] = index);
                    const me = SiHttpUtil.GetUserId();
                    const events = resp.map((event, index) => {
                        let color;
                        const colorArray = SiHttpUtil.GraphColors();
                        switch (colorGroup) {
                            case "Project":
                                color = colorArray[event.projectId % colorArray.length];
                                break;
                            case "My Reservations":
                                color = event.assignedTo == me ? '#00a65a' : '#9289ca';
                                break;
                            case "Equipment Group":
                                color = colorArray[groups[event.instrumentGroup] % colorArray.length];
                                break;
                            case "Department":
                                const hash = SiUtil.hashCode(event.department);
                                color = colorArray[Math.abs(hash) % colorArray.length];
                                break;
                            default:
                                color = '#00a65a';
                        }
                        return {
                            title: event.instrument + ' - ' + $scope.UserHash[event.assignedTo],
                            id: event.id,
                            instrument: event.instrument,
                            start: new Date(event.startDate),
                            end: new Date(event.endDate),
                            allDay: event.allDay,
                            color: color,
                            assignedTo: event.assignedTo,
                            project: event.project,
                            projectId: event.projectId,
                            instrumentId: event.instrumentId,
                            createdBy: event.createdBy
                        }
                    });
                    $scope.m.calendar.events = events;
                })
            },
            filter: {},
            filterUpdate: () => {
                const instrumentList = [];
                for (const instrument in $scope.m.calendar.filter) {
                    if (instrument && $scope.m.calendar.filter[instrument]) {
                        instrumentList.push(instrument);
                    }
                }
                $scope.m.calendar.instrumentListFilter= instrumentList.length ? instrumentList : null;
                $localStorage.calendarFilter = $scope.m.calendar.instrumentListFilter;
                $scope.m.calendar.refreshEvents();
            },
            resetFilter: () => {
                for (const instrument in $scope.m.calendar.filter) {
                    $scope.m.calendar.filter[instrument] = false;
                }
            },
            groupUpdate: () => {
                $localStorage.calendarColors = $scope.m.calendar.colorGroup;
                $scope.m.calendar.refreshEvents();
            },
            addEvent: () => {
                $scope.m.CreateForm.open();
            },
            editEvent: (event, element, view) => {
                $scope.m.editForm.open(event);
            }
        }
        $scope.m.calendar.options = {
            header: {
                left: 'month,agendaWeek,listWeek addEvent',
                center: 'title'
            },
            eventClick: $scope.m.calendar.editEvent,
            // TODO: Add event drop then open modal with new date/time
            // eventDrop: $scope.alertOnDrop,
            // eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender,
            editable: false,
            // timeZone: 'local',
            businessHours: { start: '07:30', end: '18:00' },
            customButtons: {
                addEvent: {
                    text: 'Add Event',
                    click: $scope.m.calendar.addEvent
                }
            },
            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives'
        }


        $scope.m.scheduler = {
            filter: () => {
                $scope.m.scheduler.filteredInstruments = $scope.m.instruments.filter(
                    instrument => instrument.group == $scope.m.CreateForm.data.group
                )
                $scope.m.scheduler.options.resources = $scope.m.scheduler.filteredInstruments.map(instrument => {
                    return {
                        id: instrument.id,
                        title: instrument.name
                    }
                });
                const query = {
                    instrumentId: {
                        $or: $scope.m.scheduler.options.resources.map(inst => inst.id)
                    }
                };
                SiHttpUtil.SearchByColumn('reservation', query).then(resp => {
                    $scope.m.scheduler.events = resp.map(event => {
                        return {
                            title: event.instrument + ' - ' + $scope.UserHash[event.assignedTo],
                            resourceId: event.instrumentId,
                            start: new Date(event.startDate),
                            end: new Date(event.endDate),
                            allDay: event.allDay
                        }
                    })
                })
            },
            events: [],
            eventDrop: (event) => {
                $scope.m.CreateForm.data.instrumentId = parseInt(event.resourceId);
                $scope.m.CreateForm.data.startDate.dt = new Date(event.start);
                $scope.m.CreateForm.data.endDate.dt = new Date(event.end);
                SiUtil.initTime($scope.m.CreateForm.data.startTime, event.start);
                SiUtil.initTime($scope.m.CreateForm.data.endTime, event.end);
                $scope.$digest();
            },
            click: (start, end, event, view, resource) => {
                if (!resource) {
                    resource = {
                        id: $scope.m.CreateForm.data.instrumentId || $scope.m.scheduler.options.resources[0].id
                    }
                }
                const currEvent = {
                    resourceId: parseInt(resource.id),
                    start: new Date(start),
                    end: new Date(end),
                    title: $scope.UserHash[SiHttpUtil.GetUserId()],
                    allDay: false
                }
                // $scope.m.scheduler.events.push(currEvent);
                $scope.m.CreateForm.data.currEvent = currEvent;
                $scope.m.CreateForm.data.instrumentId = parseInt(resource.id);
                $scope.m.CreateForm.data.startDate.dt = new Date(start);
                $scope.m.CreateForm.data.endDate.dt = new Date(end);
                SiUtil.initTime($scope.m.CreateForm.data.startTime, start);
                SiUtil.initTime($scope.m.CreateForm.data.endTime, end);
                // $scope.m.scheduler.options.selectable = false;
                $scope.$digest();
            }
        }
        $scope.m.scheduler.options = {
            resources: [],
            header: {
                left: 'timelineDay,timelineWeek,agendaDay,month',
                center: 'title'
            },
            defaultView: 'timelineDay',
            schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
            select: $scope.m.scheduler.click,
            eventRender: null,
            eventClick: null,
            selectable: true,
            aspectRatio: 4.5,
            nowIndicator: true,
            scrollTime: new Date().getHours() + ":00:00",
            eventResize: $scope.m.scheduler.eventDrop,
            eventDrop: $scope.m.scheduler.eventDrop,
            // eventRender: $scope.eventRender,
            timezone: 'local',
            editable: false,
            // now: true,
            businessHours: { start: '10:00', end: '15:00' }
        }
        $scope.m.editForm = {
            data: {},
            ui: {},
            open: event => {
                SiHttpUtil.FetchIdNameMapping("project").then(resp => {
                    $scope.m.ProjectDisplayData = SiHttpUtil.GetDependencyDisplayItemList(resp);
                });
                const modalInstance = $uibModal.open({
                    animation: true,
                    scope: $scope,
                    templateUrl: 'edit.html',
                    size: 'lg',
                    controller: function ($scope) {
                        $scope.m.close = function () {
                            modalInstance.close();
                        };
                    }
                });
                $scope.m.editForm.data = angular.copy(event);
                $scope.m.editForm.data.startDate = {
                    dt: new Date(event.start)
                };
                $scope.m.editForm.data.endDate = {
                    dt: new Date(event.end)
                };
                $scope.m.editForm.data.startTime = {};
                $scope.m.editForm.data.endTime = {};
                SiUtil.initTime($scope.m.editForm.data.startTime, event.start);
                SiUtil.initTime($scope.m.editForm.data.endTime, event.end);
                $scope.m.editForm.data.me = $scope.m.editForm.data.assignedTo == SiHttpUtil.GetUserId() || $scope.m.editForm.data.createdBy == SiHttpUtil.GetUserId();
            },
            Delete: () => {
                SiHttpUtil.DeleteDataEntry($scope.m.tableName, $scope.m.editForm.data.id).then(() => {
                    $scope.m.calendar.refreshEvents();
                    $scope.m.close();
                })
            },
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.editForm);
            },
            SubmitTab: () => {
                $scope.m.editForm.submitted = true;
                if (!$scope.m.editForm.ui.validate.$valid) {
                    console.error($scope.m.editForm.ui.validate);
                    return;
                }
                $scope.m.editForm.data.startDate.dt.setHours(
                    SiUtil.get24Time($scope.m.editForm.data.startTime.hours, $scope.m.editForm.data.startTime.type)
                );
                $scope.m.CreateForm.data.endDate.dt.setHours(
                    SiUtil.get24Time($scope.m.editForm.data.endTime.hours, $scope.m.editForm.data.endTime.type)
                );
                $scope.m.editForm.data.startDate.dt.setMinutes($scope.m.editForm.data.startTime.minutes);
                $scope.m.editForm.data.endDate.dt.setMinutes($scope.m.editForm.data.endTime.minutes);
                const newEntry = {
                    tableName: $scope.m.tableName,
                    id: $scope.m.editForm.data.id,
                    projectId: $scope.m.editForm.data.projectId,
                    startDate: $scope.m.editForm.data.startDate.dt,
                    endDate: $scope.m.editForm.data.endDate.dt,
                    instrumentId: $scope.m.editForm.data.instrumentId,
                    allDay: $scope.m.editForm.data.allDay,
                    assignedTo: $scope.m.editForm.data.assignedTo
                }
                SiHttpUtil.UpdateDataEntry(newEntry)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.editForm.ResetTab();
                            $scope.m.calendar.refreshEvents();
                            $scope.m.close();
                        }
                    });
            }
        }

        $scope.m.CreateForm = {
            data: {},
            ui: {},
            open: () => {
                SiHttpUtil.FetchIdNameMapping("project").then(resp => {
                    $scope.m.ProjectDisplayData = SiHttpUtil.GetDependencyDisplayItemList(resp);
                });
                const modalInstance = $uibModal.open({
                    animation: true,
                    scope: $scope,
                    templateUrl: 'add.html',
                    size: 'lg',
                    windowClass: 'exl',
                    controller: function ($scope) {
                        $scope.m.close = function () {
                            modalInstance.close();
                            $scope.m.CreateForm.ResetTab();
                        };
                    }
                });
                modalInstance.result.then(function () {
                    $scope.m.CreateForm.ResetTab();
                }, function () {
                    $scope.m.CreateForm.ResetTab();
                });
                $scope.m.CreateForm.data.startTime = {};
                SiUtil.initTime($scope.m.CreateForm.data.startTime);
                $scope.m.CreateForm.data.endTime = {};
                SiUtil.initTime($scope.m.CreateForm.data.endTime);
                $scope.m.CreateForm.data.assignedTo = SiHttpUtil.GetUserId();
            },
            // octetRecommend: () => {
            //     let instrument;
            //     if ($scope.m.CreateForm.data.numPoints > 64 || $scope.m.CreateForm.data.runTime > 120) {
            //         instrument = "Octet 384";
            //     } else {
            //         instrument = "Octet 96";
            //     }
            //     instrument = $scope.m.scheduler.filteredInstruments.filter(i => i.name == instrument);
            //     $scope.m.CreateForm.data.instrumentId = instrument[0].id;
            // },
            onChange: () => {
                $scope.m.scheduler.options.events[$scope.m.scheduler.options.events.length - 1] = {
                    resourceId: $scope.m.CreateForm.data.instrumentId,
                    start: new Date($scope.m.CreateForm.data.startDate.dt),
                    end: new Date($scope.m.CreateForm.data.endDate.dt),
                    title: $scope.UserHash[SiHttpUtil.GetUserId()],
                    allDay: $scope.m.CreateForm.data.allDay
                }
            },
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                $scope.m.dp.initDp('CreateForm', 'startDate', true);
                $scope.m.dp.initDp('CreateForm', 'endDate', true);
                $scope.m.scheduler.options.selectable = true;
                // $scope.m.activeTab = "ViewAllTab";
            },
            SubmitTab: () => {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                $scope.m.CreateForm.data.startDate.dt.setHours(
                    SiUtil.get24Time($scope.m.CreateForm.data.startTime.hours, $scope.m.CreateForm.data.startTime.type)
                );
                $scope.m.CreateForm.data.endDate.dt.setHours(
                    SiUtil.get24Time($scope.m.CreateForm.data.endTime.hours, $scope.m.CreateForm.data.endTime.type)
                );
                $scope.m.CreateForm.data.startDate.dt.setMinutes($scope.m.CreateForm.data.startTime.minutes);
                $scope.m.CreateForm.data.endDate.dt.setMinutes($scope.m.CreateForm.data.endTime.minutes);
                const newEntry = {
                    tableName: $scope.m.tableName,
                    projectId: $scope.m.CreateForm.data.projectId,
                    startDate: $scope.m.CreateForm.data.startDate.dt,
                    endDate: $scope.m.CreateForm.data.endDate.dt,
                    instrumentId: $scope.m.CreateForm.data.instrumentId,
                    allDay: $scope.m.CreateForm.data.allDay,
                    assignedTo: $scope.m.CreateForm.data.assignedTo
                }
                SiHttpUtil.CreateTableEntry(newEntry)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.CreateForm.ResetTab();
                            $scope.m.close();
                            $scope.m.calendar.refreshEvents();
                        }
                    });
            }
        }
        $scope.m.ValidateCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.CreateForm.ui.validate,
                $scope.m.CreateForm.submitted, FieldName, Type);
        $scope.m.ValidateEditInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.editForm.ui.validate,
                $scope.m.editForm.submitted, FieldName, Type);

        // Check local storage for user preferences
        if (angular.isDefined($localStorage.calendarFilter)) {
            $scope.m.calendar.instrumentListFilter = $localStorage.calendarFilter;
            if ($scope.m.calendar.instrumentListFilter) {
                for (let i = 0; i < $scope.m.calendar.instrumentListFilter.length; i++) {
                    $scope.m.calendar.filter[$scope.m.calendar.instrumentListFilter[i]] = true;
                }
            }
        }
        if (angular.isDefined($localStorage.calendarColors)) {
            $scope.m.calendar.colorGroup = $localStorage.calendarColors;
        } else {
            // Default grouping
            $scope.m.calendar.colorGroup = "My Reservations";
        }

        SiHttpUtil.FetchTableEntries("instrument").then(resp => {
            $scope.m.instruments = resp.records;
            const enums = angular.fromJson(resp.enums);
            $scope.m.instrumentGroups = enums.ENUM_instrumentGroup;
            $scope.m.calendar.refreshEvents();
        });

        $scope.m.dp = SiUtil.dp.bind($scope.m)();
        $scope.m.dp.initDp('CreateForm', 'startDate', true);
        $scope.m.dp.initDp('CreateForm', 'endDate', true);
    }
})();

//TimePerProject Parent Controller
(function () {
    'use strict';
    angular
        .module('app.TimePerProject')
        .controller('TPPcontroller', TPPcontroller);
        TPPcontroller.$inject = ['$scope', '$state', 'Global', 'SiHttpUtil'];

    function TPPcontroller($scope, $state, Global, SiHttpUtil) {
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
                $state.go("app.TimePerProject." + $scope.tableState.currentTable)
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

//Time Per Project Controller (FTE)
(function () {
    'use strict';
    angular
        .module('app.TimePerProject')
        .controller('TimeProjectController', TimeProjectController);

        TimeProjectController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$http', 'Global', '$stateParams', '$timeout', '$filter'];

    function TimeProjectController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $http, Global, $stateParams, $timeout, $filter) {
        // Main model.
        $scope.global = Global;
        $scope.m = {
            tableName: "TimePerProject",
            activeTab: "ViewAllTab",
            dtColumns: [],
            tableData: null,
            TimeListToAdd: []
        };

        $scope.op = $stateParams.op;
        $scope.id = $stateParams.id;


        $scope.m.BulkCreateForm = {
            data: {
                timeToAdd: []
            },
            ui: {},
            submitted: false,
            projectCheck: false,
            validated: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.BulkCreateForm);
                $scope.m.BulkCreateForm.data = {};
                $scope.m.BulkCreateForm.data.timeToAdd = [];
            },
            addEntry: function () {
                $scope.m.BulkCreateForm.data.timeToAdd.push({});
            },
            removeEntry: function (index) {
                $scope.m.BulkCreateForm.data.timeToAdd.splice(index, 1);
            },
            copyData: function (column) {
                var len = $scope.m.BulkCreateForm.data.timeToAdd.length;
                var entry = $scope.m.BulkCreateForm.data.timeToAdd[0][column];
                for (var i = 0; i < len; i++) {
                    $scope.m.BulkCreateForm.data.timeToAdd[i][column] = entry;
                }
            },
            SubmitTab: function () {
                $scope.m.BulkCreateForm.submitted = true;
                if (!$scope.m.BulkCreateForm.ui.validate.$valid) {
                    console.error($scope.m.BulkCreateForm.ui.validate);
                    return;
                }

                var newEntries = [];
                for (var i = 0; i < $scope.m.BulkCreateForm.data.timeToAdd.length; i++) {
                    const temp = {};
                    console.log($scope.m.BulkCreateForm.data.timeToAdd[i].projectId);
                    temp.TimeCat = $scope.m.BulkCreateForm.data.timeToAdd[i].TimeCat;
                    temp.ProjectID = $scope.m.BulkCreateForm.data.timeToAdd[i].projectId;
                    temp.PayPeriodID = $scope.m.BulkCreateForm.data.timeToAdd[i].PayPeriodId.id;
                    temp.TimeSpent = $scope.m.BulkCreateForm.data.timeToAdd[i].TimeSpent;
                    temp.PercentTime = $scope.m.BulkCreateForm.data.timeToAdd[i].TimeSpent + "%";
                    temp.Notes = $scope.m.BulkCreateForm.data.timeToAdd[i].Notes;
                    if( temp.TimeCat == 2 ){
                        temp.ProjectID = null;
                    }

                    newEntries.push(temp);
                }

                console.log(newEntries);

                //This loop finds every set of payperiods and adds up the total % for each
                // Maybe here have a check to see if the existing entries don't already include that payperiod?
                var temp = [];
                var tempMap = new Map();
                for( var a of newEntries ){
                    if( !tempMap.has(a.PayPeriodID)) {
                        tempMap.set(a.PayPeriodID, true);
                        temp.push( {
                            PayPeriodID: a.PayPeriodID,
                            TimeSpent: a.TimeSpent
                        });
                    } else {
                        for( var j of temp ) {
                            if( a.PayPeriodID == j.PayPeriodID ){
                                j.TimeSpent = j.TimeSpent + a.TimeSpent;
                            };
                        };
                    };
                };

                //Need to confirm that each project has a project ID
                    //If time spent is project and the project ID is undefined
                    //
                for( var a of newEntries ){
                    if( typeof a.ProjectID === 'undefined' ){
                        console.log("project " + $scope.m.BulkCreateForm.validated);
                        $scope.m.BulkCreateForm.projectCheck = false;
                        SiHttpUtil.NotifyErr("error", "Must select Project ID");
                        break;
                    } else
                        $scope.m.BulkCreateForm.projectCheck = true;
                }

                //This loop checks existing entries in the database for records of this payperiod
                //This loop checks that each payperiod being submitted has the value of time spent equal to 100%
                //If it doesnt it breaks the loop and does not submit the data
                if( $scope.m.BulkCreateForm.projectCheck ){
                    for( var i of $scope.m.tableData ){
                        //console.log("valid " + $scope.m.BulkCreateForm.validated);
                        for( var valid of temp ){
                           /* if( i.PayPeriodID === valid.PayPeriodID){
                                $scope.m.BulkCreateForm.validated = false;
                                SiHttpUtil.NotifyErr("error", "One or more of the selected Pay Periods already exists");
                                break;
                            } else */
                            if( valid.TimeSpent !== 100 ) {
                                $scope.m.BulkCreateForm.validated = false;
                                SiHttpUtil.NotifyErr("error", "One or more of the selected Pay Periods does not add up to 100%");
                                break;
                            } else {
                                $scope.m.BulkCreateForm.validated = true;
                            };
                        };
                    };
                    if( $scope.m.tableData.length === 0 ){
                        for( var valid of temp ){
                            if( valid.TimeSpent !== 100 ) {
                                $scope.m.BulkCreateForm.validated = false;
                                SiHttpUtil.NotifyErr("error", "One or more of the selected Pay Periods does not add up to 100%")
                                break;
                            } else {
                                $scope.m.BulkCreateForm.validated = true;
                            };
                        };
                    }
                }

                //for( var valid of temp ){
                //    if( valid.TimeSpent !== 100 ) {
                //        $scope.m.BulkCreateForm.validated = false;
                //        SiHttpUtil.NotifyErr("error", "One or more of the selected Pay Periods does not add up to 100%")
                //        break;
                //    } else {
                //        $scope.m.BulkCreateForm.validated = true;
                //    };
                //};
                console.log( $scope.m.BulkCreateForm.validated );

                if( $scope.m.BulkCreateForm.validated ){
                    var toCreate = {
                        tableName: "TimePerProject",
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
            }
        };

        $scope.m.ValidateBulkCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.BulkCreateForm.ui.validate,
                $scope.m.BulkCreateForm.submitted, FieldName, Type);

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.loadAll());
                } else {
                    $scope.m.loadAll();
                }
            }
        };

        SiHttpUtil.InitRowClick($scope);

        //$scope.m.dtColumns = [];

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.FetchTableEntries($scope.m.tableName).then(function (resp) {
                return new Promise(function (resolve, reject) {
                    //$scope.m.tableData = resp.records;
                    //console.log( $scope.m.tableData);
                    $scope.m.tableData = resp.records.filter( function(e) {
                        return e.createdBy == SiHttpUtil.GetUserId();
                    });
                    if (resp.enums) {
                        var enumList = JSON.parse(resp.enums);
                    }
                    debugger;
                    if ($scope.m.tableData) {
                        if ($scope.m.tableData.length > 0) {
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
                                //need to add a column for Payperiod Enddate in addition to the name^^
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'TimeCat'))
                                    .renderWith(
                                        SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.TimeSpentCategoriesDisplayData.Hash)
                                    )
                                    .withOption('type', 'natural')
                                    .withOption('defaultContent', ''),
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'TimeSpent'))
                                    .notVisible(),
                                //DTColumnDefBuilder
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                    .notVisible(),
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                    .notVisible(),
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
                                }).withOption('order', [['0', 'desc']]);
                        } else {
                            resolve($scope.m.tableData);
                        }
                    } else {
                        resolve($scope.m.tableData);
                    }
                })
            });
        }

        $scope.m.loadAll = function() {
            $scope.m.dp = SiUtil.dp.bind($scope.m)();

            var LoadTimeSpentCategoriesList = SiHttpUtil.FetchIdNameMapping('TimeSpentCategories').then(function (resp) {
                $scope.m.TimeSpentCategoriesList = resp;
                $scope.m.TimeSpentCategoriesDisplayData = SiHttpUtil.GetDependencyList($scope.m.TimeSpentCategoriesList);
                $scope.m.TimeSpentCategoriesListReady = true;
            });
            var LoadProjectList = SiHttpUtil.FetchIdNameMapping('project').then(function (resp) {
                $scope.m.ProjectList = [];
                var projList = []
                projList.push("SI-1");
                projList.push("SI-2");
                projList.push("SI-3");
                projList.push("SI-4");
                projList.push("SI-32");
                projList.push("SI-35");
                projList.push("SI-38");
                projList.push("SI-39");
                projList.push("SI-41");
                projList.push("SI-48");
                projList.push("SI-49");
                projList.push("SI-60");
                projList.push("SI-61");
                projList.push("SI-64");
                projList.push("SI-69");
                projList.push("SI-71");
                projList.push("SI-75");
                projList.push("SI-76");
                projList.push("SI-77");
                projList.push("SI-78");
                projList.push("SI-84");

                for(var i = 0; i < resp.length; i++) {
                    for(var j = 0; j < projList.length; j++) {
                        if(resp[i].name == projList[j]){
                            $scope.m.ProjectList.push(resp[i])
                        }
                    }
                }

                $scope.m.ProjectDisplayData = SiHttpUtil.GetDependencyList($scope.m.ProjectList);
                $scope.m.ProjectListReady = true;
            });

            var LoadPayPeriodsList = SiHttpUtil.FetchIdNameMapping('PayPeriods').then(function (resp) {
                $scope.m.PayPeriodsList = resp;
                $scope.m.PayPeriodsDisplayData = SiHttpUtil.GetDependencyList($scope.m.PayPeriodsList);
                var payPeriodIDList = [];
                var payPeriods1 = Object.values($scope.m.PayPeriodsDisplayData.ListHash);
                for (var i = 0; i < payPeriods1.length; i++) {
                    payPeriodIDList.push(payPeriods1[i]['id']);
                }
                $scope.m.payPeriodIDs1 = payPeriodIDList;
                $scope.m.PayPeriodsListReady = true;
            })

            var LoadCompletedList = SiHttpUtil.FetchTableEntries('TimePerProject').then(function (resp) {
                $scope.m.CompletedList = resp.records;
                const userid = SiHttpUtil.GetUserId();
                $scope.m.CompletedListDisplayData = SiHttpUtil.GetDependencyList($scope.m.CompletedList);
                var completedList = [];
                var payPeriods2 = Object.values($scope.m.CompletedListDisplayData.ListHash);
                for (var i = 0; i < payPeriods2.length; i++) {
                    if(payPeriods2[i]['createdBy'] === userid){
                        completedList.push(payPeriods2[i]['PayPeriodID']);
                    }
                }
                $scope.m.payPeriodIDs2 = completedList;
                $scope.m.CompletedListReady = true;
            })

            Promise.all([LoadTimeSpentCategoriesList,LoadProjectList,LoadPayPeriodsList, LoadCompletedList]).then((values) => {
                const ds1=$scope.m.PayPeriodsList;
                const ds2=$scope.m.payPeriodIDs2;
                let startPayId = 0;
                if(SiHttpUtil.GetUserId() === 78){
                    startPayId = 31;
                }
                if(SiHttpUtil.GetUserId() === 79){
                    startPayId = 34;
                }
                if(SiHttpUtil.GetUserId() === 80){
                    startPayId = 35;
                }
                if(SiHttpUtil.GetUserId() === 81){
                    startPayId = 37;
                }
                if(SiHttpUtil.GetUserId() === 82){
                    startPayId = 39;
                }
                if(SiHttpUtil.GetUserId() === 75){
                    startPayId = 25;
                }
                if(SiHttpUtil.GetUserId() === 76){
                    startPayId = 26;
                }
                const startPay = ds1.findIndex(i => i.id >= startPayId);
                ds1.splice(0,startPay);
                ds2.forEach(item => {
                    const index = ds1.findIndex(i => i.id === item)
                    if (index >= 0){
                        ds1.splice(index, 1)
                    }
                })
                $scope.m.showList = ds1;
                $scope.m.LoadDataList();


            });
            /*var deps = []; // Dependencies.
            deps.push(LoadTimeSpentCategoriesList);
            deps.push(LoadProjectList);
            deps.push(LoadCompletedList);
            Promise.all(deps).then(values => {
                $scope.m.LoadDataList();
            });*/
        }
        $scope.m.loadAll();
    }
})();

//Inventory Controller
(function () {
    'use strict';
    angular
        .module('app.Inventory')
        .controller('InventoryController', InventoryController);

    InventoryController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
        'DTColumnDefBuilder', 'SiUtil', '$http', 'Global', '$stateParams', '$timeout', '$filter'];

    function InventoryController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $http, Global, $stateParams, $timeout, $filter) {
        // Main model.
        $scope.global = Global;
        $scope.m = {
            tableName: "ProcurifyCSV",
            activeTab: "ViewAllTab",
            dtColumns: [],
            tableData: null,
            TimeListToAdd: []
        };
        $scope.op = $stateParams.op;
        $scope.id = $stateParams.id;

        $scope.m.ProcurifyCSV = {
            DtInstCallback: inst => {
                $scope.m.ProcurifyCSV.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            //Different tabs associated with Procurify - Main table & Upload
            initData: () => {
                SiHttpUtil.FetchTableEntries('ProcurifyCSV').then(resp => {
                    debugger;
                    $scope.m.ProcurifyCSV.tableData = resp.records;
                    if ($scope.m.ProcurifyCSV.tableData && $scope.m.ProcurifyCSV.tableData.length > 0) {
                        if ($scope.m.ProcurifyCSV.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.ProcurifyCSV.dtColumns, $scope.m.ProcurifyCSV.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('ProcurifyCSV', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('ProcurifyCSV', colName)
                            );
                        }
                        $scope.m.ProcurifyCSV.dtColDefs = [

                        ];
                        $scope.m.ProcurifyCSV.dtOptions = SiHttpUtil.initDtOptions($scope.m.ProcurifyCSV.dtColumns, $scope.m.ProcurifyCSV.tableData, $scope.m.ProcurifyCSV.rowCallback,
                            function () {
                                $scope.m.ProcurifyCSV.dataReady = true;
                                resolve($scope.m.ProcurifyCSV.tableData);
                            }).withOption('order', [['0', 'desc']]);
                    }
                });
            },
            RefreshData: () => {
                if ($scope.m.DtInstCallback) {
                    if ($scope.m.ProcurifyCSV.DtInst) {
                        $scope.m.activeTab = "ProcurifyCSV";
                        $scope.m.ProcurifyCSV.DtInst.changeData($scope.m.ProcurifyCSV.initData());
                        $scope.m.dataReady = true;
                        $scope.$digest();
                    } else {
                        $scope.m.activeTab = "ProcurifyCSV";
                        $scope.m.initData().then(function () {
                            $scope.m.dataReady = true;
                            $scope.$digest();
                        });
                    }
                }
            },
            viewForm: {
                CancelTab: () => {
                    $scope.m.activeTab = "ProcurifyCSV";
                    $scope.m.ProcurifyCSV.viewForm.show = false;
                    $scope.m.ProcurifyCSV.RefreshData();

                }
            },
            ui: {},
            submitted: false,

            upload: () => {
                $scope.m.activeTab = "ProcurifyStatementsImportTab";
                $scope.m.ProcurifyCSV.viewForm.show = true;
            }
        }//end of Procurify Table

        $scope.m.BulkCreateForm = {
            data: {
                timeToAdd: []
            },
            ui: {},
            submitted: false,
            projectCheck: false,
            validated: false,
            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.BulkCreateForm);
                $scope.m.BulkCreateForm.data = {};
                $scope.m.BulkCreateForm.data.timeToAdd = [];
            },
            addEntry: function () {
                $scope.m.BulkCreateForm.data.timeToAdd.push({});
            },
            removeEntry: function (index) {
                $scope.m.BulkCreateForm.data.timeToAdd.splice(index, 1);
            },
            copyData: function (column) {
                var len = $scope.m.BulkCreateForm.data.timeToAdd.length;
                var entry = $scope.m.BulkCreateForm.data.timeToAdd[0][column];
                for (var i = 0; i < len; i++) {
                    $scope.m.BulkCreateForm.data.timeToAdd[i][column] = entry;
                }
            },
            SubmitTab: function () {
                $scope.m.BulkCreateForm.submitted = true;
                if (!$scope.m.BulkCreateForm.ui.validate.$valid) {
                    console.error($scope.m.BulkCreateForm.ui.validate);
                    return;
                }

                var newEntries = [];
                for (var i = 0; i < $scope.m.BulkCreateForm.data.timeToAdd.length; i++) {
                    const temp = {};
                    console.log($scope.m.BulkCreateForm.data.timeToAdd[i].projectId);
                    temp.TimeCat = $scope.m.BulkCreateForm.data.timeToAdd[i].TimeCat;
                    temp.ProjectID = $scope.m.BulkCreateForm.data.timeToAdd[i].projectId;
                    temp.PayPeriodID = $scope.m.BulkCreateForm.data.timeToAdd[i].PayPeriodId.id;
                    temp.TimeSpent = $scope.m.BulkCreateForm.data.timeToAdd[i].TimeSpent;
                    temp.PercentTime = $scope.m.BulkCreateForm.data.timeToAdd[i].TimeSpent + "%";
                    temp.Notes = $scope.m.BulkCreateForm.data.timeToAdd[i].Notes;
                    if( temp.TimeCat == 2 ){
                        temp.ProjectID = null;
                    }

                    newEntries.push(temp);
                }

                console.log(newEntries);

                console.log( $scope.m.BulkCreateForm.validated );

                if( $scope.m.BulkCreateForm.validated ){
                    var toCreate = {
                        tableName: "TimePerProject",
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
            }
        };

        $scope.m.ValidateBulkCreateInput =
            (FieldName, Type) => SiHttpUtil.ValidateInput($scope.m.BulkCreateForm.ui.validate,
                $scope.m.BulkCreateForm.submitted, FieldName, Type);

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.loadAll());
                } else {
                    $scope.m.loadAll();
                }
            }
        };

        SiHttpUtil.InitRowClick($scope);

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.FetchTableEntries($scope.m.tableName).then(function (resp) {
                return new Promise(function (resolve, reject) {
                    //$scope.m.tableData = resp.records;
                    //console.log( $scope.m.tableData);
                    $scope.m.tableData = resp.records.filter( function(e) {
                        return e.createdBy == SiHttpUtil.GetUserId();
                    });
                    if (resp.enums) {
                        var enumList = JSON.parse(resp.enums);
                    }
                    if ($scope.m.tableData) {
                        if ($scope.m.tableData.length > 0) {
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
                                //need to add a column for Payperiod Enddate in addition to the name^^
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'TimeCat'))
                                    .renderWith(
                                        SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.m.TimeSpentCategoriesDisplayData.Hash)
                                    )
                                    .withOption('type', 'natural')
                                    .withOption('defaultContent', ''),
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'TimeSpent'))
                                    .notVisible(),
                                //DTColumnDefBuilder
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                    .notVisible(),
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                    .notVisible(),
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
                                }).withOption('order', [['0', 'desc']]);
                        } else {
                            resolve($scope.m.tableData);
                        }
                    } else {
                        resolve($scope.m.tableData);
                    }
                })
            });
        }

        $scope.m.loadAll = function() {
            $scope.m.dp = SiUtil.dp.bind($scope.m)();

            var LoadTimeSpentCategoriesList = SiHttpUtil.FetchIdNameMapping('TimeSpentCategories').then(function (resp) {
                $scope.m.TimeSpentCategoriesList = resp;
                $scope.m.TimeSpentCategoriesDisplayData = SiHttpUtil.GetDependencyList($scope.m.TimeSpentCategoriesList);
                $scope.m.TimeSpentCategoriesListReady = true;
            });
            var LoadProjectList = SiHttpUtil.FetchIdNameMapping('project').then(function (resp) {
                $scope.m.ProjectList = [];
                var projList = []
                projList.push("SI-1");


                for(var i = 0; i < resp.length; i++) {
                    for(var j = 0; j < projList.length; j++) {
                        if(resp[i].name == projList[j]){
                            $scope.m.ProjectList.push(resp[i])
                        }
                    }
                }

                $scope.m.ProjectDisplayData = SiHttpUtil.GetDependencyList($scope.m.ProjectList);
                $scope.m.ProjectListReady = true;
            });

            var LoadProcurifyList = SiHttpUtil.FetchTableEntries('ProcurifyCSV').then(function (resp) {
                $scope.m.ProcurifyCSV = resp.records;
                debugger;
                $scope.m.ProcurifyDisplayData = SiHttpUtil.GetDependencyList($scope.m.ProcurifyCSV);
                var ProcurifyList = [];
                for (var i = 0; i < $scope.m.ProcurifyCSV.length; i++) {
                    if($scope.m.ProcurifyCSV[i]['shipToContact'] === 'Anne-Marie Rousseau'){
                        ProcurifyList.push($scope.m.ProcurifyCSV[i]);
                    }
                }
                $scope.m.Procurify = ProcurifyList;

                $scope.m.CompletedListReady = true;
            })

            var LoadCompletedList = SiHttpUtil.FetchTableEntries('TimePerProject').then(function (resp) {
                $scope.m.CompletedList = resp.records;
                const userid = SiHttpUtil.GetUserId();
                $scope.m.CompletedListDisplayData = SiHttpUtil.GetDependencyList($scope.m.CompletedList);
                var completedList = [];
                var payPeriods2 = Object.values($scope.m.CompletedListDisplayData.ListHash);
                for (var i = 0; i < payPeriods2.length; i++) {
                    if(payPeriods2[i]['createdBy'] === userid){
                        completedList.push(payPeriods2[i]['PayPeriodID']);
                    }
                }
                $scope.m.payPeriodIDs2 = completedList;
                $scope.m.CompletedListReady = true;
            })

            Promise.all([LoadTimeSpentCategoriesList,LoadProjectList,LoadProcurifyList, LoadCompletedList]).then((values) => {
                const ds1=$scope.m.PayPeriodsList;
                const ds2=$scope.m.payPeriodIDs2;
                let startPayId = 0;
                if(SiHttpUtil.GetUserId() === 78){
                    startPayId = 31;
                }
                const startPay = ds1.findIndex(i => i.id >= startPayId);
                ds1.splice(0,startPay);
                ds2.forEach(item => {
                    const index = ds1.findIndex(i => i.id === item)
                    if (index >= 0){
                        ds1.splice(index, 1)
                    }
                })
                $scope.m.showList = ds1;
                $scope.m.LoadDataList();


            });
        }
        $scope.m.loadAll();
    }
})();

(function () {
    'use strict';
    angular
        .module('app.tools')
        .controller('HumanizationController', HumanizationController);
        HumanizationController.$inject = ['$scope', 'SiHttpUtil'];

    function HumanizationController($scope, SiHttpUtil) {
    }
})();
(function () {
    'use strict';
    angular
        .module('app.tools')
        .controller('SequenceUtilsController', SequenceUtilsController);
        SequenceUtilsController.$inject = ['$scope', 'SiHttpUtil', '$http', 'Global'];

    function SequenceUtilsController($scope, SiHttpUtil, $http, Global) {
        $scope.m = {
            activeTab: "TrypsinFrags"
        }

        $scope.m.TrypsinFrags = {
            data: {},
            ui: {},
            dataReady: false,
            init: ()=> {
                SiHttpUtil.FetchIdNameMapping('protein').then(function (resp) {
                    $scope.m.ProteinDisplayData = SiHttpUtil.GetDependencyDisplayItemList(resp);
                });
            },
            SubmitTab: type => {
                $scope.m.TrypsinFrags.data.miss = 0;
                let options;
                if (type === "manual") {
                    options = {
                        method: "POST",
                        url: Global.gateway + '/seqUtils/getTrypsinFrags',
                        json: true,
                        data: {
                            sequence: $scope.m.TrypsinFrags.data.sequence,
                            miss: $scope.m.TrypsinFrags.data.miss
                        }
                    }
                } else {
                    options = {
                        method: "GET",
                        url: Global.gateway + '/seqUtils/getTrypsinFrags/' + $scope.m.TrypsinFrags.data.proteinId
                    }
                }
                $http(options).then(resp => {
                    $scope.m.TrypsinFrags.dataReady = true;
                    const seq = new Sequence(resp.data.sequence);
                    seq.render("#result", {
                        'charsPerLine': 100,
                        'search': true,
                        'badge': false,
                        'title': 'Fragments'
                    });
                    const coverage = [];
                    const colors = SiHttpUtil.GraphColors();
                    if (resp.data.fragments) {
                        for (let i = 0; i < resp.data.fragments.length; i++) {
                            const curr = resp.data.fragments[i];
                            coverage.push({
                                start: curr.start,
                                end: curr.end,
                                color: curr.count > 1 ? ['black', 'darkgray'][i % 2] : colors[i % (colors.length - 1)],
                                underscore: curr.count > 1,
                                tooltip: curr.count
                            });
                        }
                    }
                    seq.coverage(coverage);
                }, err => {
                    SiHttpUtil.NotifyOperationErr('Error: ' + err)
                })
            }
        }

        $scope.m.TrypsinFrags.init();
    }
})();

(function () {
    'use strict';
    angular
        .module('app.tools')
        .controller('InstrumentDataController', InstrumentDataController);
        InstrumentDataController.$inject = ['$scope', 'SiHttpUtil', 'SiUtil', 'DTColumnDefBuilder'];

    function InstrumentDataController($scope, SiHttpUtil, SiUtil, DTColumnDefBuilder) {
        $scope.m = {
            getDateTime: SiUtil.getDateTime
        };
        $scope.m.ViCell = {
            DtInstCallback: inst => {
                $scope.m.ViCell.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            initData: () => {
                SiHttpUtil.FetchTableEntries('viCellData').then(resp => {
                    $scope.m.ViCell.tableData = resp.records;
                    if ($scope.m.ViCell.tableData && $scope.m.ViCell.tableData.length > 0) {
                        if ($scope.m.ViCell.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.ViCell.dtColumns, $scope.m.ViCell.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('viCell', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('viCell', colName)
                            );
                        }
                        $scope.m.ViCell.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.ViCell.dtColumns, 'runDate'))
                                .renderWith(
                                    SiUtil.ColDisplayers.DateTimeDisplayer
                                ),
                        ];
                        $scope.m.ViCell.dtOptions = SiHttpUtil.initDtOptions($scope.m.ViCell.dtColumns, $scope.m.ViCell.tableData, $scope.m.ViCell.rowCallback,
                            function () {
                                $scope.m.ViCell.dataReady = true;
                                resolve($scope.m.ViCell.tableData);
                            }).withOption('order', [['0', 'desc']]);
                    }
                });
            },
            viewForm: {
                data: {},
                CancelTab: () => {
                    $scope.m.activeTab = "ViCellData";
                    $scope.m.ViCell.viewForm.show = false;
                }
            },
            viewDetail: () => {
                if ($scope.m.ViCell.currentRowData) {
                    SiHttpUtil.FetchOneEntry('viCellData', $scope.m.ViCell.currentRowData.id).then(resp => {
                        $scope.m.ViCell.viewForm.data = angular.copy(resp);
                    })
                    $scope.m.ViCell.viewForm.show = true;
                    $scope.m.activeTab = "ViCellDetailTab";
                }
            }
        }
        $scope.m.Akta = {
            DtInstCallback: inst => {
                $scope.m.Akta.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            initData: () => {
                SiHttpUtil.FetchTableEntries('aktaData').then(resp => {
                    $scope.m.Akta.tableData = resp.records;
                    if ($scope.m.Akta.tableData && $scope.m.Akta.tableData.length > 0) {
                        if ($scope.m.Akta.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.Akta.dtColumns, $scope.m.Akta.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('akta', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('akta', colName)
                            );
                        }
                        $scope.m.Akta.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.Akta.dtColumns, 'RunStartDate'))
                                .renderWith(
                                    SiUtil.ColDisplayers.DateTimeDisplayer
                                ),
                        ];
                        $scope.m.Akta.dtOptions = SiHttpUtil.initDtOptions($scope.m.Akta.dtColumns, $scope.m.Akta.tableData, $scope.m.Akta.rowCallback,
                            function () {
                                $scope.m.Akta.dataReady = true;
                                resolve($scope.m.Akta.tableData);
                            }).withOption('order', [['0', 'desc']]);
                    }
                });
            },
            // viewForm: {
            //     data: {},
            //     CancelTab: () => {
            //         $scope.m.activeTab = "ViCellData";
            //         $scope.m.Akta.viewForm.show = false;
            //     }
            // },
            // viewDetail: () => {
            //     if ($scope.m.Akta.currentRowData) {
            //         SiHttpUtil.FetchOneEntry('viCellData', $scope.m.Akta.currentRowData.id).then(resp => {
            //             $scope.m.Akta.viewForm.data = angular.copy(resp);
            //         })
            //         $scope.m.Akta.viewForm.show = true;
            //         $scope.m.activeTab = "ViCellDetailTab";
            //     }
            // }
        }
        $scope.m.Nanodrop = {
            DtInstCallback: inst => {
                $scope.m.Nanodrop.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            initData: () => {
                SiHttpUtil.FetchTableEntries('nanodropData').then(resp => {
                    $scope.m.Nanodrop.tableData = resp.records;
                    if ($scope.m.Nanodrop.tableData && $scope.m.Nanodrop.tableData.length > 0) {
                        if ($scope.m.Nanodrop.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.Nanodrop.dtColumns, $scope.m.Nanodrop.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('nanodrop', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('nanodrop', colName)
                            );
                        }
                        $scope.m.Nanodrop.dtColDefs = [

                        ];
                        $scope.m.Nanodrop.dtOptions = SiHttpUtil.initDtOptions($scope.m.Nanodrop.dtColumns, $scope.m.Nanodrop.tableData, $scope.m.Nanodrop.rowCallback,
                            function () {
                                $scope.m.Nanodrop.dataReady = true;
                                resolve($scope.m.Nanodrop.tableData);
                            }).withOption('order', []);
                    }
                });
            },
            viewForm: {
                data: {},
                CancelTab: () => {
                    $scope.m.activeTab = "NanodropData";
                    $scope.m.Nanodrop.viewForm.show = false;
                }
            },
            viewDetail: () => {
                if ($scope.m.Nanodrop.currentRowData) {
                    SiHttpUtil.FetchOneEntry('nanodropData', $scope.m.Nanodrop.currentRowData.id).then(resp => {
                        $scope.m.Nanodrop.viewForm.data = angular.copy(resp);
                        $scope.m.Nanodrop.viewForm.equipmentSerial = $scope.m.Nanodrop.currentRowData.equipmentSerial;
                        $scope.m.Nanodrop.viewForm.id = $scope.m.Nanodrop.currentRowData.id;
                        $scope.m.Nanodrop.viewForm.experimentName = $scope.m.Nanodrop.currentRowData.experimentName;
                        $scope.m.Nanodrop.viewForm.applicationType = $scope.m.Nanodrop.currentRowData.applicationType;
                    })
                    $scope.m.Nanodrop.viewForm.show = true;
                    $scope.m.activeTab = "NanodropDetailTab";
                }
            }
        }
        $scope.m.pH = {
            DtInstCallback: inst => {
                $scope.m.pH.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            initData: () => {
                SiHttpUtil.FetchTableEntries('pHData').then(resp => {
                    $scope.m.pH.tableData = resp.records;
                    if ($scope.m.pH.tableData && $scope.m.pH.tableData.length > 0) {
                        if ($scope.m.pH.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.pH.dtColumns, $scope.m.pH.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('pH', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('pH', colName)
                            );
                        }
                        $scope.m.pH.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.pH.dtColumns, 'PcDateTime'))
                                .renderWith(
                                SiUtil.ColDisplayers.DateTimeDisplayer
                                )
                        ];
                        $scope.m.pH.dtOptions = SiHttpUtil.initDtOptions($scope.m.pH.dtColumns, $scope.m.pH.tableData, $scope.m.pH.rowCallback,
                            function () {
                                $scope.m.pH.dataReady = true;
                                resolve($scope.m.pH.tableData);
                            }).withOption('order', []);
                    }
                });
            },
            viewForm: {
                data: {},
                CancelTab: () => {
                    $scope.m.activeTab = "pHData";
                    $scope.m.pH.viewForm.show = false;
                }
            },
            viewDetail: () => {
                if ($scope.m.pH.currentRowData) {
                    $scope.m.pH.viewForm.data = angular.copy($scope.m.pH.currentRowData);
                    $scope.m.pH.viewForm.show = true;
                    $scope.m.activeTab = "pHDetailTab";
                }
            }
        }
        $scope.m.Osmo = {
            DtInstCallback: inst => {
                $scope.m.Osmo.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            initData: () => {
                SiHttpUtil.FetchTableEntries('osmoData').then(resp => {
                    $scope.m.Osmo.tableData = resp.records;
                    if ($scope.m.Osmo.tableData && $scope.m.Osmo.tableData.length > 0) {
                        if ($scope.m.Osmo.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.Osmo.dtColumns, $scope.m.Osmo.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('osmo', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('osmo', colName)
                            );
                        }
                        $scope.m.Osmo.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.Osmo.dtColumns, 'date'))
                                .renderWith(
                                SiUtil.ColDisplayers.DateTimeDisplayer
                                )
                        ];
                        $scope.m.Osmo.dtOptions = SiHttpUtil.initDtOptions($scope.m.Osmo.dtColumns, $scope.m.Osmo.tableData, $scope.m.Osmo.rowCallback,
                            function () {
                                $scope.m.Osmo.dataReady = true;
                                resolve($scope.m.Osmo.tableData);
                            }).withOption('order', []);
                    }
                });
            },
            viewForm: {
                data: {},
                CancelTab: () => {
                    $scope.m.activeTab = "osmoData";
                    $scope.m.Osmo.viewForm.show = false;
                }
            },
            viewDetail: () => {
                if ($scope.m.Osmo.currentRowData) {
                    $scope.m.Osmo.viewForm.data = angular.copy($scope.m.Osmo.currentRowData);
                    $scope.m.Osmo.viewForm.show = true;
                    $scope.m.activeTab = "OsmoDetailTab";
                }
            }
        }
        $scope.m.ViCell.initData();
        SiHttpUtil.InitRowClick($scope, 'ViCell');
        SiHttpUtil.InitRowClick($scope, 'Akta');
        SiHttpUtil.InitRowClick($scope, 'Nanodrop');
        SiHttpUtil.InitRowClick($scope, 'pH');
        SiHttpUtil.InitRowClick($scope, 'Osmo');
    }
})();
(function () {
    'use strict';
    angular
        .module('app.facilities')
        .controller('FreezerController', FreezerController);
    FreezerController.$inject = ['$scope', 'SiHttpUtil', 'DTOptionsBuilder', 'DTColumnBuilder',
    'DTColumnDefBuilder', 'SiUtil', '$http', 'Global', '$stateParams', '$timeout'];

    function FreezerController($scope, SiHttpUtil, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiUtil, $http, Global, $stateParams, $timeout) {
        $scope.global = Global;
        $scope.m = {
            tableName: "FreezerProLog",
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

        $scope.m.dtColumns = [];

        $scope.m.LoadDataList = function () {
            return SiHttpUtil.FetchTableEntries($scope.m.tableName).then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp.records;
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
                            }).withOption('order', [[SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'Date'), 'desc']]);
                    } else {
                        resolve($scope.m.tableData);
                    }
                });
            });
        }



        var deps = []; // Dependencies.;
        Promise.all(deps).then(values => {
            $scope.m.LoadDataList();
        });
        $scope.m.LoadDataList();

        $scope.m.Import = {
            data: {
                lotsToAdd: []
            },
            ui: {},
            submitted: false,

            ResetTab: function () {
                SiHttpUtil.ResetForm($scope.m.Import);
                $scope.m.Import.data.lotsToAdd = [];
            },
            dpOpen: function ($event, input) {
                $event.preventDefault();
                $event.stopPropagation();
                input.opened = !(input.opened);
            },
            addEntry: function () {
                $scope.m.Import.data.lotsToAdd.push({});
                //console.log("addEntry: " + $scope.m.BulkLotCreate.data.lotsToAdd)
            },
            removeEntry: function (index) {
                $scope.m.Import.data.lotsToAdd.splice(index, 1);
            },

            parseCSV: function () {
                //console.log("do i get here");
                var formData = new FormData;
                formData.append('file', document.getElementById('file').files[0]);
                SiHttpUtil.POSTRequest(SiHttpUtil.helperAPIUrl + "parseFeezerProAuditLog/", formData).then(function (resp) {
                    SiHttpUtil.NotifyOk("Please review data changes");
                    var curr;
                    for( let i = 0; i < resp.length; i++ ){
                        const curr = resp[i];
                        $scope.m.Import.data.lotsToAdd.push({
                            User: curr.User,
                            Date: curr.Date,
                            Time: curr.Time,
                            Object: curr.Object,
                            ArchiveRecord: curr.ArchiveRecord,
                            Comment: curr.Comment
                        });
                        console.log($scope.m.Import.data.lotsToAdd)
                    }
                    $scope.m.Import.SubmitTab();
                    $scope.m.ShowImportBtn = false;
                    console.log("Parse: Does it get here?");
                }, function (err) {
                    SiHttpUtil.NotifyOperationErr("CSV Parse Error");
                    $scope.m.ShowImportBtn = true;
                });

            },
            SubmitTab: function () {
                $scope.m.Import.submitted = true;
                if (!$scope.m.Import.ui.validate.$valid) {
                //    console.error($scope.m.BulkLotCreate.ui.validate);
                    return;
                }

                var newEntries = [];
                for (var i = 0; i < $scope.m.Import.data.lotsToAdd.length; i++) {
                    const temp = {};
                    temp.User = $scope.m.Import.data.lotsToAdd[i].User,
                    temp.Date = $scope.m.Import.data.lotsToAdd[i].Date,
                    temp.Time = $scope.m.Import.data.lotsToAdd[i].Time,
                    temp.Object = $scope.m.Import.data.lotsToAdd[i].Object,
                    temp.ArchiveRecord = $scope.m.Import.data.lotsToAdd[i].ArchiveRecord,
                    temp.Comment = $scope.m.Import.data.lotsToAdd[i].Comment

                    newEntries.push(temp);
                }

                var toCreate = {
                    tableName: "FreezerProLog",
                    list: newEntries
                }

                SiHttpUtil.CreateTableEntries(toCreate)
                    .then(function (resp) {
                        if (resp.status == 200) {
                            $scope.m.Import.ResetTab();
                            $scope.m.activeTab = "ViewAllTab";
                            $scope.m.RefreshData();
                        }
                    });

            }
        }

        $scope.m.InitHandler = () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope);
    }
})();
(function () {
    'use strict';
    angular
        .module('app.facilities')
        .controller('MapController', MapController);
    MapController.$inject = ['$scope', 'SiHttpUtil', 'SiUtil', '$uibModal', '$timeout'];

    function MapController($scope, SiHttpUtil, SiUtil, $uibModal, $timeout) {
        var top = "text";
        var layers = ["base", "elec120", "elec240", "elec208", "fire", "lights", "data", "text"];
        $scope.m = {};
        for (var i = 0; i < layers.length; i++) {
            $scope.m[layers[i]] = true;
        }
        // TODO Refactor this
        $timeout(function() {
            for (var i = 0; i < layers.length; i++) {
                window[layers[i]] = svgPanZoom('#' + layers[i], {
                    zoomEnabled: true,
                    dblClickZoomEnabled: false,
                    minZoom: 1.25,
                    center: 1,
                    fit: 1,
                    contain: true
                });
            }
            window[top].setOnZoom(level => {
                for (var i = 0; i < layers.length - 1; i++) {
                    window[layers[i]].zoom(level)
                    window[layers[i]].pan(window[top].getPan())
                }
            });
            window[top].setOnPan(function(point){
                for (var i = 0; i < layers.length - 1; i++) {
                    window[layers[i]].pan(point)
                }
            });
        }, 1000);
    }
})();
(function () {
    'use strict';
    angular
        .module('app.facilities')
        .controller('NetworkController', NetworkController);
    NetworkController.$inject = ['$scope', 'SiHttpUtil', 'SiUtil'];

    function NetworkController($scope, SiHttpUtil, SiUtil) {
    }
})();
(function () {
    'use strict';
    angular
        .module('app.facilities')
        .controller('ElectricalController', ElectricalController);
    ElectricalController.$inject = ['$scope', 'SiHttpUtil', 'SiUtil', 'DTColumnDefBuilder', '$timeout'];

    function ElectricalController($scope, SiHttpUtil, SiUtil, DTColumnDefBuilder, $timeout) {
        $scope.m = {
            activeTab: "SummaryTab",
            hoverDetails: [],
            hoverDetailsReady: false
        };
        $scope.m.Equipment = {
            CreateForm: {
                init: () => {
                    $scope.m.activeTab = "CreateEquipment";
                    $scope.m.Equipment.CreateForm.show = true;
                },
                data: {},
                submitted: false,
                ui: {},
                CancelTab: () => {
                    $scope.m.activeTab = "EquipmentTab";
                    $scope.m.Equipment.CreateForm.show = false;
                },
                SubmitTab: () => {
                    $scope.m.Equipment.CreateForm.submitted = true;
                    if (!$scope.m.Equipment.CreateForm.ui.validate.$valid) {
                        console.error($scope.m.Equipment.CreateForm.ui.validate);
                        return;
                    }

                    SiHttpUtil.CreateTableEntry({
                        tableName: "equipment",
                        name: $scope.m.Equipment.CreateForm.data.name,
                        circuitId: $scope.m.Equipment.CreateForm.data.circuitId,
                        usage: $scope.m.Equipment.CreateForm.data.usage,
                        network: $scope.m.Equipment.CreateForm.data.network,
                        notes: $scope.m.Equipment.CreateForm.data.notes,
                    }).then(resp => {
                        if (resp.status == 200) {
                            SiHttpUtil.ResetForm($scope.m.Equipment.CreateForm);
                            $scope.m.Equipment.CreateForm.CancelTab();
                            $scope.m.Equipment.RefreshData();
                        }
                    })
                }
            },
            editForm: {
                data: {},
                ui: {},
                show: false,
                CancelTab: () => {
                    $scope.m.activeTab = "EquipmentTab";
                    $scope.m.Equipment.editForm.show = false;
                },
                Delete: () => {
                    SiHttpUtil.DeleteDataEntry('equipment', $scope.m.Equipment.editForm.id).then(resp => {
                        if (resp.status == 200) {
                            $scope.m.Equipment.editForm.CancelTab();
                            $scope.m.Equipment.RefreshData();
                        }
                    })
                },
                SubmitTab: () => {
                    $scope.m.Equipment.editForm.submitted = true;
                    if (!$scope.m.Equipment.editForm.ui.validate.$valid) {
                        console.error($scope.m.Equipment.editForm.ui.validate);
                        return;
                    }

                    SiHttpUtil.UpdateDataEntry({
                        tableName: "equipment",
                        id: $scope.m.Equipment.editForm.id,
                        name: $scope.m.Equipment.editForm.name,
                        circuitId: $scope.m.Equipment.editForm.circuitId,
                        usage: $scope.m.Equipment.editForm.usage,
                        network: $scope.m.Equipment.editForm.network,
                        notes: $scope.m.Equipment.editForm.notes,
                    }).then(resp => {
                        if (resp.status == 200) {
                            $scope.m.Equipment.editForm.CancelTab();
                            $scope.m.Equipment.RefreshData();
                        }
                    })
                }
            },
            editDetail: () => {
                if ($scope.m.Equipment.currentRowData) {
                    $scope.m.activeTab = "EditEquipment";
                    $scope.m.Equipment.editForm.show = true;
                    $scope.m.Equipment.editForm.id = $scope.m.Equipment.currentRowData.id;
                    $scope.m.Equipment.editForm.name = $scope.m.Equipment.currentRowData.name;
                    $scope.m.Equipment.editForm.circuitId = $scope.m.Equipment.currentRowData.circuitId;
                    $scope.m.Equipment.editForm.usage = $scope.m.Equipment.currentRowData.usage;
                    $scope.m.Equipment.editForm.network = $scope.m.Equipment.currentRowData.network;
                    $scope.m.Equipment.editForm.notes = $scope.m.Equipment.currentRowData.notes;
                }
            },
            dtColumns: [],
            tableData: [],
            DtInstCallback: inst => {
                $scope.m.Equipment.DtInst = inst;
            },
            RefreshData: () => {
                if ($scope.m.Equipment.DtInstCallback) {
                    if ($scope.m.Equipment.DtInst) {
                        $scope.m.Equipment.DtInst.changeData($scope.m.Equipment.LoadData());
                    } else {
                        $scope.m.Equipment.LoadData().then(() => {
                            $scope.m.Equipment.dataReady = true;
                            $scope.$digest();
                        });
                    }
                }
            },
            LoadData: () => {
                return SiHttpUtil.FetchTableEntries('equipment').then(function (resp) {
                    return new Promise(function (resolve, reject) {
                        if (resp.enums) {
                            var enumList = JSON.parse(resp.enums);
                            $scope.enums = enumList;
                        }
                        $scope.m.Equipment.tableData = resp.records;
                        if ($scope.m.Equipment.tableData && $scope.m.Equipment.tableData.length > 0) {
                            if ($scope.m.Equipment.dtColumns.length == 0) {
                                SiHttpUtil.initDtColumns($scope.m.Equipment.dtColumns, $scope.m.Equipment.tableData,
                                    (colName) => SiHttpUtil.omitColumnForTable('equipment', colName),
                                    (colName) => SiHttpUtil.dbColumnTranslator('equipment', colName));
                            }
                            $scope.m.Equipment.dtColDefs = [
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.Equipment.dtColumns, 'createdBy'))
                                    .renderWith(SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)),
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.Equipment.dtColumns, 'updatedAt'))
                                    .renderWith(SiUtil.ColDisplayers.ShortDateDisplayer),
                            ];
                            $scope.m.Equipment.dtOptions = SiHttpUtil.initDtOptions($scope.m.Equipment.dtColumns, $scope.m.Equipment.tableData, $scope.m.Equipment.rowCallback,
                                function () {
                                    resolve($scope.m.Equipment.tableData);
                                    $scope.m.Equipment.dataReady = true;
                                    if ($scope.op == "view" && $scope.id) {
                                        var records = $scope.m.Equipment.tableData;
                                        for (var i = 0; i < records.length; i++) {
                                            if (records[i].id == $scope.id) {
                                                $scope.m.Equipment.currentRowData = records[i];
                                                break;
                                            }
                                        }
                                        $scope.m.viewDetail();
                                    }
                                }).withColReorderOrder([0, 1, 2, 7, 8, 3, 4, 5, 6]);
                        }
                    });
                });
            }
        };

        $scope.m.Circuit = {
            CreateForm: {
                init: () => {
                    $scope.m.activeTab = "CreateCircuit";
                    $scope.m.Circuit.CreateForm.show = true;
                },
                data: {},
                submitted: false,
                ui: {},
                CancelTab: () => {
                    $scope.m.activeTab = "CircuitTab";
                    $scope.m.Circuit.CreateForm.show = false;
                },
                SubmitTab: () => {
                    $scope.m.Circuit.CreateForm.submitted = true;
                    if (!$scope.m.Circuit.CreateForm.ui.validate.$valid) {
                        console.error($scope.m.Circuit.CreateForm.ui.validate);
                        return;
                    }

                    SiHttpUtil.CreateTableEntry({
                        tableName: "circuit",
                        name: $scope.m.Circuit.CreateForm.data.name,
                        location: $scope.m.Circuit.CreateForm.data.location,
                        voltage: $scope.m.Circuit.CreateForm.data.voltage,
                        capacity: $scope.m.Circuit.CreateForm.data.capacity,
                        notes: $scope.m.Circuit.CreateForm.data.notes,
                    }).then(resp => {
                        if (resp.status == 200) {
                            SiHttpUtil.ResetForm($scope.m.Circuit.CreateForm);
                            $scope.m.Circuit.CreateForm.CancelTab();
                            $scope.m.Circuit.RefreshData();
                        }
                    })
                }
            },
            editForm: {
                data: {},
                ui: {},
                show: false,
                CancelTab: () => {
                    $scope.m.activeTab = "CircuitTab";
                    $scope.m.Circuit.editForm.show = false;
                },
                Delete: () => {
                    SiHttpUtil.DeleteDataEntry('circuit', $scope.m.Circuit.editForm.id).then(resp => {
                        if (resp.status == 200) {
                            $scope.m.Circuit.editForm.CancelTab();
                            $scope.m.Circuit.RefreshData();
                        }
                    })
                },
                SubmitTab: () => {
                    $scope.m.Circuit.editForm.submitted = true;
                    if (!$scope.m.Circuit.editForm.ui.validate.$valid) {
                        console.error($scope.m.Circuit.editForm.ui.validate);
                        return;
                    }

                    SiHttpUtil.UpdateDataEntry({
                        tableName: "circuit",
                        id: $scope.m.Circuit.editForm.id,
                        name: $scope.m.Circuit.editForm.name,
                        location: $scope.m.Circuit.editForm.location,
                        voltage: $scope.m.Circuit.editForm.voltage,
                        capacity: $scope.m.Circuit.editForm.capacity,
                        notes: $scope.m.Circuit.editForm.notes,
                    }).then(resp => {
                        if (resp.status == 200) {
                            $scope.m.Circuit.editForm.CancelTab();
                            $scope.m.Circuit.RefreshData();
                        }
                    })
                }
            },
            editDetail: () => {
                if ($scope.m.Circuit.currentRowData) {
                    $scope.m.activeTab = "EditCircuit";
                    $scope.m.Circuit.editForm.show = true;
                    $scope.m.Circuit.editForm.id = $scope.m.Circuit.currentRowData.id;
                    $scope.m.Circuit.editForm.name = $scope.m.Circuit.currentRowData.name;
                    $scope.m.Circuit.editForm.location = $scope.m.Circuit.currentRowData.location;
                    $scope.m.Circuit.editForm.voltage = $scope.m.Circuit.currentRowData.voltage;
                    $scope.m.Circuit.editForm.capacity = $scope.m.Circuit.currentRowData.capacity;
                    $scope.m.Circuit.editForm.notes = $scope.m.Circuit.currentRowData.notes;
                }
            },
            dtColumns: [],
            tableData: [],
            DtInstCallback: inst => {
                $scope.m.Circuit.DtInst = inst;
            },
            RefreshData: () => {
                if ($scope.m.Circuit.DtInstCallback) {
                    if ($scope.m.Circuit.DtInst) {
                        $scope.m.Circuit.DtInst.changeData($scope.m.Circuit.LoadData());
                    } else {
                        $scope.m.Circuit.LoadData().then(() => {
                            $scope.m.Circuit.dataReady = true;
                            $scope.$digest();
                        });
                    }
                }
            },
            LoadData: () => {
                return SiHttpUtil.FetchTableEntries('circuit').then(function (resp) {
                    return new Promise(function (resolve, reject) {
                        if (resp.enums) {
                            var enumList = JSON.parse(resp.enums);
                            $scope.enums = enumList;
                        }
                        $scope.m.Circuit.tableData = resp.records;
                        if ($scope.m.Circuit.tableData && $scope.m.Circuit.tableData.length > 0) {
                            if ($scope.m.Circuit.dtColumns.length == 0) {
                                SiHttpUtil.initDtColumns($scope.m.Circuit.dtColumns, $scope.m.Circuit.tableData,
                                    (colName) => SiHttpUtil.omitColumnForTable('circuit', colName),
                                    (colName) => SiHttpUtil.dbColumnTranslator('circuit', colName));
                            }
                            $scope.m.Circuit.dtColDefs = [
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.Circuit.dtColumns, 'createdBy'))
                                    .renderWith(SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)),
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.Circuit.dtColumns, 'updatedAt'))
                                    .renderWith(SiUtil.ColDisplayers.ShortDateDisplayer),
                            ];
                            $scope.m.Circuit.dtOptions = SiHttpUtil.initDtOptions($scope.m.Circuit.dtColumns, $scope.m.Circuit.tableData, $scope.m.Circuit.rowCallback,
                                function () {
                                    resolve($scope.m.Circuit.tableData);
                                    $scope.m.Circuit.dataReady = true;
                                    if ($scope.op == "view" && $scope.id) {
                                        var records = $scope.m.Circuit.tableData;
                                        for (var i = 0; i < records.length; i++) {
                                            if (records[i].id == $scope.id) {
                                                $scope.m.Circuit.currentRowData = records[i];
                                                break;
                                            }
                                        }
                                        $scope.m.viewDetail();
                                    }
                                });
                        }
                    });
                });
            }
        };

        $scope.m.Equipment.LoadData();
        $scope.m.Circuit.LoadData();
        SiHttpUtil.InitRowClick($scope, 'Equipment');
        SiHttpUtil.InitRowClick($scope, 'Circuit');

        $scope.m.CircuitHover = function(name) {
            $scope.m.hoverDetails.ready = false;
            $scope.m.hoverDetails = [];
            SiHttpUtil.SearchByColumn('circuit', { name: name }).then(resp => {
                if (resp.length > 0) {
                    for (var i = 0; i < resp.length; i++) {
                        $scope.m.hoverDetails.push(resp[i]);
                    }
                    $scope.m.hoverDetailsReady = true;
                } else {
                    $scope.m.hoverDetailsReady = false;
                }
            });
        };

        $timeout(function() {
            svgPanZoom('#electrical', {
                zoomEnabled: true,
                dblClickZoomEnabled: false,
                disableMouseEventsDefault: false,
                minZoom: 1.25,
                center: true,
                fit: true,
                contain: true
            });
        }, 1500);
    }
})();
// FACILITIES controllers
// Instruments
(function () {
    'use strict';
    angular
        .module('app.facilities')
        .controller('InstrumentController', InstrumentController);

    InstrumentController.$inject = ['$scope', 'SiHttpUtil', 'DTColumnDefBuilder', 'SiUtil', '$stateParams'];

    function InstrumentController($scope, SiHttpUtil, DTColumnDefBuilder, SiUtil, $stateParams) {
        // Main model.
        $scope.m = {
            tableData: null,
            dtColumns: [],
            tableName: "instrument",
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
            //InitFileHandler: () => SiHttpUtil.InitJqueryImportCSVChangeHandler($scope, 'file'),
        };

        $scope.m.viewForm = SiHttpUtil.InitViewForm($scope.m);

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
                    name: $scope.m.editForm.data.name,
                    notes: $scope.m.editForm.data.notes,
                    group: $scope.m.editForm.data.group,
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
        $scope.m.CreateForm = {
            data: {},
            ui: {},
            submitted: false,
            ResetTab: function (createAnother) {
                SiHttpUtil.ResetForm($scope.m.CreateForm);
                if (!createAnother) {
                    $scope.m.activeTab = "ViewAllTab";
                }
            },
            SubmitTab: function () {
                $scope.m.CreateForm.submitted = true;
                if (!$scope.m.CreateForm.ui.validate.$valid) {
                    console.error($scope.m.CreateForm.ui.validate);
                    return;
                }
                const toCreate = {
                    tableName: $scope.m.tableName,
                    name: $scope.m.CreateForm.data.name,
                    notes: $scope.m.CreateForm.data.notes,
                    group: $scope.m.CreateForm.data.group,
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
                        $scope.instrumentGroups = enumList.ENUM_instrumentGroup;
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
                $scope.m.viewForm.data = angular.copy($scope.m.currentRowData);
                $scope.m.viewForm.data.createdAt = SiUtil.getDateOnly($scope.m.currentRowData.createdAt);
                $scope.m.viewForm.data.updatedAt = SiUtil.getDateOnly($scope.m.currentRowData.updatedAt);
                $scope.m.viewForm.show = true;
                $scope.m.activeTab = "DetailTab";
            }
        };

        $scope.m.editDetail = function () {
            if ($scope.m.currentRowData) {
                $scope.m.editForm.data = angular.copy($scope.m.currentRowData);
                $scope.m.editForm.show = true;
                $scope.m.activeTab = "EditTab";
            }
        };

        $scope.m.dp = SiUtil.dp.bind($scope.m)();
        $scope.m.LoadDataList();
    }
})();
(function () {
    'use strict';
    angular
        .module('app.project')
        .controller('ProjectsController', ProjectsController);
    ProjectsController.$inject = ['$scope', '$http', 'Global', 'Notify', '$stateParams', 'SiHttpUtil', 'SiUtil', '$state'];

    function ProjectsController($scope, $http, Global, Notify, $stateParams, SiHttpUtil, SiUtil, $state) {
        $scope.tableState = {};
        $scope.projectList = [];
        $scope.tableState.currentTable = "active";
        console.log("table:", $scope.tableState.currentTable);
        $scope.getFormattedStatus = SiUtil.getFormattedStatus;
        $scope.switchProjectTable = function () {
            console.log("table:", $scope.tableState.currentTable);
            if ($scope.tableState.currentTable == 'active') {
                $state.go("app.project")
            }
            else if ($scope.tableState.currentTable) {
                $state.go("app.project." + $scope.tableState.currentTable)
            }
        };
        $scope.tableName = "projects";
        // Dirty hack to workaround Angular/Chosen <select> off by 1 bug.
        // See: https://github.com/leocaseiro/angular-chosen/issues/8
        $scope.$watch(function () {
            return $(".chosen-select option").length;
        }, function (newvalue, oldvalue) {
            if (newvalue !== oldvalue) {
                $(".chosen-select").trigger("chosen:updated");
            }
        });

        $scope.loadAll = function () {
            $scope.UserHash = null;
            var CacheUsers = SiHttpUtil.CacheUserHash().then(function (UserHash) {
                $scope.UserHash = UserHash.complete;
                $scope.ActiveUserHash = UserHash.active;
                $scope.ActiveUserList = UserHash.activeList;
            });
            var deps = []; // Dependencies.
            deps.push(CacheUsers);
            Promise.all(deps).then(values => {
                var query = { active: true };
                SiHttpUtil.SearchByColumn('project', query).then(resp => {
                    $scope.projectList = resp;
                })
            });
        };
        $scope.loadAll();

    }
})();
(function () {
    'use strict';
    angular
        .module('app.project')
        .controller('ProjectTableController', ProjectTableController);
            ProjectTableController.$inject = ['$scope', '$state', '$stateParams', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder', 'SiHttpUtil', 'SiUtil'];
        function ProjectTableController($scope, $state, $stateParams, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder, SiHttpUtil, SiUtil) {
            $scope.tableState = {
                currentTable: "projects"
            };
            $scope.m = {
                tableData: [],
                dtColumns: [],
                activeTab: "ViewAllTab"
            };

            $scope.m.editForm = {
                data: {
                    usersToRemove: []
                },
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
                        tableName: "project",
                        id: $scope.m.editForm.id,
                        description: $scope.m.editForm.description,
                        targets: $scope.m.editForm.targets,
                        goals: $scope.m.editForm.goals,
                        platforms: $scope.m.editForm.platforms ? angular.toJson($scope.m.editForm.platforms) : null,
                        usersToRemove: $scope.m.editForm.data.usersToRemove,
                        references: angular.toJson($scope.m.editForm.RefLinkList.data),
                        properties: $scope.m.editForm.sharePointGroup,
                        stages: $scope.m.editForm.stages,
                        status: $scope.m.editForm.status,
                        updatedAt: $scope.m.editForm.updatedAt
                    }).then(resp => {
                        if (resp.status == 200) {
                            $scope.m.editForm.CancelTab();
                            $scope.m.RefreshData();
                            $scope.m.editForm.data.usersToRemove = [];
                            SiHttpUtil.ResetStateParams();
                        }
                    });
                },
                addLeader: () => {
                    var entry = {};
                    $scope.m.editForm.stages.push(entry);
                },
                removeLeader: index => {
                    var currEntry = $scope.m.editForm.stages[index];
                    if (currEntry.old) {
                        $scope.m.editForm.data.usersToRemove.push(currEntry.userId);
                    }
                    $scope.m.editForm.stages.splice(index, 1);
                }
            };
            $scope.m.CreateForm = {
                data: {},
                ui: {},
                submitted: false,
                ResetTab: function () {
                    SiHttpUtil.ResetTab($scope.m, $scope.m.CreateForm);
                },
                SubmitTab: function () {
                    $scope.m.CreateForm.submitted = true;
                    if (!$scope.m.CreateForm.ui.validate.$valid) {
                        console.error($scope.m.CreateForm.ui.validate);
                        return;
                    }
                    var toCreate = {
                        tableName: "project",
                        description: $scope.m.CreateForm.data.description,
                        targets: $scope.m.CreateForm.data.targets,
                        goals: $scope.m.CreateForm.data.goals,
                        platforms: $scope.m.CreateForm.data.platforms ? angular.toJson($scope.m.CreateForm.data.platforms) : null,
                        stages: $scope.m.CreateForm.data.stages,
                        status: $scope.m.CreateForm.data.status,
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
                        $scope.m.DtInst.changeData($scope.m.refreshProjects());
                    } else {
                        $scope.m.refreshProjects().then(function () {
                            $scope.m.dataReady = true;
                            $scope.$digest();
                        });
                    }
                }
            };

            SiHttpUtil.InitRowClick($scope);

            $scope.m.refreshProjects = function () {
                return SiHttpUtil.FetchTableEntries('project').then(function (response) {
                    return new Promise(function (resolve, reject) {
                        $scope.m.tableData = response.records;
                        $scope.enums = JSON.parse(response.enums);
                        $scope.sections = $scope.enums.ENUM_sectionName;
                        $scope.statuses = $scope.enums.ENUM_status;
                        $scope.platforms = $scope.enums.ENUM_platform;
                        $scope.stages = $scope.enums.ENUM_stage;

                        if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                            if ($scope.m.dtColumns.length == 0) {
                                SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                    (colName) => SiHttpUtil.omitColumnForTable('project', colName),
                                    (colName) => SiHttpUtil.dbColumnTranslator('project', colName));
                            }
                            $scope.m.dtColDefs = [

                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'description'))
                                    .renderWith(
                                    SiUtil.ColDisplayers.DescriptionDisplayer
                                    ),
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'projectLeaderId'))
                                    .renderWith(
                                    SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)
                                    ),
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'status'))
                                    .renderWith(
                                    SiUtil.ColDisplayers.StatusDisplayer
                                    ),
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'platforms'))
                                    .renderWith(
                                    SiUtil.ColDisplayers.ListDisplayer
                                    ),
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'createdBy'))
                                    .notVisible(),
                                DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                    .renderWith( //CreatedAt.
                                    SiUtil.ColDisplayers.ShortDateDisplayer
                                    )
                            ];
                            $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                                function () {
                                    resolve($scope.m.tableData);
                                    $scope.m.projectsReady = true;
                                    if ($stateParams.op == "edit" && $stateParams.id) {
                                        for (var i = 0; i < $scope.m.tableData.length; i++) {
                                            if ($scope.m.tableData[i].id == $stateParams.id) {
                                                $scope.m.currentRowData = $scope.m.tableData[i];
                                                break;
                                            }
                                        }
                                        $scope.editProject();
                                    }
                                }
                            ).withColReorderOrder([0, 1, 2, 3, 7, 8, 4, 5, 6]);
                        }
                    });
                });
            };
            $scope.editProject = function () {
                if ($scope.m.currentRowData) {
                    $scope.m.editForm.show = true;
                    $scope.m.activeTab = "EditTab";
                    $scope.m.editForm.id = $scope.m.currentRowData.id;
                    $scope.m.editForm.name = $scope.m.currentRowData.name;
                    $scope.m.editForm.description = $scope.m.currentRowData.description;
                    $scope.m.editForm.targets = $scope.m.currentRowData.targets;
                    $scope.m.editForm.goals = $scope.m.currentRowData.goals;
                    $scope.m.editForm.platforms = angular.fromJson($scope.m.currentRowData.platforms);
                    $scope.m.editForm.stages = [];
                    $scope.m.editForm.sharePointGroup = $scope.m.currentRowData.properties;
                    $scope.m.editForm.status = $scope.m.currentRowData.status;
                    $scope.m.editForm.updatedAt = $scope.m.currentRowData.updatedAt;
                    SiHttpUtil.FetchOneEntry('project', $scope.m.currentRowData.id).then(resp => {
                        for (var i = 0; i < resp.Users.length; i++) {
                            $scope.m.editForm.stages.push({
                                userId: resp.Users[i].id,
                                stage: resp.Users[i].ProjectStage.stage,
                                old: true
                            });
                        }
                    });

                    $scope.m.editForm.RefLinkList = {
                        data: JSON.parse($scope.m.currentRowData.references) || [],
                        nameList: $scope.sections
                    }
                }
            };
            $scope.m.refreshProjects();
        }
})();
(function () {
    'use strict';
    angular
        .module('app.project')
        .controller('ProjectDetailsController', ProjectDetailsController);
    ProjectDetailsController.$inject = ['$scope', '$state', '$stateParams', 'SiHttpUtil', 'SiUtil', '$http', 'DTOptionsBuilder', 'DTColumnBuilder', 'DTColumnDefBuilder'];

    function ProjectDetailsController($scope, $state, $stateParams, SiHttpUtil, SiUtil, $http, DTOptionsBuilder, DTColumnBuilder, DTColumnDefBuilder) {
        $scope.tableState.currentTable = "";
        $scope.m = {
            viewDetails: {
                id: $stateParams.id
            }
        };

        $scope.m.plasmids = {
            DtInstCallback: inst => {
                $scope.m.plasmids.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            initData: () => {
                SiHttpUtil.SearchByProject('plasmids', $scope.m.viewDetails.id)
                .then(resp => {
                    $scope.m.plasmids.tableData = resp;
                    if ($scope.m.plasmids.tableData && $scope.m.plasmids.tableData.length > 0) {
                        if ($scope.m.plasmids.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.plasmids.dtColumns, $scope.m.plasmids.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('plasmid', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('plasmid', colName)
                            );
                        }
                        $scope.m.plasmids.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.plasmids.dtColumns, 'name'))
                                .renderWith((data, type, full) => {
                                    return '<a href="#!/app/research/plasmids?op=view&id=' + full.id + '">' + data + '</a>';
                                }),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.plasmids.dtColumns, 'createdBy'))
                                .renderWith(SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)),
                        ];
                        $scope.m.plasmids.dtOptions = SiHttpUtil.initDtOptions($scope.m.plasmids.dtColumns, $scope.m.plasmids.tableData, null,
                            function () {
                                $scope.m.plasmids.dataReady = true;
                                resolve($scope.m.plasmids.tableData);
                            });
                    }
                });
            }
        };
        $scope.m.proteins = {
            DtInstCallback: inst => {
                $scope.m.proteins.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            initData: () => {
                SiHttpUtil.SearchByProject('protein', $scope.m.viewDetails.id)
                .then(resp => {
                    $scope.m.proteins.tableData = resp;
                    if ($scope.m.proteins.tableData && $scope.m.proteins.tableData.length > 0) {
                        if ($scope.m.proteins.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.proteins.dtColumns, $scope.m.proteins.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('protein', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('protein', colName));
                        }
                        $scope.m.proteins.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.proteins.dtColumns, 'name'))
                                .renderWith((data, type, full) => {
                                    return '<a href="#!/app/research/proteins?op=view&id=' + full.id + '">' + data + '</a>';
                                }),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.proteins.dtColumns, 'createdBy'))
                                .renderWith(SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)),
                        ];
                        $scope.m.proteins.dtOptions = SiHttpUtil.initDtOptions($scope.m.proteins.dtColumns, $scope.m.proteins.tableData, null,
                            function () {
                                $scope.m.proteins.dataReady = true;
                                resolve($scope.m.proteins.tableData);
                            });
                    }
                });
            }
        };
        $scope.m.ade = {
            DtInstCallback: inst => {
                $scope.m.ade.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            initData: () => {
                SiHttpUtil.SearchByProject('adeSummary', $scope.m.viewDetails.id)
                .then(resp => {
                    $scope.m.ade.tableData = resp;
                    if ($scope.m.ade.tableData && $scope.m.ade.tableData.length > 0) {
                        if ($scope.m.ade.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.ade.dtColumns, $scope.m.ade.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('adeSummary', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('adeSummary', colName));
                        }
                        $scope.m.ade.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.ade.dtColumns, 'name'))
                                .renderWith((data, type, full) => {
                                    return '<a href="#!/app/ade/activation?op=view&id=' + full.id + '">' + data + '</a>';
                                }),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.ade.dtColumns, 'date'))
                                .renderWith(SiUtil.ColDisplayers.ShortDateDisplayer),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.ade.dtColumns, 'createdBy'))
                                .renderWith(SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)),
                        ];
                        $scope.m.ade.dtOptions = SiHttpUtil.initDtOptions($scope.m.ade.dtColumns, $scope.m.ade.tableData, null,
                            function () {
                                $scope.m.ade.dataReady = true;
                                resolve($scope.m.ade.tableData);
                            }).withColReorderOrder([0, 1, 2, 6, 7, 4, 5, 3, 8, 9]);
                    }
                });
            }
        };
        $scope.m.cellLines = {
            DtInstCallback: inst => {
                $scope.m.cellLines.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            initData: () => {
                SiHttpUtil.SearchByProject('cellLineHarvest', $scope.m.viewDetails.id)
                .then(resp => {
                    $scope.m.cellLines.tableData = resp;
                    if ($scope.m.cellLines.tableData && $scope.m.cellLines.tableData.length > 0) {
                        if ($scope.m.cellLines.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.cellLines.dtColumns, $scope.m.cellLines.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('cellLineHarvest', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('cellLineHarvest', colName));
                        }
                        $scope.m.cellLines.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.cellLines.dtColumns, 'name'))
                                .notVisible(),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.cellLines.dtColumns, 'wellName'))
                                .renderWith((data, type, full) => {
                                    return '<a href="#!/app/pd/cellLineHarvest?op=view&id=' + full.id + '">' + data + '</a>';
                                }),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.cellLines.dtColumns, 'harvestDate'))
                                .renderWith(SiUtil.ColDisplayers.ShortDateDisplayer),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.cellLines.dtColumns, 'purificationDate'))
                                .renderWith(SiUtil.ColDisplayers.ShortDateDisplayer),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.cellLines.dtColumns, 'createdBy'))
                                .renderWith(SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)),
                        ];
                        $scope.m.cellLines.dtOptions = SiHttpUtil.initDtOptions($scope.m.cellLines.dtColumns, $scope.m.cellLines.tableData, null,
                            function () {
                                $scope.m.cellLines.dataReady = true;
                                resolve($scope.m.cellLines.tableData);
                            }).withColReorderOrder([0, 1, 2, 6, 7, 4, 5, 3, 8, 9]);
                    }
                });
            }
        };
        $scope.m.bioreactorExp = {
            DtInstCallback: inst => {
                $scope.m.bioreactorExp.DtInst = inst;
            },
            dtColumns: [],
            tableData: [],
            initData: () => {
                SiHttpUtil.SearchByProject('bioreactorExperiment', $scope.m.viewDetails.id)
                .then(resp => {
                    $scope.m.bioreactorExp.tableData = resp;
                    if ($scope.m.bioreactorExp.tableData && $scope.m.bioreactorExp.tableData.length > 0) {
                        if ($scope.m.bioreactorExp.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.bioreactorExp.dtColumns, $scope.m.bioreactorExp.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('bioreactorExperiment', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('bioreactorExperiment', colName)
                            );
                        }
                        $scope.m.bioreactorExp.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.bioreactorExp.dtColumns, 'name'))
                                .renderWith((data, type, full) => {
                                    return '<a href="#!/app/pd/bioreactorExperiment?op=view&id=' + full.id + '">' + data + '</a>';
                                }),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.bioreactorExp.dtColumns, 'createdBy'))
                                .renderWith(SiUtil.ColDisplayers.GetHashConvertDisplayer($scope.UserHash)),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.bioreactorExp.dtColumns, 'inoculationDate'))
                                .renderWith(SiUtil.ColDisplayers.DateTimeDisplayer),
                        ];
                        $scope.m.bioreactorExp.dtOptions = SiHttpUtil.initDtOptions($scope.m.bioreactorExp.dtColumns, $scope.m.bioreactorExp.tableData, null,
                            function () {
                                $scope.m.bioreactorExp.dataReady = true;
                                resolve($scope.m.bioreactorExp.tableData);
                            });
                    }
                });
            }
        };

        $scope.m.loadDetails = () => {
            SiHttpUtil.FetchOneEntry('project', $scope.m.viewDetails.id).then( resp => {
                $scope.projectGraphs($scope.m.viewDetails.id);
                $scope.m.viewDetails.name = resp.name;
                $scope.m.viewDetails.description = resp.description;
                $scope.m.viewDetails.Users = resp.Users;
                $scope.m.viewDetails.status = SiUtil.getFormattedStatus(resp.status);
                $scope.m.viewDetails.platforms = angular.fromJson(resp.platforms);
                $scope.m.viewDetails.targets = resp.targets;
                $scope.m.viewDetails.references = angular.fromJson(resp.references) || [];
                $scope.m.viewDetails.sharePointGroup = resp.properties;
            });
            $scope.m.plasmids.initData();
        };

        $scope.m.initProteins = () => {
            SiHttpUtil.SearchByProject('protein', $scope.m.viewDetails.id)
            .then( resp => {
                $scope.m.proteinRowData = resp.records;
            });
        }

        $scope.projectGraphs = id => {
            $http({
                url: SiHttpUtil.helperAPIUrl + "/projectgraphapi/" + id,
                method: "GET",
            }).then( resp => {
                $scope.m.viewDetails.sparklines = resp.data.projectCounts;
                $scope.dataReady = true;
            });
        };

        $scope.m.loadDetails();
    }
})();

(function () {
    'use strict';
    angular
        .module('app.dashboard')
        .controller('AdministrationController', AdministrationController);
    AdministrationController.$inject = ['$scope', '$http', 'Global', 'SiHttpUtil', 'SiUtil', 'DTColumnDefBuilder', 'DTColumnBuilder', '$uibModal', '$compile'];

    function AdministrationController($scope, $http, Global, SiHttpUtil, SiUtil, DTColumnDefBuilder, DTColumnBuilder, $uibModal, $compile) {
        // Fixes the angular chosen off by one error
        $scope.$watch(function () {
            return $(".chosen-select option").length;
        }, function (newvalue, oldvalue) {
            if (newvalue !== oldvalue) {
                $(".chosen-select").trigger("chosen:updated");
            }
        });
        $scope.global = Global;
        $scope.m = {
            tableData: [],
            dtColumns: [],
            DtInstCallback: inst => {
                $scope.m.DtInst = inst
            }
        };
        $scope.getReadableTimestamp = SiUtil.getReadableTimestamp;

        $scope.m.RefreshData = () => {
            if ($scope.m.DtInstCallback) {
                if ($scope.m.DtInst) {
                    $scope.m.DtInst.changeData($scope.m.LoadUserList());
                } else {
                    $scope.m.LoadUserList();
                }
            }
        };

        $scope.m.LoadUserList = function () {
            return $http.get($scope.global.gateway + "/getuserlist/").then(function (resp) {
                return new Promise(function (resolve, reject) {
                    $scope.m.tableData = resp.data;
                    $scope.m.UsersDisplayData = SiHttpUtil.GetDependencyList(resp.data);
                    if (resp.enums) {
                        var enumList = JSON.parse(resp.enums);
                    }
                    if ($scope.m.tableData && $scope.m.tableData.length > 0) {
                        if ($scope.m.dtColumns.length == 0) {
                            SiHttpUtil.initDtColumns($scope.m.dtColumns, $scope.m.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('user', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('user', colName),
                                (colName) => SiHttpUtil.hideColumnForTable('user', colName),
                            );
                            $scope.m.dtColumns.push(
                                DTColumnBuilder.newColumn(null).withTitle('Actions').renderWith($scope.m.actionsHtml)
                            )
                        }

                        $scope.m.dtColDefs = [
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'updatedAt'))
                                .renderWith(
                                SiUtil.ColDisplayers.DateTimeDisplayer
                                ),
                            DTColumnDefBuilder.newColumnDef(SiHttpUtil.dtColNameToIdx($scope.m.dtColumns, 'roles'))
                                .renderWith(
                                SiUtil.ColDisplayers.DescriptionDisplayer
                                ),
                        ];
                        $scope.m.dtOptions = SiHttpUtil.initDtOptions($scope.m.dtColumns, $scope.m.tableData, $scope.m.rowCallback,
                            function () {
                                resolve($scope.m.tableData);
                                $scope.m.dataReady = true;
                            }).withOption('order', [[0, 'desc']]).withDisplayLength(25).withOption('createdRow', createdRow);;
                    } else {
                        resolve($scope.m.tableData);
                    }
                });
            });
        };

        $scope.m.LoadRoleList = function () {
            $http.get($scope.global.gateway + "/getRoleList/").then(function (resp) {
                $scope.m.roleData = resp.data;
            });
            SiHttpUtil.FetchEnumList(['roles']).then(function (resp) {
                $scope.m.permissions = resp.permissions;
            })
        };

        $scope.m.UserForm = {
            data: {},
            Delete: id => {
                $http({
                    url: $scope.global.gateway + "/deleteuser/",
                    method: "POST",
                    data: { id: id }
                }).then(function (response) {
                    $scope.m.RefreshData();
                    SiHttpUtil.NotifyOk("User deleted successfully");
                }, function (error) {
                    SiHttpUtil.NotifyErr(error, "Delete User failed");
                    console.log("deleteUserPayload error:", error);
                });
            },
            Edit: id => {
                angular.copy($scope.m.UsersDisplayData.ListHash[id], $scope.m.UserForm.data);
                $scope.m.UserForm.data.tableHistoryDisplayList = [];
                const histories = $scope.m.UserForm.data.tableHistories ? angular.fromJson($scope.m.UserForm.data.tableHistories) : [];
                $scope.m.UserForm.data.tableHistoryDisplayList = histories.map(entry => {
                    return {
                        tableName: SiUtil.dbTableTranslator(entry.tableName),
                        time: SiUtil.getReadableTimestamp(entry.time)
                    }
                })
                const modalInstance = $uibModal.open({
                    animation: true,
                    scope: $scope,
                    templateUrl: 'editUser.html',
                    size: 'lg',
                    controller: function ($scope) {
                        $scope.m.UserForm.Edit.close = () => {
                            modalInstance.close();
                        }
                    }
                })
            },
            AddRole: role => {
                $http({
                    url: $scope.global.gateway + "/associateRole/",
                    method: "POST",
                    data: { id: $scope.m.UserForm.data.id, roleId: role.id, type: "add" }
                }).then(function (response) {
                    $scope.m.UserForm.data.Roles.push(role);
                    $scope.m.RefreshData();
                    SiHttpUtil.NotifyOk("Added role successfully");
                }, function (error) {
                    SiHttpUtil.NotifyErr(error, "Add role failed");
                });
            },
            RemoveRole: index => {
                var roleId = $scope.m.UserForm.data.Roles[index].id;
                $http({
                    url: $scope.global.gateway + "/associateRole/",
                    method: "POST",
                    data: { id: $scope.m.UserForm.data.id, roleId: roleId, type: "remove" }
                }).then(function (response) {
                    $scope.m.UserForm.data.Roles.splice(index, 1)
                    $scope.m.RefreshData();
                    SiHttpUtil.NotifyOk("Added role successfully");
                }, function (error) {
                    SiHttpUtil.NotifyErr(error, "Add role failed");
                });
            }
        }

        $scope.m.RoleForm = {
            data: {},
            Edit: role => {
                angular.copy(role, $scope.m.RoleForm.data);
                $scope.m.RoleForm.data.permissions = angular.fromJson($scope.m.RoleForm.data.permissions);
                var modalInstance = $uibModal.open({
                    animation: true,
                    scope: $scope,
                    templateUrl: 'editRole.html',
                    //size: 'lg',
                    controller: function ($scope) {
                        $scope.m.RoleForm.close = () => {
                            modalInstance.close();
                        }
                    }
                })
            },
            AddPerm: () => {
                let perm = $scope.m.RoleForm.data.permToAdd;
                if ($scope.m.RoleForm.data.permissions.indexOf(perm) > 0) {
                    SiHttpUtil.NotifyOperationErr("Permission already added")
                    return;
                }
                $scope.m.RoleForm.data.permissions.push(perm);
            },
            RemovePerm: index => {
                $scope.m.RoleForm.data.permissions.splice(index, 1);
            },
            Save: () => {
                var permissionsJson = angular.toJson($scope.m.RoleForm.data.permissions);
                $http({
                    url: $scope.global.gateway + "/updateRole/",
                    method: "POST",
                    data: {
                        id: $scope.m.RoleForm.data.id,
                        name: $scope.m.RoleForm.data.name,
                        permissions: permissionsJson
                     }
                }).then(function (response) {
                    $scope.m.LoadRoleList();
                    $scope.m.RoleForm.close();
                    SiHttpUtil.NotifyOk("Role updated successfully");
                }, function (error) {
                    SiHttpUtil.NotifyErr(error, "Role update failed");
                });
            },
            Delete: id => {
                $http({
                    url: $scope.global.gateway + "/deleteRole/",
                    method: "POST",
                    data: { id: id }
                }).then(function (response) {
                    $scope.m.LoadRoleList();
                    SiHttpUtil.NotifyOk("Role deleted successfully");
                }, function (error) {
                    SiHttpUtil.NotifyErr(error, "Role User failed");
                    console.log("deleteRole error:", error);
                });
            },
        }

        $scope.m.CreateRoleForm = {
            data: {
                permissions: []
            },
            Open: () => {
                var modalInstance = $uibModal.open({
                    animation: true,
                    scope: $scope,
                    templateUrl: 'createRole.html',
                    //size: 'lg',
                    controller: function ($scope) {
                        $scope.m.CreateRoleForm.close = () => {
                            modalInstance.close();
                        }
                    }
                })
            },
            AddPerm: () => {
                let perm = $scope.m.CreateRoleForm.data.permToAdd;
                if ($scope.m.CreateRoleForm.data.permissions.indexOf(perm) > 0) {
                    SiHttpUtil.NotifyOperationErr("Permission already added")
                    return;
                }
                $scope.m.CreateRoleForm.data.permissions.push(perm);
            },
            RemovePerm: index => {
                $scope.m.CreateRoleForm.data.permissions.splice(index, 1);
            },
            Save: () => {
                var permissionsJson = angular.toJson($scope.m.CreateRoleForm.data.permissions);
                $http({
                    url: $scope.global.gateway + "/createRole/",
                    method: "POST",
                    data: {
                        name: $scope.m.CreateRoleForm.data.name,
                        permissions: permissionsJson
                    }
                }).then(function (response) {
                    $scope.m.LoadRoleList();
                    $scope.m.CreateRoleForm.data = {
                        permissions: []
                    };
                    $scope.m.CreateRoleForm.close();
                    SiHttpUtil.NotifyOk("Role created successfully");
                }, function (error) {
                    SiHttpUtil.NotifyErr(error, "Create Role failed");
                    console.log("createRole error:", error);
                });
            }
        }

        function createdRow(row, data, dataIndex) {
            // Recompiling so we can bind Angular directive to the DT
            // Required for the button functions to work (ng-click)
            $compile(angular.element(row).contents())($scope);
        }

        $scope.m.actionsHtml = (data, type, full, meta) => {
            return '<button class="btn btn-sm btn-warning" ng-click="m.UserForm.Edit(' + data.id + ')">' +
                '   <i class="far fa-edit"></i>' +
                '</button>&nbsp;' +
                '<button class="btn btn-sm btn-danger" ng-click="m.UserForm.Delete(' + data.id + ')" )"="">' +
                '   <i class="fas fa-trash"></i>' +
                '</button>';
        }

        $scope.m.LoadUserList();
        $scope.m.LoadRoleList();
    }
})();

(function () {
    'use strict';
    angular
        .module('app.dashboard')
        .controller('UserController', UserController);
    UserController.$inject = ['$scope', 'Global'];

    function UserController($scope, Global) {
        $scope.global = Global;
    }
})();


(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('EnumsController', EnumsController);
    EnumsController.$inject = ['$scope', '$http', '$state', 'Global', 'Notify', 'SiUtil'];

    function EnumsController($scope, $http, $state, Global, Notify, SiUtil) {
        $scope.global = Global;
        $scope.$state = $state.current.name;
        $scope.tableTranslator = SiUtil.dbTableTranslator;
        $scope.enumData = {};
        $scope.enumOptions = {};
        $scope.enumsReady = false;
        $scope.defaultListClass = "bg-green-light";
        // Add enums here to show up on the editor
        $scope.enumList = {
            research: {
                'plasmid': {
                    'vector': 'Vectors',
                    'plasmidTag': 'Plasmid Tags',
                    'bacteria': 'Bacterias',
                    'mammalian': 'Mammalians'
                },
                'protein': {
                    'moleculeType': 'Molecule Types'
                },
                'transfectionRequest': {
                    'transfectionTag': 'Purification Tags',
                    'transfectionScale': 'Transfection Scales',
                    'transfectionType': 'Transfection Types',
                    'transfectionCellLine': 'Transfection Cell Lines',
                    'transfectionPurificationMethod': 'Purification Methods'
                },
                'proteinPurification': {
                    'proteinColumnType': 'Column Types',
                    'proteinStepType': 'Step Types',
                    'proteinSECTypes': "SEC Types"
                },
                'stableCellLine': {
                    'parentalCellLine': 'Parental Cell Lines',
                    'transfectionMethod': 'Transfection Methods',
                    'selectionMarker': 'Selection Markers',
                },
                'proteinAnalysisRequest': {
                    'method': 'Analysis Methods',
                    'secondarySECType': 'SEC Types'
                }
            },
            ade: {
                'sort': {
                    'sortMode': 'Sort Modes',
                    'population': 'Sort Populations',
                    'antigenSpecificity': 'Antigen Specificities',
                    'sorterUsed': 'Sorters'
                },
                'mixCondition': {
                    'eL4B5Lot': 'EL4-B5 Lot #',
                    'tsnLotNumber': 'TSN Lot #',
                    'fbsLot': 'FBS Lot #',
                    'plateType': 'Type of Plate'
                },
                'bCellSource': {
                    'tissue': 'Tissues',
                    'enrichmentType': 'Enrichment Types',
                    'stainType': 'Stain Types'
                },
                'supernatentPlate': {
                    'methodOfHarvest': 'Method of Harvest',
                    'reagent': 'Reagents'
                },
                'wellRescue': {
                    'pCRBlock': 'PCR Block Types'
                },
                'cloningAndSequence': {
                    'chainType': 'Chain Types'
                }
            },
            pd: {
                'cellLineExperiment': {
                    'cultureMedia': 'Culture Medias'
                },
                'cellLineHarvest': {
                    'harvestMethod': 'Harvest Methods',
                    'titerMethod': 'Titer Methods'
                      },
                'cellLinePurification': {
                    'clColumnType': "Column Types"
                },
                'cellLineAnalytic': {
                    'clAnalyticSectionName': 'Section Names'
                },
                'cellLinePackage': {
                    'packageSectionName': "Section Names"
                },
                'bioreactor': {
                    'bioreactorHarvestMethod': 'Harvest Methods',
                    "primaryRecovery": "Primary Recoveries",
                    "pointStyle": "Point Styles",
                    "lineColor": "Line Colors"
                },
                'bioreactorCondition': {
                    'vesselScale': 'Vessel Scales (L)',
                    'basalMedium': 'Basal Mediums',
                    'feedMedium': 'Feed Mediums'
                },
                'bioreactorPurification': {
                    'bioreactorPurificationSectionName': 'Section Names',
                    'columnType': "Column Types",
                    'membraneType': "Membrane Types"
                },
                'bioreactorAnalytic': {
                    'bioreactorAnalyticSectionName': 'Section Names'
                },
                'pdAnalysisRequest': {
                    'pdMethods': 'Analysis Methods'
                }

            },
            project: {
                'project': {
                    'sectionName': 'Section Names',
                    'platform': 'Platforms',
                    'stage': 'Stages',
                    'status': 'Statuses'
                }
            },
            io: {
                'task': {
                    'taskType': 'Task Type',
                    'instrument': 'Instrument'
                }
            },
            ct: {
                'cellSource': {
                    'cellVendor': 'Vendor',
                    'cellSourceType': 'Cell Source Type'
                },
                'vessel': {
                    'vesselType': 'Vessel Types'
                }
            },
            //accounting: {
            //    'projectBilling': {
            //        'BoaStatements': 'BoaStatements'
            //    }
            //},
            facilities: {
                'instrument': {
                    'instrumentGroup': 'Instrument Group'
                }
            }
        };

        $scope.addEnumValue = function (enumName) {
            $scope.enumData[enumName].push('New' + enumName);
            $scope.enumOptions['disableEdit' + enumName] = true;
            $scope.enumOptions[enumName + 'ListClass'] = $scope.defaultListClass;
        };
        $scope.sortableCallback = function (sourceModel, destModel, start, end) {
            console.log(start + ' -> ' + end);
        };
        $scope.sortableOptions = {
            placeholder: '<div class="box-placeholder p0 m0"><div></div></div>',
            forcePlaceholderSize: true
        };
        $scope.enableEditEnumValue = function (enumValue) {
            $scope.enumOptions['disableEdit' + enumValue] = false;
            $scope.enumOptions[enumValue + 'ListClass'] = "bg-grey-light";
        };
        $scope.deleteEnumValue = function ($index, enumValue) {
            // console.log("cur target: ", $event.currentTarget);
            $scope.enumData[enumValue].splice($index, 1);
        };
        $scope.saveEnumValue = function (EnumValue, tableName) {
            $scope.enumOptions['disableEdit' + EnumValue] = true;
            $scope.enumOptions[EnumValue + 'ListClass'] = $scope.defaultListClass;
            // Remove empty ones.
            var newEnumValues = [];
            $("." + EnumValue + "Item").each(function () {
                // console.log("vv:", $(this).val());
                var newValue = $(this).val();
                if (newValue) {
                    newEnumValues.push(newValue);
                } else {
                    $(this).parent().remove();
                }
            });
            var newEnumValuesJson = JSON.stringify(newEnumValues);
            // Save new vectors.
            $http({
                url: $scope.global.gateway + "/updateEnum",
                method: "POST",
                data: {
                    tableName: tableName + 's',
                    key: "ENUM_" + EnumValue,
                    value: newEnumValuesJson,
                    createKeyIfNotExist: "yes"
                }
            }).then(function (resp) {
                if (resp.data.message == "ok") {
                    Notify.alert(
                        EnumValue + ' saved successfully', { status: 'success' });
                }
            }, function (err) {
                console.log("save" + EnumValue + "err:", err);
            });

        };

        $scope.refreshEnums = function () {
            $http({
                url: $scope.global.gateway + "/getEnumForManyTable",
                method: "POST"
            }).then(function (resp) {
                var allEnums = resp.data;
                for (var section in $scope.enumList) {
                    for (var table in $scope.enumList[section]) {
                        for (var enumEntry in $scope.enumList[section][table]) {
                            $scope.enumOptions['disableEdit' + enumEntry] = true;
                            $scope.enumOptions[enumEntry + 'ListClass'] = $scope.defaultListClass;
                            $scope.enumData[enumEntry] = allEnums['ENUM_' + enumEntry] || [];
                        }
                    }
                }
                $scope.enumsReady = true;
            }, function (err) {
                console.log("err:", err);
            });
        };
        $scope.refreshEnums();
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('QueriesController', QueriesController);
    QueriesController.$inject = ['$scope', '$timeout', '$state', '$http', 'Notify', 'Global', '$filter', '$resource', 'DTOptionsBuilder', 'DTColumnBuilder', 'ngTableParams', 'PermPermissionStore', 'SiHttpUtil'];

    function QueriesController($scope, $timeout, $state, $http, Notify, Global, $filter, $resource, DTOptionsBuilder, DTColumnBuilder, ngTableParams, PermPermissionStore, SiHttpUtil) {
        $scope.global = Global;
        $scope.querylibsData = [];
        $scope.dtColumns = [];
        $scope.querylibsReady = false;
        // TODO: change to query manager
        $scope.userAllowed = PermPermissionStore.getPermissionDefinition('adminQuery');
        $scope.selected = {};
        $scope.editing = false;
        $scope.updateQuery = "Save Query";
        $scope.testQuery = {};
        $scope.userPerm = "";
        //$scope.tableState.currentResearchTable="querylibs";
        function verifyQuery(query) {
            // Unfinished.
            var q = query.trim();
            if (q.startsWith("update") || q.startsWith("delete") || q.startsWith("create") || q.startsWith("insert") || q.startsWith("drop") || q.startsWith("alter")) return false;
            else return true;
        }
        $scope.lastRowClicked = null;
        $scope.currentRowData = null;
        $scope.resetSelection = function () {
            $scope.lastRowClicked = null;
            $scope.currentRowData = null;
        };
        $scope.editorOptions = {
            lineWrapping : true,
            lineNumbers: true,
            mode: 'text/x-mariadb',
            smartIndent: true
        };
        $scope.rowClickHandler = function (data) {
            // A hack to find the row, regardless of re-ordering/sorting.
            var rowId = "queryID_" + data.id;
            var row = $("#" + rowId);
            // ww: Must find all children, otherwise class would be overriden
            // by <td> classes.
            if ($scope.lastRowClicked) {
                $scope.selected = {};
                $scope.lastRowClicked.find('*').removeClass("bg-green-light");
                // Clicked the same row, do de-selection.
                if ($scope.currentRowData && $scope.currentRowData.id == data.id) {
                    // console.log("de-selection of id:", data.id);
                    $scope.resetSelection();
                    return;
                }
            }
            $scope.selected = data;
            row.find('*').addClass("bg-green-light");
            $scope.lastRowClicked = row;
            // console.log("data for row:", data);
            $scope.bottom_info = "Selected:  Query with ID: " + data.id + " , and with name:" + data.name + "\n" + "Query :" + data.query;
            $scope.currentRowData = data;
        };
        $scope.rowCallback = function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
            $('td', nRow).unbind('click');
            $('td', nRow).bind('click', function () {
                $scope.$apply(function () {
                    $scope.rowClickHandler(aData);
                });
            });
            // ww:Hack: Mark the row with an ID.
            $('td', nRow).closest('tr').attr('id', "queryID_" + aData.id);
            return nRow;
        };
        $scope.translateQueryLibsColumnTitle = function (dbColName) {
            switch (dbColName) {
                case "name":
                    return "Query Description";
                case "group":
                    return "Allowed Groups";
            }
            return dbColName;
        };
        $scope.ifNeedOmit = function (dbColName) {
            var omitCols = [
                "id",
                "isDeleted",
                "createdAt",
                "updatedAt",
                "query"
            ];
            return omitCols.indexOf(dbColName) != -1;
        };
        $scope.refreshQueryLibs = function () {
            return new Promise(function (resolve, reject) {
                SiHttpUtil.FetchTableEntries('querylibs').then(function (response) {
                    $scope.querylibsData = [];
                    for (var i = 0; i < response.records.length; i++) {
                        if ($scope.userAllowed) {
                            $scope.querylibsData.push(response.records[i]);
                            continue;
                        }
                        var group = [];
                        if (response.records[i].group) group = response.records[i].group.split(";");
                        for (var j = 0; j < group.length - 1; j++) {
                            if ($scope.userPerm.indexOf(group[j]) != -1) {
                                $scope.querylibsData.push(response.records[i]);
                                break;
                            }
                        }
                    }
                    if ($scope.dtColumns.length == 0) {
                        if ($scope.querylibsData[0]) {
                            for (var h in $scope.querylibsData[0]) {
                                if (!$scope.ifNeedOmit(h)) {
                                    $scope.dtColumns.push(DTColumnBuilder.newColumn(h)
                                        .withTitle($scope.translateQueryLibsColumnTitle(h)));
                                }
                            }
                        }
                    }
                    $scope.dtOptions = DTOptionsBuilder.fromFnPromise(
                        new Promise(function (resolve, reject) {
                            $scope.querylibsReady = true;
                            resolve($scope.querylibsData);
                        })
                    ).withOption('rowCallback', $scope.rowCallback);
                }, function (error) {
                    console.log("querylibs get error:", error);
                });
            });
        };
        $scope.dtInst = {};
        $scope.dtInstCallback = function (inst) {
            $scope.dtInst = inst;
        };
        $scope.initLoadQuerylibs = function () {
            if ($scope.querylibsData.length > 0) {
                return;
            }
            if (PermPermissionStore.getPermissionDefinition('readResearch') ||
                PermPermissionStore.getPermissionDefinition('adminResearch')) {
                $scope.userPerm += "Research";
            }
            if (PermPermissionStore.getPermissionDefinition('readADE') ||
                PermPermissionStore.getPermissionDefinition('adminADE')) {
                $scope.userPerm += "ADE";
            }
            if (PermPermissionStore.getPermissionDefinition('readPD') ||
                PermPermissionStore.getPermissionDefinition('adminPD')) {
                $scope.userPerm += "PD";
            }
            if (PermPermissionStore.getPermissionDefinition('readProject') ||
                PermPermissionStore.getPermissionDefinition('adminProject')) {
                $scope.userPerm += "Project";
            }

            $scope.refreshQueryLibs();
        };
        $scope.testQuery = {};
        $scope.ckboxes = [{
            label: "Research",
            val: false
        }, {
            label: "ADE",
            val: false
        }, {
            label: "PD",
            val: false
        }, {
            label: "Project",
            val: false
        }]

        $scope.editQuery = function () {
            $scope.editing = true;
            $scope.testQuery.expression = $scope.selected.query;
            $scope.testQuery.name = $scope.selected.name;
            var groups = $scope.selected.group ? $scope.selected.group.split(";") : [];
            var cur = 0;
            for (var i = 0; i < $scope.ckboxes.length; i++) {
                if ($scope.ckboxes[i].label == groups[cur]) {
                    $scope.ckboxes[i].val = true;
                    cur++;
                } else {
                    $scope.ckboxes[i].val = false;
                }
            }
            $scope.updateQuery = "Update Query";
        }
        $scope.testQuery.results = [];
        $scope.testQuery.save = function () {
            if (!verifyQuery($scope.testQuery.expression)) {
                $scope.testQuery.error = "Invalid query. Only select query allowed.";
                return;
            }
            var group = "";
            for (var i = 0; i < $scope.ckboxes.length; i++) {
                if ($scope.ckboxes[i].val === true)
                    group += $scope.ckboxes[i].label + ";";
            }
            if ($scope.editing) {
                $http({
                    url: $scope.global.gateway + "/updateEntry",
                    method: "POST",
                    data: {
                        tableName: "querylibs",
                        userId: $scope.global.user.id,
                        id: $scope.selected.id,
                        name: $scope.testQuery.name,
                        query: $scope.testQuery.expression,
                        group: group
                    }
                }).then(function (resp) {
                    $scope.editing = false;
                    $scope.testQuery.error = "";
                    console.log("resp:", resp);
                    Notify.alert(
                        'Query updated successfully', { status: 'success' });
                    if ($scope.dtInst) {
                        $scope.dtInst.changeData($scope.refreshQueryLibs());
                    } else {
                        $scope.initLoadQuerylibs();
                    }
                    $scope.testQuery.expression = "";
                    $scope.testQuery.name = "";
                    $scope.updateQuery = "Save Query";
                }, function (err) {
                    $scope.testQuery.error = err.data.detail.body.error;
                    //$scope.editing = false;
                    console.log("Error: failed to updating query.", err);
                });
            } else {
                console.log("saving as: ", $scope.testQuery.name);
                $http({
                    url: $scope.global.gateway + "/createEntry",
                    method: "POST",
                    data: {
                        tableName: "querylibs",
                        name: $scope.testQuery.name,
                        query: $scope.testQuery.expression,
                        userId: $scope.global.user.id,
                        group: group
                    }
                }).then(function (resp) {
                    $scope.testQuery.error = "";
                    console.log("resp:", resp);
                    Notify.alert(
                        'Query created successfully', { status: 'success' });
                    if ($scope.dtInst) {
                        $scope.dtInst.changeData($scope.refreshQueryLibs());
                    } else {
                        $scope.initLoadQuerylibs();
                    }
                    $scope.testQuery.expression = "";
                    $scope.testQuery.name = "";
                }, function (err) {
                    console.log("err:", err);
                    $scope.testQuery.error = err.data.detail.error;
                });
            }
        };

        $scope.query = {
            tableData: null,
            dtColumns: [],
            DtInstCallback: inst => {
                $scope.query.DtInst = inst;
            },
            initTable: () => {
                $scope.query.dataReady = false;
                return $http({
                    url: $scope.global.gateway + "/submitQuery",
                    method: "POST",
                    data: {
                        id: $scope.currentRowData.id,
                        queryExpression: $scope.currentRowData.query.trim()
                    }
                }).then(function (resp) {
                    return new Promise(function (resolve, reject) {
                        $scope.query.tableData = resp.data;
                        if ($scope.query.DtInst) {
                            $scope.query.DtInst.DataTable.ngDestroy();
                            $scope.query.dtOptions = null;
                            $scope.query.dtColumns = [];
                            angular.element('#query').children('thead').children().remove();
                            angular.element('#query').children('tbody').children().remove();
                            angular.element('#query').empty();
                        }
                        if ($scope.query.tableData && $scope.query.tableData.length > 0) {
                            SiHttpUtil.initDtColumns($scope.query.dtColumns, $scope.query.tableData,
                                (colName) => SiHttpUtil.omitColumnForTable('query', colName),
                                (colName) => SiHttpUtil.dbColumnTranslator('query', colName)
                            );
                            $scope.query.dtOptions = SiHttpUtil.initDtOptions($scope.query.dtColumns, $scope.query.tableData, $scope.query.rowCallback,
                                function () {
                                    $scope.query.dataReady = true;
                                    resolve($scope.query.tableData);
                                }).withOption('order', [[0, 'desc']])
                        } else {
                            resolve($scope.query.tableData);
                        }
                    })
                })
            }
        }
        $scope.executeTestQuery = function () {
            if (!$scope.testQuery.expression) return;
            if (!verifyQuery($scope.testQuery.expression)) {
                $scope.testQuery.error = "Invalid query. Only select query allowed.";
                return;
            }
            $scope.tableParams = undefined;
            $http({
                url: $scope.global.gateway + "/submitQuery",
                method: "POST",
                data: {
                    queryExpression: $scope.testQuery.expression.trim(),
                }
            }).then(function (response) {
                $scope.testQuery.results = response.data;
                console.log("my resulst:", $scope.testQuery.results);
                $scope.testQuery.error = "";
                console.log("tp?", $scope.tableParams);
                $scope.tableParams = new ngTableParams({
                    page: 1, // show first page
                    count: 25 // count per page
                }, {
                        total: $scope.testQuery.results.length, // length of data4
                        getData: function ($defer, params) {
                            console.log("not here");
                            $defer.resolve($scope.testQuery.results.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    });
                $scope.tableParams.data = $scope.testQuery.results.slice(0, 25);
                $scope.tableParams.$params.count = 25;
            }, function (error) {
                console.log(error);
                // $scope.errorFound = true;
                $scope.testQuery.error = error.data.detail.body.message;
                $scope.testQuery.results = undefined;
            });
        };

        $scope.initLoadQuerylibs();
    }
})();
