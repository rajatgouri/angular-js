/*!
 *
 * SystImmune LIMS
 * Angle Version: 3.0.0
 *
 */
(function () {
    'use strict';
    angular
        .module('angle', [
            'app.core',
            'app.routes',
            'app.sidebar',
            'app.preloader',
            'app.loadingbar',
            'app.translate',
            'app.settings',
            'app.dashboard',
            'app.icons',
            'app.notify',
            'app.elements',
            'app.locale',
            'app.pages',
            'app.utils',
            'systimu',
            'app.research',
            'app.ade',
            'app.io',
            'app.ct',
            'app.pd',
            'app.project',
            'app.facilities',
            'app.tools',
            'app.accounting',
            'app.TimePerProject',
            'app.PayPeriod',
            'app.Inventory'
        ]);
})();
(function () {
    'use strict';
    angular
        .module('app.colors', []);
})();
(function () {
    'use strict';
    angular
        .module('app.core', [
            'ngAnimate',
            'ngStorage',
            'ngCookies',
            'ngDialog',
            'pascalprecht.translate',
            'ui.bootstrap',
            'ui.router',
            'permission',
            'permission.ui',
            'oc.lazyLoad',
            'cfp.loadingBar',
            'ngSanitize',
            'ngResource',
            'tmh.dynamicLocale',
            'angular.validators',
            'datatables',
            'datatables.buttons',
            'datatables.colreorder',
            'localytics.directives',
            'chart.js',
            'angular-loading-bar',
            'angularBootstrapNavTree',
            'xeditable',
            'angularplasmid',
            'angular-fullcalendar'
        ]);
})();
(function () {
    'use strict';
    angular
        .module('app.dashboard', []);
})();
(function () {
    'use strict';
    angular
        .module('app.elements', []);
})();
(function () {
    'use strict';
    angular
        .module('app.icons', []);
})();
(function () {
    'use strict';
    angular
        .module('app.lazyload', []);
})();
(function () {
    'use strict';
    angular
        .module('app.loadingbar', []);
})();
(function () {
    'use strict';
    angular
        .module('app.locale', []);
})();
(function () {
    'use strict';
    angular
        .module('app.notify', []);
})();
(function () {
    'use strict';
    angular
        .module('app.pages', []);
})();
(function () {
    'use strict';
    angular
        .module('app.preloader', []);
})();
(function () {
    'use strict';
    angular
        .module('app.settings', []);
})();
(function () {
    'use strict';
    angular
        .module('app.routes', [
            'app.lazyload'
        ]);
})();
(function () {
    'use strict';
    angular
        .module('app.translate', []);
})();
(function () {
    'use strict';
    angular
        .module('app.utils', [
            'app.colors'
        ]);
})();
(function () {
    'use strict';
    angular
        .module('app.sidebar', []);
})();
(function () {
    'use strict';
    angular
        .module('systimu', ['ui.bootstrap']);
})();
(function () {
    'use strict';
    angular
        .module('app.research', []);
})();
(function () {
    'use strict';
    angular
        .module('app.ade', []);
})();
(function () {
    'use strict';
    angular
        .module('app.io', []);
})();
(function () {
    'use strict';
    angular
        .module('app.ct', []);
})();
(function () {
    'use strict';
    angular
        .module('app.pd', []);
})();
(function () {
    'use strict';
    angular
        .module('app.project', []);
})();
(function () {
    'use strict';
    angular
        .module('app.facilities', []);
})();
(function () {
    'use strict';
    angular
        .module('app.tools', []);
})();
(function () {
    'use strict';
    angular
        .module('app.accounting', []);
})();
(function () {
    'use strict';
    angular
        .module('app.TimePerProject', []);
})();
(function () {
    'use strict';
    angular
        .module('app.email', []);
})();
(function () {
    'use strict';
    angular
        .module('app.Inventory', []);
})();
(function () {
    'use strict';
    angular
        .module('app.PayPeriod', []);
})();
(function () {
    'use strict';
    angular
        .module('app.colors')
        .constant('APP_COLORS', {
            'primary': '#5d9cec',
            'success': '#27c24c',
            'info': '#23b7e5',
            'warning': '#ff902b',
            'danger': '#f05050',
            'inverse': '#131e26',
            'green': '#37bc9b',
            'pink': '#f532e5',
            'purple': '#7266ba',
            'dark': '#3a3f51',
            'yellow': '#fad732',
            'gray-darker': '#232735',
            'gray-dark': '#3a3f51',
            'gray': '#dde6e9',
            'gray-light': '#e4eaec',
            'gray-lighter': '#edf1f2'
        });
})();
/**=========================================================
* Module: colors.js
* Services to retrieve global colors
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.colors')
        .service('Colors', Colors);
    Colors.$inject = ['APP_COLORS'];

    function Colors(APP_COLORS) {
        this.byName = byName;
        ////////////////
        function byName(name) {
            return (APP_COLORS[name] || '#fff');
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('app.core')
        .config(coreConfig);
    coreConfig.$inject = ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', '$permissionProvider'];

    function coreConfig($controllerProvider, $compileProvider, $filterProvider, $provide, $permissionProvider) {
        const core = angular.module('app.core');
        // registering components after bootstrap
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|geneious|onenote|mailto|file):/);
        core.controller = $controllerProvider.register;
        core.directive = $compileProvider.directive;
        core.filter = $filterProvider.register;
        core.factory = $provide.factory;
        core.service = $provide.service;
        core.constant = $provide.constant;
        core.value = $provide.value;
        $permissionProvider.suppressUndefinedPermissionWarning(true);
    }
})();
/**=========================================================
* Module: constants.js
* Define constants to inject across the application
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.core')
        .constant('APP_MEDIAQUERY', {
            'desktopLG': 1200,
            'desktop': 992,
            'tablet': 768,
            'mobile': 480
        });
})();
(function () {
    'use strict';
    angular
        .module('app.core')
        .run(appRun);
    appRun.$inject = ['$rootScope', '$state', '$stateParams', '$window', 'Colors', 'PermPermissionStore', '$transitions', 'Global', 'AuthenticationService', '$urlRouter'];

    function appRun($rootScope, $state, $stateParams, $window, Colors, PermPermissionStore, $transitions, Global, AuthenticationService, $urlRouter) {
        // function appRun($rootScope, $state, $stateParams, $window, $templateCache, Colors) {
        // Set reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.$storage = $window.localStorage;
        $rootScope.colorByName = Colors.byName;
        $rootScope.gatewayUrl = Global.gateway;
        // cancel click event easily
        $rootScope.cancel = function ($event) {
            $event.stopPropagation();
        };
        // stateChange deprecated
        // Hook not found
        // $rootScope.$on('$stateNotFound',
        //     function (event, unfoundState /*, fromState, fromParams*/) {
        //         console.log(unfoundState.to); // "lazy.state"
        //         console.log(unfoundState.toParams); // {a:1, b:2}
        //         console.log(unfoundState.options); // {inherit:false} + default options
        //     });
        // // Hook error
        // $rootScope.$on('$stateChangeError',
        //     function (event, toState, toParams, fromState, fromParams, error) {
        //         console.log(error);
        //     });
        // $rootScope.$on('$stateChangeSuccess',
        //     function (event, toState, toParams, fromState, fromParams) {
        //         $window.scrollTo(0, 0);
        //         $rootScope.currTitle = $state.current.title;
        //         // Attach prev state.
        //         // console.log("saving prev state:", fromState.name);
        //         $rootScope.prevState = fromState.name;
        //     });
        //////////////////////////////////////////

        // updated in ui-router 1.0, use transitions API
        $transitions.onError({}, function ($transition) {
            console.log($transition.error());
        });
        $transitions.onSuccess({}, function ($transition) {
            $window.scrollTo(0, 0);
            $rootScope.pageTitle = "SystImmune LIMS - " + $state.current.title;
            $rootScope.prevState = $transition.$from().name;
        });
        // Permissions setup
        // Get from session output
        AuthenticationService.CacheUser().then(() => {
            PermPermissionStore.definePermission('isAuthenticated', function () {
                return Global.authenticated;
            });
            PermPermissionStore.defineManyPermissions(Global.permissions, permissionName => {
                return _.includes(Global.permissions, permissionName);
            });
            // Start loading router after permissions have been set up
            $urlRouter.sync();
            $urlRouter.listen();
        });
    }
})();
(function () {
    'use strict';
    angular.module('systimu').factory('AuthenticationService', ['$http', 'Global', '$urlRouter',
        function ($http, Global, $urlRouter) {
            let cached = false;
            return {
                CacheUser: CacheUser
            };

            
            function CacheUser() {
                if (cached) {
                    return Promise.resolve();
                }
                return $http.get(Global.gateway + '/status').then(details => {
                    if (details && details.status === 200) {
                        Global.user = details.data.user;
                        Global.permissions = details.data.permissions;
                        Global.preferences = details.data.user.UserPreference || {};
                        Global.server = details.data.info.hostname;
                        Global.env = details.data.info.env;
                        Global.helperAPI = details.data.info.helperAPI;
                        Global.authenticated = true;
                        cached = false;
                    }
                    return Promise.resolve();
                }, () => {
                    $urlRouter.sync();
                    $urlRouter.listen();
                    return Promise.reject();
                });
            }
        }
    ]);
})();
(function () {
    'use strict';
    angular.module('systimu').factory('PermissionService', ['PermPermissionStore',
        function (PermPermissionStore) {
            return {
                checkPermission: checkPermission
            };

            function checkPermission(perm) {
                return PermPermissionStore.getPermissionDefinition(perm);
            }
        }
    ]);
})();
/**=========================================================
* Module: skycons.js
* Include any animated weather icon from Skycons
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.icons')
        .directive('skycon', skycon);

    function skycon() {
        const directive = {
            link: link,
            restrict: 'A'
        };
        return directive;

        function link(scope, element, attrs) {
            const skycons = new Skycons({ 'color': (attrs.color || 'white') });
            element.html('<canvas width="' + attrs.width + '" height="' + attrs.height + '"></canvas>');
            skycons.add(element.children()[0], attrs.skycon);
            skycons.play();
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('app.lazyload')
        .config(lazyloadConfig);
    lazyloadConfig.$inject = ['$ocLazyLoadProvider', 'APP_REQUIRES'];

    function lazyloadConfig($ocLazyLoadProvider, APP_REQUIRES) {
        // Lazy Load modules configuration
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: APP_REQUIRES.modules
        });
    }
})();
(function () {
    'use strict';
    angular
        .module('app.lazyload')
        .constant('APP_REQUIRES', {
            // jQuery based and standalone scripts
            scripts: {
                'whirl': ['vendor/whirl/dist/whirl.css'],
                'classyloader': ['vendor/jquery-classyloader/js/jquery.classyloader.min.js'],
                'animo': ['vendor/animo.js/animo.js'],
                'fastclick': ['vendor/fastclick/lib/fastclick.js'],
                'modernizr': ['vendor/modernizr/modernizr.js'],
                'animate': ['vendor/animate.css/animate.min.css'],
                'skycons': ['vendor/skycons/skycons.js'],
                'icons': ['vendor/fontawesome/css/fontawesome-all.min.css',
                    'vendor/simple-line-icons/css/simple-line-icons.css'
                ],
                'weather-icons': ['vendor/weather-icons/css/weather-icons.min.css'],
                'sparklines': ['vendor/sparklines/jquery.sparkline.min.js'],
                'wysiwyg': ['vendor/bootstrap-wysiwyg/bootstrap-wysiwyg.js',
                    'vendor/bootstrap-wysiwyg/external/jquery.hotkeys.js'
                ],
                'slimscroll': ['vendor/slimScroll/jquery.slimscroll.min.js'],
                'screenfull': ['vendor/screenfull/dist/screenfull.js'],
                'vector-map': ['vendor/ika.jvectormap/jquery-jvectormap-1.2.2.min.js',
                    'vendor/ika.jvectormap/jquery-jvectormap-1.2.2.css'
                ],
                'vector-map-maps': ['vendor/ika.jvectormap/jquery-jvectormap-world-mill-en.js',
                    'vendor/ika.jvectormap/jquery-jvectormap-us-mill-en.js'
                ],
                'flot-chart': ['vendor/Flot/jquery.flot.js'],
                'flot-chart-plugins': ['vendor/flot.tooltip/js/jquery.flot.tooltip.min.js',
                    'vendor/Flot/jquery.flot.resize.js',
                    'vendor/Flot/jquery.flot.pie.js',
                    'vendor/Flot/jquery.flot.time.js',
                    'vendor/Flot/jquery.flot.categories.js',
                    'vendor/flot-spline/js/jquery.flot.spline.min.js'
                ],
                // jquery core and widgets
                'jquery-ui': ['vendor/jquery-ui/ui/core.js',
                    'vendor/jquery-ui/ui/widget.js'
                ],
                // loads only jquery required modules and touch support
                'jquery-ui-widgets': ['vendor/jquery-ui/ui/core.js',
                    'vendor/jquery-ui/ui/widget.js',
                    'vendor/jquery-ui/ui/mouse.js',
                    'vendor/jquery-ui/ui/draggable.js',
                    'vendor/jquery-ui/ui/droppable.js',
                    'vendor/jquery-ui/ui/sortable.js',
                    'vendor/jqueryui-touch-punch/jquery.ui.touch-punch.min.js'
                ],
                'moment': ['vendor/moment/min/moment-with-locales.min.js'],
                'inputmask': ['vendor/jquery.inputmask/dist/jquery.inputmask.bundle.min.js'],
                'codemirror': ['vendor/codemirror/lib/codemirror.js',
                    'vendor/codemirror/lib/codemirror.css',
                ],
                // modes for common web files
                'codemirror-modes-web': ['vendor/codemirror/mode/javascript/javascript.js',
                    'vendor/codemirror/mode/xml/xml.js',
                    'vendor/codemirror/mode/htmlmixed/htmlmixed.js',
                    'vendor/codemirror/mode/css/css.js'
                ],
                'codemirror-modes-sql': [
                    'vendor/codemirror/mode/sql/sql.js',
                ],
                'taginput': ['vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.css',
                    'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput.min.js'
                ],
                'filestyle': ['vendor/bootstrap-filestyle/src/bootstrap-filestyle.js'],
                'sequence-viewer': ['lib/sequence-viewer/dist/sequence-viewer.min.js'],
                'parsley': ['vendor/parsleyjs/dist/parsley.min.js'],
                'fullcalendar': [
                    // 'lib/moment/min/moment.min.js',
                    // 'lib/fullcalendar/dist/fullcalendar.js',
                    // 'lib/fullcalendar/dist/fullcalendar.css',
                    // 'lib/fullcalendar-scheduler/dist/scheduler.min.css',
                    // 'lib/fullcalendar-scheduler/dist/scheduler.js'
                ],
                'gcal': ['vendor/fullcalendar/dist/gcal.js'],
                'morris': ['vendor/raphael/raphael.js',
                    'vendor/morris.js/morris.js',
                    'vendor/morris.js/morris.css'
                ],
                'loaders.css': ['vendor/loaders.css/loaders.css'],
                'spinkit': ['vendor/spinkit/css/spinkit.css'],
                'svg-pan-zoom': ['vendor/svg-pan-zoom/svg-pan-zoom.min.js']
            },
            // Angular based script (use the right module name)
            modules: [{
                name: 'toaster',
                files: ['vendor/angularjs-toaster/toaster.js',
                    'vendor/angularjs-toaster/toaster.css'
                ]
            }, {
                name: 'ngWig',
                files: ['vendor/ngWig/dist/ng-wig.min.js']
            }, {
                name: 'ngTable',
                files: ['vendor/ng-table/dist/ng-table.min.js',
                    'vendor/ng-table/dist/ng-table.min.css'
                ]
            }, {
                name: 'ngTableExport',
                files: ['vendor/ng-table-export/ng-table-export.js']
            }, {
                name: 'htmlSortable',
                files: ['vendor/html.sortable/dist/html.sortable.js',
                    'vendor/html.sortable/dist/html.sortable.angular.js'
                ]
            }, {
                name: 'angularFileUpload',
                files: ['vendor/angular-file-upload/angular-file-upload.js']
            }, {
                name: 'ngImgCrop',
                files: ['vendor/ng-img-crop/compile/unminified/ng-img-crop.js',
                    'vendor/ng-img-crop/compile/unminified/ng-img-crop.css'
                ]
            }, {
                name: 'ui.select',
                files: ['vendor/angular-ui-select/dist/select.js',
                    'vendor/angular-ui-select/dist/select.css'
                ]
            }, {
                name: 'ui.sortable',
                files: [
                    'vendor/angular-ui-sortable/jquery-ui.min.css',
                    'vendor/angular-ui-sortable/jquery-ui.min.js',
                    'vendor/angular-ui-sortable/sortable.min.js',
                ]
            }, {
                name: 'ui.codemirror',
                files: [
                    'vendor/angular-ui-codemirror/ui-codemirror.js',
                ]
            }, {
                name: 'angular-carousel',
                files: ['vendor/angular-carousel/dist/angular-carousel.css',
                    'vendor/angular-carousel/dist/angular-carousel.js'
                ]
            }, {
                name: 'ngGrid',
                files: ['vendor/ng-grid/build/ng-grid.min.js',
                    'vendor/ng-grid/ng-grid.css'
                ]
            }, {
                name: 'infinite-scroll',
                files: ['vendor/ngInfiniteScroll/build/ng-infinite-scroll.js']
            }, {
                name: 'ui.bootstrap-slider',
                files: ['vendor/seiyria-bootstrap-slider/dist/bootstrap-slider.min.js',
                    'vendor/seiyria-bootstrap-slider/dist/css/bootstrap-slider.min.css',
                    'vendor/angular-bootstrap-slider/slider.js'
                ]
            }, {
                name: 'ui.grid',
                files: ['vendor/angular-ui-grid/ui-grid.min.css',
                    'vendor/angular-ui-grid/ui-grid.min.js'
                ]
            }, {
                name: 'textAngular',
                files: ['vendor/textAngular/dist/textAngular.css',
                    'vendor/textAngular/dist/textAngular-rangy.min.js',
                    'vendor/textAngular/dist/textAngular-sanitize.js',
                    'vendor/textAngular/src/globals.js',
                    'vendor/textAngular/src/factories.js',
                    'vendor/textAngular/src/DOM.js',
                    'vendor/textAngular/src/validators.js',
                    'vendor/textAngular/src/taBind.js',
                    'vendor/textAngular/src/main.js',
                    'vendor/textAngular/dist/textAngularSetup.js'
                ],
                serie: true
            }, {
                name: 'angular-rickshaw',
                files: ['vendor/d3/d3.min.js',
                    'vendor/rickshaw/rickshaw.js',
                    'vendor/rickshaw/rickshaw.min.css',
                    'vendor/angular-rickshaw/rickshaw.js'
                ],
                serie: true
            }, {
                name: 'chartjs',
                files: ['vendor/Chart.js/Chart.min.js',
                    'vendor/Chart.js/angular-chart.min.js'
                ],
                serie: true
            }, {
                name: 'angular-chartist',
                files: ['vendor/chartist/dist/chartist.min.css',
                    'vendor/chartist/dist/chartist.js',
                    'vendor/angular-chartist.js/dist/angular-chartist.js'
                ],
                serie: true
            }, {
                name: 'ui.map',
                files: ['vendor/angular-ui-map/ui-map.js']
            }, {
                name: 'dndLists',
                files: ['vendor/angular-drag-and-drop-lists/dist/angular-drag-and-drop-lists.js']
            }, {
                name: 'angular-jqcloud',
                files: ['vendor/jqcloud2/dist/jqcloud.css',
                    'vendor/jqcloud2/dist/jqcloud.js',
                    'vendor/angular-jqcloud/angular-jqcloud.js'
                ]
            }, {
                name: 'angularGrid',
                files: ['vendor/ag-grid/dist/angular-grid.css',
                    'vendor/ag-grid/dist/angular-grid.js',
                    'vendor/ag-grid/dist/theme-dark.css',
                    'vendor/ag-grid/dist/theme-fresh.css'
                ]
            }, {
                name: 'ng-nestable',
                files: ['vendor/ng-nestable/src/angular-nestable.js',
                    'vendor/nestable/jquery.nestable.js'
                ]
            }, {
                name: 'akoenig.deckgrid',
                files: ['vendor/angular-deckgrid/angular-deckgrid.js']
            }, {
                name: 'oitozero.ngSweetAlert',
                files: ['vendor/sweetalert/dist/sweetalert.css',
                    'vendor/sweetalert/dist/sweetalert.min.js',
                    'vendor/angular-sweetalert/SweetAlert.js'
                ]
            }, {
                name: 'bm.bsTour',
                files: ['vendor/bootstrap-tour/build/css/bootstrap-tour.css',
                    'vendor/bootstrap-tour/build/js/bootstrap-tour-standalone.js',
                    'vendor/angular-bootstrap-tour/dist/angular-bootstrap-tour.js'
                ],
                serie: true
            }]
        });
})();
(function () {
    'use strict';
    angular
        .module('app.loadingbar')
        .config(loadingbarConfig);
    loadingbarConfig.$inject = ['cfpLoadingBarProvider'];

    function loadingbarConfig(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
        cfpLoadingBarProvider.latencyThreshold = 500;
        cfpLoadingBarProvider.parentSelector = '.wrapper > section';
    }
})();
(function () {
    'use strict';
    angular
        .module('app.loadingbar')
        .run(loadingbarRun);
    loadingbarRun.$inject = ['$rootScope', '$timeout', 'cfpLoadingBar'];

    function loadingbarRun($rootScope, $timeout, cfpLoadingBar) {
        // Loading bar transition
        // -----------------------------------
        let thBar;
        $rootScope.$on('$stateChangeStart', function () {
            if ($('.wrapper > section').length) {// check if bar container exists
                thBar = $timeout(function () {
                    cfpLoadingBar.start();
                }, 5); // sets a latency Threshold
            }
        });
        $rootScope.$on('$stateChangeSuccess', function (event) {
            event.targetScope.$watch('$viewContentLoaded', function () {
                $timeout(function () {
                    $timeout.cancel(thBar);
                    cfpLoadingBar.complete();
                }, 40);
            });
        });
    }
})();
(function () {
    'use strict';
    angular
        .module('app.locale')
        .config(localeConfig);
    localeConfig.$inject = ['tmhDynamicLocaleProvider'];

    function localeConfig(tmhDynamicLocaleProvider) {
        tmhDynamicLocaleProvider.localeLocationPattern('vendor/angular-i18n/angular-locale_{{locale}}.js');
    }
})();
/**=========================================================
* Module: locale.js
* Demo for locale settings
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.locale')
        .controller('LocalizationController', LocalizationController);
    LocalizationController.$inject = ['$rootScope', 'tmhDynamicLocale', '$locale'];

    function LocalizationController($rootScope, tmhDynamicLocale, $locale) {
        activate();
        ////////////////
        function activate() {
            $rootScope.availableLocales = {
                'en': 'English',
                'es': 'Spanish',
                'de': 'German',
                'fr': 'French',
                'ar': 'Arabic',
                'ja': 'Japanese',
                'ko': 'Korean',
                'zh': 'Chinese'
            };
            $rootScope.model = { selectedLocale: 'en' };
            $rootScope.$locale = $locale;
            $rootScope.changeLocale = tmhDynamicLocale.set;
        }
    }
})();
/**=========================================================
* Module: notify.js
* Directive for notify plugin
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.notify')
        .directive('notify', notify);
    notify.$inject = ['Notify'];

    function notify(Notify) {
        const directive = {
            link: link,
            restrict: 'A',
            scope: {
                options: '=',
                message: '='
            }
        };
        return directive;

        function link(scope, element) {
            element.on('click', function (e) {
                e.preventDefault();
                Notify.alert(scope.message, scope.options);
            });
        }
    }
})();
/**=========================================================
* Module: notify.js
* Create a notifications that fade out automatically.
* Based on Notify addon from UIKit (http://getuikit.com/docs/addons_notify.html)
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.notify')
        .service('Notify', Notify);
    Notify.$inject = ['$timeout'];

    function Notify($timeout) {
        this.alert = notifyAlert;
        ////////////////
        function notifyAlert(msg, opts) {
            if (msg) {
                $timeout(function () {
                    $.notify(msg, opts || {});
                });
            }
        }
    }
})();
/**
 * Notify Addon definition as jQuery plugin
 * Adapted version to work with Bootstrap classes
 * More information http://getuikit.com/docs/addons_notify.html
 */
