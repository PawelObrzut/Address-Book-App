// back-end
const Joi = require('joi');
const express = require('express');
const app = express();
const cors = require('cors');

const addresses = [
    {
        id: 1,
        title: "Mrs.",
        name: "Marilyn",
        lastName: "Monroe",
        street: "5th Helena Drive",
        lgh: "12305",
        city: "Brentwood",
        zip: "90049"
    },
    {
        id: 2,
        title: "Mr.",
        name: "Frank",
        lastName: "Sinatra",
        street: "East Alejo Rd",
        lgh: "1148",
        city: "Palm Springs",
        zip: "92264"
    },
    {
        id: 3,
        title: "Mr.",
        name: "Elvis",
        lastName: "Presley",
        street: "EP Boulevard",
        lgh: "3764",
        city: "Memphis",
        zip: "38116"
    },
    {
        id: 4,
        title: "Mrs.",
        name: "Sharon",
        lastName: "Tate",
        street: "Cielo Drive",
        lgh: "10050",
        city: "Beverly Hills",
        zip: "90210"
    }
];

app.use(express.json());
app.use(cors());

const validateAddress = (address) => {
    const schema = Joi.object({
        title: Joi.string().required(),
        name: Joi.string().required(),
        lastName: Joi.string().required(),
        street: Joi.string().required(),
        lgh: Joi.string().required(),
        city: Joi.string().required(),
        zip: Joi.string()
    });

    return schema.validate(address);
};


app.get('/', (req, res) => {
    res
    .status(200)
    .header('location', '/')
    .send('Try url http://localhost:3000/api/addresses/');
});

app.get('/api/addresses', (req, res) => {
    res
    .status(200)
    .setHeader('location', '/api/addresses')
    .json(addresses);
});

app.get('/api/addresses/:id', (req, res) => {
    const address = addresses.find(address => address.id===parseInt(req.params.id));
    if (!address) {
        res.status(404).send('object not found');
        return;
    }
    res
    .status(200)
    .setHeader('location', `/api/addresses/:${req.params.id}`)
    .json(address);
});

app.post('/api/addresses/', (req, res) => {
    // setting unique ID for every new entry
    const ids = addresses.map(address => address.id);
    const max = Math.max(...ids);
    let id = max + 1;
    if (ids.length === 0) {
        id = 1;
    }
    // validation. !question: is it better to validate forms in front-end or back-end?

    const { error } = validateAddress(req.body);
    if (error) {
        console.log(error.details[0].message);
        res.status(400).send(error.details[0].message);
        return;
    }

    addresses.push({
        id: id,
        ... req.body
    });
    const address = addresses.find(address => address.id==id);
    res
    .status(201)
    .setHeader('location', `/api/addresses/:${id}`)
    .json(address);
});

app.put('/api/addresses/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const address = addresses.find(address => address.id === id);
    if (!address) {
        res.status(404).send('object not found');
        return;
    }
    // validate
    const { error } = validateAddress(req.body);

    if (error) {
        console.log(error.details[0].message);
        res.status(400).send(error.details[0].message);
        return;
    }
    // Update address
    address.title = req.body.title;
    address.name = req.body.name;
    address.lastName = req.body.lastName;
    address.street = req.body.street;
    address.lgh = req.body.lgh;
    address.city = req.body.city;
    address.zip = req.body.zip;

    // status 200 because endpoint returns updated address
    res
    .status(200)
    .setHeader('Content-Type', 'application/json')
    .setHeader('location', `/api/addresses/:${address.id}`)
    .json(address);
});

app.delete('/api/addresses/:id', (req, res) => {
    const address = addresses.find(address => address.id === parseInt(req.params.id));
    if (!address) {
        res.status(404).send('object not found');
        return;
    }
    addresses.splice(addresses.findIndex(address => address.id === parseInt(req.params.id)), 1);

    // status 204 because the endpoint returns no object
    res
    .status(204)
    .end();
});


module.exports = {
    app
  }  