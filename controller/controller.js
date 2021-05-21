import models from '../models/ConnectdatabaseModel.js';
import mongoose from 'mongoose';
//If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.
async function getCollection(req, res, next) {
    const results = await models.SchemaClass.find().exec();
    // if (validate)
    res.send(results);
}

function getDocument(req, res, next) {
    console.log("get id called");
    let tempid;
    try {
        tempid = mongoose.Types.ObjectId(req.params.id);
        console.log(tempid);
    } catch (error) {
        console.error(error);
        res.status(400).send({
            message: `Error 400, bad request dude.., or you know.. You picked the wrong id.. you need to understand objectID mongodb.. 12-24bits or something`
        });
        return;
    }

    async function asyncDocument(id) {
        //is findbyid better?
        const validateDocument = models.SchemaClass.findOne({
            _id: id
        });
        if ((await validateDocument).length === 0) {
            throw new Error("No such id...!")
        }
        return validateDocument;
    }

    asyncDocument(tempid).then(document => {
        res.send(document)
        console.log(document)
        return;
    }).catch(err => {
        console.log(err);
        res.status(400).send({
            m: "no id..."
        });
        return;
    })
}

function createMongoData(req, res, next) {
    //Sort this...
    let newDocument = new models.SchemaClass({
        name: "11111.",
        quote: "vvv",
        category: "vvv"
    });

    //asynch in create char..!
    //  const saveNewNote = await newDocument.save();
    // console.log(saveNewNote);
    newDocument.save(function (error, document) {
        if (error) console.error(error)
        console.log(document)
    })

    res.send("item added")
}

//Make it.. Nicer.. error handling... Don't forget async shit,...!
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
    res.send({m: "you nuked it...!"})
}

function pageNotfound(req, res, next) {
    res.status(404).send({
        m: 'I do not exist.. Sucks'
    });
}

export default {
    getCollection,
    createMongoData,
    getDocument,
    updateDocument,
    deleteDocument,
    deleteCollection,
    pageNotfound
}