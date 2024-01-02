const router = require('express').Router();
let User = require('../models/user.model');

//get account by firebase uid
router.route('/:uid').get((req, res) => {
    const uid = req.params.uid;

    User.findOne({ uid: uid })
    .then(data => {
        if(data === null){
            res.send({});
        }else{
            res.send(data);
        }
    })
    .catch(err => {
        console.log(err);
    })
});

//create new account
router.route('/add-account').post((req, res) => {
    const newUser = new User({
        uid: req.body.uid,
        admin: req.body.admin,
        hoaName: '',
        sheets: []
    })

    newUser.save()
    .then(() => res.json(newUser))
    .catch(err => res.status(400).json('Error: ' + err))
});

//update hoa name
router.route('/update/hoa-name').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.hoaName = req.body.hoaName;

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//create new sheet
router.route('/new/sheet').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.sheets.push({
            name: req.body.sheetName,
            startingBalance: req.body.startingBalance,
            income: [],
            expenses: [],
            assessments: [],
            created: new Date()
        })

        console.log('updated account', account)

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
})

module.exports = router;