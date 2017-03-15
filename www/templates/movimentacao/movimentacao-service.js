controleFinanceiroAPP.service('MovimentacaoService', function ($http, $q) {



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

  this.excluir = function (id) {
    var defer = $q.defer();
    $http.delete("http://localhost:8080/movimentacao/"+id)
      .then(
        function(response){
          defer.resolve(response);

        },
        function(errResponse){
          console.error('Erro ao excluir movimentacao');
          defer.reject(errResponse);
        }
      );
    return defer.promise;
  }

  this.setMovimentacao = function (movimentacao) {
    this.movimentacao = movimentacao;
  }
  this.setMovimentacoes = function (movimentacoes) {
    this.movimentacoes = movimentacoes;
  }

  this.getMovimentacao = function () {
    return this.movimentacao;
  }

  this.getMovimentacoes = function () {
    return this.movimentacoes;
  }

})
