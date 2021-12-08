const express = require('express');

const router = express.Router();
const Post = require('../models/post');

router.get('',async (req, res, next) => {

    const posts = await Post.find();

    return res.status(200).json({
        message: 'posts fetched succesfully!!',
        posts
    });
});

router.get('/:id', async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (post) {
        return res.status(200).json(post);        
    } else {
        return res.status(400).json({
            message: 'post not found!!'
        });
    }

})

router.post('',async(req, res, next) => {
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

router.put('/:id', (req, res, next) => {
    const post = new Post({ 
        _id: req.body.id,
        title: req.body.title,
        description: req.body.description
    })
    
    Post.updateOne({_id: req.params.id}, post).then(result => {
        console.log(result);
        res.status(200).json({message: "Update successfull!"});
    })
})

router.delete('/:id',async (req, res, next) => {

    await Post.deleteOne({
        _id: req.params.id
    });

    return res.status(200).json({
        message: 'posts deleted'
    });
});

module.exports = router;