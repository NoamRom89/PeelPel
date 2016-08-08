'use strict';
/**
 * controller for user Login to the system
 */
app.controller('LoginCtrl', function ($scope, $rootScope, $http, userFactory, APP_REGEX, $localstorage, $state, $stateParams, $ionicPopup) {

  var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);

  var userRoles = null;

  $scope.app = $rootScope.app;

  // login object.
  $scope.login = {
    password: {
      value: '',
      key: 'password',
      placeholder: 'סיסמא'
    },
    username: {
      value: '',
      key: 'username',
      placeholder: 'תעודת זהות'
    },
    isDisabled: function () {
      return APP_REGEX.password.test($scope.login.password.value);
    },
    isRemember: {
      value: true,
      lable: 'Remember Me'
    },
    signIn: function () {
      var data = { username: $scope.login.username.value, password: $scope.login.password.value, isRemember: $scope.login.isRemember.value };

      $http.post(SERVER_ROOT_PATH + '/public/app/login', { data: data }).
        then(function (response) {
          // console.log('login response', response);

          if (response.data.err) {
            // handle error.
            console.log('login error. Handle it');
            var alertPopup = $ionicPopup.alert({
              title: "התחברות נכשלה",
              template: "בדוק שהזנת פרטים נכונים"
            });
            return;
          }

          //console.log('Login succeed! response:', response.data);
          var user = response.data.result;
          //console.log("User: ", user);

          if (!userFactory.setUser(user)) {
            // if here, could not set user,
            // handle error
            console.log("!userFactory.setUser(user) = false:  if here, could not set user,handle error");
          }
          $localstorage.set($localstorage.localSTypes.BNSToken, user.token.token);
          userFactory.initFactory();


          // create header for token.
          $http.defaults.headers.post['x-access-token'] = user.token.token;
          // root scope user object.
          $rootScope.connectedUser = user;
          setDeviceToken();

          $rootScope.$broadcast('init', "init()");
          $state.go('tab.calendar');


        }, function (err) {
          console.log("Error: ", err);
          var alertPopup = $ionicPopup.alert({
            title: "התחברות נכשלה",
            template: "נותק הקשר עם השרת"
          });
        });


      var setDeviceToken = function(){
        //if device token isn't exist, create it
        console.log("rootScope from login page:",$rootScope);
        if(!$rootScope.connectedUser.deviceTokens){
          var deviceToken = $rootScope.deviceCredentials;
          if(deviceToken){
            $http.post(SERVER_ROOT_PATH + '/client/setDeviceToken', { token : deviceToken.token, platform : deviceToken.platform }).
              then(function (res) {

                if(res.data.error){
                  console.log("Res.error: ", res);
                }

                $rootScope.connectedUser.deviceToken = deviceToken.token;
                console.log("Device token has been saved",res);

              });
          }
          else{
            console.log("deviceToken isn't exist: ", deviceToken);
          }
        }
        else{
          console.log("$rootScope.connectedUser.deviceToken exist");
        }
      }

    }
  };


/***********************  Init()  *************************/
  $scope.init = function () {
    if(lsValue){
      $state.go('tab.calendar');
    }else{
      $state.go('login');
    }
  };

  $scope.init();
});


/**
 * controller for password forgoten procedure
 */
app.controller('ForgotPassCtrl', ["$scope", "$http", "$state", "$stateParams", "$location","APP_REGEX", "$ionicPopup",
  function ($scope, $http, $state, $stateParams, $location, APP_REGEX,$ionicPopup) {


    var fpid = null;

    $scope.init = function () {
      // check if fpid exists as a query string
      fpid  =  $localstorage.get($localstorage.localSTypes.BNSToken);
      $scope.isForgotPassword = fpid ? true : false;
      // if true, forgot password screen should appear
      if ($scope.isForgotPassword) {
        // validate fpid.
        // if fpid is not valid, redirect to forgot password screen \ login screen \ let user know and add button to forgot password screen.
        $http.post(SERVER_ROOT_PATH + '/public/validateForgotPasswordToken', { token: fpid }).
          then(function (response) {
            console.log('validateForgotPasswordToken response', response);
            if (response.data.err || !response.result) {
              // redirect to login page.
              console.log('forgotPassword error. Handle it', response);
              //$state.go('login.signin');
              return;
            }
          }, function (err) {
            consolo.log('Error - /public/validateForgotPasswordToken', err);
          });
      } else {

      }
    };


    $scope.forgotPassword = {
      legend: 'חדש/י סיסמא',
      text: 'הכנס/י סיסמא חדשה',
      password: {
        first: {
          value: '',
          name: 'password1',
          placeholder: 'הכנס/י סיסמא חדשה'
        },
        second: {
          value: '',
          name: 'password2',
          placeholder: 'הכנס/י סיסמא בשנית'
        }
      },
      button: {
        login: {
          uiSref: 'login.signin',
          value: 'התחבר'
        },
        isDisabled: function () {

          if(APP_REGEX.password.test($scope.forgotPassword.password.first.value) &&
            $scope.forgotPassword.password.first.value == $scope.forgotPassword.password.second.value)
            return true;

          return false;
        },
        // forgot password section
        submit: {
          value: 'שנה סיסמא',
          action: function () {
            console.log('$scope.forgotPassword.password', $scope.forgotPassword.password);

            if ($scope.forgotPassword.password.first.value == '' ||
              $scope.forgotPassword.password.first.value != $scope.forgotPassword.password.second.value)
              return;

            $http.post(SERVER_ROOT_PATH + '/public/changePassword', { token: fpid, password: $scope.forgotPassword.password.first.value }).
              then(function (response) {
                console.log('forgotPassword response', response);
                if (response.data.err) {
                  // handle error.
                  console.log('forgotPassword error. Handle it');
                  return;
                }

              }, function (response) {

              });
          }
        },
      }
    };

    $scope.form = {
      legend: 'שכחת סיסמא?',
      text: 'הכנס אימייל או תעודת זהות על מנת לשחזר את סיסמתך',
      username: {
        value : '',
        placeholder: 'ת.ז או אמייל',
        name: 'username'
      },
      login: {
        value: 'התחבר',
        uiSref: 'login.signin'
      },
      // forgot password section
      submit: {
        value: 'אפס סיסמא',
        action: function () {

          if ($scope.form.username.value == '')
            return;

          $http.post(SERVER_ROOT_PATH + '/public/forgotPassword', { username: $scope.form.username.value }).
            then(function (response) {
              console.log('forgotPassword response', response);
              if(response.data.result == true){
                var alertPopup = $ionicPopup.alert({
                  title: "Password was reset!",
                  template: "Please check your emails"
                });
              }
              if (response.data.err) {
                // handle error.
                console.log('forgotPassword error. Handle it');
                var alertPopup = $ionicPopup.alert({
                  title: "בעיה!",
                  template: "בדוק שוב את הפרטים שהזנת!"
                });
                return;
              }

            }, function (response) {

            });
        }
      },

    };


    $scope.init();
  }]);
