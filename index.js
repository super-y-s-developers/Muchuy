require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./src/routers')
const app = express();
const cors = require('cors')

const PORT = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Muchuy api v0.1');
});

app.use('/v1', routes);

app.listen(PORT, () => console.log(`server started at port:${PORT}`));
