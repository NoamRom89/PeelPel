'use strict';
/**
 * controller  - Calendar
 */


app.controller('TabsCtrl', function($scope, $rootScope, $http, userFactory,AddCSSService, $state,$localstorage){

  var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
  $http.defaults.headers.post['x-access-token'] = lsValue;

  var cleanUpFuncInit = $rootScope.$on('init', function(event, mass) {
    console.log("Init() from Tabs: ",mass);
    init();
  });
  /*******************************  Destroy Broducast  ******************************************/
  $rootScope.$on('$destroy', function() {
    cleanUpFuncInit();
  });

  $scope.user = {};


  //1st initialized of the page
  var init = function(){

    userFactory.promiseFunc().then(function (data) {
        //console.log('Data from promise call - factory (TabsCtrl): ',data.data.result);

        $rootScope.connectedUser = data.data.result;
        //console.log("User from factory promise(Tabs): ", $rootScope.connectedUser);



        var themeSelectors = ".tab-item .bnsUserProfileTab";
        var declarations = {};
        declarations["background-image"] = "url("+ $rootScope.connectedUser.photo.medium +")";

        AddCSSService(themeSelectors, declarations);


      });

    var promiseNotificationFunc = function(){
      var promiseNotification = $http.post(SERVER_ROOT_PATH + '/client/getNotifications').
        success(function (res) {
          return res.new;

        })
        .error(function(data, status) {
          console.error('/client/getNotifications error', status, data);
        });
      return promiseNotification;
    };

    promiseNotificationFunc().then(function(data){
      $rootScope.numOfNotifications = data.data.new;
      //$scope.numOfNotifications = $rootScope.numOfNotifications;
      $localstorage.set($localstorage.localSTypes.BNSNotNum, $scope.numOfNotifications);
      //console.log('$rootScope.numOfNotifications', $rootScope.numOfNotifications);
    });
  };


  init();

});
