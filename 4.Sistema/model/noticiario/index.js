const axios = require('axios');

module.exports = {
  getNoticias: function (callback) {
    console.log('NYAPPKEY:', process.env.NY_APP_KEY);
    axios.get(`https://api.nytimes.com/svc/topstories/v2/business.json?api-key=${process.env.NY_APP_KEY}`)
      .then(function (response) {
        callback(false, response.data.results);
      })
      .catch(function (error) {
        console.log(true, error);
        callback('Error', error);
      });
  }
};