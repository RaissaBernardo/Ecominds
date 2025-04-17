const dadosRecentes = [];

function atualizarDashboard() {
  fetch('http://10.110.3.139:1880/dados') // ip externo
    .then(res => res.json())
    .then(d => {
      // att status
      document.getElementById('status').innerHTML = `
        <p><strong>Temperatura Atual:</strong> ${d.temp}°C |
        <strong>Umidade Atual:</strong> ${d.umi}% |
        <strong>Luminosidade:</strong> ${d.ldr}</p>
      `;

      const agora = new Date().toLocaleTimeString();
      dadosRecentes.push({ ...d, hora: agora });
      if (dadosRecentes.length > 10) dadosRecentes.shift();

      //att grafico
      const trace = {
        x: dadosRecentes.map(item => item.hora),
        y: dadosRecentes.map(item => item.temp),
        type: 'scatter',
        name: 'Temperatura'
      };

      Plotly.newPlot('chart', [trace], {
        title: 'Temperatura ao Longo do Tempo',
        xaxis: { title: 'Hora' },
        yaxis: { title: '°C' }
      });

      // att tab
      const tbody = document.getElementById('tabela-dados');
      tbody.innerHTML = dadosRecentes.map(item => `
        <tr>
          <td>${item.temp}</td>
          <td>${item.umi}</td>
          <td>${item.ldr}</td>
          <td>${item.hora}</td>
        </tr>
      `).join('');
    })
    .catch(err => {
      console.error('Erro ao buscar dados:', err);
    });
}

setInterval(atualizarDashboard, 5000);
atualizarDashboard();