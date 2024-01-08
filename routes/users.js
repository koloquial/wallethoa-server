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
        expensePayees: []
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

//add home owner
router.route('/add/home-owner').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.homeOwners.push({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            address1: req.body.address1,
            address2: req.body.address2,
            city: req.body.city,
            state: req.body.state,
            zipcode: req.body.zipcode,
            phone: req.body.phone,
            email: req.body.email,
            emergName: req.body.emergName,
            emergPhone: req.body.emergPhone,
            ownership: req.body.ownership,
            note: [req.body.note],
            dues: req.body.dues,
            dateCreated: new Date()
        })

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

/*** INCOME ***/
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
                    notes: [req.body.note]
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

//add note
router.route('/add/note').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        //find correct sheet (active)
        for(let i = 0; i < account.sheets.length; i++){
            if(account.sheets[i].name === req.body.sheet.name){
                //sheet found
                //type of note
                if(req.body.type === 'income'){
                    //find deposit
                    for(let j = 0; j < account.sheets[i].income.length; j++){
                        if(account.sheets[i].income[j].postDate === req.body.item.postDate){
                            //found deposit, overwrite item;
                            account.sheets[i].income[j] = req.body.item;
                            break;
                        }
                    }
                }
                break;
            }
        }

        account.markModified("sheets");
        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//update note
router.route('/update/note').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        //find correct sheet
        for(let i = 0; i < account.sheets.length; i++){
            if(account.sheets[i].name === req.body.sheet.name){
                //sheet found
                //type of note
                if(req.body.type === 'income'){
                    //find deposit
                    account.sheets[i].income[req.body.depositIndex].notes[req.body.noteIndex] = req.body.item;
                    break;
                }
            }
        }

        account.markModified("sheets");
        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//delete note
router.route('/delete/note').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        //find correct sheet
        for(let i = 0; i < account.sheets.length; i++){
            if(account.sheets[i].name === req.body.sheet.name){
                //sheet found
                //type of note
                if(req.body.type === 'income'){
                    //find deposit
                    account.sheets[i].income[req.body.depositIndex].notes[req.body.noteIndex] = req.body.item;
                    break;
                }
            }
        }

        account.markModified("sheets");
        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//delete deposit 
router.route('/delete/deposit').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        //find correct sheet (active)
        for(let i = 0; i < account.sheets.length; i++){
            if(account.sheets[i].name === req.body.sheet.name){
                //sheet found
                //find deposit
                account.sheets[i].income.splice(req.body.index, 1);
                break;
            }
        }

        account.markModified("sheets");
        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

/*** EXPENSE ***/
//add expense type
router.route('/add/expense-type').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.expenseTypes.push(req.body.type)
        
        account.markModified("expenseTypes");
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

        account.markModified("expenseTypes");
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

        account.markModified("expenseTypes");
        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//add expense payee
router.route('/add/expense-payee').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account.expensePayees.push(req.body.payee);

        account.markModified("expensePayees");
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

        account.markModified("expensePayees");
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

        account.markModified("expensePayees");
        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//add expense
router.route('/add/expense').post((req, res) => {
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