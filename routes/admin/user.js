const express = require('express');
const app = express();
const router = express.Router();
const fs = require('fs');
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const faker = require('faker');
const {isEmpty} = require('../../helpers/upload-helper')
// const {userAuth} = require('../../helpers/authenticate')



//settting default layout
router.all('/*',  (req, res, next)=>{

    req.app.locals.layout = 'admin';
    next();
})


router.get('/', (req, res)=>{

    User.find()
    .then(users=>{
        res.render('admin/users', {users: users})
    })
})

router.get('/create', (req, res)=>{
    res.render('admin/users/create')
})

router.get('/dummy', (req, res)=>{
    res.render('admin/users/dummy')
})


//generate dummy
router.post('/generate-fake-users', (req, res)=>{
    for(let i = 0; i < req.body.numbers; i++){

        const newUser = new User({
            fullname: faker.name.firstName() + ' ' + faker.name.lastName(),
            email: faker.internet.email(),
            status: 'Active',
            role: 'Subscriber',
            password: 'secret',
            file: 'default.png',
    
        })
    
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash('secret', salt, (err, hash)=>{
                if(err) throw err
                newUser.password = hash
    
                newUser.save()
                .then(user=>{
                    console.log(`New User: ${user}`)
                    req.flash('success_msg', 'Users created successfully :)');
                    res.redirect('/admin/users')
                })
                 .catch(err =>{
                     console.log(`eRROR with saving dummy users: ${err}`)
                 })
            })
        })
    
    }
})


// create users
router.post('/create', (req, res)=>{

    let filename = 'default.png';

    if(!isEmpty(req.files)){
        let file = req.files.file;
        filename = Date.now() + '-' + file.name
        file.mv('./public/uploads/' + filename, err=>{
            if(err) throw err;
        })
    }

    

    const newUser = new User({
        fullname: req.body.fullname,
        email: req.body.email,
        status: req.body.status,
        role: req.body.role,
        password: req.body.password,
        file: filename,

    })

    bcrypt.genSalt(10, (err, salt)=>{
        bcrypt.hash(req.body.password, salt, (err, hash)=>{
            if(err) throw err
            newUser.password = hash

            newUser.save()
            .then(user=>{
                console.log(`New User: ${user}`)
                req.flash('success_msg', 'User created successfully :)');
                res.redirect('/admin/users')
            })
            .catch(err=> console.log(err))
        })
    })


})



// edit users |viewing it
router.get('/:id/edit', (req, res)=>{

    User.findOne({_id: req.params.id})
    .then(user=>{
        res.render('admin/users/edit', {user:user})
    })
    .catch(err => console.log(err))
})


// updating user
router.post('/:id/update', (req, res)=>{

    User.findOne({_id: req.params.id})
    .then(user=>{
        let filename = user.file;
        if(!isEmpty(req.files)){
            let file = req.files.file;
            filename = Date.now() + '-' + file.name;
            file.mv('./public/uploads/' + filename, err=>{
                if(err)  throw err;
            })
        }

        if(user.file !== 'default.png' && user.file !== ''){
            fs.unlink('./public/uploads/' + user.file, err=>{
                if(err) throw err;
            })
        }

        if(req.body.password){
            user.fullname = req.body.fullname,
            user.email = req.body.email,
            user.status = req.body.status,
            user.role = req.body.role,
            user.file = filename,

            bcrypt.genSalt(10, (err, salt)=>{
                bcrypt.hash(req.body.password, salt, (err, hash)=>{
                    if(err) throw err;

                    user.password = hash;

                    user.save()
                    .then(savedUser=>{
                        req.flash('success_msg', 'User updated successfully :)')
                        res.redirect('/admin/users')
                    })
                    .catch(err => console.log(`saving user with password err: ${err}`))

                })
            })
        }else{
            user.fullname = req.body.fullname,
            user.email = req.body.email,
            user.status = req.body.status,
            user.role = req.body.role,
            user.file = filename,

            user.save()
            .then(savedUser=>{
                req.flash('success_msg', 'User updated successfully :)')
                res.redirect('/admin/users')
            })
            .catch(err => console.log(`saving user without password err: ${err}`))
        }

    })
    .catch(err => console.log(`User updating pulling error: ${err}`))
})


// deleting user
router.get('/:id/delete', (req, res)=>{

    User.findOne({_id: req.params.id})
    .then(user=>{
        if(user.file !== 'default.png' && user.file !== ''){
            fs.unlink('./public/uploads/' + user.file, err=>{
                if(err) throw err;
            })
        }

        user.delete()
        .then(user=>{
            req.flash('success_msg', 'User deleted successfully :)')
            res.redirect('/admin/users')
        })
    })
})

module.exports = router