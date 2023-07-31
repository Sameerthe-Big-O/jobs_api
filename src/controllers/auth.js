const User = require('../models/User')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const jwt = require('jsonwebtoken');
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            throw new BadRequestError('please provide a name and email password', 400)
        }

        const user = await User.create({ ...req.body })
        const token = user.createJWT();

        res.status(201).json({
            user: { name: user.name },
            message: 'success',
            nBHits: user.length,
            token
        })

    } catch (error) {
        next(error)
    }
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password', 400);
    }
    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials', 401)
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials', 401)
    }
    // compare password
    const token = user.createJWT()
    res.status(200).json({ user: { name: user.name }, token })
}

module.exports = {
    register,
    login,
}
