const dadosRecentes = [];

function atualizarDashboard() {
  fetch('http://localhost:5500/api/sensores')
    .then(res => res.json())
    .then(d => {
      // Atualiza o bloco de status
      document.getElementById('status').innerHTML = `
        <p>Temperatura: <span id="temperatura">${d.temp.toFixed(1)}</span>°C</p>
        <p>Umidade: <span id="umidade">${d.umi.toFixed(1)}</span>%</p>
        <p>Status: <span id="status-condicao">${document.getElementById('status-condicao').textContent}</span></p>
      `;

      const agora = new Date().toLocaleTimeString();
      dadosRecentes.push({ temp: d.temp, umi: d.umi, hora: agora });
      if (dadosRecentes.length > 10) dadosRecentes.shift();

      // Atualiza a tabela
      const tbody = document.getElementById('tabela-dados');
      tbody.innerHTML = dadosRecentes.map(item => `
        <tr>
          <td>${item.temp.toFixed(1)}</td>
          <td>${item.umi.toFixed(1)}</td>
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