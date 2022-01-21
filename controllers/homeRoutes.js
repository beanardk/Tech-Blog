const router = require('express').Router();
const express = require('express'); 
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req,res) => {
    try {
        const postData =await Post.findAll({
            include: [
                {
                    model: User,
                    attributes: ['username'],
                }
            ]
        });
        console.log(req.session.user_username)

        const post = postData.map((post) => post.get({ plain: true }));

        res.render('homepage', {
            post,
            logged_in: req.session.logged_in
        });
    } catch (err) {
        res.status(500).json(err)
    }
});

router.get('/post/:id', async (req,res) => {
    try {
        const postData = await Post.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['username'],
                }
            ]
        });
        const post = postData.get({ plain: true });

        res.render('post', {
            ...post,
            logged_in: req.session.logged_in
        });
    } catch(err) {
        res.status(500).json(err)
    }
});