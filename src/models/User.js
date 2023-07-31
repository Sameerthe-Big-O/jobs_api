const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { userInfo } = require('os');

const userModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name filed cannot be empty'],
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: [true, 'name filed cannot be empty'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'please provide valid email'
        ],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'please provide valid password'],
        minlength: 3,
        maxlength: 100,
    },
})

//*so here in this middleware what's happening here is that before inserting the new document the object we give to the mongoose it'll take that run this middleware and then it'll save itn here the this refers to the document itself
userModel.pre('save', async function () {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

//*also that these method we can be when we got the data back basically here the name will be refered the property of document we'll get it back
userModel.methods.getName = function (ob) {
    console.log(this.name);
    return this.name
}

userModel.methods.createJWT = function () {
    return jwt.sign(
        { userId: this._id, name: this.name },
        process.env.JWT_ACCESS_TOEKN,
        {
            expiresIn: process.env.JWT_LIFETIME,
        }
    )
}

userModel.methods.comparePassword = async function (canditatePassword) {
    const isMatch = await bcrypt.compare(canditatePassword, this.password)
    return isMatch
}

//*we can also make the our custom method on the mongoose so if there's some sort of tthing we're do again and again we can simply just add as the mongoose method here the this will point to the document that get return from the database


module.exports = mongoose.model('User', userModel);