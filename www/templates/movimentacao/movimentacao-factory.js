controleFinanceiroAPP.factory("MovimentacaoFactory",function (MovimentacaoService) {

  var movimentacoes= {}
  movimentacoes.buscarTodas = function (callback) {
      MovimentacaoService.buscarTodas()
        .then(
          function (response) {
            callback(response.data,'');
          },
          function (errResponse) {
            console.error('Erro ao realizar a requisição GET');
            callback('',errResponse);
          }
        )
  }

  return movimentacoes;
});
