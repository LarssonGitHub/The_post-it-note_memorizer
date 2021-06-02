import models from '../models/ConnectdatabaseModel.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const {
    SESSION_NAME,
} = process.env;


function validateUser(req, res, next) {
    console.log(req.session);
    if (!req.session.isValidated) {
        //Sätt ett lämpligt medelande på alla redirect
        req.session.notification = "access denied"
        return res.redirect('/user/login');
    }
    console.log(req.session.isValidated);
    return next();
}

function renderLogin(req, res, next) {
    res.status(200).render('pages/login', {
        message: "Welcome to your favorite post it-note-app!",
        errorMessage: res.locals.notification
    });
}

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
function notify(req,res,next) {
    res.locals.notification = req.session.notification;
    delete req.session.notification;
    next();
}


async function submitLogin(req, res, next) {
    const {
        name,
        password
    } = req.body;

    // console.log(req.body);

    const validateUser = await models.UserSchemaClass.findOne({
        name: name,
        password: password
    });

    // console.log(validateUser);
    if (!validateUser) {
        // console.log("no user there...! Or your password is wrong");
        req.session.notification = "No such user found in our database"
        return res.redirect('/user/login');
    }

    // const validatePassword = await models.UserSchemaClass.findOne({
    //     password: password
    // });

    // if (!validatePassword) {
    //     console.log("no password there...!");
    //     return res.redirect('/user/login');
    // }

    //session behåller/håller reda på ditt namn 
    req.session.isValidated = validateUser;
    res.redirect('/')

}


function renderRegistrer(req, res, next) {
    res.status(200).render('pages/register', {
        anwser: "greetings from server, create an account you loveable person",
    });
}

function submitRegistrer(req, res, next) {
    console.log('post User event called');

    const {
        name,
        password
    } = req.body

    async function postNewUser() {
        try {
            let newDocument = new models.UserSchemaClass({
                name: name,
                password: password
            });
            let saveDocument = await newDocument.save();
            return [true, 200, saveDocument];
        } catch (err) {
            console.log(err);
            return [false, 400, err];
        }
    }

    postNewUser().then(validation => {
        let [isValidated, statusCode, result] = validation;
        if (isValidated) {
            console.log("user added");
            res.status(statusCode).redirect('/user/login')
            return;
        }

        console.log({
            Anwser: "Didn't add a new user",
            result: result
        });

        res.status(statusCode).redirect('/user/register');

    });
}


async function getCollection(req, res, next) {
    console.log('getCollection called');

    try {
        const validateDocument = await models.SchemaClass.find({
            userID: req.session.isValidated.name
        }).exec();

        const results = validateDocument;

        if (!validateDocument || validateDocument.length === 0) {
            console.log('no documents');
            res.status(200).render('pages/index', {
                results: results,
                message: 'Create your first post it note! Press the stack of notes to get started with your new sorted life!'
            });
            return;
        }
        if (validateDocument) {
            res.status(200).render('pages/index', {
                results: results,
                message: 'Welcome back'
            });
            return;
        }
    } catch (err) {
        res.status(404).render('pages/index', {
            results: [],
            message: err
        });
    }
}
//Make nicer error checking, in this example... Make it into one async.. not two!
async function getDocument(req, res, next) {
    console.log("get id called");
    const id = req.params.id

    try {
        const convertToObjectID = mongoose.Types.ObjectId(id)
        console.log(convertToObjectID);
        const validateDocument = await models.SchemaClass.findOne({
            _id: convertToObjectID
        });
        // console.log(validateDocument);
        if (!validateDocument || validateDocument.length === 0) {
            throw new Error("couldn't find any document by that id");
            // res.status(404).json("couldn't find any document by that id");
        }

        if (validateDocument || validateDocument.length === 1) {
            res.status(200).send(validateDocument)
        }
    } catch (err) {
        console.log(err);
        res.status(404).json(err);
        return;
    }
}

async function createDocument(req, res, next) {
    console.log('post event called');
    const {
        headline,
        notes
    } = req.body;

    console.log(req.session.isValidated.name);

    try {
        // //in case someone wants to mess with my cookies
        // if (req.session.isValidated.name !== ) {
        //     throw new Error("Don't mess around with my cookies!")
        // }

        let newDocument = new models.SchemaClass({
            headline: headline || "Dude, you didn't add headline",
            note: notes || "You didn't add anything",
            //userID: User id när postar postitnote
            xAxis: 50,
            yAxis: 50,
            userID: req.session.isValidated.name
        });

        if (newDocument.userID !== req.session.isValidated.name) {
            throw new Error("Don't try to cheat the system...")
        }

        if (newDocument.userID === req.session.isValidated.name) {
            let saveDocument = await newDocument.save();

            res.status(200).send({
                message: "Document added!",
                document: saveDocument
            })
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(404).json(err);
        return;
    }
}

//Make it.. Nicer.. error handling... Don't forget async shit,...! YOU WHERE HERE........ :(((((((())))))))))()D)
async function updateDocument(req, res, next) {
    console.log('updatebyid Called');

    const id = mongoose.Types.ObjectId(req.params.id);
    const findDoucment = await models.SchemaClass.findOne({
        _id: id
    });

    findDoucment.name = "You just updated me!"
    findDoucment.quote = findDoucment.category
    findDoucment.category = findDoucment.category

    const doc = await findDoucment.save()

    console.log(doc);
    res.send({
        a: 'doucment updated!',
        m: doc
    });
}

async function deleteDocument(req, res, next) {
    try {
        //findOneAndDelete better? https://mongoosejs.com/docs/api/model.html#model_Model.deleteOne
        console.log('delete called');

        const id = req.params.id;

        if (!id) {
            throw new Error('Sorry, something went wrong on the client side')
        }

        const convertToObjectID = mongoose.Types.ObjectId(id)
        const findDoucment = await models.SchemaClass.findOne({
            _id: convertToObjectID
        });

        if (findDoucment.userID !== req.session.isValidated.name) {
            throw new Error("'Can't edit other people's documents")
        }

        if (findDoucment.userID === req.session.isValidated.name) {
            const deletedDocument = await findDoucment.remove()
            // console.log(deletedDocument);
            res.status(200).send({
                a: 'doucment deleted!',
                m: deletedDocument
            });
        }

    } catch (err) {
        console.log(err);
        res.status(404).send(err);
    }
}

async function deleteCollection(req, res, next) {
    try {
        console.log('nuke called');

        if (req.session.isValidated.name) {
            await models.SchemaClass.deleteMany({
                userID: req.session.isValidated.name
            });
            
            res.status(200).send({
                m: "you nuked it...!"
            })
        }

    } catch (err) {
        console.log(err);
        res.status(404).send(err);
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

function pageNotfound(req, res, next) {
    res.status(404).send({
        m: 'I do not exist.. Sucks'
    });
}

export default {
    getCollection,
    createDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    deleteCollection,
    pageNotfound,
    validateUser,
    renderLogin,
    submitLogin,
    renderRegistrer,
    submitRegistrer,
    logout,
    notify
}