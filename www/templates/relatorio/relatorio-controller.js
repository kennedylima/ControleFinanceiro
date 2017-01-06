controleFinanceiroAPP.controller("RelatorioController", function ($scope,$cordovaSQLite,$rootScope,$ionicPlatform,$filter) {
  $ionicPlatform.ready(function () {
    $scope.movimentacoes = [];
    $scope.categorias = [];
    var dados = [];
    grafico = undefined;
    canvas = {};
    var nomeDasCategorias = [];
    $scope.tipoGrafico = 'line';
    var graficoCarregado = false;


    $scope.graficoEmLinha = function () {
      if(grafico != undefined){
        grafico.destroy();
        console.log("Destruindo linha");
      }
      canvas = document.getElementById('relatorio').getContext('2d');
      grafico = new Chart(canvas, {
        type: 'line',
        data: {
          labels: nomeDasCategorias,
          datasets: [{
            data: dados,
            backgroundColor:
              'rgba(27, 251, 137, 0.5)'
            ,
            borderColor:
              'rgba(27, 251, 137, 1)'
            ,
            borderWidth: 1
          }]
        },
        options: {
          tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
              label: function(tooltipItems, dados) {
                return $filter('currency')(tooltipItems.yLabel, 'R$: ', 2)
              }
            }
          },
        }

      });
      graficoCarregado = true;
    }

    $scope.graficoEmBarra = function () {
      if(grafico != undefined){
        grafico.destroy();
        console.log("Destruindo barra");
      }

      canvas = document.getElementById('relatorio').getContext('2d');
      grafico = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: nomeDasCategorias,
          datasets: [{
            data: dados,
            backgroundColor: [
              'rgba(27, 251, 137, 0.5)',
              'rgba(50, 183, 252, 0.5)',
              'rgba(231, 145, 255, 0.5)',
              'rgba(253, 255, 89, 0.5)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(104, 128, 254, 0.2)',
              'rgba(5, 255, 203, 0.2)',
              'rgba(22, 95, 05, 0.2)',
              'rgba(96, 25, 7, 0.2)'
            ],
            borderColor: [
              'rgba(27, 251, 137, 1)',
              'rgba(50, 183, 252, 1)',
              'rgba(231, 145, 255, 1)',
              'rgba(253, 255, 89, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(104, 128, 254, 1)',
              'rgba(5, 255, 203, 1)',
              'rgba(22, 95, 05, 1)',
              'rgba(96, 25, 7, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          tooltips: {
            enabled: true,
            mode: 'single',
            callbacks: {
              label: function(tooltipItems, dados) {
                console.log(tooltipItems);
                console.log(nomeDasCategorias);
                return $filter('currency')(tooltipItems.yLabel, 'R$: ', 2)
              }
            }
          },
        }

      });
      graficoCarregado = true;
    }

    $scope.graficoEmPizza = function () {
      if(grafico != undefined){
        grafico.destroy();
        console.log("Destruindo pizza");
      }

      canvas = document.getElementById('relatorio').getContext('2d');
      grafico = new Chart(canvas,{
        type: 'pie',
        data: {
          labels: nomeDasCategorias,
          datasets: [{
            data: dados,
            backgroundColor: [
              'rgba(27, 251, 137, 0.5)',
              'rgba(50, 183, 252, 0.5)',
              'rgba(231, 145, 255, 0.5)',
              'rgba(253, 255, 89, 0.5)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(104, 128, 254, 0.2)',
              'rgba(5, 255, 203, 0.2)',
              'rgba(22, 95, 05, 0.2)',
              'rgba(96, 25, 7, 0.2)'
            ],
            hoverBackgroundColor: [
              'rgba(27, 251, 137, 1)',
              'rgba(50, 183, 252, 1)',
              'rgba(231, 145, 255, 1)',
              'rgba(253, 255, 89, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(104, 128, 254, 1)',
              'rgba(5, 255, 203, 1)',
              'rgba(22, 95, 05, 1)',
              'rgba(96, 25, 7, 1)'
            ]
          }]
          }
      });

      graficoCarregado = true;
      console.log(grafico);
    }

    var buscarCategorias = function () {
      var query = "SELECT * FROM categoria";
      $cordovaSQLite.execute($rootScope.banco, query)
        .then(function (res) {
          if ($scope.categorias.length != res.rows.length) {
            for (var i = 0; i < res.rows.length; i++) {
              $scope.categorias.push(res.rows.item(i));
            }
          }

          buscarMovimentacoes();
        }, function (error) {
          console.log(error);
        });
    }

    var buscarMovimentacoes = function () {
      var query = "SELECT * FROM movimentacao";
      $cordovaSQLite.execute($rootScope.banco, query)
        .then(function (res) {
          if ($scope.movimentacoes.length != res.rows.length) {
            for (var i = 0; i < res.rows.length; i++) {
              $scope.movimentacoes.push(res.rows.item(i));
            }
          }
          totalizarGastosPorCategoria();
        }, function (error) {
          console.log(error);
        });
    }

    var totalizarGastosPorCategoria = function () {
      for (var j = 0; j < $scope.categorias.length; j++) {
        $scope.categorias[j].totalGasto = 0;
        for (var i = 0; i < $scope.movimentacoes.length; i++) {
          if ($scope.movimentacoes[i].categoria_id == $scope.categorias[j].id) {
              $scope.categorias[j].totalGasto += $scope.movimentacoes[i].valor;
          }
        }
        dados.push($scope.categorias[j].totalGasto);
        nomeDasCategorias.push($scope.categorias[j].descricao);
      }
      $scope.graficoEmBarra();

    }

    if (ionic.Platform.isAndroid()) {
      buscarCategorias();
    } else {
      CategoriaFactory.buscarTodas(function (response, error) {
        if (!error) {
          $scope.categorias = response;
        }
      })
    }


  });


});
