const User = require('../models/UserModel')
const bcrypt = require('bcrypt');
const { generalAccessToken, generalRefreshToken } = require('./jwtService');

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'OK',
                    message: 'The email existed!'
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'Create user successfully!',
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const login = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = userLogin
        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'The user not existed!'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword) {
                resolve({
                    status: 'OK',
                    message: 'The password or user is incorrect!'
                })
            }
            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            console.log('access_token', access_token)
            resolve({
                status: 'OK',
                message: 'Login successfully!',
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = {
    createUser,
    login
}