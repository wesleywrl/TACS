'use strict';

const { getProducts, createProduct, importProducts, exportProducts } = require('../model/products/products');

const multer = require('multer');
const upload = multer({ dest: 'tmp/csv/' });

const csv = require('csv-parser');
const fs = require('fs');

module.exports = function (app, restrict, logger) {

  app.get('/products', restrict, function (req, res) {
    logger.trace('Tela de products acessada.');
    getProducts(function (err, products) {
      if (!err) {
        res.render('pages/products', {
          products: products
        });
      } else {
        req.session.error = err;
        res.render('pages/products', {
          products: [],
        });
      }
    });
  });

  app.get('/products/create', restrict, function (req, res) {
    logger.trace('Tela de cadastro de products acessada.');
    res.render('pages/productsCreate');
  });

  app.post('/products/create', restrict, function (req, res) {
    const { description, price } = req.body;
    
    logger.trace('Criação de produto:', description);

    createProduct(description, price, function (err, result) {
      console.log('Err, result', err, result);
      if (err) {
        req.session.error = result;
      } else {
        req.session.success = 'Cadastro bem sucedido.'
      }
      res.redirect('/products');
    });
    
  });

  app.get('/products/importar', restrict, function (req, res) {
    logger.trace('Tela de importação de products acessada.');
    getProducts(function (err, products) {
      if (!err) {
        res.render('pages/productsImport', {
          products: products
        });
      } else {
        req.session.error = err;
        res.render('pages/productsImport', {
          products: [],
        });
      }
    });
  });

  app.post('/products/importar', upload.single('csv'), restrict, function (req, res) {
    logger.trace('Operação de importação de products utilizada.');
    const fileRows = [];
    console.log('csv handler:', csv);

    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        console.log("row:", row)
        fileRows.push(row);
      })
      .on('end', () => {
        console.log('CSV file successfully processed');

        importProducts(fileRows, function (err, result) {
          console.log('Err, result', err, result);
          if (err) {
            logger.trace('Erro ao importar produtos.');
            req.session.error = result;
          } else {
            req.session.success = 'Importação bem sucedida.'
          }
          res.redirect('/products');
        });

        fs.unlinkSync(req.file.path);
      });


  });

  app.get('/products/exportar', restrict, function (req, res) {
    logger.trace('Tela de exportação de products acessada.');
    getProducts(function (err, products) {
      if (!err) {
        res.render('pages/productsExport', {
          products: products
        });
      } else {
        req.session.error = err;
        res.render('pages/productsExport', {
          products: [],
        });
      }
    });
  });

  app.post('/products/exportar', restrict, function (req, res) {
    logger.trace('Operação de exportação de products utilizada.');
    exportProducts(function (err, result) {
      //this statement tells the browser what type of data is supposed to download and force it to download
      res.writeHead(200, {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename=*products*.csv'
      });
      // whereas this part is in charge of telling what data should be parsed and be downloaded
      res.end(result, "binary");
    });
  });
}