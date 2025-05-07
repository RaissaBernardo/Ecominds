// Constantes para as faixas críticas
const TEMP_CRITICO_MIN = 20;
const TEMP_CRITICO_MAX = 30;
const UMIDADE_CRITICO_MIN = 30;
const UMIDADE_CRITICO_MAX = 60;

// Verifica se as condições são críticas
function verificarCondicao(temp, umid) {
  const tempCritica = temp < TEMP_CRITICO_MIN || temp > TEMP_CRITICO_MAX;
  const umidCritica = umid < UMIDADE_CRITICO_MIN || umid > UMIDADE_CRITICO_MAX;
  return tempCritica || umidCritica ? 'critico' : 'ideal';
}

// Busca dados do sensor e atualiza a tela
async function buscarDadosSensor() {
  try {
    const response = await fetch('http://localhost:5500/api/sensores');
    const dados = await response.json();

    const temperatura = parseFloat(dados.temp);
    const umidade = parseFloat(dados.umi);
    const status = verificarCondicao(temperatura, umidade);

    // Atualiza os valores na tela
    document.getElementById('temperatura').textContent = temperatura.toFixed(1);
    document.getElementById('umidade').textContent = umidade.toFixed(1);

    // Atualiza o status
    const statusSpan = document.getElementById('status-condicao');
    statusSpan.textContent = status === 'ideal' ? 'Condições Ideais' : 'Condições Críticas';
    statusSpan.className = status === 'ideal' ? 'status-normal' : 'status-critico';

  } catch (error) {
    console.error('Erro ao buscar dados do sensor:', error);
  }
}

// Carrega o gráfico de temperatura
let graficoInicializado = false; // Controle de estado

async function carregarGraficoTemperatura() {
  try {
    const response = await fetch('http://localhost:5500/api/historico');
    const dados = await response.json();

    const horas = dados.map(d => d.hora);
    const temperaturas = dados.map(d => d.temperatura);

    const trace = {
      x: horas,
      y: temperaturas,
      mode: 'lines+markers',
      type: 'scatter',
      line: { color: '#4CAF50' }
    };

    const layout = {
      title: 'Variação da Temperatura em Tempo Real',
      xaxis: { title: 'Hora' },
      yaxis: { title: 'Temperatura (°C)' }
    };

    if (!graficoInicializado) {
      Plotly.newPlot('grafico-temperatura', [trace], layout);
      graficoInicializado = true;
    } else {
      Plotly.react('grafico-temperatura', [trace], layout); // Atualização sútil
    }

    console.log("Gráfico atualizado com:", dados); // Debug

  } catch (error) {
    console.error("Erro ao atualizar gráfico:", error);
  }
}

// Atualizações automáticas
setInterval(buscarDadosSensor, 5000);
setInterval(carregarGraficoTemperatura, 60000);

// Executa as funções imediatamente ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
  buscarDadosSensor();
  carregarGraficoTemperatura();
});