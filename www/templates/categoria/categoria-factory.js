controleFinanceiroAPP.factory("CategoriaFactory",function ($ionicPlatform,$cordovaSQLite,$cordovaToast,$rootScope,CategoriaService) {

  var categorias = [];

  categorias.buscarTodas = function (callback) {
      CategoriaService.buscarTodas()
        .then(
          function (response) {
            callback(response.data, '');
          },
          function (errResponse) {
            console.error('Erro ao realizar a requisição GET');
            callback('', errResponse);
          }
        )
    }
  return categorias;
});

