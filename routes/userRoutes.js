const User = require("../models/user");
const bcrypt = require('bcrypt');

const express = require('express');
const router = express.Router();

const { createTokenForUser } = require("../services/auth");


router.get('/login', (req, res) => {
    return res.render('login');
});

router.get('/register', (req, res) => {
    return res.render('register');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const findUser = await User.findOne({ email: email });
        if (!findUser) {
            return res.render('login', { error: "User does not exist" });
        }
        if (!bcrypt.compareSync(password, findUser.password)){
            return res.render('login', { error: 'Incorrect Password' });
        }
        const token = createTokenForUser(findUser);
        // console.log('token', token);
        return res.cookie('token', token).redirect('/');
    } catch (err) {
        console.error(err);
        return res.render('login', { error: 'Invalid Credentials' });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
});

router.post('/register', async (req, res, next) => {
    const { fullName, email, password } = req.body
    const hash = bcrypt.hashSync(password, 12);
    try {
        const findUser = await User.findOne({ email: email });
        if (findUser) {
            return res.redirect('/user/login');
        }
        await User.create({
            fullName: fullName,
            email: email,
            password: hash
        });
        res.redirect('/user/login');
    } catch (err) {
        console.log(err);
        res.redirect('/user/register');
    }
});


module.exports = router;