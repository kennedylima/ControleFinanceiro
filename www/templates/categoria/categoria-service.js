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

  this.excluir = function (id) {
    var defer = $q.defer();
    $http.delete("http://localhost:8080/categoria/"+id)
      .then(
        function(response){
          defer.resolve(response);

        },
        function(errResponse){
          console.error('Erro ao remover');
          defer.reject(errResponse);
        }
      );
    return defer.promise;
  }
  this.setCategoria = function (categoria) {
    this.categoria = categoria;
  }

  this.getCategoria = function () {
    return this.categoria;
  }

  this.setCategorias = function (categorias) {
    this.categorias = categorias;
  }

  this.getCategorias = function () {
    return this.categorias;
  }
})

