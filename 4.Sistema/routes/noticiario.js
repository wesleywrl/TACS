'use strict';

const { getNoticias } = require('../model/noticiario');

module.exports = function (app, restrict, logger) {
  app.get('/noticiario', restrict, function (req, res) {
    console.log('Logger:', logger);
    logger.trace('Tela de noticiário acessada.');
    getNoticias(function (err, noticiario) {
      if (!err) {
        res.render('pages/noticiario', {
          noticias: noticiario
        });
      } else {
        req.session.error = err;
        res.render('pages/noticiario', {
          noticias: [],
        });
      }
    });


  });
}