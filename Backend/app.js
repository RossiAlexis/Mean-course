const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');

mongoose.connect("mongodb+srv://Alex:FOeGkWwJq7DswMh6@cluster0.73kqi.mongodb.net/node-angualr?retryWrites=true&w=majority")
    .then(() => {
        console.log('connected to database');
    })
    .catch((() => {
        console.log('Something went wrong')
    }))


app.use('/images',express.static('images'));
app.use(bodyParser.json());

app.use((req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE,PUT, OPTIONS");
    next()
})

app.use('/api/posts',postsRoutes);



module.exports = app;