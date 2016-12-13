controleFinanceiroAPP.controller("RelatorioController", function ($scope) {
  $scope.titulo = "Relatório";
  var canvas= {};
  var relatorio = document.getElementById('relatorio').getContext('2d');
  var dados = [3000000, 1000000, 500000, 200000, 2000000, 1020500];
  var nomeDasEmpresas = ["Petel CGR", "Petel CBA ", "Petel PVH ", "Petel SGO ", "Petel Treze ", "Pedis "];
  var option={
    segmentShowStroke : false,
    animateScale : true,
    tooltipTemplate: "<%= label +' '+accounting.formatMoney(value, 'R$', 0)%>"
  }

  $scope.gerarGrafico = function () {
      grafico = new Chart(relatorio, {
        type: 'bar',
        data: {
          labels: nomeDasEmpresas,
          datasets: [{
            data: dados,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: option

      });
  }

  $scope.gerarGrafico();
});
