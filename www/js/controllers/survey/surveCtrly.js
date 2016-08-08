'use strict';
/**
  * controller  - filter
*/
app.controller('SurveyCtrl', function($scope, $rootScope, $http, userFactory, $stateParams, $localstorage,
                                      $state, $ionicPopup,$ionicLoading,$timeout){

  console.log('I am a SurveyCtrl, $stateParams:', $stateParams.surveyId);

  var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
  $http.defaults.headers.post['x-access-token'] = lsValue;

  var voted = false;
  var optionVoted;

  $scope.date = {};
  $scope.time = {};
  $scope.survey = {};
  $scope.optionImg = {};
  $scope.optionPressed = [];

  $scope.s3CategoriesLink = 'https://s3-eu-west-1.amazonaws.com/bnsolutions-essentials/icons/categories/';

  $timeout(function(){
    console.log("document.getElementsByTagName(INPUT).length",document.getElementsByTagName("INPUT").length);

    if(optionVoted) {
      for (var i = 0; i < document.getElementsByTagName("INPUT").length; i++) {
        console.log("document.getElementsByTagName(INPUT)[i]",document.getElementsByTagName("INPUT")[i]);
        document.getElementsByTagName("INPUT")[i].disabled = true;
      }
    }
  }, 1000);


  var myIndexOf = function (voteObjFalse) {
    for (var i = 0; i < $scope.optionPressed.length; i++) {
      if ($scope.optionPressed[i].userId == voteObjFalse.userId && $scope.optionPressed[i].optionId == voteObjFalse.optionId) {
        return i;
      }
    }
    return -1;
  };

  //{
  //  userId: userFactory.getUser()._id,
  //optionId: null
  //};

  var getSurvey = function(){
    if($stateParams.surveyId){

      $http.post(SERVER_ROOT_PATH + '/client/getAllSurveys', {surveyId:$stateParams.surveyId}).

        then(function (res) {
          $scope.survey = res.data.result[0];

          console.log("Suerys: ",$scope.survey);
          $scope.date = $scope.survey.expirationDate;
          $scope.time = $scope.survey.expirationDate;

          $scope.time = moment($scope.time).format('HH:mm');
          $scope.date = moment($scope.date).format('MMMM Do, YYYY');
          //console.log('Time of survey: ', $scope.time );
          //console.log('Date of survey: ', $scope.date );

          $scope.optionImg = $rootScope.categoryHebrewName;


          if($scope.survey.votes.length > 0){
            angular.forEach($scope.survey.votes, function(vote){
              //Check if user has already voted
              if(vote.user == $rootScope.connectedUser._id){
                //if so, check his vote
                voted = true;
                optionVoted = vote;
              }
            });
          }

          angular.forEach($scope.survey.options, function(option){
            if(optionVoted){
              if(option._id == optionVoted.option){
                option.pressed = true;
              }else{
                option.pressed = false;
              }
            }else{
              option.pressed = false;
            }
          });

          console.log('getSurvey API response :',res.data.result);
          $ionicLoading.hide();

        }, function (err) {
          console.log("Error - ajax call was failed:  /client/getAllSurveys - ", err);
        });
    }



  };

  // This function selecting only 1 checkbox
  // When checkbox is selected, we need to check weather it's true or false
  // True - select it and push the vote obj into $scope.optionPressed
  // False - dissect it and check if it exist inside the $scope.optionPressed array

  $scope.optionSelected = function(position,options){
    angular.forEach(options, function(option, index) {
      if (position != index){
        option.pressed = false;
      }


      if(option.pressed){
        var voteObjTrue = {
          userId: userFactory.getUser()._id,
          optionId: option._id
        };

        $scope.optionPressed.push(voteObjTrue);

        return;
      }

      var voteObjFalse = {
        userId : userFactory.getUser()._id,
        optionId : option._id
      };

      var spliceIndex = myIndexOf(voteObjFalse);

      if(spliceIndex > -1){
        $scope.optionPressed.splice(spliceIndex,1);
      }
      voteObjFalse = null;

    });
    //console.log("User option: ",$scope.optionPressed);

  };

  $scope.sendVote = function(){
    if($scope.optionPressed&& $scope.optionPressed.length > 0){

      $scope.optionPressed[0].surveyId = $stateParams.surveyId;
      console.log('$scope.optionPressed[0]',$scope.optionPressed[0]);

      $http.post(SERVER_ROOT_PATH + '/client/vote',$scope.optionPressed[0]).

        then(function (res) { //here we should get
          console.log('/client/vote API response :',res);
          var alertPopup = $ionicPopup.alert({
            title: "הצבעת בהצלחה!",
            template: "תוצאות יתפרסמו בהמשך"
          });

          voted = true;

          for(var i = 0; i < document.getElementsByTagName("INPUT").length; i++){
            document.getElementsByTagName("INPUT")[i].disabled = true;
          }

          $state.go('tab.notification');


        }, function (err) {
          console.log("Error - ajax call was failed:  /client/vote - ", err);
          var alertPopup = $ionicPopup.alert({
            title: "הצבעתך לא נשלחה!",
            template: "שלח שוב"
          });
        });
    }
  };

  $scope.closeSurvey = function(){
    $state.go('tab.notification');
  };

  $scope.userVoted = function(){
    return voted;
  };


  /*********************************************************************************************************/

  function init(){
    $ionicLoading.show();
    userFactory.promiseFunc().then(function (data) {
      $rootScope.connectedUser = data.data.result;
      if($rootScope.connectedUser){
        getSurvey();
      }
    });

  }

  init();
});
