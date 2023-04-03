const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')
//Login/landing page
//@route GET /

router.get('/', ensureGuest,(req, res) => {
    res.render('login',{
        layout: 'login',
    })
})



//Dashboard page
//@route GET /dashboard

router.get('/dashboard',ensureAuth, (req, res) => {
    console.log(req.user)
    res.render('dashboard')
})


module.exports = router