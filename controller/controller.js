import models from '../models/documentsSchema.js';
import mongoose from 'mongoose';

async function getCollection(req, res, next) {
    // console.log('render and get collection');
    try {
        const validateDocument = await models.Documents.find({
            userID: req.session.isValidated.name
        }).exec();

        const results = validateDocument;

        if (!validateDocument || validateDocument.length === 0) {
            console.log('404, no documents');
            res.status(200).render('pages/index', {
                headerMessage: "First time? Welcome!",
                user: req.session.isValidated.name,
                results: results,
            });
            return;
        }
        if (validateDocument) {
            res.status(200).render('pages/index', {
                headerMessage: 'Welcome back!',
                user: req.session.isValidated.name,
                results: results,
            });
            return;
        }
        if (validateDocument.length > 15) {
            res.status(200).render('pages/index', {
                headerMessage: "Isn't it time to clean up some notes?",
                user: req.session.isValidated.name,
                results: results,
            });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(404).render('pages/index', {
            headerMessage: 'Something went wrong',
            user: req.session.isValidated.name,
            results: null,
        });
    }
}
//PRETTY MUCH UNSUSED! ROUTES COMMENTED OUT... Will most likely not have time to implement a new search function..!
async function getDocument(req, res, next) {
    // console.log("get id called");
    const id = req.params.id
    try {
        const convertToObjectID = mongoose.Types.ObjectId(id)
        const validateDocument = await models.Documents.findOne({
            _id: convertToObjectID
        });
        // console.log(validateDocument);
        if (!validateDocument || validateDocument.length === 0) {
            res.status(404).json("couldn't find any document by that id");
        }

        if (validateDocument.userID !== req.session.isValidated.name) {
            throw new Error("Don't try to look up other people's documents! NO peeking");
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
    // console.log('post event called');
    let {
        headlineValue,
        bodyTextValue,
        colorSelectValue
    } = req.body;

    try {
        let newDocument = new models.Documents({
            headline: headlineValue || "Dude, you didn't add headline",
            bodyText: bodyTextValue || "You didn't add anything",
            colorSelect: colorSelectValue || 'Green',
            userID: req.session.isValidated.name || "noUser"
        });
        if (newDocument.userID !== req.session.isValidated.name || newDocument === 'noUser') {
            res.status(203).json({
                message: "Don't try to cheat the system lad! Didn't add document"
            });
            return;
        }
        if (newDocument.userID === req.session.isValidated.name) {
            let saveDocument = await newDocument.save();
            res.status(200).json({
                message: "New document added!",
                document: saveDocument
            })
            return;
        }
    } catch (err) {
        console.log(err);
        res.json({
            message: "Something failed in the server side, didn't post a new document, sorry!",
            err: err
        });
        return;
    }
}

//Make it.. Nicer.. error handling... Don't forget async shit,...! YOU WHERE HERE........ :(((((((())))))))))()D)
async function updateDocument(req, res, next) {
    // console.log('updatebyid Called');
    let {
        id,
        headlineValue,
        bodyTextValue,
        colorSelectValue,
        userIDValue
    } = req.body;


    try {

        if (id === '') {
            res.status(401).json({
                message: "Don't cheat my id! Don't mess with my html id!",
                document: false
            });
            return;
        }
        if (userIDValue !== req.session.isValidated.name) {
            res.status(401).json({
                message: "I said don't mess with my cookies!",
                document: false
            });
            return;
        }
        if (userIDValue === "noUser") {
            res.status(401).json({
                message: "I said don't mess with my cookies!",
                document: false
            });
            return;
        }

        const dataId = mongoose.Types.ObjectId(id);

        let updateDocument = await models.Documents.findOne({
            _id: dataId
        });

        updateDocument.overwrite({
            headline: headlineValue || "Dude, you didn't add headline",
            bodyText: bodyTextValue || "You didn't add anything",
            colorSelect: colorSelectValue || 'Green',
            userID: req.session.isValidated.name || "noUser"
        });

        const uppdatedDocument = await updateDocument.save();

        res.status(200).json({
            message: "Document updated!",
            document: uppdatedDocument
        })
        return;

    } catch (err) {
        console.log(err);
        res.json({
            message: "Something is wrong, didn't add anything, sorry!",
            err: err
        });
    }
}

async function deleteDocument(req, res, next) {
    try {
        // console.log('delete called');

        const id = req.params.id;

        if (!id && id.length === 0) {
            res.status(404).json({
                message: "Sorry, no such id exist..!!",
                document: false
            });
            return;
        }
        const convertToObjectID = mongoose.Types.ObjectId(id)
        const findDoucment = await models.Documents.findOne({
            _id: convertToObjectID
        });

        if (findDoucment.userID !== req.session.isValidated.name) {
            res.status(404).json({
                message: "Sorry, no such id exist..! That or you tried to sneakily get another user's documents..! Don't mess with MY COOKIES!",
                document: false
            });
            return;
        }
        if (findDoucment.userID === req.session.isValidated.name) {
            const deletedDocument = await findDoucment.remove()
            res.status(200).send({
                message: 'Document deleted! Hope it was worth it!',
                document: deletedDocument.id
            });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(404).send({
            message: "Something is wrong, didn't delete",
            err: err
        });

    }
}

async function deleteCollection(req, res, next) {
    try {
        // console.log('nuke called');

        const findAllDocuments = await models.Documents.find({
            userID: req.session.isValidated.name
        }).exec();

        if (findAllDocuments.length === 0) {
            res.status(404).json({
                message: "If you want to send a tactical nuke.. You need to create some documents first!"
            });
            return;
        }

        //Didn't know how to implement this..
        // const doublecheck = findAllDocuments.filter(document => document.userID !==  req.session.isValidated.name);

        if (findAllDocuments.length > 0) {
            await models.Documents.deleteMany({
                userID: req.session.isValidated.name
            });
            res.status(200).json({
                message: "It's all gone!"
            });
            return;
        }

    } catch (err) {
        console.log(err);
        res.status(404).send({
            err: err,
            message: "Something is wrong, didn't nuke"
        });
    }
}

function pageNotfound(req, res, next) {
    console.log('404. Opps, someone tried to access a route which does not exist.');
    res.redirect('/')
}

export default {
    getCollection,
    createDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    deleteCollection,
    pageNotfound,
}