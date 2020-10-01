const express = require('express');
const router = express.Router();

router.all('/*', (req, res, next)=>{

    req.app.locals.layout = 'admin';
    next();
})

router.get('/', (req, res)=>{
    res.render('admin/index')
});

router.get('/posts', (req, res)=>{
    res.render('admin/posts')
})

router.get('/create-post', (req, res)=>{
    res.render('admin/create-post')
})


module.exports = router;
