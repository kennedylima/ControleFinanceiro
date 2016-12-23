controleFinanceiroAPP.controller("CategoriaController", function ($scope,$rootScope,$state,$ionicPopup,$ionicPlatform,$mdDialog,$cordovaSQLite,$cordovaToast,CategoriaFactory,CategoriaService) {
  $ionicPlatform.ready(function () {
    $scope.categorias = [];
    $scope.categoria = CategoriaService.getCategoria();

    $scope.buscarCategorias = function () {
      $scope.categorias = [];

      if ($scope.categorias.length == 0) {
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
      }
    }

    if ($scope.categorias.length == 0) {
      $scope.buscarCategorias();
    }

    $scope.salvar = function () {

      if (ionic.Platform.isAndroid()) {
        if ($scope.categoria.id != undefined) {
          var query = "UPDATE categoria SET descricao=?,valorMaximo=? WHERE id = ?";
          $cordovaSQLite.execute($rootScope.banco, query, [$scope.categoria.descricao, $scope.categoria.valorMaximo, $scope.categoria.id])
            .then(function (res) {
              CategoriaService.setCategoria(undefined);
              $state.go('categorias');
            }, function (err) {
              $cordovaToast.showShortBottom(err);
            });

        } else {
          var query = "INSERT INTO categoria (descricao,valorMaximo) VALUES(?,?)";
          $cordovaSQLite.execute($rootScope.banco, query, [$scope.categoria.descricao, $scope.categoria.valorMaximo])
            .then(function (res) {
              CategoriaService.setCategoria(undefined);
              $state.go('categorias');
            }, function (err) {
              $cordovaToast.showShortBottom(err);
            });
        }

      } else {
        CategoriaService.salvar($scope.categoria)
          .then(function (response) {
            $state.go('categorias');
          }, function (error) {
            console.log(error);
          })
      }
    }

    $scope.editar = function (categoria) {
      CategoriaService.setCategoria(categoria);
      $state.go('categoria');

    }

    $scope.adicionar = function () {
      var categoria = {};
      CategoriaService.setCategoria(categoria);
      $state.go("categoria");
    }

    $scope.excluir = function (id, evento) {
      $ionicPopup.show({
        template: '',
        title: 'Deseja realmente excluir este item ?',
        subTitle: '',
        scope: $scope,
        buttons: [
          {
            text: 'Não',
            type: 'button-assertive',
          },
          {
            text: '<b>Sim</b>',
            type: 'button-positive',
            onTap: function (e) {
              if (ionic.Platform.isAndroid()) {
                var query = "DELETE FROM categoria WHERE id=" + id;
                $cordovaSQLite.execute($rootScope.banco, query)
                  .then(function (res) {
                    $scope.buscarCategorias();
                  }, function (err) {
                    $cordovaToast.showShortBottom(err);
                  });
              } else {
                CategoriaService.excluir(id)
                  .then(function (response) {
                    $scope.buscarCategorias();

                  }, function (error) {
                    if (error.status == 500) {
                      $mdDialog.show(
                        $mdDialog.alert()
                          .parent(angular.element(document.querySelector('#popupContainer')))
                          .clickOutsideToClose(true)
                          .title('Há Movimentações utilizando esta categoria!')
                          .textContent('Para remove-la apague ou mude as movimentações de categoria')

                          .ariaLabel('Alert Dialog Demo')
                          .ok('OK, Entendi')
                          .targetEvent(evento)
                      );
                    }
                    console.log(error);
                  })
              }
            }
          }
        ]
      });
    }

  });
})