(function ($) {
    'use strict';
    const containers = {},
        messages = {},
        notify = function (options) {
            if ($.type(options) === 'string') {
                options = {message: options};
            }
            if (arguments[1]) {
                options = $.extend(options, $.type(arguments[1]) === 'string' ? {status: arguments[1]} : arguments[1]);
            }
            return (new Message(options)).show();
        },
        closeAll = function (group, instantly) {
            let id;
            for (id in messages) {
                if (messages.hasOwnProperty(id)) {
                    if (group && group === messages[id].group) {
                        messages[id].close(instantly);
                    } else {
                        messages[id].close(instantly);
                    }
                }
            }
        };
    var Message = function (options) {
        // var $this = this;
        this.options = $.extend({}, Message.defaults, options);
        this.uuid = 'ID' + (new Date().getTime()) + 'RAND' + (Math.ceil(Math.random() * 100000));
        this.element = $([
            // @geedmo: alert-dismissable enables bs close icon
            '<div class="uk-notify-message alert-dismissable">',
            '<a class="close">&times;</a>',
            '<div>' + this.options.message + '</div>',
            '</div>'
        ].join('')).data('notifyMessage', this);
        // status
        if (this.options.status) {
            this.element.addClass('alert alert-' + this.options.status);
            this.currentstatus = this.options.status;
        }
        this.group = this.options.group;
        messages[this.uuid] = this;
        if (!containers[this.options.pos]) {
            containers[this.options.pos] = $('<div class="uk-notify uk-notify-' + this.options.pos + '"></div>').appendTo('body').on('click', '.uk-notify-message', function () {
                $(this).data('notifyMessage').close();
            });
        }
    };
    $.extend(Message.prototype, {
        uuid: false,
        element: false,
        timout: false,
        currentstatus: '',
        group: false,
        show: function () {
            if (this.element.is(':visible')) { return; }
            var $this = this;
            containers[this.options.pos].show().prepend(this.element);
            var marginbottom = parseInt(this.element.css('margin-bottom'), 10);
            this.element.css({
                'opacity': 0,
                'margin-top': -1 * this.element.outerHeight(),
                'margin-bottom': 0
            }).animate({ 'opacity': 1, 'margin-top': 0, 'margin-bottom': marginbottom }, function () {
                if ($this.options.timeout) {
                    var closefn = function () {
                        $this.close();
                    };
                    $this.timeout = setTimeout(closefn, $this.options.timeout);
                    $this.element.hover(
                        function () {
                            clearTimeout($this.timeout);
                        },
                        function () {
                            $this.timeout = setTimeout(closefn, $this.options.timeout);
                        }
                    );
                }
            });
            return this;
        },
        close: function (instantly) {
            const $this = this,
                finalize = function () {
                    $this.element.remove();
                    if (!containers[$this.options.pos].children().length) {
                        containers[$this.options.pos].hide();
                    }
                    delete messages[$this.uuid];
                };
            if (this.timeout) { clearTimeout(this.timeout); }
            if (instantly) {
                finalize();
            } else {
                this.element.animate({
                    'opacity': 0,
                    'margin-top': -1 * this.element.outerHeight(),
                    'margin-bottom': 0
                }, function () {
                    finalize();
                });
            }
        },
        content: function (html) {
            const container = this.element.find('>div');
            if (!html) {
                return container.html();
            }
            container.html(html);
            return this;
        },
        status: function (status) {
            if (!status) {
                return this.currentstatus;
            }
            this.element.removeClass('alert alert-' + this.currentstatus).addClass('alert alert-' + status);
            this.currentstatus = status;
            return this;
        }
    });
    Message.defaults = {
        message: '',
        status: 'normal',
        timeout: 5000,
        group: null,
        pos: 'top-center'
    };
    $.notify = notify;
    $.notify.message = Message;
    $.notify.closeAll = closeAll;
    return notify;
}(jQuery));
// Disable preloader to make it seem faster
// (function () {
//     'use strict';
//     angular
//         .module('app.preloader')
//         .directive('preloader', preloader);
//     preloader.$inject = ['$animate', '$timeout', '$q'];

//     function preloader($animate, $timeout, $q) {
//         var directive = {
//             restrict: 'EAC',
//             template: '<div class="preloader-progress">' +
//             '<div class="preloader-progress-bar" ' +
//             'ng-style="{width: loadCounter + \'%\'}"></div>' +
//             '</div>',
//             link: link
//         };
//         return directive;
//         ///////
//         function link(scope, el) {
//             scope.loadCounter = 0;
//             var counter = 0,
//                 timeout;
//             // disables scrollbar
//             angular.element('body').css('overflow', 'hidden');
//             // ensure class is present for styling
//             el.addClass('preloader');
//             appReady().then(endCounter);
//             timeout = $timeout(startCounter);
//             ///////
//             function startCounter() {
//                 var remaining = 100 - counter;
//                 counter = counter + (0.015 * Math.pow(1 - Math.sqrt(remaining), 2));
//                 scope.loadCounter = parseInt(counter, 10);
//                 timeout = $timeout(startCounter, 20);
//             }

//             function endCounter() {
//                 $timeout.cancel(timeout);
//                 scope.loadCounter = 100;
//                 $timeout(function () {
//                     // animate preloader hiding
//                     $animate.addClass(el, 'preloader-hidden');
//                     // retore scrollbar
//                     angular.element('body').css('overflow', '');
//                 }, 300);
//             }

