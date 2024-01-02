const router = require('express').Router();
let User = require('../models/user.model');

//get user by firebase uid
router.route('/:uid').get((req, res) => {
    //pull uid from params
    const uid = req.params.uid;

    //find uid inside User database
    User.findOne({ uid: uid })
    .then(data => {
        res.json(data);
    })
    .catch(err => {
        console.log(err);
    })
});

//add new user to database via uid
router.route('/add').post((req, res) => {
    console.log('req body', req.body)

    const temp = {
        uid: req.body.uid
    }

    const newUser = new User(temp);

    newUser.save()
    .then(() => res.json('User added.'))
    .catch(err => res.status(400).json(err))
});

//update hoa name
router.route('/update').update((req, res) => {
    console.log('req body', req.body)

   res.json('updated name');
});

module.exports = router;