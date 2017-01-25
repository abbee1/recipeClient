var module = angular.module("recipe", ["ui.router"]);

module.config(function ($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state("home", {
        url: "/",
        templateUrl: "templates/home.html",
        controller: "homeCtrl"
    }).state("register", {
        url: "/register",
        templateUrl: "templates/register.html",
        controller: "registeringCtrl"
    }).state("recipe", {
        url: "/recipe/:id",
        templateUrl: "templates/recipe.html",
        controller: "recipeCtrl"
    }).state("addRecipe", {
        url: "/addRecipe",
        templateUrl: "templates/addRecipe.html",
        controller: "addRecipeCtrl"
    }).state("changeRecipe", {
        url: "/changeRecipe",
        templateUrl: "templates/changeRecipe.html",
        controller: "changeRecipeCtrl"
    });
});

//controller home
module.controller("homeCtrl", function ($scope, recipeService, $rootScope) {
    var promise = recipeService.getRecipes();
    promise.then(function (data) {
        $scope.recipes = data.data;
    });
});

//controller loggin
module.controller("logginCtrl", function ($scope, recipeService, $rootScope) {
    $scope.loggIn = function () {
        recipeService.loggIn($scope.username, $scope.password);
    };
});

//controller registering
module.controller("registeringCtrl", function ($scope, recipeService, $rootScope) {
    $scope.register = function () {
        recipeService.register($scope.username, $scope.password);
    };
});

//controller för att titta på ett recept
module.controller("recipeCtrl", function ($scope, recipeService, $rootScope, $stateParams) {
    var promise = recipeService.getRecipe($stateParams.id);
    promise.then(function (data) {
        $scope.recipe = data.data;
        console.log(data.data);
    });
    var promise2 = recipeService.getIngre($stateParams.id);
    promise2.then(function (data) {
        $scope.ingredients = data.data;
    });
});

//lägga till ett recept
module.controller("addRecipeCtrl", function ($scope, $rootScope, recipeService) {
    recipeService.getRecipes().then(function (data) {
        $scope.recipes = data.data;
    });

    $scope.addRecipe = function () {
        recipeService.addRecipe($scope.name, $scope.instru, $scope.category, $scope.author);
    };

});

//ändra och raderar controller
module.controller("changeRecipeCtrl", function ($scope, $rootScope, recipeService) {
    var promise = recipeService.getRecipes();
    promise.then(function (data) {
        $scope.recipes = data.data;
    });

    $scope.removeRecipe = function (id, author) {
        if ($rootScope.user == author) {
            return recipeService.removeRecipe(id);
        } else {
            alert("du får inte radera denna din fitta");
        }
    };

    $scope.fillForm = function (id) {
        for (var i = 0; i < $scope.recipes.length; i++) {
            if ($scope.recipes[i].id === id) {
                $scope.formId = id;
                $scope.formName = $scope.recipes[i].name;
                $scope.formCat = $scope.recipes[i].category;
                $scope.formAut = $scope.recipes[i].author;
            }
        }
    };

    $scope.submitForm = function () {
        recipeService.updateRecipe($scope.formId, $scope.formName, $scope.formCat, $scope.formAut);
    };
});

//service
module.service("recipeService", function ($q, $http, $rootScope, $stateParams) {
    this.getRecipes = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/recipe/webresources/recipe";
        $http.get(url).then(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    this.getRecipe = function (id) {
        var deffer = $q.defer();
        var url = "http://localhost:8080/recipe/webresources/recipe/" + id;
        $http({
            url: url,
            method: "GET",
            params: {id: id}
        }).then(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    this.getIngre = function (id) {
        var deffer = $q.defer();
        var url = "http://localhost:8080/recipe/webresources/ingred/" + id;
        $http({
            url: url,
            method: "GET",
            params: {id: id}
        }).then(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    this.getCategory = function () {
        var deffer = $q.defer();
        var url = "http://localhost:8080/recipe/webresources/category";
        $http({
            url: url,
            method: "GET",
        }).then(function (data) {
            deffer.resolve(data);
        });
        return deffer.promise;
    };
    this.loggIn = function (username, password) {
        var url = "http://localhost:8080/recipe/webresources/login";
        var auth = "Basic " + window.btoa(username + ":" + password);
        $rootScope.user;
        $http({
            url: url,
            method: "POST",
            headers: {'Authorization': auth}
        }).then(function (data) {
            console.log("Du är inloggad");
            $rootScope.isLoggdIn = true;
            $rootScope.user = username;
            $rootScope.pass = password;
        });
    };
    this.register = function (username, password) {
        console.log("register anropas");
        var data = {
            password: password,
            username: username
        };
        console.log(data);
        var url = "http://localhost:8080/recipe/webresources/user";
        
        $http({
            url: url,
            method: "POST",
            data: data
        }).then(function (data) {
            alert("Välkommen till Mat-Albin " + username);
        });
    };
    this.addRecipe = function (name, instru, category, author) {
        var data = {
            name: name,
            instructions: instru,
            category: category,
            author: author
        };
        var url = "http://localhost:8080/recipe/webresources/recipe";
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        $http({
            url: url,
            method: "POST",
            data: data,
            headers: {'Authorization': auth}
        }).then(function (data, status) {
            console.log("recept tillagd");
            console.log(data);
        });
    };
    this.updateRecipe = function (id, name, category, author) {
        var data = {
            id: id,
            name: name,
            category: category,
            author: author
        };
        var url = "http://localhost:8080/recipe/webresources/recipe/" + id;
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);

        $http({
            url: url,
            method: "PUT",
            data: data,
            headers: {'Authorization': auth}
        }).then(function (data, status) {
            console.log("Match updaterad");
        })
                .error(function (data, status) {
                    console.log("Det blev fel");
                });
    };
    this.removeRecipe = function (id) {
        var url = "http://localhost:8080/recipe/webresources/recipe/" + id;
        var auth = "Basic " + window.btoa($rootScope.user + ":" + $rootScope.pass);
        console.log(auth);
        console.log(url);
        $http({
            url: url,
            method: "DELETE",
            headers: {'Authorization': auth}
        }).then(function (data, status) {
            console.log("Match borttagen");
            alert("YAS");
        }).error(function (data, status) {
            console.log("det blev fel");
            alert("fuck");
        });
    };

});
