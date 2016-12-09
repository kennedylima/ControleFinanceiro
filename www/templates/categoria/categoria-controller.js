controleFinanceiroAPP.controller("CategoriaController", function ($scope,$state, CategoriaFactory,CategoriaService) {
  $scope.categoria = {};
  CategoriaFactory.buscarTodas(function (response, error) {
    if(!error){
      $scope.categorias = response;
    }
  })

  $scope.salvar = function () {
    CategoriaService.salvar($scope.categoria)
      .then(function (response) {
        $state.go('categorias');
      }, function (error) {
        console.log(error);
      })
  }
})
