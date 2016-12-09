controleFinanceiroAPP.service('MovimentacaoService', function ($http, $q) {

  var movimentacao={};
  this.buscarTodas = function () {
    var defer = $q.defer();
    $http.get("http://localhost:8080/movimentacao")
      .then(
        function(response){
          defer.resolve(response);

        },
        function(errResponse){
          console.error('Erro ao realizar a requisição GET');
          defer.reject(errResponse);
        }
      );
    return defer.promise;
  }

  this.salvar = function (movimentacao) {
    var defer = $q.defer();
    $http.post("http://localhost:8080/movimentacao", movimentacao)
      .then(
        function(response){
          defer.resolve(response);

        },
        function(errResponse){
          console.error('Erro ao realizar a requisição GET');
          defer.reject(errResponse);
        }
      );
    return defer.promise;
  }

  this.setMovimentacao = function (movimentacao) {
    this.movimentacao = movimentacao;
  }

  this.getMovimentacao = function () {
    return this.movimentacao;
  }

})
