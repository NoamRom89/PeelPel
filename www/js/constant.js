'use strict';

/**
 * Config constant
 */
app.constant('APP_MEDIAQUERY', {
    'desktopXL': 1200,
    'desktop': 992,
    'tablet': 768,
    'mobile': 480
});
app.constant('APP_REGEX', {
    'email': /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/,
    'password': /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{6,}$/,
});
app.constant('JS_REQUIRES', {
    //*** Scripts
    scripts: {
        //*** Javascript Plugins
        // 'modernizr': ['../js/vendors/modernizr.js'],
        // 'moment': ['../js/vendors/moment.min.js'],
        // 'spin': '../js/vendors/spin.js',

        // //*** jQuery Plugins
        // 'perfect-scrollbar-plugin': ['../js/vendors/perfect-scrollbar.jquery.js', '../stylesheets/vendors/perfect-scrollbar.css'],
        // 'ladda': ['../bower_components/ladda/dist/ladda.min.js', '../bower_components/ladda/dist/ladda-themeless.min.css'],
        // 'sweet-alert': ['../js/vendors/sweet-alert.min.js', '../stylesheets/vendors/sweet-alert.css'],
        // 'chartjs': '../js/vendors/Chart.min.js',
        // 'jquery-sparkline': '../js/vendors/jquery.sparkline.js',
        // 'ckeditor-plugin': '../bower_components/ckeditor/ckeditor.js',
        // 'jquery-nestable-plugin': ['../bower_components/jquery-nestable-rtl/jquery.nestable.rtl.js'],
        // 'touchspin-plugin': ['../bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.js', '../bower_components/bootstrap-touchspin/dist/jquery.bootstrap-touchspin.min.css'],

        // //*** Controllers
        // 'dashboardCtrl': '../js/controllers/dashboardCtrl.js',
        // 'usersCtrl': '../js/controllers/usersCtrl.js',
        // 'eventsCtrl': '../js/controllers/eventsCtrl.js',
        // 'calendarCtrl': '../js/controllers/calendarCtrl.js',
        // 'missionCtrl': '../js/controllers/missionCtrl.js', 
        // 'surveyCtrl': '../js/controllers/surveyCtrl.js',
        // 'analyticsCtrl': '../js/controllers/analyticsCtrl.js',
        //*** BNS Controllers
        'LoginCtrl': './js/controllers/loginCtrl.js'

        // should be deleted or changed.

        // 'forgotPasswordCtrl': '../js/controllers/forgotPasswordCtrl.js',
        // 'iconsCtrl': '../js/controllers/iconsCtrl.js',
        // 'vAccordionCtrl': '../js/controllers/vAccordionCtrl.js',
        // 'ckeditorCtrl': '../js/controllers/ckeditorCtrl.js',
        // 'laddaCtrl': '../js/controllers/laddaCtrl.js',
        // 'ngTableCtrl': '../js/controllers/ngTableCtrl.js',
        // 'cropCtrl': '../js/controllers/cropCtrl.js',
        // 'asideCtrl': '../js/controllers/asideCtrl.js',
        // 'toasterCtrl': '../js/controllers/toasterCtrl.js',
        // 'sweetAlertCtrl': '../js/controllers/sweetAlertCtrl.js',
        // 'mapsCtrl': '../js/controllers/mapsCtrl.js',
        // 'chartsCtrl': '../js/controllers/chartsCtrl.js',
        // 'calendarCtrl': '../js/controllers/calendarCtrl.js',
        // 'nestableCtrl': '../js/controllers/nestableCtrl.js',
        // 'validationCtrl': ['../js/controllers/validationCtrl.js'],
        // 'userCtrl': ['../js/controllers/userCtrl.js'],
        // 'selectCtrl': '../js/controllers/selectCtrl.js',
        // 'addUserCtrl': '../js/controllers/addUserCtrl.js',
        // 'uploadCtrl': '../js/controllers/uploadCtrl.js',
        // 'treeCtrl': '../js/controllers/treeCtrl.js',
        // 'inboxCtrl': '../js/controllers/inboxCtrl.js',
        // 'xeditableCtrl': '../js/controllers/xeditableCtrl.js',
        // 'chatCtrl': '../js/controllers/chatCtrl.js',
        // 'dynamicTableCtrl': '../js/controllers/dynamicTableCtrl.js',
        // 'NotificationIconsCtrl': '../js/controllers/notificationIconsCtrl.js',
        
        // //*** Filters
        // 'htmlToPlaintext': '../js/filters/htmlToPlaintext.js'
    },
    //*** angularJS Modules
    modules: [//{
    //     // name: 'angularMoment',
    //     // files: ['../js/core/angular-moment.js']
    // }, {
    //     name: 'toaster',
    //     files: ['../js/vendors/toaster.js', '../stylesheets/vendors/toaster.css']
    // }, {
    //     name: 'angularBootstrapNavTree',
    //     files: ['../bower_components/angular-bootstrap-nav-tree/dist/abn_tree_directive.js', '../bower_components/angular-bootstrap-nav-tree/dist/abn_tree.css']
    // }, {
    //     name: 'angular-ladda',
    //     files: ['../bower_components/angular-ladda/dist/angular-ladda.min.js']
    // }, {
    //     name: 'ngTable',
    //     files: ['../bower_components/ng-table/dist/ng-table.min.js', '../bower_components/ng-table/dist/ng-table.min.css']
    // }, {
    //     name: 'ui.select',
    //     files: ['../bower_components/angular-ui-select/dist/select.min.js', '../bower_components/angular-ui-select/dist/select.min.css', '../bower_components/select2/dist/css/select2.min.css', '../bower_components/select2-bootstrap-css/select2-bootstrap.min.css', '../bower_components/selectize/dist/css/selectize.bootstrap3.css']
    // }, {
    //     name: 'ui.mask',
    //     files: ['../bower_components/angular-ui-utils/mask.min.js']
    // }, {
    //     name: 'ngImgCrop',
    //     files: ['../bower_components/ngImgCrop/compile/minified/ng-img-crop.js', '../bower_components/ngImgCrop/compile/minified/ng-img-crop.css']
    // }, {
    //     name: 'angularFileUpload',
    //     files: ['../bower_components/angular-file-upload/angular-file-upload.min.js']
    // }, {
    //     name: 'ngAside',
    //     files: ['../js/core/angular-aside.min.js', '../stylesheets/vendors/angular-aside.css']
    // }, {
    //     name: 'truncate',
    //     files: ['../js/vendors/truncate.js']
    // }, {
    //     name: 'oitozero.ngSweetAlert',
    //     files: ['../js/vendors/SweetAlert.min.js']
    // }, {
    //     name: 'monospaced.elastic',
    //     files: ['../bower_components/angular-elastic/elastic.js']
    // }, {
    //     name: 'ngMap',
    //     files: ['../bower_components/ngmap/build/scripts/ng-map.min.js']
    // }, {
    //     name: 'tc.chartjs',
    //     files: ['../js/vendors/tc-angular-chartjs.min.js']
    // }, {
    //     name: 'flow',
    //     files: ['../bower_components/ng-flow/dist/ng-flow-standalone.min.js']
    // }, {
    //     name: 'uiSwitch',
    //     files: ['../js/core/angular-ui-switch.js', '../stylesheets/vendors/angular-ui-switch.css']
    // }, {
    //     name: 'ckeditor',
    //     files: ['../bower_components/angular-ckeditor/angular-ckeditor.min.js']
    // }, {
    //     name: 'mwl.calendar',
    //     files: ['../js/vendors/angular-bootstrap-calendar-tpls.js', '../stylesheets/vendors/angular-bootstrap-calendar.min.css', '../js/config-calendar.js']
    // }, {
    //     name: 'ng-nestable',
    //     files: ['../bower_components/ng-nestable/src/angular-nestable.js']
    // }, {
    //     name: 'vAccordion',
    //     files: ['../js/vendors/v-accordion.min.js', '../stylesheets/vendors/v-accordion.css']
    // }, {
    //     name: 'xeditable',
    //     files: ['../bower_components/angular-xeditable/dist/../js/xeditable.min.js', '../bower_components/angular-xeditable/dist/css/xeditable.css', 'assets/../js/config/config-xeditable.js']
    // }, {
    //     name: 'checklist-model',
    //     files: ['../bower_components/checklist-model/checklist-model.js']
    // }, {
    //     name: 'angular-notification-icons',
    //     files: ['../js/vendors/angular-notification-icons.min.js', '../stylesheets/vendors/angular-notification-icons.css']
    // }
    ]
});
