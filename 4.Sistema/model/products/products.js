const pool = require('../db/connection');
const format = require('pg-format');

module.exports = {
  getProducts: function (callback) {
    pool.query(`SELECT products.id, products.description, products.price, COUNT(c.id) as clientes_alcancados
      FROM products
      LEFT JOIN sales s ON s.product_id = products.id
      LEFT JOIN clients c ON s.client_id = c.id
      GROUP BY products.id
    `, (err, res) => {
      if (err || res.rows.length == 0) {
        console.log(err);
        callback(true, 'Nenhum produto encontrado');
      } else {
        callback(false, res.rows);
      }
    });
  },

  createProduct: function (description, price, callback) {
    pool.query('INSERT INTO products (description, price) VALUES ($1, $2) returning *',
      [description, parseFloat(price)], (err, res) => {
      console.log(err);
      console.log('Result query', res.rows);
      if (err) {
        console.log(err);
        callback(true, 'Erro ao cadastrar produto.');
      } else {
        callback(false, res.rows);
      }
    });
  },

  importProducts: function (products, callback) {
    const arrayProducts = products.map(product => [product.description, product.price]);
    console.log("Array products:", arrayProducts);
    pool.query(format('INSERT INTO products (description, price) VALUES %L returning id', arrayProducts), [], (err, res) => {
      if (err) {
        console.log(err.message);
        if (err.message.includes('duplicate')) {
          callback(true, 'Não é possível importar valores duplicados.')
        } else {
          callback(true, 'Erro ao realizar importação.');
        }
      } else {
        console.log('Result query', res.rows);
        callback(false, res.rows);
      }
    });
  },
  exportProducts: function (callback) {
    pool.query(`
      SELECT p.description, p.price
      FROM products p
    `, [], (err, res) => {
      console.log('Err, res export:', err, res.rows);

      callback(false, dataToCSV(res.rows, ["description", "price"]));
    });
  }
};

// The function gets a list of objects ('dataList' arg), each one would be a single row in the future-to-be CSV file
// The headers to the columns would be sent in an array ('headers' args). It is taken as the second arg
function dataToCSV(dataList, headers) {
  var allObjects = [];
  // Pushing the headers, as the first arr in the 2-dimensional array 'allObjects' would be the first row
  allObjects.push(headers);

  //Now iterating through the list and build up an array that contains the data of every object in the list, in the same order of the headers
  dataList.forEach(function (object) {
    var arr = [];
    arr.push(object.description, object.price);
    // Adding the array as additional element to the 2-dimensional array. It will evantually be converted to a single row
    allObjects.push(arr)
  });

  // Initializing the output in a new variable 'csvContent'
  var csvContent = "";

  // The code below takes two-dimensional array and converts it to be strctured as CSV
  // *** It can be taken apart from the function, if all you need is to convert an array to CSV
  allObjects.forEach(function (infoArray, index) {
    var dataString = infoArray.join(",");
    csvContent += index < allObjects.length ? dataString + "\n" : dataString;
  });

  // Returning the CSV output
  return csvContent;
}