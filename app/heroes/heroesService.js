angular.module('heroes')
    .service('heroesService', heroesService)


function heroesService($http) {

    this.getHeroes = function (comics, win, fail) {
      $http.get('app/heroes/' + comics + '.json').then(function (response) {
          win(response.data);
      }, fail || angular.noop);
    };

    this.getHero = function (comics, heroName, win, fail) {
        this.getHeroes(comics, function (heroes) {
            var result = null;
            angular.forEach(heroes, function (hero) {
                if (hero.name === heroName) {
                    result = hero;
                }
            });
            win(result);
        }, fail || angular.noop);
    };
}