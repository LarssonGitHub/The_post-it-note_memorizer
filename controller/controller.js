import models from '../models/documentsSchema.js';
import mongoose from 'mongoose';

async function getCollection(req, res, next) {
    console.log('render and get collection');
    try {
        const validateDocument = await models.Documents.find({
            userID: req.session.isValidated.name
        }).exec();

        const results = validateDocument;

        if (!validateDocument || validateDocument.length === 0) {
            console.log('no documents');
            res.status(200).render('pages/index', {
                headerMessage: "First time? Welcome!",
                user: req.session.isValidated.name,
                results: results,
                errorMessage: null
            });
            return;
        }
        if (validateDocument) {
            res.status(200).render('pages/index', {
                headerMessage: 'Welcome back!',
                user: req.session.isValidated.name,
                results: results,
                errorMessage: null
            });
            return;
        }
        if (validateDocument > 15) {
            res.status(200).render('pages/index', {
                headerMessage: "Isn't it time to clean up some notes?",
                user: req.session.isValidated.name,
                results: results,
                errorMessage: null
            });
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(404).render('pages/index', {
            headerMessage: 'Something went wrong',
            user: req.session.isValidated.name,
            results: null,
            errorMessage: err
        });
    }
}
//PRETTY MUCH UNSUSED! ROUTES COMMENTED OUT... Will most likely not have time to implement a new search function..!
async function getDocument(req, res, next) {
    console.log("get id called");
    const id = req.params.id
    try {
        const convertToObjectID = mongoose.Types.ObjectId(id)
        console.log(convertToObjectID);
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
    console.log('post event called');
    console.log(req.body);
    let {headlineValue, bodyTextValue, colorSelect} = req.body;
    try {
        let newDocument = new models.Documents({
            headline: headlineValue || "Dude, you didn't add headline",
            bodyText: bodyTextValue || "You didn't add anything",
            colorSelect: colorSelect,
            userID: req.session.isValidated.name
        });
        if (newDocument.userID !== req.session.isValidated.name) {
            res.status(404).json({
                message: "Don't try to cheat the system lad!"
            });
            return;
        }
        if (newDocument.userID === req.session.isValidated.name) {
            let saveDocument = await newDocument.save();
            console.log(saveDocument);
            res.status(200).json({
                message: "Document added!",
                // document: saveDocument
            })
            return;
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({
            message: "Something is wrong, didn't add anything, sorry!"
        });
        return;
    }
}

//Make it.. Nicer.. error handling... Don't forget async shit,...! YOU WHERE HERE........ :(((((((())))))))))()D)
async function updateDocument(req, res, next) {
    console.log('updatebyid Called');
    console.log(req.body);
    // console.log(req.body)
    // const id = mongoose.Types.ObjectId(req.params.id);
    // const findDoucment = await models.SchemaClass.findOne({
    //     _id: id
    // });

    // findDoucment.name = "You just updated me!"
    // findDoucment.quote = findDoucment.category
    // findDoucment.category = findDoucment.category

    // const doc = await findDoucment.save()

    // console.log(doc);
    // res.send({
    //     a: 'doucment updated!',
    //     // m: doc
    // });
}

async function deleteDocument(req, res, next) {
    try {
        //findOneAndDelete better? https://mongoosejs.com/docs/api/model.html#model_Model.deleteOne
        console.log('delete called');

        const id = req.params.id;

        if (!id) {
            res.status(404).json({
                message: "Sorry, no such id exist..! That or you tried to sneakily get another user's documents..! Bad boy!"
            });
            return;
        }
        const convertToObjectID = mongoose.Types.ObjectId(id)
        const findDoucment = await models.Documents.findOne({
            _id: convertToObjectID
        });

        if (findDoucment.userID !== req.session.isValidated.name) {
            res.status(404).json({
                message: "Sorry, no such id exist..! That or you tried to sneakily get another user's documents..! Don't mess with MY COOKIES!"
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
        res.status(404).send(err);
    }
}

async function deleteCollection(req, res, next) {
    try {
        console.log('nuke called');

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
        res.status(404).json(err);
    }
}

function pageNotfound(req, res, next) {
    // res.status(404).send({
    //     m: 'I do not exist.. Sucks'
    // });
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