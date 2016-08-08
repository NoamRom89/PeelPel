'use strict';
/**
 * controller  - New Activity
 */


app.controller('NewActivityCtrl', function($scope, $rootScope, $http, userFactory, $state,$ionicPopup,$ionicPopover,$localstorage, $stateParams,$ionicLoading){

  $scope.currentDate = new Date();
  $scope.dirty = [];
  $scope.data = {
    step: 1,
    form: {
      start: moment(),
      title: "",
      description: "",
      photo:"https://s3-eu-west-1.amazonaws.com/bnsolutions/default_mission_cover.jpg",
      privacy:"private",
      favorite:false,
      notify:false
    }
  };

  $scope.toggleFavorite = function(){
    // TELL THE USER THIS MISSION WILL BE ADDED TO FAVORITE AS SOON AS HE
    // CREATES THE MISSION

    $scope.data.form.favorite = !$scope.data.form.favorite;
  };

  $scope.toggleReminder = function(){
    // TELL THE USER THE REMINDER WILL BE SENT AS SOON AS HE
    // CREATES THE MISSION

    $scope.data.form.notify = !$scope.data.form.notify;
  };

  $scope.isStepDisabled = function(step){
    if(step == 1){
      // CHECK IF DATE IS BEFORE TODAY !!!!
      if(!$scope.data.form.start)
        return true;
      if(!$scope.data.form.title)
        return true;

      return false;
    }else if(step == 2){

      return false;
    }else if(step == 3){
      return false;
    }

    return true;
  };

  $scope.isDirty = function(index){
    if($scope.dirty.indexOf(index) > -1)
      return true;

    return false;
  };

  $scope.submit = function() {

  };

  $scope.getActivityTime = function(){
    console.log(moment($scope.data.form.start).format('HH:mm'));
    return moment($scope.data.form.start).format('HH:mm');
  };

  $scope.nextStep = function() {
    $scope.dirty.push($scope.data.step);
    $scope.data.step += 1;
    if($scope.data.step > 3){
      $scope.data.step = 3;
    }
  };

  $scope.chooseStep = function(index){
    if($scope.data.step == index)
      return;

    if((index > ($scope.data.step)) && $scope.isStepDisabled($scope.data.step))
      return;

    var prev = index - 1 == 0 ?  1 : index - 1;
    if($scope.dirty.indexOf(index) == -1 && $scope.isStepDisabled(prev))
      return;

    // set dirty for all section from current to index
    for(var i = $scope.data.step; i < index; i++)
      $scope.dirty.push(i);

    $scope.data.step = index;
  };

});
