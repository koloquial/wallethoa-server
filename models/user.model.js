const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    uid: {
        type: String,
        required: true,
    },
    admin: {
        type: String,
        required: true,
    },
    hoaName: { type: String },
    sheets: { type: {} },
    homeOwners: { type: [] },
    incomeTypes: { type: [] },
    expenseTypes: { type: [] },
    expensePayees: { type: [] }
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema);

module.exports = User;