var HeroesApp = angular.module("HeroesApp", [
    'ui.bootstrap',
    "ui.router",
    'heroes'
]);

HeroesApp.directive("hero", function($state) {
    return {
        scope: {
            hero: '=model'
        },
        template: '<a ng-click="viewHero(hero)">' +
        '<h3>{{ hero.name }}</h3>' +
        '<img ng-src="{{ hero.logoImg }}" />' +
        '<h6>{{ hero.realName }}</h6>' +
        '</a>',
        link: function (scope, element, attrs) {
            scope.viewHero = function (hero) {
                $state.go("heroes.view", { comics: $state.params.comics, heroName: hero.name })
            }
        }
    };
});


HeroesApp.config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/avengers");

    $stateProvider
        .state("heroes", {
            url: "/",
            templateUrl: "app/main.html",
            controller: function ($scope, $state) {
                $scope.tabs = [
                    {title: 'Avengers', state: 'heroes.list', stateParams: { comics: 'avengers' }},
                    {title: 'X-Men', state: 'heroes.list', stateParams: { comics: 'x-men' }},
                    {title: 'Guardians of the Galaxy', state: 'heroes.list', stateParams: { comics: 'guardians' }}
                ];

                $scope.goToState = function (state, stateParams) {
                    $state.go(state, stateParams);
                };
            }
        })
        .state("heroes.list", {
            url: ":comics",
            templateUrl: "app/heroes/heroes-list.html",
            resolve: {
                heroes: function ($q, $stateParams, heroesService) {
                    var deferred = $q.defer();
                    heroesService.getHeroes($stateParams.comics, deferred.resolve, deferred.reject);

                    return deferred.promise;
                }
            },
            controller: function ($scope, heroes) {
                $scope.heroes = heroes;
            }
        })
        .state("heroes.view", {
            url: ":comics/:heroName",
            templateUrl: "app/heroes/hero-view.html",
            resolve: {
              hero: function ($q, $stateParams, heroesService) {
                  var deferred = $q.defer();
                  heroesService.getHero($stateParams.comics, $stateParams.heroName, deferred.resolve, deferred.reject);

                  return deferred.promise;
              }
            },
            controller: function ($scope, hero) {
                $scope.hero = hero;
            }
        })
});

