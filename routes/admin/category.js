const express = require('express');
const app = express();
const router = express.Router();
const Category = require('../../models/Category')
const faker = require('faker')

router.get('/*', (req, res, next)=>{

    res.app.locals.layout = 'admin'

    next()
})

router.get('/', (req, res)=>{

    Category.find()
    .then(categories=>{
     res.render('admin/category/index', {categories: categories})
    })
    .catch(err => console.log(err))

})

// create
router.post('/create', (req, res)=>{

    const newCat = new Category();
    newCat.title = req.body.title
    newCat.date = new Date();

    newCat.save()
    .then(category=>{
        console.log(`New Category: ${category}`)
        req.flash('success_msg', `${category.title} created successfully :)`);
        res.redirect('/admin/categories')
    })
    .catch(err => console.log(err))
})

// dummy
router.post('/dummy', (req, res)=>{
    
    for(let i = 0; i < req.body.number; i++){
        const newCat = new Category();
        newCat.title = faker.lorem.word();
        newCat.date = new Date();

        newCat.save()
        .then(category=>{
            console.log(`New Category: ${category}`)
            req.flash('success_msg', `${req.body.number} dummy categories successfully created  :)`);
            res.redirect('/admin/categories')
        })
        .catch(err => console.log(err))
    }
})

// delete
router.get('/:id/delete', (req, res)=>{
    Category.deleteOne({_id: req.params.id})
    .then(category =>{
        req.flash('success_msg', `Category has been deleted successfully :)`);
        res.redirect('/admin/categories')
    })
    .catch(err => console.log(err))
})

router.post('/:id/edit', (req, res)=>{

    Category.findOne({_id: req.params.id})
    .then(category =>{
        category.title = req.body.title

        category.save()
        .then(response =>{
            req.flash('success_msg', `Category has been updated successfully :)`);
            console.log(`Updated ${response}`)
            res.redirect('/admin/categories')
        })

    })
    .catch(err => console.log(err))
})

module.exports = router;



