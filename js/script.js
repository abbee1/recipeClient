var module = angular.module("recipe", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider){
   $urlRouterProvider.otherwise("/");
   
       $stateProvider.state("home", {
        url: "/", 
        templateUrl: "templates/home.html",
        controller: "homeCtrl"
    });
});

module.controller("homeCtrl", function ($scope, recipeService){
   var promise = recipeService.getRecipes();
   promise.then(function (data){
      $scope.recipes = data.data; 
   });
});

module.service("recipeService", function ($q, $http){
    this.getRecipes = function (){
       var deffer = $q.defer();
       var url = "http://localhost:8080/recipe/webresources/recipe";
       $http.get(url).then(function (data){
          deffer.resolve(data); 
       });
        return deffer.promise;
    };
});