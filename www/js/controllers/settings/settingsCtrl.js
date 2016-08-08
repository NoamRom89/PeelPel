'use strict';
/**
 * controller  - social articles
 */
app.controller('SettingsCtrl', function($scope, $rootScope, $http, userFactory, APP_REGEX, $localstorage, $state, $stateParams, $ionicLoading,$ionicPopup, $ionicAnalytics){

  //
  //var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
  //$http.defaults.headers.post['x-access-token'] = lsValue;
  //
  //
  ///*************************** Sending logs of article *******************************/
  //
  //  ////Start-articles
  //
  //$scope.heartPressed = false;
  //$scope.articles = {};
  //$scope.oneArticle={};
  //$scope.testShowArticle=[];
  //var staticNumOfArticles = 4;
  //
  ////here get the data from the dataBase,user-article.
  //var getArticles = function(){
  //
  //  $ionicLoading.show();
  //
  //  if(!$rootScope.connectedUser){
  //
  //  }
  //
  //
  //  $http.post(SERVER_ROOT_PATH + '/client/getAllArticles').
  //
  //    then(function (res) {
  //      //console.log('Response:',res);
  //      if(res.data.error){
  //        console.log("Error getting articles");
  //        return;
  //      }
  //
  //      $scope.articles = res.data.result;
  //
  //      //Randomize articles to be displayed (4 at a time)
  //      for(var i = 0; i < staticNumOfArticles; i++){
  //
  //        var article = $scope.articles[Math.floor(Math.random()*$scope.articles.length)];
  //
  //        if($scope.testShowArticle.indexOf(article) == -1){
  //          $scope.testShowArticle[i] = article;
  //
  //          angular.forEach($rootScope.connectedUser.favorites.articles, function(articleFav){
  //            if(article._id == articleFav.article._id){
  //              article.favorit = true;
  //            }
  //            else{
  //              article.favorit = false;
  //            }
  //          });
  //
  //        }
  //      }
  //
  //      $ionicLoading.hide();
  //
  //    }, function (err) {
  //      console.log("Error - ajax call was failed:  /client/getAllArticles - ", err);
  //    });
  //
  //
  //
  //};
  //
  //
  ///**********************  User delete article,get new one from DB   **********************/
  //var getOneArticle = function(article){
  //
  //
  //  var i = $scope.testShowArticle.indexOf(article);
  //
  //  if(i !== -1){
  //
  //    var articleIndex = $scope.articles.indexOf(article);
  //    $scope.articles.splice(articleIndex,1);
  //
  //    //$scope.testShowArticle.splice(index,1);
  //    $scope.testShowArticle[i] = $scope.articles[Math.floor(Math.random()*$scope.articles.length)];
  //
  //    //if there is no more article - send the same article
  //    console.log('$scope.testShowArticle[i]',$scope.testShowArticle[i]);
  //    if($scope.testShowArticle[i] == null){
  //      return article;
  //    }
  //
  //    return $scope.testShowArticle[i]
  //  }
  //
  //  return article;
  //
  //
  //};
  //
  ///**********************  User press on an article   **********************/
  //$scope.passToArticle = function(article){
  //
  //  if(!article || article._id == ''){
  //    return;
  //  }
  //
  //  var log = {
  //    type: $rootScope.events.types.article.key,
  //    action: $rootScope.events.actions.entry.key,
  //    value: article._id
  //  };
  //
  //  $http.post(SERVER_ROOT_PATH + '/client/addEventLog', {log : log}).
  //
  //    then(function (res) {
  //      console.log('Response from /client/addEventLog:',res);
  //      if(res.data.error){
  //        console.log("Error getting articles");
  //        return;
  //      }
  //
  //      console.log("LOG - article entry was occurred", article._id);
  //    }, function (err) {
  //      console.log("Error - ajax call was failed:  /client/addEventLog - ", err);
  //    });
  //
  //  $localstorage.set($localstorage.localSTypes.BNSState, 'tab.articles');
  //  $state.go('article', {articleId: article._id});
  //};
  ///**************************************************************************************************************/
  //
  //
  ///**
  // * User add article to his favorites
  // */
  //$scope.favoritesBtn = function(article){
  //
  //  $scope.heartPressed = !$scope.heartPressed;
  //  console.log('Article to be favorite: ',article);
  //
  //  $http.post(SERVER_ROOT_PATH + '/client/addArticleToFavorites',{articleId:article._id}).
  //
  //    then(function (res) {
  //      console.log('Response from adding article to favorites:',res.data.result);
  //      if(res.data.result){
  //        article.favorit = !article.favorit;
  //        $rootScope.$broadcast('addFavoriteArticle', "Hello from articles");
  //      }
  //
  //    }, function (err) {
  //      console.log("Error - ajax call was failed:  /client/addArticleToFavorites- ", err);
  //    });
  //
  //
  //  if($scope.heartPressed){
  //    var log = {
  //      type: $rootScope.events.types.favorite.key,
  //      action: $rootScope.events.actions.add.key,
  //      value: null
  //    };
  //  }else{
  //
  //    var log = {
  //      type: $rootScope.events.types.favorite.key,
  //      action: $rootScope.events.actions.remove.key,
  //      value: null
  //    };
  //  }
  //
  //
  //
  //  $http.post(SERVER_ROOT_PATH + '/client/addEventLog', {log : log}).
  //
  //    then(function (res) {
  //      console.log('LOG - adding/removing article into favorites :',res);
  //
  //    }, function (err) {
  //      console.log("Error - ajax call was failed:  /client/addEventLog - ", err);
  //    });
  //};
  //
  ///********************************************************************************************************************/
  //
  ///**
  // * change Img Article
  // */
  //$scope.initImgLogo = function(imgName){
  //  if(imgName == "One"){
  //    return "articleLogo2" ;
  //  }
  //};
  //
  ///********************************************************************************************************************/
  //
  ///**
  // * delete Article and get New one
  // **/
  //$scope.deleteArticle = function(artDelete,num){
  //
  //  //console.log("delete article",artDelete, num);
  //
  //  $scope.testShowArticle[num] = getOneArticle(artDelete);
  //
  //
  //  if($scope.testShowArticle[num] == artDelete){
  //    var alertPopup = $ionicPopup.alert({
  //      title: "נגמרה מכסת הכתבות",
  //      template: "עוד כמה שעות יהיו עוד"
  //    });
  //  }
  //
  //};
  //
  ///***********************************************************************************************************************/
  //
  ///**
  // * Force Refresh
  // **/
  //$scope.refreshTasks = function() {
  //
  //  console.log('Refreshing');
  //  getArticles();
  //
  //  $timeout(function() {
  //    $scope.$broadcast('scroll.refreshComplete');
  //    $scope.$broadcast('scroll.refreshComplete');
  //  }, 400);
  //};
  //
  ////// listen for the event in the relevant $scope
  ////$scope.$on('myCustomEvent', function (event, data) {
  ////  console.log(data); // 'Data to send'
  ////});
  //
  ///***********************************************************************************************************************/
  //
  //var getUpdateUser = function(){
  //
  //  $ionicLoading.show();
  //  //userFactory.initFactory();
  //  //console.log('$localstorage.get($localstorage.localSTypes.BNSToken)',$localstorage.get($localstorage.localSTypes.BNSToken));
  //
  //  userFactory.promiseFunc().then(function (data) {
  //    console.log('Data: ', data);
  //    $rootScope.connectedUser = data.data.result;
  //    console.log("Making a promise call from factory: ", $rootScope.connectedUser);
  //    if($rootScope.connectedUser){
  //      getArticles();
  //    }
  //    else{
  //      console.log('Cant get user');
  //    }
  //  });
  //};
  //
  //function init(){
  //  getUpdateUser();
  //
  //}
  //
  //init();


  $scope.privacy = function(){
    var alertPopup = $ionicPopup.alert({
      title: "מדיניות פרטיות",
      template: "מדיניות פרטיות"
    });
    $ionicAnalytics.track('Privacy pressed - Settings', {
      userId: $rootScope.connectedUser._id,
      eventDescription:'User press on PRIVACY button'
    });

    alertPopup.then(function(res) {
      console.log('If user press on O.K, show res: ',res);
      $ionicAnalytics.track('Privacy pressed OK - Settings', {
        userId: $rootScope.connectedUser._id,
        eventDescription:'User press on OK button'
      });
    });
  };

  $scope.about = function(){
    var alertPopup = $ionicPopup.alert({
      title: "אודות",
      template: "אודות"
    });
    $ionicAnalytics.track('About pressed - Settings', {
      userId: $rootScope.connectedUser._id,
      eventDescription:'User press on ABOUT button'
    });

    alertPopup.then(function(res) {
      console.log('If user press on O.K, show res: ',res);
      $ionicAnalytics.track('About pressed OK - Settings', {
        userId: $rootScope.connectedUser._id,
        eventDescription:'User press on OK button'
      });
    });
  };

  // A confirm dialog
  $scope.logOut = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'יציאה מהמערכת',
      template: 'אתה בטוח שאתה רוצה לעזוב את המערכת?'
    });

    $ionicAnalytics.track('Logout pressed - Settings', {
      userId: $rootScope.connectedUser._id,
      eventDescription:'User press on logout button'
    });

    confirmPopup.then(function(res) {
      if(res) {
        console.log('User logged out');
        $localstorage.removeItem($localstorage.localSTypes.BNSToken);
        $state.go('login');
        $ionicAnalytics.track('Logout Succeed - Settings', {
          userId: $rootScope.connectedUser._id,
          eventDescription:'User press OK'
        });
      } else {
        console.log('User pressed "Cancel" ');
        $ionicAnalytics.track('Logout Failed - Settings', {
          userId: $rootScope.connectedUser._id,
          eventDescription:'User press Cancel'
        });
      }
    });
  };


  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };


  var init = function(){
    userFactory.promiseFunc().then(function (data) {
      //console.log('CalendarCtrl user after factory: ',data.data.result);
      $rootScope.connectedUser = data.data.result;
    });
  };


  init();

});
