const express = require('express');
const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const cors = require('cors');

const app = express();
app.use(cors());

const port = new SerialPort('COM3', { baudRate: 9600 }); // troque 'COM3' pela sua porta
const parser = port.pipe(new Readline({ delimiter: '\n' }));

let dados = {};

parser.on('data', linha => {
  try {
    dados = JSON.parse(linha);
  } catch (e) {
    console.log("Erro no JSON:", linha);
  }
});

app.get('/dados', (req, res) => res.json(dados));
app.listen(3000, () => console.log("Rodando em http://localhost:3000"));
