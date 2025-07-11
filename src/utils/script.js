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

