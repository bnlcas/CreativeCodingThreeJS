const express = require('express'); // web framework
const path = require('path');

require('dotenv').config(); 

const app = express();

// serve files / assets from the src dir
app.use(express.static('src')); 

// in response to `GET /` requests, send specified html file`
app.get('/', (request, response) => {
  response.sendFile(`${__dirname}/dist/index.html`);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Listening at localhost:${PORT}`);
});