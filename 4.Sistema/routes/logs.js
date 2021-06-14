'use strict'

const fs = require('fs');

module.exports = function (app, restrict, logger) {
  app.get('/logs', restrict, function (req, res) {
    //vlogger.fatal("Erro fatal ao acessar a página de logs, brincadeirinha.");

    // **modify your existing code here**
    fs.readFile('logs/systemlog.log', 'utf8', (e, data) => {
      if (e) throw e;
      console.error("Data:", data);
      res.render('pages/logs', {
        linhasLog: data
      });
    });


  });
} 