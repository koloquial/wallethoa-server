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
        expensesTypes: [],
        expensesPayees: []
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

/** TYPES **/
// [income type, expense type, payee type]

//add type 
router.route('/add/type').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account[req.body.type].push(req.body.item);

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//update type
router.route('/update/type').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account[req.body.type][req.body.index] = req.body.item;

        account.markModified(req.body.type);
        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

//delete type
router.route('/delete/type').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        account[req.body.type].splice(req.body.index, 1);

        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

/** NOTES  */
//add note
router.route('/add/note').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        //find correct sheet (active)
        for(let i = 0; i < account.sheets.length; i++){
            if(account.sheets[i].name === req.body.sheet.name){
                //sheet found
                //replace note array item
                //account > sheets[0] > income[0] > .notes.push
                account.sheets[i][req.body.type][req.body.itemIndex].notes.push(req.body.item);
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
                //update note
                account.sheets[i][req.body.type][req.body.itemIndex].notes[req.body.editIndex] = req.body.item;
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
                account.sheets[i][req.body.type][req.body.itemIndex].notes.splice(req.body.editIndex, 1);
                break;
            }
        }

        account.markModified("sheets");
        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});

/** SLIPS **/
//add slip
router.route('/add/slip').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        //find correct sheet
        for(let i = 0; i < account.sheets.length; i++){
            if(account.sheets[i].name === req.body.sheet.name){
                console.log('slip', req.body.slip)
                console.log('account.sheets[i]', account.sheets[i])
                account.sheets[i][req.body.slip].push({
                    uid: req.body.uid,
                    postDate: req.body.postDate,
                    type: req.body.type,
                    payee: req.body.payee,
                    dateCreated: req.body.dateCreated,
                    amount: req.body.amount,
                    notes: req.body.note ? [req.body.note] : []
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

//update slip
router.route('/update/slip').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        //find correct sheet
        for(let i = 0; i < account.sheets.length; i++){
            if(account.sheets[i].name === req.body.sheet.name){
                //sheet found
                //update slip
                account.sheets[i][req.body.type][req.body.itemIndex] = req.body.slip;
                break;
            }
        }

        account.markModified("sheets");
        account.save()
        .then(() => res.json(account))
        .catch(err => res.status(400).json('Error: ' + err))
    })
});
 
//delete slip
router.route('/delete/slip').post((req, res) => {
    User.findOne({ uid: req.body.uid })
    .then(account => {
        //find correct sheet
        for(let i = 0; i < account.sheets.length; i++){
            if(account.sheets[i].name === req.body.sheet.name){
                //sheet found
                //find slip
                account.sheets[i][req.body.type].splice(req.body.index, 1);
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