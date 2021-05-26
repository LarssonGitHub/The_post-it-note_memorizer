import dbModels from './ConnectdatabaseModel.js';
import mongoose from 'mongoose';

// function getmongooseID(id) {
//     try {
//         console.log("you see me");
//     return mongoose.Types.ObjectId(id);
//     } catch (err) {
//         console.log(err);
//         return [false, 500, "Major screw up, moongose is kinky and wants 12-24 bit string, double check the url"];
//     }
// }

async function findDocuments() {
    try {
        const validateDocument = await dbModels.SchemaClass.find().exec();
        return [true, 200, validateDocument];
        } catch (err) {
            console.log(err);
            return [false, 500, "Something horrible went wrong getting all collections"];
        }
}


async function getDocumentByID(id) {
    try {
    const finalId = mongoose.Types.ObjectId(id)
    const validateDocument = await dbModels.SchemaClass.findOne({
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
}

}


async function postNewDocument() {
    try {
        let newDocument = new dbModels.SchemaClass({
            name: "88.",
            quote: "2",
            category: "2"
        });
        let saveDocument = await newDocument.save();
        return [true, 200, saveDocument];
    } catch (err) {
        return [false, 400, err];
    }
}

export default {
    findDocuments,
    postNewDocument,
    // getmongooseID,
    getDocumentByID
}