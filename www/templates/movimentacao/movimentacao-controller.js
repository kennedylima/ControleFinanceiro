controleFinanceiroAPP.controller("MovimentacaoController", function ($scope, $rootScope,$state,$http,$filter,$window,$ionicPopup,$ionicPlatform,$cordovaToast,$cordovaSQLite,$filter,$mdDialog,MovimentacaoService,MovimentacaoFactory,CategoriaFactory) {
  $ionicPlatform.ready(function () {

    $scope.receita = "RECEITA";
    $scope.despesa = "DESPESA";
    $scope.movimentacoes = [];
    $scope.movimentacao = MovimentacaoService.getMovimentacao();

    $scope.totalDespesa = 0;
    $scope.totalReceita = 0;
    $scope.saldo = 0;
    $scope.totalDespesaPorCategoria = 0;
    $scope.categorias = [];

    $scope.mesVigente = new Date();

    var eventoDialog= {};
    var movimentacao = {};
    var primeiroDiaDoMes = undefined;
    var ultimoDiaDoMes = undefined;

    var getUltimoDiaDoMes = function (data) {
      return new Date(data.getFullYear(), data.getMonth() + 1, 0, 23, 59, 59);
    }

    var getPrimeiroDiaDoMes = function (data) {
      return new Date(data.getFullYear(), data.getMonth(), 1);
    }

    $scope.mesAnterior = function () {
     $scope.mesVigente.setMonth( $scope.mesVigente.getMonth()-1);
      console.log("Mes Anterior ------------------------------");
      console.log("Primeiro dia Mes "+primeiroDiaDoMes);
      //console.log("Mes vigente -1 "+$scope.mesVigente.getMonth()-1);
      console.log("Mes vigente "+$scope.mesVigente);
      primeiroDiaDoMes = new Date($scope.mesVigente.getFullYear(), $scope.mesVigente.getMonth(), 1);
      ultimoDiaDoMes = new Date($scope.mesVigente.getFullYear(), $scope.mesVigente.getMonth() + 1, 0, 23, 59, 59);
      $scope.buscarMovimentacoes();
      console.log("Mes Anterior ------------------------------");
      console.log("Primeiro dia do mês "+primeiroDiaDoMes);
      console.log("Ultimo dia do mês "+ultimoDiaDoMes);
      console.log("Mes Anterior ------------------------------");
    }

    $scope.mesPosterior = function () {
      $scope.mesVigente.setMonth($scope.mesVigente.getMonth()+1);
      primeiroDiaDoMes = new Date($scope.mesVigente.getFullYear(), $scope.mesVigente.getMonth(), 1);
      ultimoDiaDoMes = new Date($scope.mesVigente.getFullYear(), $scope.mesVigente.getMonth() + 1, 0, 23, 59, 59);
      $scope.buscarMovimentacoes();
      console.log("Mes Posterior ------------------------------");
      console.log("Primeiro dia do mês "+primeiroDiaDoMes);
      console.log("Ultimo dia do mês "+ultimoDiaDoMes);
      console.log("Mes Posterior ------------------------------");
    }


    if(primeiroDiaDoMes == undefined){
      primeiroDiaDoMes = getPrimeiroDiaDoMes(new Date());
      ultimoDiaDoMes = getUltimoDiaDoMes(new Date());
      $scope.mesVigente = primeiroDiaDoMes;
      console.log("Primeiro dia"+primeiroDiaDoMes);
      console.log("Mes vigente"+$scope.mesVigente);
    }

    $scope.buscarMovimentacoes = function () {
      $scope.movimentacoes = [];
      if (ionic.Platform.isAndroid()) {
        //var query = "SELECT * FROM movimentacao";
        var query = "SELECT * FROM movimentacao WHERE data  BETWEEN "+primeiroDiaDoMes.getTime()+" AND  "+ultimoDiaDoMes.getTime()+"";
        console.log(query);
        $cordovaSQLite.execute($rootScope.banco, query)
          .then(function (res) {
            console.log(res.rows.item(0));
            if ($scope.movimentacoes.length != res.rows.length) {
              for (var i = 0; i < res.rows.length; i++) {
                movimentacao = res.rows.item(i);
                movimentacao.data = new Date(movimentacao.data);
                movimentacao.dataFormatada = Date.parse(movimentacao.data);
                //$scope.movimentacao.dataFormatada = $filter('date')($scope.movimentacao.dataFormatada, "dd/MM/yyyy");
                buscarCategoriaPor(movimentacao);
              }
            }
            if(res.rows.length == 0){
              $scope.totalDespesa = 0;
              $scope.totalReceita = 0;
              $scope.saldo = 0;
            }
          }, function (error) {
            console.log(error);
          });
      } else {
        MovimentacaoFactory.buscarTodas(function (response, error) {
          if (!error) {
            $scope.movimentacoes = response;
            calcularReceitaDespesaESaldo();

          }
        });
      }
    }

    if (ionic.Platform.isAndroid()) {
      var query = "SELECT * FROM categoria";
      $cordovaSQLite.execute($rootScope.banco, query)
        .then(function (res) {
          if ($scope.categorias.length != res.rows.length) {
            for (var i = 0; i < res.rows.length; i++) {
              $scope.categorias.push(res.rows.item(i));
            }
          }
        }, function (error) {
          console.log(error);
        });
    } else {
      CategoriaFactory.buscarTodas(function (response, error) {
        if (!error) {
          $scope.categorias = response;
        }
      })
    }


    $scope.editar = function (movimentacao, evento) {
      eventoDialog = evento;
      movimentacao.data = new Date(movimentacao.data);
      MovimentacaoService.setMovimentacao(movimentacao);
      $scope.movimentacao = movimentacao;
      buscarCategoriaPor(movimentacao);
      $state.go("movimentacao");
    }


    $scope.salvar = function (evento) {
      $scope.movimentacao.data = $scope.movimentacao.data.getTime();
      eventoDialog = evento;
      if (ionic.Platform.isAndroid()) {
        if ($scope.movimentacao.id != undefined) {
          var query = "UPDATE movimentacao SET tipo=?,descricao=?,data=?,categoria_id=?,valor=? WHERE id=?";
          $cordovaSQLite.execute($rootScope.banco, query,
            [ $scope.movimentacao.tipo,
              $scope.movimentacao.descricao,
              $scope.movimentacao.data,
              $scope.movimentacao.categoria.id,
              $scope.movimentacao.valor,
              $scope.movimentacao.id])
            .then(function (res) {
              console.log(res.rows.item(0));
              MovimentacaoService.setMovimentacao(undefined);
              var index = $scope.movimentacoes.indexOf($scope.movimentacao);
              $scope.movimentacoes[index] = $scope.movimentacoes;
              $state.go('movimentacoes');
            }, function (error) {
              console.log(error);
            });

        } else {
          var query = "INSERT INTO movimentacao (tipo,descricao ,data, categoria_id,valor) VALUES(?,?,?,?,?)";
          $cordovaSQLite.execute($rootScope.banco, query,
            [$scope.movimentacao.tipo,
              $scope.movimentacao.descricao,
              $scope.movimentacao.data,
              $scope.movimentacao.categoria.id,
              $scope.movimentacao.valor])
            .then(function (res) {
              MovimentacaoService.setMovimentacao(undefined);
              $scope.movimentacoes.push($scope.movimentacao);
              calcularGastosPor($scope.movimentacao.categoria);
              $state.go('movimentacoes');
            }, function (err) {
              $cordovaToast.showShortBottom(err);
            });
        }

      } else {
        MovimentacaoService.salvar($scope.movimentacao)
          .then(function (response) {

            MovimentacaoFactory.buscarTodas(function (response, error) {
              if (!error) {
                $scope.movimentacoes = response;
                calcularReceitaDespesaESaldo();
                $state.go('movimentacoes');
              }
            });

          }, function (error) {
            console.log(error);
          })
      }
    }

    $scope.adicionar = function () {
      MovimentacaoService.setMovimentacao(undefined);
      $state.go("movimentacao");
    }

    $scope.excluir = function (movimentacao) {
      $ionicPopup.show({
        template: '',
        title: 'Deseja realmente excluir este item ?',
        subTitle: '',
        scope: $scope,
        buttons: [
          {
            text: 'Não',
            type: 'button-positive'
          },
          {
            text: '<b>Sim</b>',
            type: 'button-assertive',
            onTap: function (e) {

              if (ionic.Platform.isAndroid()) {
                  var query = "DELETE FROM movimentacao WHERE id="+movimentacao.id;
                  $cordovaSQLite.execute($rootScope.banco, query)
                    .then(function (res) {
                      MovimentacaoService.setMovimentacao(undefined);
                      var index = $scope.movimentacoes.indexOf(movimentacao);
                      $scope.movimentacoes.splice(index,1);
                      $state.go($state.current, {}, {reload: true});
                    },function (err) {
                      console.log(err);
                    });
              }else {
                MovimentacaoService.excluir(id)
                  .then(function (response) {
                    $scope.buscarMovimentacoes();

                  }, function (error) {
                    console.log(error);
                  })
              }


            }
          }
        ]
      });
    }

    var calcularReceitaDespesaESaldo= function() {
      calcularDespesa();
      calcularReceita();
      calcularSaldo();
    }



    var calcularDespesa = function () {
      $scope.totalDespesa = 0;
      angular.forEach($scope.movimentacoes, function (movimentacao) {
        if (movimentacao.tipo == "DESPESA") {
          $scope.totalDespesa += movimentacao.valor;
        }
      });
    }

    var calcularReceita = function () {
      $scope.totalReceita = 0;
      angular.forEach($scope.movimentacoes, function (movimentacao) {
        if (movimentacao.tipo == "RECEITA") {
          $scope.totalReceita += movimentacao.valor;
        }
      });
    }

    var calcularSaldo = function () {
      $scope.saldo = $scope.totalReceita - $scope.totalDespesa;
    }

    var calcularGastosPor = function (categoria) {
      if ($scope.movimentacoes.length > 0) {
        angular.forEach($scope.movimentacoes, function (movimentacao) {
          if($scope.movimentacao.categoria == undefined){
            angular.forEach($scope.categorias, function (categoria) {
              if (movimentacao.categoria_id == categoria.id ) {
                movimentacao.categoria = categoria;
              }
            });
          }
          else if (movimentacao.categoria.id == categoria.id) {
            $scope.totalDespesaPorCategoria += movimentacao.valor;
          }

        });


        if($scope.totalDespesaPorCategoria > $scope.movimentacao.categoria.valorMaximo && $scope.movimentacao.categoria.valorMaximo != null) {
          var valorExcedido = $scope.totalDespesaPorCategoria - $scope.movimentacao.categoria.valorMaximo;
          valorExcedido = $filter('currency')(valorExcedido, "R$:", 2);
          $mdDialog.show(
            $mdDialog.alert()
              .clickOutsideToClose(true)
              .title('Atenção !')
              .textContent('Você gastou com ' + $scope.movimentacao.categoria.descricao + ' ' + valorExcedido + ' a mais que o esperado !')
              .ariaLabel('Alerta de Gasto')
              .ok('OK, Entendi')
              .targetEvent(eventoDialog)
          );
        }



      } else {
        $scope.totalDespesaPorCategoria += movimentacao.valor;
      }
    }

    var buscarCategoriaPor = function (movimentacao) {
      if(movimentacao.categoria == undefined) {
        var query = "SELECT * FROM categoria WHERE id=" + movimentacao.categoria_id + ";";
        $cordovaSQLite.execute($rootScope.banco, query)
          .then(function (res) {
            movimentacao.categoria = {};
            movimentacao.categoria = res.rows.item(0);
            $scope.movimentacoes.push(movimentacao);
            var ix =
            calcularReceitaDespesaESaldo(movimentacao);

          }, function (error) {
            console.log(error);
          });
      }
    }




    $scope.buscarMovimentacoes();
  });
})
