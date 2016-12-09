controleFinanceiroAPP.service('CategoriaService', function ($http, $q) {

  this.buscarTodas = function () {
    var defer = $q.defer();
    $http.get("http://localhost:8080/categoria")
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

  this.salvar = function (categoria) {
    var defer = $q.defer();
    $http.post("http://localhost:8080/categoria",categoria)
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
})

