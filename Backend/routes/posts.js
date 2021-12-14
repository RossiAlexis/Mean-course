const express = require('express');
const multer = require('multer');

const router = express.Router();
const Post = require('../models/post');
const app = require('../app');


const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}


const storage = multer.diskStorage({
    destination: (req, file,cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = null;
        if(!isValid)
            error = new Error('Invalid mime type');
        cb(error, './images')
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, `${name}-${Date.now()}.${ext}`);
    }
});
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

router.post('',multer({storage: storage}).single('image'),async(req, res, next) => {
    console.log(req.file);
    const url = req.protocol + '://' + req.get('host');
    const post = new Post({
        title: req.body.title,
        description: req.body.description,
        image: url + '/images/' + req.file.filename
    });
   const addedPost = await post.save();
    res.status(201).json({
        message: 'Post added succesfully!!',
        post: {
            ...addedPost,
            id: addedPost._id
        }
    });
});

router.put('/:id',multer({storage: storage}).single('image'), (req, res, next) => {

    if(req.file) {
        const url = req.protocol + '://' + req.get('host');
        req.body.image = url + '/images/' + req.file.filename;       
    }
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        description: req.body.description,
        image: req.body.image
    });
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