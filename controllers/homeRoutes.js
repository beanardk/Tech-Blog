const router = require('express').Router();
const express = require('express'); 
const req = require('express/lib/request');
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

router.get('/user', withAuth, async (req,res) => {
    try {
        console.log("before db call");
        const userData = await User.findOne({ where: {username:req.session.user_username}}, {
            attributes: { exclude: ['password'] },
        });
        console.log(userData);
        const user = userData.get({ plain: true });
        res.render('user', {
            ...user,
            logged_in: true
        });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/login', (req,res) => {
    if(req.session.logged_in) {
        res.redirect('/user');
        return;
    }

    res.render('login');
});

module.exports = router;