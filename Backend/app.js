const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const Post = require('./models/post');

mongoose.connect("mongodb+srv://Alex:FOeGkWwJq7DswMh6@cluster0.73kqi.mongodb.net/node-angualr?retryWrites=true&w=majority")
    .then(() => {
        console.log('connected to database');
    })
    .catch((() => {
        console.log('Something went wrong')
    }))


app.use(bodyParser.json());

app.use((req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS");
    next()
})

app.post('/api/posts',async(req, res, next) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });
   const addedPost = await post.save();
    res.status(201).json({
        message: 'Post added succesfully!!',
        postId: addedPost._id
    });
});

app.get('/api/posts',async (req, res, next) => {

    const posts = await Post.find();

    return res.status(200).json({
        message: 'posts fetched succesfully!!',
        posts
    });
});

app.delete('/api/posts/:id',async (req, res, next) => {

    await Post.deleteOne({
        _id: req.params.id
    });

    return res.status(200).json({
        message: 'posts deleted'
    });
});

module.exports = app;