import models from '../models/ConnectdatabaseModel.js';
import mongoose from 'mongoose';
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
 
    if (!validatedUser) {
        console.log("acces denied");
        return res.redirect('login');
    }
    return next();
}

function login(req, res, next) {
    res.status(200).render('pages/login', {
        anwser: "greetings from server, denied, log in!",
    });
}

async function getCollection(req, res, next) {

    async function findDocuments() {
        try {
            const validateDocument = await models.SchemaClass.find().exec();
            return [true, 200, validateDocument];
            } catch (err) {
                console.log(err);
                return [false, 500, "Something horrible went wrong getting all collections"];
            }
    }

    findDocuments().then(validation => {
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

function getDocument(req, res, next) {
    console.log("get id called");

    async function getDocumentByID(id) {
        try {
        const finalId = mongoose.Types.ObjectId(id)
        const validateDocument = await models.SchemaClass.findOne({
            _id: finalId
        });
    console.log(validateDocument);
        if (validateDocument === null) {
            throw new Error("couldn't find any document by that id")
        }
        return [true, 200, validateDocument];
    
    } catch (err) {
        console.log(err);
        return [false, 404, "Something went wrong, most likely is there no document with this id"];
    }}

    getDocumentByID(req.params.id).then(validation => {
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

    async function postNewDocument() {
        try {
            let newDocument = new models.SchemaClass({
                name: "new created document2.",
                quote: "2",
                category: "2"
            });
            let saveDocument = await newDocument.save();
            return [true, 200, saveDocument];
        } catch (err) {
            console.log(err);
            return [false, 400, err];
        }
    }

    postNewDocument().then(validation => {
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