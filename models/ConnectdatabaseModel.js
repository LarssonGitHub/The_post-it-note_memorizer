import mongoose from 'mongoose';

// //This is what connects to the database! A security risk and should be in env. file later)
const connectionStream = 'mongodb+srv://user:Los20Miss@cluster0.dqq4b.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
  
//Remember to make this into asynch and shit..
let db = mongoose.connect(connectionStream, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
  console.log('Connection to DB Successful');
}) .catch (err => {
  console.log('Connection to DB Failed', err);
  process.exit()
})

// In Mongoose, you need to use models to create, read, update, or delete items from a MongoDB collection.
const Schema = mongoose.Schema;

const schema = new Schema({
        name: {
            type: String, 
            // unique has destroyed my sevrer D:
            // unique: true, 
            minlength: 2,
            maxlength: 25,
            required: true
        },
        quote: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        }
    });
  

const SchemaClass = mongoose.model('quote', schema);


export default {
 SchemaClass
}

//gold.. https://zellwk.com/blog/mongoose/












// Defining your schema https://mongoosejs.com/docs/guide.html
// Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

// function createObject() {
//     // console.log("yo, you wanted to create an object");
//     // const mongoData = mongoose.model('quote', quoteSchema);

//     // let qoute = new mongoose({
//     //     // id: createID(),
//     //     name: "eee",
//     //     quote: "e",
//     //     category: "new"
//     // });
//     // //create new shit...
//     // qoute.save(function (err) {
//     //     console.log(err);
//     // });
//     // return;
// }

// export default {
//     // addToMongoDataBase,
//     createObject,
//     getConnection
// }