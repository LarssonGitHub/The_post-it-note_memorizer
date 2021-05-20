import models from '../models/ConnectdatabaseModel.js';

//If the current middleware function does not end the request-response cycle, it must call next() to pass control to the next middleware function. Otherwise, the request will be left hanging.
async function getData(req, res, next) {
    const results = await models.SchemaClass.find().exec();
    // if (validate)
    res.send(results);
}

async function createMongoData(req, res, next) {
    //Sort this...
 let newShit =  await new models.SchemaClass({
    name: "2222.",
    quote: "vvv",
    category: "vvv"
});
newShit.save(function (error, document) {
    if (error) console.error(error)
    console.log(document)
  })
    res.send("item added")
}

export default {
    getData,
    createMongoData
}