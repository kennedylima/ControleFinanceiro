controleFinanceiroAPP.controller("MovimentacaoController", function ($scope, $rootScope,$state,$http,MovimentacaoService,MovimentacaoFactory,CategoriaFactory) {

  $scope.receita = "RECEITA";
  $scope.despesa = "DESPESA";
  $scope.movimentacao = MovimentacaoService.getMovimentacao();

  $scope.totalDespesa = 0;
  $scope.totalReceita = 0;
  $scope.saldo = 0;

  $scope.buscarMovimentacoes = function () {
    MovimentacaoFactory.buscarTodas(function (response, error) {
      if(!error){
        $scope.movimentacoes = response;
        calcularDespesa();
        calcularReceita();
        calcularSaldo();
      }
    });
  }

  CategoriaFactory.buscarTodas( function (response, error) {
    if(!error){
      $scope.categorias = response;
    }
  })


  $scope.editar = function(movimentacao){
    movimentacao.data = new Date(movimentacao.data);
    MovimentacaoService.setMovimentacao(movimentacao);
    $scope.movimentacao = movimentacao;
    console.log($scope.movimentacao);
    $state.go("movimentacao");
  }

  $scope.buscarMovimentacoes();

  $scope.salvar = function () {
    MovimentacaoService.salvar($scope.movimentacao)
      .then(function (response) {
        $state.go('movimentacoes');
      }, function (error) {
        console.log(error);
      })
  }

  $scope.adiconar=function(){
    var movimentacao = {};
    MovimentacaoService.setMovimentacao(movimentacao);
    $state.go("movimentacao");
  }

  $scope.excluir = function (id) {
    window.alert("Excluir" + id);
  }

  var calcularDespesa = function(){
    angular.forEach($scope.movimentacoes,function (movimentacao) {
      if(movimentacao.tipo== "DESPESA"){
        $scope.totalDespesa += movimentacao.valor;
      }
    });
  }

  var calcularReceita = function(){
    angular.forEach($scope.movimentacoes,function (movimentacao) {
      if(movimentacao.tipo== "RECEITA"){
        $scope.totalReceita += movimentacao.valor;
      }
    });
  }

  var calcularSaldo = function(){
    $scope.saldo = $scope.totalReceita - $scope.totalDespesa;
  }
})
