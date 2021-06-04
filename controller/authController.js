import models from '../models/usersSchema.js';
import dotenv from 'dotenv';
dotenv.config();
const {
    SESSION_NAME,
} = process.env;


function renderLogin(req, res, next) {
    res.status(200).render('pages/login', {
        message: "Welcome to your favorite post it-note-app!",
        errorMessage: res.locals.notification
    });
}

async function submitLogin(req, res, next) {
    try {
        const {
            name,
            password
        } = req.body;
        const validateUser = await models.Users.findOne({
            name: name,
            password: password
        });
        if (!validateUser) {
            req.session.notification = "No such user found in our database, your password or username is incorrect"
            return res.redirect('/user/login');
        }
        req.session.isValidated = validateUser;
        res.redirect('/')
    } catch (err) {
        req.session.notification = err;
        return res.redirect('/user/login');
    }
}

function renderRegistrer(req, res, next) {
    res.status(200).render('pages/register', {
        message: "Create Your account",
        errorMessage: res.locals.notification
    });
}

async function submitRegistrer(req, res, next) {
    console.log('post User event called');
    const {
        name,
        password
    } = req.body
        try {
            let newUser = new models.Users({
                name: name,
                password: password
            });

            let saveDocument = await newUser.save();
       
            if (saveDocument) {
                req.session.notification = "Account created, please log in."
                return res.redirect('/user/login');
            }
        } catch (err) {
            console.log(err);
            req.session.notification = 'Something went horrible wrong..! Try again';
            return res.redirect('/user/register');
        }
}

function logout(req, res) {
    req.session.destroy((err) => {
        if (err) {
            console.log(err);
            res.redirect('/')
            return
        }
        res.clearCookie(SESSION_NAME);
        console.log('cookie destroyed');
        res.redirect('/')
    });
};

export default {
    renderLogin,
    submitLogin,
    renderRegistrer,
    submitRegistrer,
    logout
}