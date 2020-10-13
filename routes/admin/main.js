const express = require('express');
const router = express.Router();
// const {userAuth} = require('../../helpers/authenticate')

// router.all('/*', userAuth, (req, res, next)=>{

//     req.app.locals.layout = 'admin';
//     next();
// })


router.all('/*', (req, res, next)=>{

    req.app.locals.layout = 'admin';
    next();
})

router.get('/', (req, res)=>{
    res.render('admin/index')

    // Session Usage
    // req.session.tony = "Atuoha Anthony";
    // if(req.session.tony){
    //     console.log(`Am ${req.session.tony}`)
    // }

});




module.exports = router;
