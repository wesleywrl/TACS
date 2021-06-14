'use strict'

const fs = require('fs');

module.exports = function (app, restrict, logger) {
  app.get('/logs', restrict, function (req, res) {
    logger.trace("Tela de logs acessada.");

    fs.readFile('logs/systemlog.log', 'utf8', (e, data) => {
      if (e) {
        console.log('Error accessing file system:', e);
        throw e;
      };
      console.error("Data:", data);
      res.render('pages/logs', {
        linhasLog: data
      });
    });


  });
} 