const express = require('express');
const axios = require('axios');
const morgan = require('morgan');

const app = express();
const port = 3333;
const path = '/product/:productId'

app.use(morgan('dev'));
app.use(path, express.static('./public'));

// Routes
//Gallery Service
app.get(`${path}/gallery/bundle.js`, (req, res) => {
  axios.get('http://localhost:7777/bundle.js')
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

app.get(`/api/images/:productId`, (req, res) => {
  const { productId } = req.params;

  axios.get(`http://localhost:7777/api/images/${productId}`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

app.patch(`/api/favorite/:productId`, (req, res) => {
  const { productId } = req.params;

  axios.patch(`http://localhost:7777/api/favorite/${productId}`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

// Reviews Service
app.get(`${path}/reviews/bundle.js`, (req, res) => {
  axios.get(`http://localhost:3000${path}/bundle.js`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

app.get(`/api/product/:productId`, (req, res) => {
  const { productId } = req.params;

  axios.get(`http://localhost:3000/api/product/${productId}`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

module.exports = {
  app,
};