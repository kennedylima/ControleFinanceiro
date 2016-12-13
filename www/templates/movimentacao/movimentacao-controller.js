controleFinanceiroAPP.controller("MovimentacaoController", function ($scope, $rootScope,$state,$http,$ionicPopup,$cordovaToast,$filter,$mdDialog,MovimentacaoService,MovimentacaoFactory,CategoriaFactory) {

  $scope.receita = "RECEITA";
  $scope.despesa = "DESPESA";
  $scope.movimentacao = MovimentacaoService.getMovimentacao();

  $scope.totalDespesa = 0;
  $scope.totalReceita = 0;
  $scope.saldo = 0;
  $scope.totalDespesaPorCategoria = 0;

  $scope.buscarMovimentacoes = function () {
    if(ionic.Platform.isAndroid()){

    }else {
      MovimentacaoFactory.buscarTodas(function (response, error) {
        if (!error) {
          $scope.movimentacoes = response;

        }
      });
    }
    calcularDespesa();
    calcularReceita();
    calcularSaldo();

  }

  if(ionic.Platform.isAndroid()){

  }else {
    CategoriaFactory.buscarTodas(function (response, error) {
      if (!error) {
        $scope.categorias = response;
      }
    })
  }


  $scope.editar = function(movimentacao){
    movimentacao.data = new Date(movimentacao.data);
    MovimentacaoService.setMovimentacao(movimentacao);
    $scope.movimentacao = movimentacao;
    console.log($scope.movimentacao);
    $state.go("movimentacao");
  }


  $scope.salvar = function (evento) {
    if(ionic.Platform.isAndroid()){

    }else {
      MovimentacaoService.salvar($scope.movimentacao)
        .then(function (response) {

          MovimentacaoFactory.buscarTodas(function (response, error) {
            if (!error) {
              $scope.movimentacoes = response;
              calcularGastosPor($scope.movimentacao.categoria, evento);
              calcularDespesa();
              calcularReceita();
              calcularSaldo();
              $state.go('movimentacoes');
            }
          });

        }, function (error) {
          console.log(error);
        })
    }
  }

  $scope.adicionar=function(){
    var movimentacao = {};
    MovimentacaoService.setMovimentacao(movimentacao);
    $state.go("movimentacao");
  }

  $scope.excluir = function (id) {
    $ionicPopup.show({
      template: '',
      title: 'Deseja realmente excluir este item ?',
      subTitle: '',
      scope: $scope,
      buttons: [
        { text: 'Não',
          type: 'button-assertive'},
        {
          text: '<b>Sim</b>',
          type: 'button-positive',
          onTap: function(e) {

            MovimentacaoService.excluir(id)
              .then(function (response) {
                $scope.buscarMovimentacoes();

              },function (error) {
                console.log(error);
              })
          }
        }
      ]
    });
  }

  var calcularDespesa = function(){
    $scope.totalDespesa = 0;
    angular.forEach($scope.movimentacoes,function (movimentacao) {
      if(movimentacao.tipo== "DESPESA"){
        $scope.totalDespesa += movimentacao.valor;
      }
    });
  }

  var calcularReceita = function(){
    $scope.totalReceita = 0;
    angular.forEach($scope.movimentacoes,function (movimentacao) {
      if(movimentacao.tipo== "RECEITA"){
        $scope.totalReceita += movimentacao.valor;
      }
    });
  }

  var calcularSaldo = function(){
    $scope.saldo = $scope.totalReceita - $scope.totalDespesa;
  }

  var calcularGastosPor = function (categoria, evento) {
    if($scope.movimentacoes.length > 0){
      angular.forEach($scope.movimentacoes,function (movimentacao) {
        if(movimentacao.categoria.id == categoria.id){
          $scope.totalDespesaPorCategoria += movimentacao.valor;
        }
      });

      if($scope.totalDespesaPorCategoria > $scope.movimentacao.categoria.valorMaximo && $scope.movimentacao.categoria.valorMaximo != null){
        var valorExcedido = $scope.totalDespesaPorCategoria - $scope.movimentacao.categoria.valorMaximo;
        valorExcedido = $filter('currency')(valorExcedido,"R$:",2);
        $mdDialog.show(
          $mdDialog.alert()
            .clickOutsideToClose(true)
            .title('Atenção !')
            .textContent('Você gastou com '+$scope.movimentacao.categoria.descricao+' '+ valorExcedido +' a mais que esperado !')
            .ariaLabel('Alert Dialog Demo')
            .ok('OK, Entendi')
            .targetEvent(evento)
        );
      }
    }else {
      $scope.totalDespesaPorCategoria += $scope.movimentacao.valor;
    }
  }


  $scope.buscarMovimentacoes();
})
