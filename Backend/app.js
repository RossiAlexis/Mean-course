const express = require('express');
const app = express();
const bodyParser = require('body-parser')


app.use(bodyParser.json());

app.use((req, res, next)=> {
    res.setHeader('Access-Control-Allow-Origin', "*");
    res.setHeader('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.setHeader('Access-Control-Allow-Methods', "GET, POST, PATCH, DELETE, OPTIONS");
    next()
})

app.post('/api/posts',(req, res, next) => {
    const post = req.body;
    console.log(post);
    res.status(201).json({
        message: 'Post added succesfully!!'
    });
});

app.get('/api/posts',(req, res, next) => {
    const posts = [
        {
            id:'f13412412',
            title: 'first server-side post',
            description: 'this is coming from the server!'
        },
        {
            id:'hk234142bj',
            title: 'second server-side post',
            description: 'this is coming from the server!'
        }
    ]
    return res.status(200).json({
        message: 'posts fetched succesfully!!',
        posts
    });
});


module.exports = app;