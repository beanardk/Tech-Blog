const router = require('express').Router();
const req = require('express/lib/request');
const res = require('express/lib/response');
const { Post } = require('../../models');
const withAuth = require('../../utils/auth')

router.post('/', withAuth, async (req,res) => {
    try {
        const newPost = await Post.create({
            ...req.body,
            user_username: req.session.user_username,
        });
        res.status(200).json(newPost)
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:id', withAuth, async (req,res) => {
    try {
        const postData = await Post.destroy({
            where: {
                id: req.params.id,
                user_username: req.session.user_username,
            },
        });

        if(!postData) {
            res.status(404).json({ message: 'No post found with this id!' });
            return;
        }

        res.status(200).json(postData);
    } catch (err) {
        res.status(500).json(err)
    }
});

router.put('/:id', withAuth, async (req,res) => {
    try {
        const updatedPostData = await Post.update(req.body, {
            where: {
                id: req.params.id,
                user_username: req.session.user_username,
            },
        });
        res.status(200).json(updatedPostData);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;