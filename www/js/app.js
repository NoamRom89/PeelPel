// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'BNSApp' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'BNSApp.services' is found in services.js
// 'BNSApp.controllers' is found in controllers.js



//var SERVER_ROOT_PATH = 'http://localhost:3030';
var SERVER_ROOT_PATH = 'http://ec2-54-229-36-138.eu-west-1.compute.amazonaws.com:3030';

var app = angular.module('BNSApp', ['ionic', 'BNSApp.service', 'BNSApp.factory', 'ionic-datepicker','ngCordova','ionic.service.analytics']);

//Keeping everything in the scoop
app.constant('APP_REGEX', {
    'email': /^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/,
    'password': /^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{4,}$/,
});

/**
 *
 * App Configuration & Run
 */

app
.run(function($ionicPlatform, $rootScope,$ionicAnalytics) {
  $ionicPlatform.ready(function() {

    var deviceInformation = ionic.Platform.device();
    deviceInformation.platform = deviceInformation.platform.toLowerCase();

    console.log("deviceInformation: ",deviceInformation);


    $ionicAnalytics.register();

    $ionicAnalytics.setGlobalProperties({
      app_version_number: 'v0.1.0',
      day_of_week: (new Date())
    });

     //Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
     //for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    var push = new Ionic.Push({
      "debug": true
    });

    push.register(function(token) {
      //console.log("Device token:",token.token);
      var deviceCredentials = {
        token:token.token,
        platform:deviceInformation.platform
      };
      $rootScope.deviceCredentials = deviceCredentials;
      //console.log("$rootScope.deviceCredentials:",$rootScope.deviceCredentials);
      push.saveToken(token);  // persist the token in the Ionic Platform
    });


  });

})


.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {

    $ionicConfigProvider.navBar.alignTitle('center');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'LoginCtrl'
      })

  .state('loginForgot', {
      url: '/forgot',
      templateUrl: 'templates/login_forgot.html',
      controller: 'LoginCtrl'
  })

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html',
      controller: 'TabsCtrl'
  })

  // Each tab has its own nav history stack:
    .state('tab.settings', {
      url: '/settings',
      views: {
        'tab-settings': {
          templateUrl: 'templates/tab-settings.html',
          controller: 'SettingsCtrl'
        }
      }
    })

    .state('tab.articles', {
      url: '/articles',
      views: {
        'tab-articles': {
          templateUrl: 'templates/tab-articles.html',
          controller: 'ArticlesCtrl'
        }
      }
    })

    .state('article', {
      url: '/articles/:articleId',
      templateUrl: 'templates/article.html',
      controller: 'ArticleCtrl'
    })

  .state('tab.calendar', {
      url: '/calendar',
      views: {
        'tab-calendar': {
          templateUrl: 'templates/tab-calendar.html',
          controller: 'CalendarCtrl'
        }
      }
    })

      .state('newActivity', {
        url: '/newActivity',
        templateUrl: 'templates/newactivity.html',
        controller: 'NewActivityCtrl'
      })

    .state('activity', {
      url: '/calendar/:activityId',
      templateUrl: 'templates/activity.html',
      controller: 'ActivityCtrl'
    })

    .state('tab.filter', {
      url: '/filter',
      views: {
        'tab-filter': {
          templateUrl: 'templates/tab-filter.html',
          controller: 'FilterCtrl'
        }
      }
    })

  .state('tab.notification', {
    url: '/notification',
    views: {
      'tab-notification': {
        templateUrl: 'templates/tab-notification.html',
        controller: 'NotificationCtrl'
      }
    }
  })

  .state('tab.profile', {
    url: '/profile',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'ProfileCtrl'
      }
    }
  })

    .state('survey', {
      url: '/survey/:surveyId',
      templateUrl: 'templates/survey.html',
      controller: 'SurveyCtrl'
    })

    .state('hobbies', {
      url: '/hobbies',
      templateUrl: 'templates/hobbies.html',
      controller: 'HobbiesCtrl'
    })

    .state('residentProfile', {
      url: '/residentProfile/:residentId',
      templateUrl: 'templates/residentProfile.html',
      controller: 'ResidentProfileCtrl'
    });

});
