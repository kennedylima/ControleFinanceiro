controleFinanceiroAPP.controller("RelatorioController", function ($scope,$cordovaSQLite,$rootScope,$ionicPlatform,$filter, $state, MovimentacaoService, CategoriaService) {
  $ionicPlatform.ready(function () {
    $scope.movimentacoes = [];
    $scope.categorias = [];
    var dados = [];
    var grafico = {};
    var canvas = {};
    var div = {};
    var nomeDasCategorias = [];

    $scope.movimentacoes = MovimentacaoService.getMovimentacoes();
    $scope.categorias = CategoriaService.getCategorias();

    $scope.graficoEmLinha = function () {
      criarElemtentoCanvas();
      new Chart(canvas, {
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
            callbacks: {
              label: function(tooltipItems, dados) {
                return $filter('currency')(tooltipItems.yLabel, 'R$: ', 2)
              }
            }
          },
          scales: {
            xAxes: [{
              ticks: {
                fontSize: 40 / $scope.categorias.length
              }
            }],

            yAxes: [{
              ticks: {
                fontSize: 10
              }
            }]
          }
        }
      });
    }

    $scope.graficoEmBarra = function () {
      criarElemtentoCanvas();
      ctx = canvas.getContext('2d');

       grafico = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: nomeDasCategorias,
          datasets: [{
            data: dados,
            backgroundColor: $scope.categorias.cor,
            borderColor: $scope.categorias.cor,
            borderWidth: 1
          }]
        },
        options: {
          tooltips: {
            callbacks: {
              label: function(tooltipItems, dados) {
                return $filter('currency')(tooltipItems.yLabel, 'R$: ', 2)
              }
            }
          },
          scales: {
            xAxes: [{
              ticks: {
                fontSize: 40 / $scope.categorias.length
              }
            }],
            yAxes: [{
              ticks: {
                fontSize: 10
              },
              stacked: true
            }]
          }
        }

      });
    }

    $scope.graficoEmPizza = function () {
      criarElemtentoCanvas();
      ctx = canvas.getContext('2d');
      grafico = new Chart(ctx,{
        type: 'pie',
        data: {
          labels: nomeDasCategorias,
          datasets: [{
            data: dados,
            backgroundColor: $scope.categorias.cor,
            hoverBackgroundColor: $scope.categorias.cor
          }]
        }
      });
    }

    var gerardorDeCorRGB = function() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return 'rgb(' + r + "," + g + "," + b + ")";
    }

    var criarElemtentoCanvas = function () {
      removerTodosOsElementosDaDiv();
      canvas = document.createElement('canvas');
      div = document.getElementById("divRelatorio");
      canvas.id = "relatorio";
      canvas.style.position = "relative";
      div.appendChild(canvas);
    }

    var removerTodosOsElementosDaDiv = function(){
        div.innerHTML = '';
    }

    var totalizarGastosPorCategoria = function () {
      $scope.categorias.cor = [];
        for (var j = 0; j < $scope.categorias.length; j++) {
          $scope.categorias[j].totalGasto = 0;
          for (var i = 0; i < $scope.movimentacoes.length; i++) {
            if ($scope.movimentacoes[i].categoria_id == $scope.categorias[j].id
              && $scope.movimentacoes[i].valor > 0
              && $scope.movimentacoes[i].tipo == "DESPESA") {
              $scope.categorias[j].totalGasto += $scope.movimentacoes[i].valor;
              $scope.exibirGrafico = true;
            }

          }

          if ($scope.categorias[j].totalGasto > 0) {
            nomeDasCategorias.push($scope.categorias[j].descricao);
            dados.push($scope.categorias[j].totalGasto);
          }

          $scope.categorias.cor.push(gerardorDeCorRGB());

        }

        $scope.graficoEmBarra();


    }

    totalizarGastosPorCategoria();

  });

});




/*var buscarCategorias = function () {
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
  }*/

