async function carregarCotacao(tipoMoeda, idContainer) {
    const url = `https://economia.awesomeapi.com.br/json/last/${tipoMoeda}`;
    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();
        // O nome da chave é removido o "-" e substituído por "" (ex: USD-BRL => USDBRL)
        const moeda = dados[tipoMoeda.replace('-', '')];

        const container = document.getElementById(idContainer);
        if (!container) return;

        container.querySelector('#name-money').textContent = `${moeda.name}`;
        container.querySelector('#value-money').textContent = `R$ ${parseFloat(moeda.bid).toFixed(2)}`;
        if (moeda.pctChange < 0) {
            container.querySelector('#percnt-money').style.color = 'red';
            container.querySelector('#percnt-money').textContent = `${parseFloat(moeda.pctChange).toFixed(2)}% hoje`;
        } else {
            container.querySelector('#percnt-money').style.color = 'green';
            container.querySelector('#percnt-money').textContent = `${parseFloat(moeda.pctChange).toFixed(2)}% hoje`;
        }
    } catch (erro) {
        const container = document.getElementById(idContainer);
        if (!container) return;
        container.querySelector('#name-money').textContent = 'Erro ao carregar cotação';
        container.querySelector('#value-money').textContent = '';
        container.querySelector('#percnt-money').textContent = '';
    }
}

carregarCotacao('USD-BRL', 'item-container1'); // Carrega a cotação do Dólar para o Real
carregarCotacao('EUR-BRL', 'item-container2'); // Carrega a cotação do Euro para o
carregarCotacao('GBP-BRL', 'item-container3'); // Carrega a cotação da Libra Esterlina para o Real
carregarCotacao('BTC-BRL', 'item-container4'); // Carrega a cotação do Bitcoin para o Real


let moedaSelecionada = ''; // armazena a moeda escolhida

function selecionarMoeda(moeda) {
    moedaSelecionada = moeda;
    document.getElementById('currency-input').value = moeda;
}

function converter() {
    const valor = parseFloat(document.getElementById('valorInput').value);
    if (!moedaSelecionada) {
        alert('Selecione uma moeda no dropdown.');
        return;
    }
    if (isNaN(valor)) {
        alert('Digite um valor válido para conversão.');
        return;
    }

    const destino = 'BRL'; // fixo para conversão para Real
    const url = `https://economia.awesomeapi.com.br/json/last/${moedaSelecionada}-${destino}`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            const key = moedaSelecionada + destino;
            const cotacao = parseFloat(data[key].ask);
            const convertido = (valor * cotacao).toFixed(2);
            // Mostra o valor convertido no mesmo input onde aparece a moeda
            document.getElementById('currency-input').value = `R$ ${convertido}`;
        })
        .catch(err => {
            console.error('Erro ao buscar cotação:', err);
            alert('Erro ao buscar cotação.');
        });
}

fetch('https://economia.awesomeapi.com.br/json/daily/USD-BRL/30')
  .then(res => res.json())
  .then(dados => {
    const labels = dados.map(item => {
      const date = new Date(item.timestamp * 1000);
      return `${date.getDate()}/${date.getMonth()+1}`;
    }).reverse();

    const valores = dados.map(item => Number(item.bid)).reverse();

    const ctx = document.getElementById('meuGrafico').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Dólar (R$)',
          data: valores,
          borderColor: 'rgb(75, 192, 192)',
          fill: false,
          tension: 0.1
        }]
      }
    });
  });
