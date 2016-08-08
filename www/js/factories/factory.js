angular.module('BNSApp.factory', ['ngSanitize'])

  .factory('userFactory', function ($localstorage,$http, $rootScope) {

    /******************************** Promise   ***************************************/
    var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
    $http.defaults.headers.post['x-access-token'] = lsValue;


    //console.log('lsValue', lsValue);

    var initFactory = function(){
      lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
      $http.defaults.headers.post['x-access-token'] = lsValue;
    };

    var promiseFunc = function(){
      var promise = $http.post(SERVER_ROOT_PATH + '/client/getProfile').
        success(function (response) {

          //console.log('Result from factory promise: ', response.result);
          user = response.result;
          return user;

        })
        .error(function(data, status) {
          console.log('lsValue', lsValue);
          console.error('/client/getProfile error', status, data);
        });
      return promise;
    };


    /***************************************************************************************************************/

        var user = null;

        var setUser = function (userObj) {
            if (!userObj)
                return false;

            user = userObj;
            return true;
        };

        var getUser = function () {
            return user;
        };

        return {
            setUser: setUser,
            getUser: getUser,
            promiseFunc: promiseFunc,
            initFactory: initFactory
        }


    })

  .factory('$localstorage', ['$window', function($window) {

        var localSTypes = {
            BNSToken: 'BNSToken',
            BNSState: 'BNSState',
            BNSNotNum: 'BNSNotNum'
          };

          return {
            set: function(key, value) {
              if (value == null || value == '' || value == undefined || !localSTypes[key])
                    return;

              $window.localStorage[key] = value;
            },
            get: function(key) {
              return $window.localStorage[key]; //|| defaultValue
            },
            setObject: function(key, value) {
              if (value == null || value == '' || value == undefined || !localSTypes[key])
                    return;

              $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
              return JSON.parse($window.localStorage[key] || '{}');
            },
            localSTypes: localSTypes,
            removeItem: function(key){
              $window.localStorage.removeItem(key);
            }
      }
    }])

  .factory('AddCSSService', [function() {
    return function(selectors, declarations) {
      var declarationString = "";
      angular.forEach(declarations, function(value, key) {
        declarationString += key + ":" + value + " !important;"
      });

      if (declarationString != "") {
        var sheet = document.createElement('style');
        sheet.innerHTML = selectors + " {" + declarationString + "}";
        document.body.appendChild(sheet);
      }
    };
  }]);
