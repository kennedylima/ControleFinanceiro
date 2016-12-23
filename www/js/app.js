// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var controleFinanceiroAPP = angular.module('controleFinanceiro', ['ionic','ngCordova','ngMaterial','ngAria','ngAnimate','ui.utils.masks','chart.js'])

.run(function($ionicPlatform,$cordovaSQLite,$cordovaToast,$rootScope,$cordovaSplashscreen) {

  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }

    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    setTimeout(function() {
      navigator.splashscreen.hide();
    }, 10000)

    $rootScope.banco = $cordovaSQLite.openDB({name: "ControleFinanceiro", location: "default"});
    var criarTabelaCategoria = "CREATE TABLE IF NOT EXISTS categoria " +
      "(id integer primary key autoincrement, descricao varchar(100) not null, valorMaximo real)";


    $cordovaSQLite.execute($rootScope.banco, criarTabelaCategoria)
      .then(function (response) {
          console.log("Tebela Categoria criada com sucesso");
        }, function (error) {
          console.log("Erro = " + JSON.stringify(error));
        }
      )

    var criarTabelaMovimentacao = "CREATE TABLE IF NOT EXISTS movimentacao (" +
      "id integer primary key autoincrement, tipo text,descricao varchar(100)," +
      "data integer, categoria_id integer, valor real, FOREIGN KEY(categoria_id) REFERENCES categoria(id))";
    $cordovaSQLite.execute($rootScope.banco, criarTabelaMovimentacao)
      .then(function (response) {
          console.log("Tebela Movimentacao criada com sucesso");
        }, function (error) {
          console.log("Erro = " + JSON.stringify(error));
        }
      )
  });

})

.config(function($stateProvider,$urlRouterProvider,$locationProvider,$mdThemingProvider) {

  $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('grey');

  $stateProvider
    .state('movimentacoes', {
      url: '/',
      templateUrl: 'templates/movimentacao/movimentacoes.html',
      controller: 'MovimentacaoController'
    })
      .state('movimentacao', {
      url: '/movimentacao',
      templateUrl: 'templates/movimentacao/movimentacao.html',
      controller: 'MovimentacaoController'
    })
    .state('categoria', {
      url: '/categoria',
      templateUrl: 'templates/categoria/categoria.html',
      controller: 'CategoriaController'
  })
    .state('categorias', {
      url: '/categorias',
      templateUrl: 'templates/categoria/categorias.html',
      controller: 'CategoriaController'
  })
    .state('relatorio', {
      url: '/relatorio',
      templateUrl: 'templates/relatorio/relatorio.html',
      controller: 'RelatorioController'
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');
  //$locationProvider.html5Mode({enabled: true, requireBase: false});
})

.config(['$mdDateLocaleProvider', CalendarConfig]);

  function CalendarConfig($mdDateLocaleProvider) {
    $mdDateLocaleProvider.months = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    $mdDateLocaleProvider.shortMonths = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    $mdDateLocaleProvider.days = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    $mdDateLocaleProvider.shortDays = ['Dom', 'Seg', 'Ter', 'Quar', 'Qui', 'Sex', 'Sáb'];
    $mdDateLocaleProvider.firstDayOfWeek = 0;


    $mdDateLocaleProvider.parseDate = function(dateString) {
      var m = moment(dateString, 'DD/MM/YYYY', true);
      return m.isValid() ? m.toDate() : new Date(NaN);
    };

    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format('DD/MM/YYYY');
    };


    $mdDateLocaleProvider.weekNumberFormatter = function(weekNumber) {
      return 'Semaine ' + weekNumber;
    };

    $mdDateLocaleProvider.firstRenderableDate = new Date(1776, 6, 4);
    $mdDateLocaleProvider.lastRenderableDate = new Date(2100, 11, 21);
  };


