angular.module('BNSApp.service', [])

  .service('RequestsService', ['$http', '$q', '$ionicLoading',  RequestsService]);

function RequestsService($http, $q, $ionicLoading){

    var base_url = 'http://{YOUR SERVER}';

    function register(device_token){

      var deferred = $q.defer(); //run the function asynchronously
      $ionicLoading.show(); //show the ionic loader animation

      //make a POST request to the /register path and submit the device_token as data.
      $http.post(base_url + '/register', {'device_token': device_token})
        .success(function(response){

          $ionicLoading.hide();//hide the ionic loader
          deferred.resolve(response);

        })
        .error(function(data){
          console.log("Error receiving the data from RequestsService : ",data);
          deferred.reject();
        });


      return deferred.promise;//return the result once the POST request returns a response

    }


    return {
      register: register
    };
  }

