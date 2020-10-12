const express = require('express');
const app = express();
const router = express.Router();

router.get('/*', (req, res, next)=>{

    req.app.locals.layout = 'admin';
    next();

})


router.get('/', (req, res)=>{
    res.render('admin/users')
})

router.get('/create', (req, res)=>{
    res.render('admin/users/create')
})

router.get('/dummy', (req, res)=>{
    res.render('admin/users/dummy')
})

router.post('/generate-fake-users', (req, res)=>{


})

module.exports = router