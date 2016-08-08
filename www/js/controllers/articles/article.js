
'use strict';
/**
 * controller  - Article
 */


app.controller('ArticleCtrl', function($scope, $rootScope, $http, userFactory, $state,$localstorage, $stateParams,$ionicLoading){

    var articleTimer;

    var lsValue =  $localstorage.get($localstorage.localSTypes.BNSToken);
    $http.defaults.headers.post['x-access-token'] = lsValue;

    console.log('$stateParams:', $stateParams.articleId);

  var getArticleById = function(){

    $ionicLoading.show();
    $http.post(SERVER_ROOT_PATH + '/client/getOneArticle', {articleId : $stateParams.articleId}).

      then(function (res) {
        if(res.data.error){
          console.log("Error getting articles");
          return;
        }

        $scope.article = res.data.result;
        $ionicLoading.hide();
        console.log("Article obj: ",$scope.article);
      }, function (err) {
        console.log("Error - ajax call was failed:  /client/getOneArticle - ", err);
      });



  };



  /************************************ User press back  ***************************************************/
  $scope.goBack = function() {
    console.log("Returning back!");
    clearTimeout(articleTimer);

    $state.go($localstorage.get($localstorage.localSTypes.BNSState));

  };


  /*********************************************************************************************************************************/



  function init() {
    getArticleById();

    articleTimer = setTimeout(function(){

      var log = {
        type: $rootScope.events.types.article.key,
        action: $rootScope.events.actions.time.key,
        value: $stateParams.articleId
      };

      $http.post(SERVER_ROOT_PATH + '/client/addEventLog', {log : log}).

        then(function (res) {
          console.log('LOG - article time was occurred  :',res);

        }, function (err) {
          console.log("Error - ajax call was failed:  /client/addEventLog - ", err);
        });
    }, 10000);
  }

  init();



});
