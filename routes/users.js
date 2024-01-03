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
        sheets: [],
        homeOwners: [],
        incomeTypes: [],
        expenseCategories: [],
        expensePayee: []
    })

    newUser.save()
    .then(() => res.json(newUser))
    .catch(err => res.status(400).json('Error: ' + err))
});

//update hoa name
router.route('/update/hoa-name').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.hoaName = req.body.name;

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//create new sheet
router.route('/add/sheet').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.sheets.push({
            name: req.body.name,
            startingBalance: req.body.balance,
            income: [],
            expenses: [],
            assessments: [],
            created: new Date()
        })

        account.markModified("sheets");

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

/* INCOME */
//add income type
router.route('/add/income-type').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.incomeTypes.push(req.body.type)

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//update income type
router.route('/update/income-type').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.incomeTypes[req.body.index] = req.body.type;

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//delete income type
router.route('/delete/income-type').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.incomeTypes.splice(req.body.index, 1);

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//add deposit
router.route('/add/deposit').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        //find correct sheet
        for(let i = 0; i < account.sheets.length; i++){
            if(account.sheets[i].name === req.body.sheet.name){
                account.sheets[i].income.push({
                    uid: req.body.uid,
                    postDate: req.body.postDate,
                    type: req.body.type,
                    dateCreated: req.body.dateCreated,
                    amount: req.body.amount,
                    note: req.body.note
                })
                break;
            }
        }

        account.markModified("sheets");
        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

/* EXPENSE */
//add expense type
router.route('/add/expense-type').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.expenseTypes.push(req.body.type)

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//add expense payee
router.route('/add/expense-payee').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.expensePayees.push(req.body.payee)

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//update expense type
router.route('/update/expense-type').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.expenseTypes[req.body.index] = req.body.type;

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//update expense payee
router.route('/update/expense-payee').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.expensePayees[req.body.index] = req.body.payee;

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//delete expense type
router.route('/delete/expense-type').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.expenseTypes.splice(req.body.index, 1);

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//delete expense payee
router.route('/delete/expense-payee').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.expensePayees.splice(req.body.index, 1);

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//add expense slip
router.route('/add/expense-slip').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        //find correct sheet
        for(let i = 0; i < account.sheets.length; i++){
            if(account.sheets[i].name === req.body.sheet.name){
                account.sheets[i].expenses.push({
                    uid: req.body.uid,
                    postDate: req.body.postDate,
                    type: req.body.type,
                    payee: req.body.payee,
                    dateCreated: req.body.dateCreated,
                    amount: req.body.amount,
                    note: req.body.note
                })
                break;
            }
        }

        account.markModified("sheets");
        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

module.exports = router;