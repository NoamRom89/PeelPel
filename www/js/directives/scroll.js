app = angular.module('BNSApp.directive', []);


app.directive('scroll',   ['$http','$window' ,function ($http,$window)
    {
      return function(scope, element, attrs) {
        angular.element($window).bind("scroll", function() {
          if (this.pageYOffset >= 100) {
            //scope.boolChangeClass = true;
            console.log('Scroll - this.pageYOffset >= 100');
          } else {
            //scope.boolChangeClass = false;
            console.log('Scroll - this.pageYOffset <= 100');
          }
          scope.$apply();
        });
      };

    }]);
