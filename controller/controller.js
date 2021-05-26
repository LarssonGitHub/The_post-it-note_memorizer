import models from '../models/ConnectdatabaseModel.js';
import mongoose from 'mongoose';
import crud from '../models/crudFunctions.js'
import dotenv from 'dotenv';
import session, {
    MemoryStore
} from 'express-session';
import express from 'express';

const app = express();


dotenv.config();
const {
    PORT,
    SESSION_LIFETIME,
    NODE_ENV,
    SESSION_NAME,
    SESSION_SECRET,
    TEST
} = process.env;


app.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore(),
    cookie: {
        maxAge: Number(SESSION_LIFETIME),
        sameSite: 'strict',
        secure: NODE_ENV === 'production',
    },
}));

//If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.
const validatedUser = false;

function validateUser(req, res, next) {
    console.log("acces denied");
    if (!validatedUser) {
        return res.redirect('login');
    }
    return next();
}



async function getCollection(req, res, next) {
    crud.findDocuments().then(validation => {
        let [isValidated, statusCode, result] = validation;
        if (isValidated) {
            res.status(statusCode).render('pages/index', {
                Anwser: "All collection",
                result: result
            });
            return;
        }
        res.status(statusCode).send({
            Anwser: "something went wrong.. Ops",
            result: result
        });
    });

}

function login(req, res, next) {
    res.status(200).render('pages/login', {
        anwser: "greetings from server, denied, log in!",
    });
}

function getDocument(req, res, next) {
    console.log("get id called");
    crud.getDocumentByID(req.params.id).then(validation => {
        let [isValidated, statusCode, result] = validation;
        if (isValidated) {
            res.status(statusCode).send({
                Anwser: "Id found!",
                result: result
            });
            return;
        }
        res.status(statusCode).send({
            Anwser: "something went wrong.. Ops",
            result: result
        });
    });
}

function createDocument(req, res, next) {
    console.log('post event called');
    crud.postNewDocument().then(validation => {
        let [isValidated, statusCode, result] = validation;
        if (isValidated) {
            res.status(statusCode).send({
                Anwser: "Added new document",
                result: result
            });
            return;
        }
        res.status(statusCode).send({
            Anwser: "Didn't add a new document",
            result: result
        });
    });
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
    //findOneAndDelete better? https://mongoosejs.com/docs/api/model.html#model_Model.deleteOne
    console.log('delete called');
    const id = mongoose.Types.ObjectId(req.params.id);
    const findDoucment = await models.SchemaClass.findOne({
        _id: id
    });

    const deleted = await findDoucment.remove()

    console.log(deleted);
    res.send({
        a: 'doucment deleted!',
        m: deleted
    });

}

async function deleteCollection(req, res, next) {
    console.log('nuke route called');
    await models.SchemaClass.deleteMany({});
    res.send({
        m: "you nuked it...!"
    })
}

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
    login
}