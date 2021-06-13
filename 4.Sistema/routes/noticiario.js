'use strict';

const { getNoticias } = require('../model/noticiario');

module.exports = function (app, restrict, logger) {
  app.get('/noticiario', restrict, function (req, res) {

    getNoticias(function (err, noticiario) {
      console.log('NOTICIAS:', noticiario);
      console.log('ERR:', err);
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