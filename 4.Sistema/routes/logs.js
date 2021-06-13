'use strict';

const {  } = require('../model/noticiario');

module.exports = function (app, restrict, logger) {
  app.get('/logs', restrict, function (req, res) {
    logger.trace('Tela de Noticiários acessados');

    getNoticiario(function (err, noticiario) {
      if (!err) {
        res.render('pages/noticiario', {
          noticiario: noticiario
        });
      } else {
        req.session.error = err;
        res.render('pages/noticiario', {
          noticiario: [],
        });
      }
    });

  });
}