//             function appReady() {
//                 var deferred = $q.defer();
//                 var viewsLoaded = 0;
//                 var off = scope.$on('$viewContentLoaded', function () {
//                     viewsLoaded++;
//                     if (viewsLoaded === 2) {
//                         // with resolve this fires only once
//                         $timeout(function () {
//                             deferred.resolve();
//                         }, 10);
//                         off();
//                     }
//                 });
//                 return deferred.promise;
//             }
//         }
//     }
// })();
(function () {
    'use strict';
    angular
        .module('app.settings')
        .run(settingsRun);
    settingsRun.$inject = ['$rootScope', 'Global', '$localStorage'];

    function settingsRun($rootScope, Global, $localStorage) {
        // Global Settings
        // -----------------------------------
        const intro = 'SystImmune LIMS';
        const version = '1';
        $rootScope.app = {
            name: intro,
            fullName: intro + ' v' + version,
            global: Global,
            description: 'Laboratory Information Management System',
            year: (new Date()).getFullYear(),
            layout: {
                isFixed: true,
                isCollapsed: false,
                isBoxed: false,
                isRTL: false,
                horizontal: false,
                isFloat: false,
                asideHover: false,
                theme: null,
                isCollapsedText: false,
                tableRows: 10
            },
            useFullLayout: false,
            hiddenFooter: false,
            offsidebarOpen: false,
            asideToggled: false,
            viewAnimation: 'ng-fadeInUp'
        };
        // Setup the layout mode
        $rootScope.app.layout.horizontal = ($rootScope.$stateParams.layout === 'app-h');
        // Restore layout settings
        if (angular.isDefined($localStorage.layout)) {
            $rootScope.app.layout = $localStorage.layout;
        } else {
            $localStorage.layout = $rootScope.app.layout;
        }
        $rootScope.$watch('app.layout', function () {
            $localStorage.layout = $rootScope.app.layout;
        }, true);
        // Close submenu when sidebar change from collapsed to normal
        $rootScope.$watch('app.layout.isCollapsed', function (newValue) {
            if (newValue === false) {
                $rootScope.$broadcast('closeSidebarMenu');
            }
        });
    }
})();
/**=========================================================
* Module: helpers.js
* Provides helper functions for routes definition
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.routes')
        .provider('RouteHelpers', RouteHelpersProvider);
    RouteHelpersProvider.$inject = ['APP_REQUIRES'];

    function RouteHelpersProvider(APP_REQUIRES) {
        /* jshint validthis:true */
        return {
            // provider access level
            basepath: basepath,
            resolveFor: resolveFor,
            // controller access level
            $get: function () {
                return {
                    basepath: basepath,
                    resolveFor: resolveFor
                };
            }
        };
        // Set here the base of the relative path
        // for all app views
        function basepath(uri) {
            return 'app/views/' + uri;
        }
        // Generates a resolve object by passing script names
        // previously configured in constant.APP_REQUIRES
        function resolveFor() {
            const _args = arguments;
            return {
                deps: ['$ocLazyLoad', '$q', function ($ocLL, $q) {
                    // This code will parallel load the dependancies
                    // var deps = []; // empty promise
                    // for (var i = 0, len = _args.length; i < len; i++) {
                    //     deps.push(getRequired(_args[i]));
                    // }
                    // return $ocLL.load(deps);
                    //
                    // Creates a promise chain for each argument
                    let promise = $q.when(1); // empty promise
                    let i = 0, len = _args.length;
                    for (; i < len; i++) {
                        promise = andThen(_args[i]);
                    }
                    return promise;
                    // creates promise to chain dynamically
                    function andThen(_arg) {
                        // also support a function that returns a promise
                        if (typeof _arg === 'function') {
                            return promise.then(_arg);
                        }
                        return promise.then(function () {
                            // if is a module, pass the name. If not, pass the array
                            let whatToLoad = getRequired(_arg);
                            // simple error check
                            if (!whatToLoad) {
                                return $.error('Route resolve: Bad resource name [' + _arg + ']');
                            }
                            // finally, return a promise
                            return $ocLL.load(whatToLoad);
                        });
                    }
                    // check and returns required data
                    // analyze module items with the form [name: '', files: []]
                    // and also simple array of script files (for not angular js)
                    function getRequired(name) {
                        if (APP_REQUIRES.modules) {
                            for (let m in APP_REQUIRES.modules) {
                                if (APP_REQUIRES.modules[m].name && APP_REQUIRES.modules[m].name === name) {
                                    return APP_REQUIRES.modules[m];
                                }
                            }
                        }
                        return APP_REQUIRES.scripts && APP_REQUIRES.scripts[name];
                    }
                }]
            };
        } // resolveFor
    }
})();
/**=========================================================
* Module: config.js
* App routes and resources configuration
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.routes')
        .config(routesConfig);
    routesConfig.$inject = ['$stateProvider', '$locationProvider', '$urlRouterProvider', '$urlMatcherFactoryProvider', 'RouteHelpersProvider'];

    function routesConfig($stateProvider, $locationProvider, $urlRouterProvider, $urlMatcherFactoryProvider, helper) {
        $urlMatcherFactoryProvider.strictMode(false);
        // Set the following to true to enable the HTML5 Mode
        // You may have to set <base> tag in index and a routing configuration in your server
        $locationProvider.html5Mode(false);
        $urlRouterProvider.otherwise('/');
        $urlRouterProvider.deferIntercept();
        //
        // Application Routes
        // -----------------------------------
        $stateProvider
            .state('home', {
                url: '/',
                title: 'Home',
                controller: 'HomeController',
                templateUrl: 'app/pages/home.html',
                resolve: helper.resolveFor()
            })
            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: helper.basepath('app.html'),
                resolve: helper.resolveFor('fastclick', 'animo', 'filestyle'),
                data: {
                    permissions: {
                        only: 'isAuthenticated',
                        redirectTo: 'home'
                    }
                }
            })
            .state('app.home', {
                url: '/home',
                title: 'Home',
                controller: 'LandingHomeController',
                templateUrl: helper.basepath('home.html'),
                resolve: helper.resolveFor()
            })
            .state('app.facilities.scheduling', {
                url: '/scheduling',
                title: 'Equipment Scheduling',
                controller: 'SchedulingController',
                templateUrl: helper.basepath('partials/scheduling.html'),
                resolve: helper.resolveFor('fullcalendar'),
                data: {
                    permissions: {
                        only: ['readScheduling', 'adminScheduling'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.TimePerProject', {
                url: '/time',
                title: 'Time Per Project',
                controller: 'TimeProjectController',

                templateUrl: helper.basepath('partials/TimePerProject.html'),
                resolve: helper.resolveFor()//,
                //data: {
                //    permissions: {
                //        //only: ['readScheduling', 'adminScheduling'],
                //        //redirectTo: 'page.permissionDenied'
                //    }
                //}
            })
            .state('app.email', {
                url: '/email',
                title: 'Email',
                controller: 'EmailController',
                templateUrl: helper.basepath('email.html'),
                resolve: helper.resolveFor()
              
            })
            .state('app.Inventory', {
                url: '/inventory',
                title: 'Inventory',
                controller: 'InventoryController',

                templateUrl: helper.basepath('partials/Inventory.html'),
                resolve: helper.resolveFor()//,
                //data: {
                //    permissions: {
                //        //only: ['readScheduling', 'adminScheduling'],
                //        //redirectTo: 'page.permissionDenied'
                //    }
                //}
            })
            .state('app.research', {
                url: '/research',
                title: 'Research',
                controller: 'ResearchController',
                templateUrl: helper.basepath('research.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch', 'readPurification'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.proteinSummary', {
                url: '/proteinSummary?op&id',
                title: 'Protein Summary',
                params: {
                    op: { dynamic: true },
                    id: { dynamic: true },
                },
                controller: 'ProteinSummaryController',
                templateUrl: helper.basepath('partials/proteinSummary.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.constructRequest', {
                url: '/constructRequest?op&id',
                title: 'Construct Requests',
                controller: 'ConstructRequestController',
                templateUrl: helper.basepath('partials/constructRequest.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.constructStatus', {
                url: '/constructStatus?op&id',
                title: 'Construct Request Status',
                controller: 'ConstructStatusController',
                templateUrl: helper.basepath('partials/constructStatus.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.plasmids', {
                url: '/plasmids?op&id',
                title: 'Plasmids',
                controller: 'PlasmidsController',
                templateUrl: helper.basepath('partials/plasmids.html'),
                resolve: helper.resolveFor('filestyle'),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.transfectionRequests', {
                url: '/transfectionRequests?op&id',
                title: 'Transfection Requests',
                controller: 'TransfectionRequestsController',
                templateUrl: helper.basepath('partials/transfectionRequest.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.transfections', {
                url: '/transfections?op&id',
                title: 'Transfections',
                controller: 'TransfectionsController',
                templateUrl: helper.basepath('partials/transfection.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.proteins', {
                url: '/proteins?op&id',
                title: 'Proteins',
                controller: 'ProteinsController',
                templateUrl: helper.basepath('partials/proteins.html'),
                resolve: helper.resolveFor('sequence-viewer'),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.proteinPurification', {
                url: '/proteinPurification?op&id',
                title: 'Protein Purifications',
                controller: 'ProteinPurificationController',
                templateUrl: helper.basepath('partials/proteinPurification.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch', 'readPurification'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.proteinRequest', {
                url: '/proteinRequest?op&id',
                title: 'Protein Requests',
                controller: 'ProteinRequestController',
                templateUrl: helper.basepath('partials/proteinRequest.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.stableCellLine', {
                url: '/stableCellLine?op&id',
                title: 'Stable Cell Lines',
                controller: 'StableCellLineController',
                templateUrl: helper.basepath('partials/stableCellLine.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.proteinAnalysisRequest', {
                url: '/proteinAnalysisRequest?op&id',
                title: 'Protein Analysis Requests',
                controller: 'ProteinAnalysisRequestController',
                templateUrl: helper.basepath('partials/proteinAnalysisRequest.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.proteinAnalysis', {
                url: '/proteinAnalysis?op&id',
                title: 'Protein Analytics',
                controller: 'ProteinAnalysisController',
                templateUrl: helper.basepath('partials/proteinAnalysis.html'),
                resolve: helper.resolveFor('filestyle'),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.bindingData', {
                url: '/bindingData?op&id',
                title: 'Protein Binding Data',
                controller: 'ProteinBindingDataController',
                templateUrl: helper.basepath('partials/bindingData.html'),
                resolve: helper.resolveFor('filestyle'),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.kineticRequest', {
                url: '/kineticRequest?op&id',
                title: 'Kinetic Request',
                controller: 'KineticRequestsController',
                templateUrl: helper.basepath('partials/kineticRequests.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readResearch', 'adminResearch'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.research.enums', {
                url: '/enums',
                title: 'Dropdown Editor',
                controller: 'EnumsController',
                templateUrl: helper.basepath('partials/enums.html'),
                resolve: helper.resolveFor('dndLists', 'htmlSortable')
            })
            .state('app.project', {
                url: '/projects',
                title: 'Projects',
                controller: 'ProjectsController',
                templateUrl: helper.basepath('project.html'),
                resolve: helper.resolveFor('sparklines'),
                data: {
                    permissions: {
                        only: ['readProject', 'adminProject'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.project.table', {
                url: '/table?op&id',
                title: 'All Projects',
                controller: 'ProjectTableController',
                templateUrl: helper.basepath('partials/projects.html'),
                resolve: helper.resolveFor()
            })
            .state('app.project.details', {
                url: '/details?id',
                title: 'Project Details',
                controller: 'ProjectDetailsController',
                templateUrl: helper.basepath('partials/project-details.html'),
                resolve: helper.resolveFor()
            })
            .state('app.project.enums', {
                url: '/enums',
                title: 'Dropdown Editor',
                controller: 'EnumsController',
                templateUrl: helper.basepath('partials/enums.html'),
                resolve: helper.resolveFor('dndLists', 'htmlSortable')
            })
            .state('app.ade', {
                url: '/ade',
                title: 'ADE',
                controller: 'AdeController',
                templateUrl: helper.basepath('ade.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readADE', 'adminADE'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.ade.bCellSource', {
                url: '/bCellSource?op&id',
                title: 'B Cell Sources',
                controller: 'BCellSourceController',
                templateUrl: helper.basepath('partials/bCellSource.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.mixCondition', {
                url: '/mixCondition?op&id',
                title: 'Mix Conditions',
                controller: 'MixConditionController',
                templateUrl: helper.basepath('partials/mixCondition.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.sort', {
                url: '/sort?op&id',
                title: 'Sorts',
                controller: 'SortController',
                templateUrl: helper.basepath('partials/sort.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.bCCPlate', {
                url: '/bCCPlate?op&id',
                title: 'BCC Plates',
                controller: 'BCCPlateController',
                templateUrl: helper.basepath('partials/bCCPlate.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.supernatentPlate', {
                url: '/supernatentPlate?op&id',
                title: 'Supernatent Plate',
                controller: 'SupernatentPlateController',
                templateUrl: helper.basepath('partials/supernatentPlate.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.activation', {
                url: '/activation?op&id',
                title: 'Activation',
                controller: 'ActivationController',
                templateUrl: helper.basepath('partials/activation.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.wellRescue', {
                url: '/wellRescue?op&id',
                title: 'Well Rescues',
                controller: 'WellRescueController',
                templateUrl: helper.basepath('partials/wellRescue.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.cloningAndSequence', {
                url: '/cloningAndSequence?op&id',
                title: 'Cloning And Sequences',
                controller: 'CloningAndSequenceController',
                templateUrl: helper.basepath('partials/cloningAndSequence.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.discoveryPlasmid', {
                url: '/discoveryPlasmid?op&id',
                title: 'Discovery Plasmid',
                controller: 'DiscoveryPlasmidController',
                templateUrl: helper.basepath('partials/discoveryPlasmid.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.humanizationPlasmid', {
                url: '/humanizationPlasmid?op&id',
                title: 'Humanization Plasmids',
                controller: 'HumanizationPlasmidController',
                templateUrl: helper.basepath('partials/humanizationPlasmid.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.discoveryTransfection', {
                url: '/discoveryTransfection?op&id',
                title: 'Discovery Transfections',
                controller: 'DiscoveryTransfectionController',
                templateUrl: helper.basepath('partials/discoveryTransfection.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.humanizationTransfection', {
                url: '/humanizationTransfection?op&id',
                title: 'Humanization Transfections',
                controller: 'HumanizationTransfectionController',
                templateUrl: helper.basepath('partials/humanizationTransfection.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.transfectionRequest', {
                url: '/transfectionRequest?op&id',
                title: 'Transfection Request',
                controller: 'ADTransfectionRequestController',
                templateUrl: helper.basepath('partials/adTransfectionRequest.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ade.enums', {
                url: '/enums',
                title: 'Dropdown Editor',
                controller: 'EnumsController',
                templateUrl: helper.basepath('partials/enums.html'),
                resolve: helper.resolveFor('dndLists', 'htmlSortable')
            })
            .state('app.io', {
                url: '/io',
                title: 'Immuno-Oncology',
                controller: 'IoController',
                templateUrl: helper.basepath('io.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readIO', 'adminIO'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.io.task', {
                url: '/task?op&id',
                title: 'Tasks',
                controller: 'IOTaskController',
                templateUrl: helper.basepath('partials/task.html'),
                resolve: helper.resolveFor()
            })
            .state('app.io.reagent', {
                url: '/reagent?op&id',
                title: 'Reagents',
                controller: 'ReagentController',
                templateUrl: helper.basepath('partials/reagent.html'),
                resolve: helper.resolveFor()
            })
            .state('app.io.enums', {
                url: '/enums',
                title: 'Dropdown Editor',
                controller: 'EnumsController',
                templateUrl: helper.basepath('partials/enums.html'),
                resolve: helper.resolveFor('dndLists', 'htmlSortable')
            })
            .state('app.ct', {
                url: '/ct',
                title: 'Cell Therapy',
                controller: 'CellTherapyController',
                templateUrl: helper.basepath('cellTherapy.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readCellTherapy', 'adminCellTherapy'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.ct.cellSource', {
                url: '/cellSource?op&id',
                title: 'Cell Source',
                controller: 'CTCellSourceController',
                templateUrl: helper.basepath('partials/cellSource.html'),
                resolve: helper.resolveFor('filestyle')
            })
            .state('app.ct.donor', {
                url: '/donor?op&id',
                title: 'Donor',
                controller: 'DonorController',
                templateUrl: helper.basepath('partials/donor.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ct.freeze', {
                url: '/freeze?op&id',
                title: 'Cell Freeze Log',
                controller: 'CTFreezeController',
                templateUrl: helper.basepath('partials/ctFreeze.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ct.thaw', {
                url: '/thaw?op&id',
                title: 'Cell Thaw Log',
                controller: 'CellThawController',
                templateUrl: helper.basepath('partials/ctThaw.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ct.experiment', {
                url: '/experiment?op&id',
                title: 'Experiments',
                controller: 'CTExperimentsController',
                templateUrl: helper.basepath('partials/ctExperiment.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ct.vessel', {
                url: '/vessel?op&id',
                title: 'Vessels',
                controller: 'CTVesselController',
                templateUrl: helper.basepath('partials/ctVessel.html'),
                resolve: helper.resolveFor()
            })
            .state('app.ct.chemData', {
                url: '/chemData?op&id',
                title: 'Bioreactor Chem Data',
                controller: 'CTChemDataController',
                templateUrl: helper.basepath('partials/ctChemData.html'),
                resolve: helper.resolveFor('filestyle')
            })
            .state('app.ct.enums', {
                url: '/enums',
                title: 'Dropdown Editor',
                controller: 'EnumsController',
                templateUrl: helper.basepath('partials/enums.html'),
                resolve: helper.resolveFor('dndLists', 'htmlSortable')
            })
            .state('app.pd', {
                url: '/pd',
                title: 'PD',
                controller: 'PdController',
                templateUrl: helper.basepath('pd.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readPD', 'adminPD'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.pd.bioreactor', {
                url: '/bioreactor?op&id',
                title: 'Bioreactors',
                controller: 'BioreactorController',
                templateUrl: helper.basepath('partials/bioreactor.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.bioreactorGraph', {
                url: '/bioreactorGraph?property&id&tab',
                title: 'Bioreactor Graphs',
                controller: 'BioreactorGraphController',
                templateUrl: helper.basepath('partials/bioreactorGraph.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.bioreactorChemData', {
                url: '/bioreactorChemData?op&id',
                title: 'Bioreactor Chem Data',
                controller: 'BioreactorChemDataController',
                templateUrl: helper.basepath('partials/bioreactorChemData.html'),
                resolve: helper.resolveFor('filestyle')
            })
            .state('app.pd.bioreactorVCDData', {
                url: '/bioreactorVCDData?op&id',
                title: 'Bioreactor VCD Data',
                controller: 'BioreactorVCDDataController',
                templateUrl: helper.basepath('partials/bioreactorVCDData.html'),
                resolve: helper.resolveFor('filestyle')
            })
            .state('app.pd.bioreactorCondition', {
                url: '/bioreactorCondition?op&id',
                title: 'Bioreactor Conditions',
                controller: 'BioreactorConditionController',
                templateUrl: helper.basepath('partials/bioreactorCondition.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.bioreactorExperiment', {
                url: '/bioreactorExperiment?op&id',
                title: 'Bioreactor Experiments',
                controller: 'BioreactorExperimentController',
                templateUrl: helper.basepath('partials/bioreactorExperiment.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.bioreactorPurification', {
                url: '/bioreactorPurification?op&id',
                title: 'Bioreactor Purifications',
                controller: 'BioreactorPurificationController',
                templateUrl: helper.basepath('partials/bioreactorPurification.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.bioreactorAnalytic', {
                url: '/bioreactorAnalytic?op&id',
                title: 'Bioreactor Analytics',
                controller: 'BioreactorAnalyticsController',
                templateUrl: helper.basepath('partials/bioreactorAnalytic.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.cellLineExperiment', {
                url: '/cellLineExperiment?op&id',
                title: 'Cell Line Experiments',
                controller: 'CellLineExperimentController',
                templateUrl: helper.basepath('partials/cellLineExperiment.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.cellLineHarvest', {
                url: '/cellLineHarvest?op&id',
                title: 'Cell Line Harvests',
                controller: 'CellLineHarvestController',
                templateUrl: helper.basepath('partials/cellLineHarvest.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.cellLinePurification', {
                url: '/cellLinePurification?op&id',
                title: 'Cell Line Purifications',
                controller: 'CellLinePurificationController',
                templateUrl: helper.basepath('partials/cellLinePurification.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.cellLineAnalytic', {
                url: '/cellLineAnalytic?op&id',
                title: 'Cell Line Analytics',
                controller: 'CellLineAnalyticController',
                templateUrl: helper.basepath('partials/cellLineAnalytic.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.cellLinePackage', {
                url: '/cellLinePackage?op&id',
                title: 'Cell Line Packages',
                controller: 'CellLinePackageController',
                templateUrl: helper.basepath('partials/cellLinePackage.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.analysisRequest', {
                url: '/analysisRequest?op&id',
                title: 'Analytical Request',
                controller: 'PDAnalysisRequestController',
                templateUrl: helper.basepath('partials/pdAnalysisRequest.html'),
                resolve: helper.resolveFor('filestyle', 'ui.sortable'),
            })
            .state('app.pd.pdAnalysis', {
                url: '/analysis?op&id',
                title: 'PD Analytics',
                controller: 'PDAnalysisController',
                templateUrl: helper.basepath('partials/pdAnalysis.html'),
                resolve: helper.resolveFor('filestyle'),
            })
            .state('app.pd.cellExpansion', {
                url: '/cellExpansion?op&id',
                title: 'Cell Expansions',
                controller: 'CellExpansionController',
                templateUrl: helper.basepath('partials/cellExpansion.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.cellExpansionData', {
                url: '/cellExpansionData?op&id',
                title: 'Cell Expansion Data',
                controller: 'CellExpansionDataController',
                templateUrl: helper.basepath('partials/cellExpansionData.html'),
                resolve: helper.resolveFor()
            })
            .state('app.pd.enums', {
                url: '/enums',
                title: 'Dropdown Editor',
                controller: 'EnumsController',
                templateUrl: helper.basepath('partials/enums.html'),
                resolve: helper.resolveFor('dndLists', 'htmlSortable')
            })
            .state('app.query', {
                url: '/query',
                title: 'Query',
                controller: 'QueriesController',
                templateUrl: helper.basepath('query.html'),
                resolve: helper.resolveFor('codemirror', 'ui.codemirror', 'codemirror-modes-sql', 'ngTable', 'ngTableExport')
            })
            .state('app.admin', {
                url: '/admin',
                title: 'Administration',
                controller: 'AdministrationController',
                controllerAs: 'dash3',
                templateUrl: helper.basepath('admin.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: 'adminUser',
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.facilities', {
                url: '/facilities',
                title: 'Facilities',
                controller: 'FacilitiesController',
                templateUrl: helper.basepath('facilities.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['readFacilities', 'adminFacilities'],
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
            .state('app.facilities.freezer', {
                url: '/freezer',
                title: 'Freezer',
                controller: 'FreezerController',
                templateUrl: helper.basepath('partials/freezer.html'),
                resolve: helper.resolveFor(),
            })
            .state('app.facilities.map', {
                url: '/map',
                title: 'Map',
                controller: 'MapController',
                templateUrl: helper.basepath('partials/floorplan.html'),
                resolve: helper.resolveFor('svg-pan-zoom'),
            })
            .state('app.facilities.network', {
                url: '/network',
                title: 'Network',
                controller: 'NetworkController',
                templateUrl: helper.basepath('partials/network.html'),
                resolve: helper.resolveFor(),
            })
            .state('app.facilities.electrical', {
                url: '/electrical',
                title: 'Electrical',
                controller: 'ElectricalController',
                templateUrl: helper.basepath('partials/electrical.html'),
                resolve: helper.resolveFor('svg-pan-zoom'),
            })
            .state('app.facilities.instrument', {
                url: '/instrument?op&id',
                title: 'instrument',
                controller: 'InstrumentController',
                templateUrl: helper.basepath('partials/instrument.html'),
                resolve: helper.resolveFor()
            })
            .state('app.facilities.enums', {
                url: '/enums',
                title: 'Dropdown Editor',
                controller: 'EnumsController',
                templateUrl: helper.basepath('partials/enums.html'),
                resolve: helper.resolveFor('dndLists', 'htmlSortable')
            })
                // Equipment Management Page - allows connection to FTE for later intergration
                // to the Accounting project
            .state('app.equipmentManagement', {
                url: '/equipmentManagement',
                title: 'Equipment Management',
                controller: 'AccountingController',
                templateUrl: helper.basepath('equipmentManagement.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: 'accountingUser',
                        redirectTo: 'page.permissionDenied'
                    }
                }

            })
                // Page routing for accounting tab and the sub tabs associated
                // Allows users with user admin permissions to access these pages
            .state('app.accounting', {
                url: '/accounting',
                title: 'Accounting',
                controller: 'AccountingController',
                templateUrl: helper.basepath('accounting.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: 'accountingUser',
                        redirectTo: 'page.permissionDenied'
                    }
                }
            })
                    // First subpage of Accounting - Project Billing
                    // This page allows users to view project billing, individual billing statements,
                    // and upload new statements
            .state('app.accounting.accounting', {
                url: '/projectBilling?op&id',
                title: 'Project Billing',
                //controller: 'AccountingController',
                controller: 'accBillingController',
                templateUrl: helper.basepath('partials/accounting.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['accountingUser'],
                        redirectTo: 'page.permissionDenied'
                    }
                }

            })
                    // Second subpage of Accounting - Project Staffing
                    // tracks staffing associated with each project and time dedicated by each person - FTE subpage
            .state('app.accounting.fte', {
                url: '/projectStaffing?op&id',
                title: 'Project Staffing',
                controller: 'ProjectStaffing',
                templateUrl: helper.basepath('partials/fte.html'),
                resolve: helper.resolveFor(),
                data: {
                    permissions: {
                        only: ['accountingUser'],
                        redirectTo: 'page.permissionDenied'
                    }
                }

            })
            .state('app.tools', {
                url: '/tools',
                abstract: true,
                resolve: helper.resolveFor(),
            })
            .state('app.tools.humanization', {
                url: '/humanization',
                title: 'Humanization',
                controller: 'HumanizationController',
                templateUrl: helper.basepath('partials/humanization.html'),
                resolve: helper.resolveFor(),
            })
            .state('app.tools.seqUtils', {
                url: '/seqUtils',
                title: 'Sequence Utilities',
                controller: 'SequenceUtilsController',
                templateUrl: helper.basepath('partials/seqUtils.html'),
                resolve: helper.resolveFor('sequence-viewer')
            })
            .state('app.tools.instrumentData', {
                url: '/instrumentData',
                title: 'Instrument Data',
                controller: 'InstrumentDataController',
                templateUrl: helper.basepath('partials/instrumentData.html'),
                resolve: helper.resolveFor()
            })
            .state('app.document', {
                url: '/document',
                title: 'Change Log',
                controller: 'DocumentController',
                templateUrl: helper.basepath('document.html'),
                resolve: helper.resolveFor()
            })
            .state('app.userSettings', {
                url: '/settings',
                title: 'Settings',
                controller: 'UserController',
                controllerAs: 'dash3',
                templateUrl: helper.basepath('user-settings.html'),
                resolve: helper.resolveFor()
            })
            //
            // Single Page Routes
            // -----------------------------------
            .state('page', {
                url: '/page',
                templateUrl: 'app/pages/page.html',
                resolve: helper.resolveFor(),
                controller: ['$rootScope', function ($rootScope) {
                    $rootScope.app.layout.isBoxed = false;
                }]
            })
            .state('page.permissionDenied', {
                url: '/permissionDenied',
                title: 'Permission Denied',
                controller: 'PermissionDeniedController',
                templateUrl: 'app/pages/permissionDenied.html'
            })
            .state('page.signin', {
                url: '/signin',
                title: 'SignIn',
                templateUrl: 'app/pages/signin.html'
            })
            .state('page.404', {
                url: '/404',
                title: 'Not Found',
                templateUrl: 'app/pages/404.html'
            });
    }
})();
(function () {
    'use strict';
    angular
        .module('app.translate')
        .config(translateConfig);
    translateConfig.$inject = ['$translateProvider'];

    function translateConfig($translateProvider) {
        $translateProvider.useStaticFilesLoader({
            prefix: 'app/i18n/',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('en');
        $translateProvider.useLocalStorage();
        $translateProvider.usePostCompiling(true);
        $translateProvider.useSanitizeValueStrategy('escape');
    }
})();
(function () {
    'use strict';
    angular
        .module('app.translate')
        .run(translateRun);
    translateRun.$inject = ['$rootScope', '$translate'];

    function translateRun($rootScope, $translate) {
        // Internationalization
        // ----------------------
        $rootScope.language = {
            // Handles language dropdown
            listIsOpen: false,
            // list of available languages
            available: {
                'en': 'English',
                'cn': '简体中文 (Simplified Chinese)'
            },
            // display always the current ui language
            init: function () {
                const proposedLanguage = $translate.proposedLanguage() || $translate.use();
                const preferredLanguage = $translate.preferredLanguage(); // we know we have set a preferred one in app.config
                $rootScope.language.selected = $rootScope.language.available[(proposedLanguage || preferredLanguage)];
            },
            set: function (localeId) {
                // Set the new idiom
                $translate.use(localeId);
                // save a reference for the current language
                $rootScope.language.selected = $rootScope.language.available[localeId];
                // finally toggle dropdown
                $rootScope.language.listIsOpen = !$rootScope.language.listIsOpen;
            }
        };
        $rootScope.language.init();
    }
})();
/**=========================================================
* Module: animate-enabled.js
* Enable or disables ngAnimate for element with directive
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.utils')
        .directive('animateEnabled', animateEnabled);
    animateEnabled.$inject = ['$animate'];

    function animateEnabled($animate) {
        return {
            link: link,
            restrict: 'A'
        };

        function link(scope, element, attrs) {
            scope.$watch(function () {
                return scope.$eval(attrs.animateEnabled, scope);
            }, function (newValue) {
                $animate.enabled(!!newValue, element);
            });
        }
    }
})();
/**=========================================================
* Module: browser.js
* Browser detection
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.utils')
        .service('Browser', Browser);
    Browser.$inject = ['$window'];

    function Browser($window) {
        return $window.jQBrowser;
    }
})();
/**=========================================================
 * Module: filestyle.js
 * Initializes the fielstyle plugin
 =========================================================*/

 (function() {
    'use strict';

    angular
        .module('app.utils')
        .directive('filestyle', filestyle);

    function filestyle () {
        return {
            link: link,
            restrict: 'A'
        };

        function link(scope, element) {
            const options = element.data();
            // old usage support
            options.classInput = element.data('classinput') || options.classInput;
            element.filestyle(options);
        }
    }

})();
/**=========================================================
* Module: clear-storage.js
* Removes a key from the browser storage via element click
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.utils')
        .directive('resetKey', resetKey);
    resetKey.$inject = ['$state', '$localStorage'];

    function resetKey($state, $localStorage) {
        return {
            link: link,
            restrict: 'A',
            scope: {
                resetKey: '@'
            }
        };

        function link(scope, element) {
            element.on('click', function (e) {
                e.preventDefault();
                if (scope.resetKey) {
                    delete $localStorage[scope.resetKey];
                    $state.go($state.current, {}, { reload: true });
                } else {
                    $.error('No storage key specified for reset.');
                }
            });
        }
    }
})();
/**=========================================================
* Module: load-css.js
* Request and load into the current page a css file
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.utils')
        .directive('loadCss', loadCss);

    function loadCss() {
        return {
            link: link,
            restrict: 'A'
        };

        function link(scope, element, attrs) {
            element.on('click', function (e) {
                if (element.is('a')) { e.preventDefault(); }
                const uri = attrs.loadCss;
                let link;
                if (uri) {
                    link = createLink(uri);
                    if (!link) {
                        $.error('Error creating stylesheet link element.');
                    }
                } else {
                    $.error('No stylesheet location defined.');
                }
            });
        }

        function createLink(uri) {
            const linkId = 'autoloaded-stylesheet';
            const ele = $('#' + linkId);
            const oldLink = ele.attr('id', linkId + '-old');
            $('head').append($('<link/>').attr({
                'id': linkId,
                'rel': 'stylesheet',
                'href': uri
            }));
            if (oldLink.length) {
                oldLink.remove();
            }
            return ele;
        }
    }
})();
/**=========================================================
* Module: now.js
* Provides a simple way to display the current time formatted
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.utils')
        .directive('now', now);
    now.$inject = ['dateFilter', '$interval'];

    function now(dateFilter, $interval) {
        return {
            link: link,
            restrict: 'EA'
        };

        function link(scope, element, attrs) {
            const format = attrs.format;

            function updateTime() {
                const dt = dateFilter(new Date(), format);
                element.text(dt);
            }
            updateTime();
            const intervalPromise = $interval(updateTime, 1000);
            scope.$on('$destroy', function () {
                $interval.cancel(intervalPromise);
            });
        }
    }
})();
/**=========================================================
* Module: table-checkall.js
* Tables check all checkbox
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.utils')
        .directive('checkAll', checkAll);

    function checkAll() {
        return {
            link: link,
            restrict: 'A'
        };

        function link(scope, element) {
            element.on('change', function () {
                const $this = $(this),
                    index = $this.index() + 1,
                    checkbox = $this.find('input[type="checkbox"]'),
                    table = $this.parents('table');
                // Make sure to affect only the correct checkbox column
                table.find('tbody > tr > td:nth-child(' + index + ') input[type="checkbox"]')
                    .prop('checked', checkbox[0].checked);
            });
        }
    }
})();
/**=========================================================
* Module: trigger-resize.js
* Triggers a window resize event from any element
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.utils')
        .directive('triggerResize', triggerResize);
    triggerResize.$inject = ['$window', '$timeout'];

    function triggerResize($window, $timeout) {
        return {
            link: link,
            restrict: 'A'
        };

        function link(scope, element) {
            element.on('click', function () {
                $timeout(function () {
                    $window.dispatchEvent(new Event('resize'));
                });
            });
        }
    }
})();
/**=========================================================
* Module: utils.js
* Utility library to use across the theme
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.utils')
        .service('Utils', Utils);
    Utils.$inject = ['$window', 'APP_MEDIAQUERY'];

    function Utils($window, APP_MEDIAQUERY) {
        const $html = angular.element('html'),
            $win = angular.element($window),
            $body = angular.element('body');
        return {
            // DETECTION
            support: {
                transition: (function () {
                    const transitionEnd = (function () {
                        let element = document.body || document.documentElement,
                            transEndEventNames = {
                                WebkitTransition: 'webkitTransitionEnd',
                                MozTransition: 'transitionend',
                                OTransition: 'oTransitionEnd otransitionend',
                                transition: 'transitionend'
                            },
                            name;
                        for (name in transEndEventNames) {
                            if (element.style[name] !== undefined) { return transEndEventNames[name]; }
                        }
                    }());
                    return transitionEnd && { end: transitionEnd };
                })(),
                animation: (function () {
                    const animationEnd = (function () {
                        let element = document.body || document.documentElement,
                            animEndEventNames = {
                                WebkitAnimation: 'webkitAnimationEnd',
                                MozAnimation: 'animationend',
                                OAnimation: 'oAnimationEnd oanimationend',
                                animation: 'animationend'
                            },
                            name;
                        for (name in animEndEventNames) {
                            if (element.style[name] !== undefined) { return animEndEventNames[name]; }
                        }
                    }());
                    return animationEnd && { end: animationEnd };
                })(),
                requestAnimationFrame: window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                },
                /*jshint -W069*/
                touch: (
                    ('ontouchstart' in window && navigator.userAgent.toLowerCase().match(/mobile|tablet/)) ||
                    (window.DocumentTouch && document instanceof window.DocumentTouch) ||
                    (window.navigator['msPointerEnabled'] && window.navigator['msMaxTouchPoints'] > 0) || //IE 10
                    (window.navigator['pointerEnabled'] && window.navigator['maxTouchPoints'] > 0) || //IE >=11
                    false
                ),
                mutationobserver: (window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null)
            },
            // UTILITIES
            isInView: function (element, options) {
                /*jshint -W106*/
                const $element = $(element);
                if (!$element.is(':visible')) {
                    return false;
                }
                const window_left = $win.scrollLeft(),
                    window_top = $win.scrollTop(),
                    offset = $element.offset(),
                    left = offset.left,
                    top = offset.top;
                options = $.extend({ topoffset: 0, leftoffset: 0 }, options);
                return top + $element.height() >= window_top && top - options.topoffset <= window_top + $win.height() &&
                    left + $element.width() >= window_left && left - options.leftoffset <= window_left + $win.width();
            },
            langdirection: $html.attr('dir') === 'rtl' ? 'right' : 'left',
            isTouch: function () {
                return $html.hasClass('touch');
            },
            isSidebarCollapsed: function () {
                return $body.hasClass('aside-collapsed') || $body.hasClass('aside-collapsed-text');
            },
            isSidebarToggled: function () {
                return $body.hasClass('aside-toggled');
            },
            isMobile: function () {
                return $win.width() < APP_MEDIAQUERY.tablet;
            }
        };
    }
})();
/**=========================================================
* Module: sidebar-menu.js
* Handle sidebar collapsible elements
=========================================================*/
(function () {
    'use strict';
    angular
        .module('app.sidebar')
        .controller('SidebarController', SidebarController);
    SidebarController.$inject = ['$rootScope', '$scope', '$state', 'SidebarLoader', 'Utils', 'Global', 'PermissionService'];

    function SidebarController($rootScope, $scope, $state, SidebarLoader, Utils, Global, PermissionService) {
        $scope.global = Global;
        activate();
        ////////////////
        function activate() {
            const collapseList = [];
            // demo: when switch from collapse to hover, close all items
            $rootScope.$watch('app.layout.asideHover', function (oldVal, newVal) {
                if (newVal === false && oldVal === true) {
                    closeAllBut(-1);
                }
            });
            // Load menu from json file
            // -----------------------------------
            SidebarLoader.getMenu(sidebarReady);

            function sidebarReady(items) {
                $scope.menuItems = items.data;
            }
            // Handle sidebar and collapse items
            // ----------------------------------
            $scope.getMenuItemPropClasses = function (item) {
                return (item.heading ? 'nav-heading' : '') +
                    (isActive(item) ? ' active' : '');
            };
            $scope.addCollapse = function ($index, item) {
                collapseList[$index] = $rootScope.app.layout.asideHover ? true : !isActive(item);
            };
            $scope.isCollapse = function ($index) {
                return (collapseList[$index]);
            };
            // Not used, might be used later
            $scope.checkRolePerm = function (item) {
                if (item.permission) {
                    return PermissionService.checkPermission(item.permission)
                }
                if ($scope.global && $scope.global.user) {
                    return true;
                }
                // Not authenticated. Show nothing.
                return false;
            };
            $scope.toggleCollapse = function ($index, isParentItem) {
                // collapsed sidebar doesn't toggle drodopwn
                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) { return true; }
                // make sure the item index exists
                if (angular.isDefined(collapseList[$index])) {
                    if (!$scope.lastEventFromChild) {
                        collapseList[$index] = !collapseList[$index];
                        closeAllBut($index);
                    }
                } else if (isParentItem) {
                    closeAllBut(-1);
                }
                $scope.lastEventFromChild = isChild($index);
                //$window.location.reload();
                return true;
            };
            // Controller helpers
            // -----------------------------------
            // Check item and children active state
            function isActive(item) {
                if (!item) { return; }
                if (!item.sref || item.sref === '#') {
                    let foundActive = false;
                    angular.forEach(item.submenu, function (value) {
                        if (isActive(value)) { foundActive = true; }
                    });
                    return foundActive;
                } else {
                    return $state.is(item.sref) || $state.includes(item.sref);
                }
            }

            function closeAllBut(index) {
                index += '';
                for (let i in collapseList) {
                    if (index < 0 || index.indexOf(i) < 0) {
                        collapseList[i] = true;
                    }
                }
            }

            function isChild($index) {
                /*jshint -W018*/
                return (typeof $index === 'string') && !($index.indexOf('-') < 0);
            }
        } // activate
    }
})();
/**=========================================================
* Module: sidebar.js
* Wraps the sidebar and handles collapsed state
=========================================================*/
(function() {
    "use strict";
    angular.module("app.sidebar").directive("sidebar", sidebar);
    sidebar.$inject = ["$rootScope", "$timeout", "$window", "Utils"];

    function sidebar($rootScope, $timeout, $window, Utils) {
        const $win = angular.element($window);
        return {
            // bindToController: true,
            // controller: Controller,
            // controllerAs: 'vm',
            link: link,
            restrict: "EA",
            template: '<nav class="sidebar" ng-transclude></nav>',
            transclude: true,
            replace: true
            // scope: {}
        };

        function link(scope, element, attrs) {
            let currentState = $rootScope.$state.current.name;
            const $sidebar = element;
            const eventName = Utils.isTouch() ? "click" : "mouseenter";
            let subNav = $();
            let wrapper, sbclickEvent;
            $sidebar.on(eventName, ".nav > li", function() {
                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {
                    subNav.trigger("mouseleave");
                    subNav = toggleMenuItem($(this), $sidebar);
                    // Used to detect click and touch events outside the sidebar
                    sidebarAddBackdrop();
                }
            });
            scope.$on("closeSidebarMenu", function() {
                removeFloatingNav();
            });
            // Normalize state when resize to mobile
            $win.on("resize", function() {
                if (!Utils.isMobile()) { asideToggleOff(); }
            });
            // Adjustment on route changes
            $rootScope.$on("$stateChangeStart", function(event, toState) {
                currentState = toState.name;
                // Hide sidebar automatically on mobile
                asideToggleOff();
                $rootScope.$broadcast("closeSidebarMenu");
            });
            // Autoclose when click outside the sidebar
            if (angular.isDefined(attrs.sidebarAnyclickClose)) {
                wrapper = $(".wrapper");
                sbclickEvent = "click.sidebar";
                $rootScope.$watch("app.asideToggled", watchExternalClicks);
            }
            //////
            function watchExternalClicks(newVal) {
                // if sidebar becomes visible
                if (newVal === true) {
                    $timeout(function() {
                        // render after current digest cycle
                        wrapper.on(sbclickEvent, function(e) {
                            // if not child of sidebar
                            if (!$(e.target).parents(".aside").length) {
                                asideToggleOff();
                            }
                        });
                    });
                } else {
                    // dettach event
                    wrapper.off(sbclickEvent);
                }
            }

            function asideToggleOff() {
                $rootScope.app.asideToggled = false;
                if (!scope.$$phase) { scope.$apply(); } // anti-pattern but sometimes necessary
            }
        }
        ///////
        function sidebarAddBackdrop() {
            const $backdrop = $("<div/>", {class: "dropdown-backdrop"});
            $backdrop
                .insertAfter(".aside-inner")
                .on("click mouseenter", function() {
                    removeFloatingNav();
                });
        }
        // Open the collapse sidebar submenu items when on touch devices
        // - desktop only opens on hover
        function toggleTouchItem($element) {
            $element
                .siblings("li")
                .removeClass("open")
                .end()
                .toggleClass("open");
        }
        // Handles hover to open items under collapsed menu
        // -----------------------------------
        function toggleMenuItem($listItem, $sidebar) {
            removeFloatingNav();
            const ul = $listItem.children("ul");
            if (!ul.length) { return $(); }
            if ($listItem.hasClass("open")) {
                toggleTouchItem($listItem);
                return $();
            }
            const $aside = $(".aside");
            const $asideInner = $(".aside-inner"); // for top offset calculation
            // float aside uses extra padding on aside
            const mar =
                parseInt($asideInner.css("padding-top"), 0) +
                parseInt($aside.css("padding-top"), 0);
            const subNav = ul.clone().appendTo($aside);
            toggleTouchItem($listItem);
            const itemTop = $listItem.position().top + mar - $sidebar.scrollTop();
            const vwHeight = $win.height();
            subNav.addClass("nav-floating").css({
                position: $rootScope.app.layout.isFixed ? "fixed" : "absolute",
                top: itemTop,
                bottom:
                    subNav.outerHeight(true) + itemTop > vwHeight ? 0 : "auto"
            });
            subNav.on("mouseleave", function() {
                toggleTouchItem($listItem);
                subNav.remove();
            });
            return subNav;
        }

        function removeFloatingNav() {
            $(".dropdown-backdrop").remove();
            $(".sidebar-subnav.nav-floating").remove();
            $(".sidebar li.open").removeClass("open");
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('app.sidebar')
        .service('SidebarLoader', SidebarLoader);
    SidebarLoader.$inject = ['$http'];

    function SidebarLoader($http) {
        this.getMenu = getMenu;
        ////////////////
        function getMenu(onReady, onError) {
            const menuJson = 'server/sidebar-menu.json';
            const menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache
            onError = onError || function () {
                alert('Failure loading menu');
            };
            $http
                .get(menuURL)
                .then(onReady, onError);
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .service('TableSettingsLoader', TableSettingsLoader);
    TableSettingsLoader.$inject = ['$http'];

    function TableSettingsLoader($http) {
        this.getMenu = getMenu;
        ////////////////
        function getMenu(onReady, onError) {
            const menuJson = 'server/table-settings.json';
            const menuURL = menuJson + '?v=' + (new Date().getTime()); // jumps cache
            onError = onError || function () {
                alert('Failure loading table settings');
            };
            $http
                .get(menuURL)
                .then(onReady, onError);
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('HeaderController', HeaderController);
    HeaderController.$inject = ['$scope', 'Global', 'SignOut', '$window'];

    function HeaderController($scope, Global, SignOut, $window) {
        $scope.global = Global;
        $scope.SignOut = function () {
            SignOut.get(function (response) {
                if (response.status === 'success') {
                    $scope.global = null;
                    $window.location.href = "/";
                }
            });
        };
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('HomeController', HomeController);
    HomeController.$inject = ['$scope', '$state', 'Global'];

    function HomeController($scope, $state, Global) {
        if (Global && Global.authenticated) {
            $state.go("app.home");
        }
    }
})();
/**=========================================================
 * Module: sparkline.js
 * SparkLines Mini Charts
 =========================================================*/
(function () {
    'use strict';

    angular
        .module('systimu')
        .directive('sparkline', sparkline);

    function sparkline() {
        return {
            restrict: 'EA',
            scope: {
                'sparkline': '='
            },
            controller: Controller
        };
    }
    Controller.$inject = ['$scope', '$element', '$timeout', '$window'];
    function Controller($scope, $element, $timeout, $window) {
        const runSL = function () {
            initSparLine();
        };

        $timeout(runSL);

        function initSparLine() {
            let options = $scope.sparkline,
                data = $element.data();

            if (!options) { // if no scope options, try with data attributes
                options = data;
            } else if (data) { // data attributes overrides scope options
                options = angular.extend({}, options, data);
            }

            options.type = options.type || 'bar'; // default chart is bar
            options.disableHiddenCheck = true;

            $element.sparkline('html', options);

            if (options.resize) {
                $($window).resize(function () {
                    $element.sparkline('html', options);
                });
            }
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('RefLinkController', RefLinkController)
        .directive('refLinkDirective', function () {
            return {
                scope: {
                    refLinkList: "=info"
                },
                templateUrl: "app/views/partials/refLinkDirective.html",
                controller: "RefLinkController"
            };
        });

    RefLinkController.$inject = ['$scope'];
    function RefLinkController($scope) {
        $scope.enableEdit = function () {
            $scope.rowform.$show();
        };
        $scope.saveRow = function () {
            $scope.rowform.$submit();
        };
        $scope.addRow = function () {
            const EmptyRow = {
                section: null, name: null, url: null
            };
            $scope.refLinkList.data.push(EmptyRow);
        };
        $scope.removeRow = function (index) {
            //console.log("removing", index);
            $scope.refLinkList.data.splice(index, 1);
        };
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('RefController', RefController)
        .directive('referencesDirective', function () {
            return {
                scope: {
                    references: "=ref",
                    table: "=table",
                    accept: "=accept",
                    callback: "=cb"
                },
                templateUrl: "app/views/partials/referencesDirective.html",
                controller: "RefController"
            };
        });

        RefController.$inject = ['$scope', 'SiHttpUtil'];
    function RefController($scope, SiHttpUtil) {
        $scope.addFile = () => {
            $scope.references = SiHttpUtil.RefInit($scope.references);
            SiHttpUtil.UploadFile($scope.table, 'file', $scope.notes).then(resp => {
                $scope.references.files.push(resp.data);
                $scope.clearFileInput();
            })
        }
        $scope.addLink = () => {
            $scope.references = SiHttpUtil.RefInit($scope.references);
            $scope.references.links.push({name: $scope.name, url: $scope.url});
            $scope.name = null;
            $scope.url = null;
        }
        $('#file').change(() => {
            $scope.file = true;
            $scope.$digest();
        })


        $scope.removeFile = index => {
            $scope.references.files.splice(index, 1);
        }
        $scope.removeLink = index => {
            $scope.references.links.splice(index, 1);
        }

        $scope.clearFileInput = () => {
            $("#file").filestyle('clear');
            $scope.file = false;
        }

    }

})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('RefViewController', RefViewController)
        .directive('referenceViewDirective', function () {
            return {
                scope: {
                    references: "=ref",
                    callback: "=cb"
                },
                templateUrl: "app/views/partials/referencesViewDirective.html",
                controller: "RefViewController"
            };
        });

        RefViewController.$inject = ['$scope', 'SiHttpUtil'];
    function RefViewController($scope, SiHttpUtil) {
        $scope.dl = SiHttpUtil.DownloadFile;

        // Check references on initialization
        $scope.callback = () => {
            if (!$scope.references) {
                $scope.references = [];
            }
            if (!Array.isArray($scope.references)) {
                $scope.references = angular.fromJson($scope.references);
            }
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .directive('widgetDirective', function () {
            return {
                scope: {
                    widget: "=widget",
                    widgetdata: "=data",
                    widgetlist: "=widgetlist",
                    model: "=model",
                    index: "=index"
                },
                templateUrl: "app/views/partials/widgetDirective.html",
                controller: function ($scope) {
                    $scope.UserHash = $scope.model.UserHash;
                }
            }
        });
})();
//Permission Denied
(function () {
    'use strict';
    angular
        .module('systimu')
        .controller('PermissionDeniedController', PermissionDeniedController);
    PermissionDeniedController.$inject = ['$scope', '$http', 'Global', '$window',
        '$stateParams', '$rootScope', '$state'];

    function PermissionDeniedController($scope, $http, Global, $window, $stateParams, $rootScope, $state) {
        // Go to login page instead of permission denied page if not logged in
        if (Global.user == null) {
            $state.go('home');
        }
        $scope.m = {
            goback: () => {
                if (!$rootScope.prevState) {
                    $window.history.back();
                }
                $state.go($rootScope.prevState);
            }
        };
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .service('LogIn', LogInService);
    LogInService.$inject = ['$resource'];

    function LogInService($resource) {
        return $resource('/api/loginldap');
    }
})();
(function () {
    'use strict';
    angular
        .module('app.pages')
        .controller('LoginFormController', LoginFormController);
    LoginFormController.$inject = ['$window', 'LogIn'];

    function LoginFormController($window, LogIn) {
        const vm = this;
        activate();
        ////////////////
        function activate() {
            // bind here all data from the form
            vm.account = {};
            // place the message if something goes wrong
            vm.authMsg = '';
            vm.login = function () {
                vm.authMsg = '';
                if (vm.loginForm.$valid) {
                    const logIn = new LogIn({
                        username: vm.account.email,
                        password: vm.account.password
                    });
                    logIn.$save(function (response) {
                        if (response.status === 'success') {
                            $window.location.href = "/";
                        } else {
                            vm.authMsg = 'Incorrect credentials.';
                        }
                    }, function (err) {
                        vm.authMsg = err.data.status.message;
                    });
                } else {
                    // set as dirty if the user click directly to login so we show the validation messages
                    /*jshint -W106*/
                    vm.loginForm.account_email.$dirty = true;
                    vm.loginForm.account_password.$dirty = true;
                }
            };
        }
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .service('SignUp', SignUpService);
    SignUpService.$inject = ['$resource'];

    function SignUpService($resource) {
        return $resource('/users');
    }
})();
(function () {
    'use strict';
    angular
        .module('systimu')
        .service('SignOut', SignOutService);
    SignOutService.$inject = ['$resource'];

    function SignOutService($resource) {
        return $resource('/api/signout');
    }
})();
/*
 * Helper Modules
 */
(function () {
    'use strict';
    //Global service for global variables
    angular.module('systimu').factory("Global", [
        function () {
            const _this = this;
            // Config of domain address prefix for gateway service.
            const thisDomain = window.location.protocol + "//" + window.location.hostname + ":" + window.location.port;
            const gatewayUrl = thisDomain + '/api';
            _this._data = {
                user: null,
                permissions: [],
                authenticated: false,
                gateway: gatewayUrl,
                domain: thisDomain,
                server: null,
                env: null,
                helperAPI: null,
            };
            return _this._data;
        }
    ]);
})();
(function () {
    'use strict';
    // Share some util codes between controllers.
    angular.module('systimu').factory("SiUtil", ['SiHttpUtil',
        function (SiHttpUtil) {
            const _this = this;

            // Date picker utils.
            const dpGen = function () {
                // Generates a dp with *your* scope.
                // "this" would need to be re-bind to the $scope you use.
                const userScope = this;
                const dp = {};
                // NOTE(ww): Require the ".data" layer.
                dp.initDp = function (form, control, default_today) {
                    userScope[form].data[control] = {};
                    if (default_today) {
                        userScope[form].data[control].dt = new Date();
                    } else {
                        userScope[form].data[control].dt = null;
                    }
                    userScope[form].data[control].opened = false;
                };
                dp.dpFormat = "MM/dd/yyyy";
                // Toggle calendar popup. Bind "this", same as above.
                dp.dpOpen = function ($event, form, control) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    userScope[form].data[control].opened = !(userScope[form].data[control].opened);
                };
                return dp;
            };

            _this._data = {
                dateFormat: new Intl.DateTimeFormat('en-US'),
                dateTimeFormat: new Intl.DateTimeFormat('en-US', {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }),
                timeFormat: new Intl.DateTimeFormat('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                readableTimeFormat: new Intl.DateTimeFormat('en-us', {
                    weekday: "long",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                }),
                getReadableTimestamp: function (dbTimestamp) {
                    if (dbTimestamp) {
                        const date = new Date(dbTimestamp);
                        return _this._data.readableTimeFormat.format(date);
                    }
                    return null;
                },
                getDateOnly: function (dbTimestamp) {
                    if (dbTimestamp) {
                        const date = new Date(dbTimestamp);
                        return _this._data.dateFormat.format(date);
                    }
                    return null;
                },
                exponential: (data, digits = 2) => {
                    if(data && !isNaN(data)) {
                        return data.toExponential(digits);
                    }
                    return data;
                },
                getDateTime: function (dbTimestamp) {
                    if (dbTimestamp) {
                        const date = new Date(dbTimestamp);
                        return _this._data.dateTimeFormat.format(date);
                    }
                    return null;
                },
                getTimeOnly: function (dbTimestamp) {
                    if (dbTimestamp) {
                        const date = new Date(dbTimestamp);
                        return _this._data.timeFormat.format(date);
                    }
                    return null;
                },
                get24Time: function (hours, type) {
                    if (type === "PM" && hours < 12) {
                        hours = parseInt(hours) + 12;
                    } else if (type === "AM" && hours === 12) {
                        hours = parseInt(hours) - 12;
                    }
                    return hours;
                },
                initTime: function (element, tableData) {
                    if (element == null) {
                        element = {};
                    }
                    if (tableData == null) {
                        element.date = new Date();
                        element.date.setSeconds(0);
                    } else {
                        element.date = new Date(tableData);
                    }
                    element.type = element.date.getHours() >= 12 ? "PM" : "AM";
                    element.hours = (element.date.getHours() + 11) % 12 + 1;
                    element.minutes = element.date.getMinutes();
                    element.toggleAMPM = function (data) {
                        if (data.type === "PM") data.type = "AM";
                        else data.type = "PM";
                    }
                },
                getDisplayDescription: function (desp) {
                    if (!desp) {
                        return null;
                    }
                    if (desp.length < 51) {
                        return desp;
                    }
                    return desp.substring(0, 50) + "...";
                },
                getCheckBox: function (value) {
                    if (value && value === "No") {
                        return '';
                    } else if (value || value === "Yes") {
                        return '<i class="fa fa-check"></i>';
                    }
                    return '';
                },
                roundNumber: function (value) {
                    if (!value) {
                        return null;
                    }
                    return '<span title="' + value + '">' + Math.round(value * 100) / 100 + '</span>';
                },
                percentage: function (value) {
                    return '<span title="' + value + '">' + Math.round(value * 100) / 100 + ' %</span>';
                },
                separateList: function (data) {
                    if (!data) {
                        return null;
                    }
                    return angular.fromJson(data).join(", ");
                },
                getFormattedStatus: function (status) {
                    if (!status) {
                        return null;
                    }
                    const statusColors = {
                        "Pending": "warning",
                        "In Progress": "primary",
                        "In Purification": "info",
                        "Completed": "success",
                        "Failed": "danger",
                        "Submitted": "primary",
                        "Sorted": "success",
                        "Not Sorted": "info",
                        "Purified": "success",
                        "Not Purified": "warning",
                        "Yes": "success",
                        "No": "info",
                        "Active": "success",
                        "Planned": "info",
                        "Inactive": "warning",
                        "On Hold": "inverse",
                        "Denied": "danger",
                        "Approved": "purple"
                    };
                    const color = statusColors[status] || "inverse";
                    return '<span class="label label-' + color + '">' + status + "</>";
                },
                dbTableTranslator: function (table) {
                    const translateTable = SiHttpUtil.tableSettings.tableFriendlyNames;
                    // Check table name.
                    if (!(translateTable[table])) {
                        console.error("Unrecognized table. -" + table);
                        return table;
                    }
                    return translateTable[table];
                },
                ColDisplayRenderer: function (Transformer, data, type, full) {
                    if (type === 'display' || type === 'export') {
                        return Transformer(data);
                    }
                    return data;
                },
                ColDisplayRendererWPeriod: function (name, Transformer, data, type, full) {
                    if (type === 'display' && Transformer) {
                        return Transformer(full[name]);
                    }
                    return full[name];
                },
                ColDisplayFilterRenderer: function (Transformer, data, type, full) {
                    if (type === 'display' || type === 'filter') {
                        return Transformer(data);
                    }
                    return data;
                },
                CloneRenderer: function (name, data, type, full) {
                    if (!data) {
                        return null;
                    }
                    data = data.split(";");
                    const length = data.length;
                    for (let i = 0; i < length; i++) {
                        if (full[name] - 1 === i) {
                            data[i] = '<span style="background-color: #FFFF00;">' + data[i] + '</span>';
                        } else {
                            data[i] = data[i];
                        }
                    }
                    return data.join(', ');
                },
                progress: function (data) {
                    if (!data) {
                        return null;
                    }
                    const val = parseFloat(data);
                    if (isNaN(val)) {
                        return null;
                    }
                    const progressBar = document.createElement("div");
                    progressBar.setAttribute('role', 'progressbar');
                    progressBar.setAttribute('aria-valuenow', data);
                    progressBar.setAttribute('aria-valuemin', '0');
                    progressBar.setAttribute('aria-valuemax', '100');
                    progressBar.setAttribute("style", "width: " + data + "%");
                    progressBar.className = val >= 100 ? "progress-bar progress-bar-success" : "progress-bar progress-bar-info";
                    const parent = document.createElement("div");
                    parent.className = "progress progress-striped";
                    parent.append(progressBar);
                    return parent.outerHTML;
                },
                hashCode: str => {
                    const x = str || "";
                    let hash = 0;
                    for (let i = 0; i < x.length; i++) {
                        hash = ((hash<<5) - hash) + x.charCodeAt(i);
                        hash = hash & hash;
                    }
                    return hash;
                },
                dp: dpGen,
                // Return true to show error information.
                validate: function (formInstance, name, type, special_checker) {
                    if (special_checker) {
                        return name === special_checker.field_name;
                    }
                },
                // Convert a null to false. Can be used for wrapper of checkbox value.
                wrapBoolean: function (val) {
                    return (val) ? val : false;
                },
                // Takes a list of objects
                // Returns the average of all the values as an object with the same keys
                AverageList: function (list) {
                    const result = {};
                    for (let properties in list[0]) {
                        if (list[0].hasOwnProperty(properties)) {
                            let values = list.map(obj => obj[properties]);
                            // Calculate sum and filter out null values
                            values = values.filter(x => x !== null);
                            result[properties] = values.length > 0 ? values.reduce((a, b) => a + b) / values.length : null;
                        }
                    }
                    return result;
                },
                // Calculates the average and total yield used in purifications
                CalculateAverages: function (prop, form) {
                    const average = _this._data.AverageList(form[prop]);
                    form.averages[prop] = average;
                    if (average.yield) {
                        form.totalYield *= average.yield > 100 ? 1 : average.yield / 100;
                    }
                },
                GetPurificationTagMethod: (proteinId, tags, methods) => {
                    return SiHttpUtil.FetchOneEntry("protein", proteinId).then(resp => {
                        if (resp.Plasmids.length > 0) {
                            for (let i = 0; i < resp.Plasmids.length; i++) {
                                let currPlasmid = resp.Plasmids[i];
                                if (!currPlasmid.ENUM_plasmidTag) continue;
                                if (!currPlasmid.ENUM_plasmidTag.includes("Kappa") &&
                                    !currPlasmid.ENUM_plasmidTag.includes("Lambda")) {
                                        return _this._data.PurificationTagMethodMap(currPlasmid.ENUM_plasmidTag, tags, methods);
                                    }
                            }
                        }
                        return { tag: "Other", methods: methods };
                    })
                },
                PurificationTagMethodMap: function (plasmidTag, purificationTags, purificationMethods) {
                    let methodFilter, methods, tag;
                    if (plasmidTag.includes("His")) {
                        methodFilter = "His";
                        tag = "His10";
                    } else {
                        tag = purificationTags.filter(tag => tag.startsWith(plasmidTag.charAt(0)));
                        if (tag.length > 0) {
                            tag = tag[0];
                        } else {
                            tag = "Other";
                        }
                        if (plasmidTag.startsWith('h') || plasmidTag.startsWith('m') || plasmidTag.startsWith('Rb')) {
                            methodFilter = "ProA";
                        } else if (plasmidTag.startsWith('gt') || plasmidTag.startsWith('rt')) {
                            methodFilter = "ProG";
                        }
                    }
                    methods = purificationMethods.filter(method => method.startsWith(methodFilter));
                    methods.push("Other");
                    return { methods: methods, tag: tag };
                },
                PasteTableIntoInputs: function (form, inputs, event) {
                    // form and inputs assumed to be an array
                    const clipboard = event.originalEvent.clipboardData.getData('text').split("\n");
                    for (let row = 0; row < form.length; row++) {
                        const curr = clipboard[row].split("\t");
                        for (let col = 0; col < inputs.length; col++) {
                            form[row][inputs[col]] = isNaN(curr[col]) ? curr[col] : parseFloat(curr[col]);
                        }
                    }
                }
            };

            const ColDisplayers = {};
            ColDisplayers.ShortDateDisplayer = _this._data.ColDisplayFilterRenderer.bind(undefined, _this._data.getDateOnly);
            ColDisplayers.DateTimeDisplayer = _this._data.ColDisplayFilterRenderer.bind(undefined, _this._data.getDateTime);
            ColDisplayers.ShortTimeDisplayer = _this._data.ColDisplayFilterRenderer.bind(undefined, _this._data.getTimeOnly);
            ColDisplayers.DescriptionDisplayer = _this._data.ColDisplayRenderer.bind(undefined, _this._data.getDisplayDescription);
            ColDisplayers.StatusDisplayer = _this._data.ColDisplayRenderer.bind(undefined, _this._data.getFormattedStatus);
            ColDisplayers.CheckDisplayer = _this._data.ColDisplayRenderer.bind(undefined, _this._data.getCheckBox);
            ColDisplayers.RoundDisplayer = _this._data.ColDisplayRenderer.bind(undefined, _this._data.roundNumber);
            ColDisplayers.PercentageDisplayer = _this._data.ColDisplayRenderer.bind(undefined, _this._data.percentage);
            ColDisplayers.ListDisplayer = _this._data.ColDisplayRenderer.bind(undefined, _this._data.separateList);
            ColDisplayers.ExponentialDisplayer = _this._data.ColDisplayRenderer.bind(undefined, _this._data.exponential);
            ColDisplayers.ProgressDisplayer = _this._data.ColDisplayRenderer.bind(undefined, _this._data.progress);
            // Hash Convert.
            ColDisplayers.GetHashConvertDisplayer = function (Hash) {
                return SiHttpUtil.IdToVal.bind(undefined, Hash);
            };
            ColDisplayers.FixJoinDisplay = function (name, Transformer) {
                return _this._data.ColDisplayRendererWPeriod.bind(undefined, name, Transformer);
            };
            ColDisplayers.CloneDisplayer = function (name) {
                return _this._data.CloneRenderer.bind(undefined, name);
            };
            _this._data.ColDisplayers = ColDisplayers;

            return _this._data;
        }
    ]);
})();
(function () {
    'use strict';
    // Service for common http requests.
    angular.module('systimu').factory("SiHttpUtil", ['$http', 'Global', 'DTColumnBuilder', 'DTOptionsBuilder', 'Notify', 'Colors', 'TableSettingsLoader', '$location', '$window', '$rootScope',
        function ($http, Global, DTColumnBuilder, DTOptionsBuilder, Notify, Colors, TableSettingsLoader, $location, $window, $rootScope) {
            const _this = this;
            const global = Global;

            TableSettingsLoader.getMenu(tableSettingsReady);

            function tableSettingsReady(items) {
                _this._data.tableSettings = items.data;
            }

            _this._data = {
                helperAPIUrl: global.helperAPI,
                tableSettings: {},
                initDtOptions: function (dtCols, dtData, rowCallback, readyCallback) {
                    return DTOptionsBuilder.fromFnPromise(
                        new Promise(function (resolve, reject) {
                            resolve(dtData);
                            readyCallback();
                        })
                    )
                        .withOption('rowCallback', rowCallback)
                        .withOption('deferRender', true)
                        .withOption('lengthMenu', [[10, 25, 50, 100, -1], [10, 25, 50, 100, "All"]])
                        .withDisplayLength($rootScope.app.layout.tableRows)
                        .withOption('responsive', true)
                        .withButtons([
                            {
                                extend: 'colvis',
                                text: 'Columns'
                            },
                            {
                                extend: 'copy',
                                text: 'Copy'
                            },
                            {
                                extend: 'csv',
                                filename: 'export',
                                text: 'Export CSV'
                            },
                            {
                                extend: 'excelHtml5',
                                filename: 'export',
                                text: 'Export Excel',
                                // Make it export a different data (for notes)
                                // exportOptions: {
                                //     orthogonal: "export"
                                // }
                            },
                            {
                                extend: 'print',
                                title: "",
                                text: 'Print',
                                exportOptions: {
                                    columns: ':visible'
                                }
                            }
                        ])
                        .withOption('order', [[_this._data.dtColNameToIdx(dtCols, 'name'), 'desc']])
                        .withColReorder();
                },
                initDtColumns: function (dtCols, dtData, colFilter, colTranslator, colHidden, colOrder) {
                    // Sanity check.
                    if (!(colFilter && colTranslator)) {
                        console.error("Missing params.");
                    }
                    // New way
                    if (colOrder) {
                        for (let i = 0; i < colOrder.length; i++) {
                            const col = colOrder[i];
                            const column = DTColumnBuilder.newColumn(col).withTitle(colTranslator(col));
                            if (col === 'id') {
                                column.withOption('searchable', false).notVisible();
                            }
                            if (col === 'name') {
                                column.withOption('type', 'natural')
                            }
                            if (colHidden && colHidden(col)) {
                                column.notVisible();
                            }
                            dtCols.push(column.withOption('defaultContent', ''));
                        }
                    } else {
                        // Init columns.
                        const FirstRow = dtData[0];
                        if (FirstRow) {
                            //console.log(FirstRow);
                            for (const col in FirstRow) {
                                if (!colFilter(col)) {
                                    const column = DTColumnBuilder.newColumn(col).withTitle(colTranslator(col));
                                    if (col === 'id') {
                                        column.withOption('searchable', false).notVisible();
                                    }
                                    if (col === 'name') {
                                        column.withOption('type', 'natural')
                                    }
                                    if (colHidden && colHidden(col)) {
                                        column.notVisible();
                                    }
                                    dtCols.push(column.withOption('defaultContent', ''));
                                }
                            }
                        }
                    }
                },
                omitColumnForTable: function (table, colName) {
                    const CommonOmitCols = _this._data.tableSettings.commonOmitCols;
                    const OmitCols = _this._data.tableSettings.omitCols;

                    // Check table name.
                    if (!(OmitCols[table])) {
                        //console.error("Unrecognized table. -" + table);
                        return (CommonOmitCols.indexOf(colName) !== -1); // Ignored by Common.
                    }
                    else {
                        return ((CommonOmitCols.indexOf(colName) !== -1) // Ignored by Common.
                            || (OmitCols[table].indexOf(colName) !== -1)); // Ignored by specific table.
                    }
                },
                hideColumnForTable: function (table, colName) {
                    const hideCols = _this._data.tableSettings.hideCols;

                    if (hideCols[table]) {
                        return hideCols[table].indexOf(colName) !== -1; // Ignored by specific table.
                    }
                    return 0;
                },
                dtColNameToIdx: function (dtCols, colName) {
                    for (let i = 0; i < dtCols.length; i++) {
                        if (dtCols[i].mData === colName) {
                            return i;
                        }
                    }
                    return -1;
                },
                dbColumnTranslator: function (table, colName) {
                    const translateCols = _this._data.tableSettings.columnTranslator;
                    const CommonTransCols = _this._data.tableSettings.commonTransCols;

                    // Check table name.
                    if (!(translateCols[table])) {
                        console.error("Unrecognized table. -" + table);
                        return colName;
                    }

                    return translateCols[table][colName] || CommonTransCols[colName] || colName;
                },
                tableOrder: function (table) {
                    return _this._data.tableSettings.tableOrder[table] || null;
                },
                tableRowResetSelection: function (m) {
                    m.lastRowClicked = null;
                    m.currentRowData = null;
                },
                // m - model, assumed to have certain properties.
                tableRowClickHandler: function (m, modelName, data) {
                    // A hack to find the row, regardless of re-ordering/sorting.
                    const rowId = modelName + "_row_" + data.id;
                    const row = $("#" + rowId);
                    // ww: Must find all children, otherwise class would be overriden
                    // by <td> classes.
                    if (m.lastRowClicked) {
                        m.lastRowClicked.find('*').removeClass("bg-green-light");
                        // Clicked the same row, do de-selection.
                        if (m.currentRowData && m.currentRowData.id === data.id) {
                            // console.log("de-selection of id:", data.id);
                            m.resetSelection();
                            return;
                        }
                    }
                    row.find('*').addClass("bg-green-light");
                    m.lastRowClicked = row;
                    // console.log("data for row:", data);
                    m.currentRowData = data;
                },
                tableRowCallback: function (m, scope, modelName, nRow, aData, iDisplayIndex, iDisplayIndexFull) {
                    // Unbind first in order to avoid any duplicate handler (see https://github.com/l-lin/angular-datatables/issues/87)
                    $('td', nRow).unbind('click');
                    $('td', nRow).bind('click', function () {
                        scope.$apply(function () {
                            // $scope.rowClickHandler(aData);
                            m.rowClickHandler(aData);
                        });
                    });
                    // ww:Hack: Mark the row with an ID.
                    $('td', nRow).closest('tr').attr('id', modelName + "_row_" + aData.id);
                    return nRow;
                },
                InitRowClick: function (Scope, modelName) {
                    // Assume one datatable per controller
                    let model = null;
                    if (!modelName) {
                        model = Scope.m;
                        modelName = "";
                    } else {
                        model = Scope.m[modelName]
                    }
                    // Row clicks properties.
                    model.lastRowClicked = false;
                    model.currentRowData = null;

                    model.resetSelection = _this._data.tableRowResetSelection.bind(undefined, model);
                    model.rowClickHandler = _this._data.tableRowClickHandler.bind(undefined, model, modelName);
                    model.rowCallback = _this._data.tableRowCallback.bind(undefined, model, Scope, modelName);
                },
                InitViewForm: m => {
                    return {
                        data: {},
                        show: false,
                        submitted: false,
                        CancelTab: () => _this._data.HideTab(m, m.viewForm)
                    }
                },
                RefInit: ref => {
                    if (!ref) {
                        return ref = {
                            files: [],
                            links: []
                        };
                    }
                    if (typeof ref === 'string' || ref instanceof String) {
                        return angular.fromJson(ref);
                    }
                    return ref;
                },
                HideTab: function (m, Form) {
                    m.activeTab = "ViewAllTab";
                    Form.show = false;
                },
                ResetForm: function (Form) {
                    Form.data = {};
                    Form.ui.validate.$setPristine();
                    Form.submitted = false;
                    _this._data.ResetStateParams();
                },
                ResetStateParams: function () {
                    if ($location.$$search.op) {
                        $location.search({});
                        $location.$$compose();
                    }
                },
                ResetTab: function (m, Form) {
                    _this._data.ResetForm(Form);
                    m.activeTab = "ViewAllTab";
                },
                // General validation, needs params binding to individual controller.
                ValidateInput: function (Validate, Submitted, FieldName, Type) {
                    const input = Validate[FieldName];
                    if (input === undefined) {
                        console.error("Undefined field:", FieldName);
                        return false; // Ignore.
                    }
                    return (input.$dirty || Submitted) && input.$error[Type];
                },
                GetDependencyDisplayItemList: function (Records, IdFieldOverride, NameFieldOverride) {
                    const ret = {
                        ItemList: [],
                        Hash: {},
                        ListHash: {}
                    };
                    let IdField = "id";
                    let NameField = "name";
                    if (IdFieldOverride) {
                        IdField = IdFieldOverride;
                    }
                    if (NameFieldOverride) {
                        NameField = NameFieldOverride;
                    }
                    if (Records) {
                        for (let i = 0; i < Records.length; i++) {
                            const RecordItemText = Records[i][NameField];
                            const RecordItem = {
                                value: Records[i][IdField],
                                text: RecordItemText
                            };
                            ret.ItemList.push(RecordItem);
                            ret.ItemList.sort(function (a, b) { return b.value - a.value });
                            //ret.ItemList.sort();
                            //ret.ItemList.reverse();
                            ret.Hash[Records[i][IdField]] = RecordItemText;
                            ret.ListHash[Records[i][IdField]] = Records[i];
                        }
                    }
                    return ret;
                },
                GetDependencyList: function (Records, IdFieldOverride, NameFieldOverride) {
                    const ret = {
                        ItemList: [],
                        Hash: {},
                        ListHash: {}
                    };
                    let IdField = "id";
                    let NameField = "name";
                    if (IdFieldOverride) {
                        IdField = IdFieldOverride;
                    }
                    if (NameFieldOverride) {
                        NameField = NameFieldOverride;
                    }
                    if (Records) {
                        let i = 0, len = Records.length;
                        for (; i < len; i++) {
                            const RecordItemText = Records[i][NameField];
                            const RecordItem = {
                                value: Records[i][IdField],
                                text: RecordItemText
                            };
                            ret.ItemList.push(RecordItem);
                            ret.Hash[Records[i][IdField]] = RecordItemText;
                            ret.ListHash[Records[i][IdField]] = Records[i];
                        }
                    }
                    return ret;
                },
                GetProteinTypeShorthand: function (ProteinType) {
                    const moleculeTypeShorthand = {
                        "mAb": "C",
                        "Bispecific": "X",
                        "Trispecific": "T",
                        "Tetraspecific": "E",
                        "Reagent": "R",
                        "scFv": "S",
                        "Humanized": "H"
                    };

                    if (ProteinType in moleculeTypeShorthand) {
                        return moleculeTypeShorthand[ProteinType];
                    }
                    return "?";
                },
                GraphColors: () => {
                    return [
                        Colors.byName('purple'),
                        Colors.byName('primary'),
                        Colors.byName('success'),
                        Colors.byName('warning'),
                        Colors.byName('danger'),
                        Colors.byName('info'),
                        Colors.byName('pink'),
                        Colors.byName('yellow'),
                        Colors.byName('green'),
                        Colors.byName('inverse')
                    ]
                },
                DefaultBarOptions: function () {
                    return {
                        legend: {
                            display: false
                        },
                        title: {
                            display: true,
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                        },
                        hover: {
                            mode: 'index',
                            intersect: false
                        },
                        scales: {
                            xAxes: [],
                            yAxes: [{
                                scaleLabel: {
                                    display: true
                                },
                                ticks: {
                                    beginAtZero: true
                                }
                            }]
                        }
                    }
                },
                CalculateSubmissionVolume: function (MethodType, SampleConcentration) {
                    // uL
                    const calculations = {
                        "HPLC SEC": (50 / SampleConcentration) + 20,
                        "MALS": (50 / SampleConcentration) + 20,
                        "Poros": 500,
                        "Reduced CE-SDS": (102 * 0.5 / SampleConcentration) + 25,
                        "Non-Reduced CE-SDS": (102 * 0.5 / SampleConcentration) + 25,
                        "cIEF": 30,
                        "IEX": 130,
                        "Protein Thermal Shift": (25 / SampleConcentration) + 25,
                        "Endotoxin": 125
                    };
                    if (MethodType in calculations) {
                        return calculations[MethodType];
                    }
                    return null;
                },
                GetMinConcentrationNeeded: function (MethodType) {
                    // ug/uL
                    const minConcentrations = {
                        "HPLC SEC": 0.3,
                        "MALS": 0.3,
                        //"Poros": NULL,
                        "Reduced CE-SDS": 1.5,
                        "Non-Reduced CE-SDS": 1.5,
                        "cIEF": 5,
                        "IEX": 1.2,
                        "Protein Thermal Shift": 0.4,
                    };
                    if (MethodType in minConcentrations) {
                        return minConcentrations[MethodType];
                    }
                    return null;
                },
                GetUserId: function () {
                    return global.user.id;
                },
                FetchEnumList: function (TableList) {
                    return $http(
                        {
                            url: global.gateway + "/getEnumForManyTable",
                            method: "POST",
                            data: {
                                tableNameArray: TableList
                            }
                        }
                    ).then(function (resp) {
                        return Promise.resolve(resp.data);
                    }, function (err) {
                        console.log(err);
                    });
                },
                FetchTableEntries: function (table_name) {
                    return $http(
                        {
                            url: global.gateway + "/getTableEntries",
                            method: "POST",
                            data: {
                                "tableName": table_name
                            }
                        }
                    ).then(function (resp) {
                        return Promise.resolve(resp.data);
                    }, function (err) {
                        if (err.status === 403) {
                            $window.location.href  = '/';
                        }
                        console.error("err:", err);
                    });
                },
                FetchIdNameMapping: function (table_name) {
                    return $http(
                        {
                            url: global.gateway + "/getNameMappings",
                            method: "POST",
                            data: {
                                "tableName": table_name
                            }
                        }
                    ).then(function (resp) {
                        return Promise.resolve(resp.data);
                    }, function (err) {
                        if (err.status === 403) {
                            $window.location.href  = '/';
                        }
                        console.error("err:", err);
                    });
                },
                FetchTableEntriesWithQuery: function (table_name, query_string) {
                    return $http(
                        {
                            url: global.gateway + "/getTableEntries",
                            method: "POST",
                            data: {
                                "tableName": table_name,
                                queryString: query_string
                            }
                        }
                    ).then(function (resp) {
                        return Promise.resolve(resp.data);
                    }, function (err) {
                        if (err.status === 403) {
                            $window.location.href  = '/';
                        }
                        console.error("err:", err);
                    });
                },
                SearchByColumn: function (table_name, columns) {
                    return $http(
                        {
                            url: global.gateway + "/searchTableEntriesByColumn",
                            method: "POST",
                            data: {
                                "tableName": table_name,
                                "columns": columns
                            }
                        }
                    ).then(function (resp) {
                        return Promise.resolve(resp.data);
                    }, function (err) {
                        if (err.status === 403) {
                            $window.location.href  = '/';
                        }
                        console.error("err:", err);
                    });
                },
                SearchByProject: function (table_name, project_id) {
                    return $http(
                        {
                            url: global.gateway + "/searchByProject",
                            method: "POST",
                            data: {
                                "tableName": table_name,
                                "projectId": project_id
                            }
                        }
                    ).then(function (resp) {
                        return Promise.resolve(resp.data);
                    }, function (err) {
                        if (err.status === 403) {
                            $window.location.href  = '/';
                        }
                        console.error("err:", err);
                    });
                },
                POSTRequest: function (url, data) {
                    console.log('why am i not here')
                    console.log(url)
                    console.log("Start post request call " + data)
                    return $http(
                        {
                            url: url,
                            method: "POST",
                            data: data,
                            headers: { 'Content-Type': undefined }
                        }
                    ).then(function (resp) {
                        console.log("normal return " + resp.data)
                        return Promise.resolve(resp.data);
                    }, function (err) {
                        console.log("error return " + resp)
                        return Promise.reject(err.data);
                    });
                },
                RefreshPlasmidData: entryId => {
                    const url = global.gateway + '/seqUtils/cachePlasmidInfo/' + entryId;
                    return $http.get(url).then(resp =>{
                        return Promise.resolve(resp.data);
                    }, err => {
                        return Promise.reject(err.data);
                    });
                },
                FetchOneEntry: function (tableName, id) {
                    if (!tableName || !id) {
                        console.error("FetchOneEntry: Missing param.");
                        return;
                    }
                    return $http(
                        {
                            url: global.gateway + "/getEntry",
                            method: "POST",
                            data: {
                                tableName: tableName,
                                id: id
                            }
                        }
                    ).then(function (resp) {
                        return Promise.resolve(resp.data);
                    }, function (err) {
                        if (err.status === 403) {
                            $window.location.href  = '/';
                        }
                        console.error("err:", err);
                    });
                },
                CreateTableEntry: function (Data) {
                    console.log(Data);
                    // Insert user name etc.
                    Data.userId = global.user.id;
                    return $http.post(
                        global.gateway + "/createEntry",
                        Data
                    ).then(function (resp) {
                        if (resp.status === 200) {
                            _this._data.NotifyOk(Data.tableName + " " + resp.data.name + " is created successfully");
                        } else {
                            _this._data.NotifyErr("error", Data.tableName + " failed to create new record");
                        }
                        return new Promise((resolve, reject) => {
                            resolve(resp);
                        });
                    }, function (error) {
                        _this._data.NotifyErr(error.statusText, Data.tableName + " failed to create new record");
                        console.error("updateEntry error:" + error.statusText);
                    });
                },
                CreateTableEntries: function (Data) {
                    console.log("CreatetableEntries Call:");
                    console.log(Data);
                    // Insert user name etc.
                    Data.userId = global.user.id;
                    return $http.post(
                        global.gateway + "/insertTableEntries",
                        Data
                    ).then(function (resp) {
                        console.log(resp)
                        if (resp.status === 200) {
                            _this._data.NotifyOk(Data.tableName + " created multiple entries successfully");
                        } else {
                            _this._data.NotifyErr("error", Data.tableName + " failed to create new entries");
                        }
                        return new Promise((resolve, reject) => {
                            resolve(resp);
                        });
                    }, function (error) {
                        _this._data.NotifyErr(error.statusText, Data.tableName + " failed to create new entries");
                        console.error("updateEntry error:" + error.statusText);
                    });
                },
                UpdateDataEntry: function (postData) {
                    return $http({
                        url: global.gateway + "/updateEntry",
                        method: "POST",
                        data: postData
                    }).then(function (resp) {
                        console.log("updateEntry resp:", resp);
                        if (resp.status === 200) {
                            _this._data.NotifyOk(postData.tableName + " is updated successfully");
                        } else {
                            _this._data.NotifyErr("error", postData.tableName + " failed to update the record");
                        }
                        return new Promise((resolve, reject) => {
                            resolve(resp);
                        });
                    }, function (error) {
                        if (error.status === 403) {
                            _this._data.NotifyErr("error", postData.tableName + " update conflict. Please check out the updated data.");
                        } else {
                            _this._data.NotifyErr("error", postData.tableName + " failed to update the record");
                        }
                    });
                },
                DeleteDataEntry: function (tableName, id) {
                    return $http({
                        url: global.gateway + "/deleteEntry",
                        method: "POST",
                        data: {
                            tableName: tableName,
                            id: id
                        }
                    }).then(function (resp) {
                        console.log("deleteEntry resp:", resp);
                        if (resp.status === 200) {
                            _this._data.NotifyOk(tableName + " was deleted successfully");
                        } else {
                            _this._data.NotifyErr("error", tableName + " failed to delete the record");
                        }
                        return new Promise((resolve, reject) => {
                            resolve(resp);
                        });
                    }, function (error) {
                        if (error.status === 403) {
                            _this._data.NotifyErr("error", tableName + " update conflict. Please check out the updated data.");
                        } else {
                            _this._data.NotifyErr("error", tableName + " failed to delete the record");
                        }
                    });
                },
                UpdateDataEntries: function (postData) {
                    return $http({
                        url: global.gateway + "/updateEntries",
                        method: "POST",
                        data: postData
                    }).then(function (resp) {
                        console.log("updateEntry resp:", resp);
                        if (resp.status === 200) {
                            _this._data.NotifyOk(postData.tableName + " updated multiple entries successfully");
                        } else {
                            _this._data.NotifyErr("error", postData.tableName + " failed to update records");
                        }
                        return new Promise((resolve, reject) => {
                            resolve(resp);
                        });
                    }, function (error) {
                        if (error.status === 403) {
                            _this._data.NotifyErr("error", postData.tableName + " update conflict. Please check out the updated data.");
                        } else {
                            _this._data.NotifyErr("error", postData.tableName + " failed to update records");
                        }
                    });
                },
                UploadFile: function (tableName, fileInputId, notes) {
                    // sends as multipart form-data
                    const formData = new FormData;
                    formData.append('file', document.getElementById(fileInputId).files[0]);
                    formData.append('tableName', tableName);
                    formData.append('notes', notes)
                    return $http({
                        url: global.gateway + "/uploadFile",
                        method: "POST",
                        headers: { 'Content-Type': undefined },
                        data: formData
                    }).then(resp => {
                        if (resp.status === 200) {
                            _this._data.NotifyOk("Uploaded file successfully");
                        }
                        return new Promise(resolve => {
                            resolve(resp);
                        });
                    }, err => {
                        _this._data.NotifyErr("error", "failed to upload file" + err);
                    })
                },
                DownloadFile: function (details, download) {
                    $http({
                        url: global.gateway + "/downloadFile",
                        method: "POST",
                        data: {
                            fileId: details.fileId
                        },
                        responseType: 'blob'
                    }).then(resp => {
                        const file = new Blob([resp.data]);
                        _this._data.DlBlob(details.fileName, file);
                        // To embed rather than download
                        // cons fileURL = URL.createObjectURL(file);
                        // return $sce.trustAsResourceUrl(fileURL);
                    });
                },
                DlBlob: function (fileName, blob) {
                    // Simulate browser click
                    if (navigator.msSaveBlob) { // IE 10+
                        navigator.msSaveBlob(blob, filename);
                    } else {
                        const link = document.createElement("a");
                        if (link.download !== undefined) { // feature detection
                            // Browsers that support HTML5 download attribute
                            const url = URL.createObjectURL(blob);
                            link.setAttribute("href", url);
                            link.setAttribute("download", fileName);
                            link.style.visibility = 'hidden';
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                        }
                    }
                },
                // Hash for translate from id to user display name.
                CacheUserHash: function () {
                    return $http({
                        url: global.gateway + '/getCompleteUserList',
                        method: "GET"
                    }).then(function (resp) {
                        const UserHash = {
                            complete: {},
                            active: {},
                            activeList: []
                        };
                        const Users = resp.data.users;
                        for (let user of Users) {
                            if (!user.isDeleted) {
                                UserHash.active[user.id] = user.displayName;
                                UserHash.activeList.push({id: user.id, name: user.displayName})
                            }
                            UserHash.complete[user.id] = user.displayName;
                        }
                        return new Promise((resolve, reject) => {
                            resolve(UserHash);
                        });
                    });
                    //TODO(ww): Catch errors.
                },
                IdToVal: function (Hash, Id) {
                    if (Id in Hash) {
                        return Hash[Id];
                    }
                    return Id;
                },
                NotifyOk: function (msg) {
                    const info = (msg) ? msg : "Operation success";
                    Notify.alert(info, { status: 'success' });
                },
                NotifyErr: function (err, msg) {
                    const info = (msg) ? msg : "Operation failure";
                    Notify.alert(info, { status: 'danger' });
                    if (err) {
                        console.error("Error: ", err);
                    }
                },
                NotifyMsgByCode: function (resp, op) {
                    return new Promise((resolve, reject) => {
                        if (resp && resp.status === 200) {
                            _this._data.NotifyMsgOk(op);
                            resolve();
                        } else {
                            _this._data.NotifyMsgErr(resp, op);
                        }
                    });
                },
                NotifyMsgOk: function (op) {
                    Notify.alert(op + " Success", { status: 'success' });
                },
                NotifyMsgErr: function (err, op) {
                    Notify.alert(op + " Failure", { status: 'danger' });
                    if (err) {
                        console.error("Error: ", err);
                    }
                },
                NotifyOperationErr: function (op) {
                    Notify.alert(op, { status: 'danger' });
                },
                InitJqueryImportCSVChangeHandler: function (Scope, fieldName) {
                    //console.log(Scope.m.ShowImportBtn)

                    // NOTE(ww): Tied to hardcoded var names.
                    if (!fieldName) fieldName = 'file';
                    $('#' + fieldName).change(function (e) {
                        const FakePath = $('#' + fieldName).val();
                        if (Scope.m) {
                            Scope.m.ShowImportBtn = FakePath;
                        }
                        Scope.showImportBtn = FakePath;
                        Scope.$digest();
                    });
                },
                exportToCsv: function (filename, rows) {
                    // converts list of objects to blob
                    const processRow = function (row) {
                        let finalVal = '';
                        console.log(row);
                        for (let j = 0; j < row.length; j++) {
                            let innerValue = row[j] === null ? '' : row[j].toString();
                            if (row[j] instanceof Date) {
                                innerValue = row[j].toLocaleString();
                            }
                            let result = innerValue.replace(/"/g, '""');
                            if (result.search(/([",\n])/g) >= 0) {
                                result = '"' + result + '"';
                            }
                            if (j > 0)
                                finalVal += ',';
                            finalVal += result;
                        }
                        return finalVal + '\n';
                    };

                    let csvFile = '';
                    for (let i = 0; i < rows.length; i++) {
                        csvFile += processRow(rows[i]);
                    }

                    const blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
                    _this._data.DlBlob(filename, blob);
                }
            };
            return _this._data;
        }
    ]);
})();
