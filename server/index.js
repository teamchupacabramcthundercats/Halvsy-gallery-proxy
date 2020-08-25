const express = require('express');
const axios = require('axios');
const morgan = require('morgan');
const compression = require('compression');
const mcache = require('memory-cache');

const app = express();
const port = 3333;
const path = '/product/:productId'

const GALLERY_URL = `http://EtsyGalleryLoadBalancer-33db76ca545177a3.elb.us-west-2.amazonaws.com:7777`;
const REVIEW_URL = 'http://Ghrsea11frontendcapstoneLoadBala-4e0cad97e0939acd.elb.us-west-2.amazonaws.com:3000';

app.use(compression());
app.use(morgan('dev'));
app.use(path, express.static('./public'));

/* Please note the cache function was borrowed from an article on medium.com.
  I've looked it over and understand what it's doing so I didn't see any reason
  to rewrite the function as it serves my purpose perfectly.
  I'm utilizing it to cache the bundle.js files.

  URL: https://medium.com/the-node-js-collection/simple-server-side-cache-for-express-js-with-node-js-45ff296ca0f0
*/
const cache = (duration) => {
  return (req, res, next) => {
    let key = '__express__' + req.originalUrl || req.url
    let cachedBody = mcache.get(key)
    if (cachedBody && cachedBody !== "Not Found") {
      res.send(cachedBody)
      return
    } else {
      res.sendResponse = res.send
      res.send = (body) => {
        mcache.put(key, body, duration * 1000);
        res.sendResponse(body)
      }
      next()
    }
  }
}

// Routes
//Gallery Service
app.get(`${path}/gallery/bundle.js`, cache(7200), (req, res) => {
  const { productId } = req.params;

  axios.get(`${GALLERY_URL}/product/${productId}/bundle.js`)
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

  axios.get(`${GALLERY_URL}/api/images/${productId}`)
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

  axios.patch(`${GALLERY_URL}/api/favorite/${productId}`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

// Reviews Service
app.get(`${path}/reviews/bundle.js`, cache(7200), (req, res) => {
  const { productId } = req.params;

  axios.get(`${REVIEW_URL}/product/${productId}/bundle.js`)
    .then((response) => {
      res.send(response.data);
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(404);
    });
});

app.get(`/api/product/:productId`, cache(7200), (req, res) => {
  const { productId } = req.params;

  axios.get(`${REVIEW_URL}/api/product/${productId}`)
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