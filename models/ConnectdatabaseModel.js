import mongoose from 'mongoose';

// //This is what connects to the database! A security risk and should be in env. file later)
import dotenv from 'dotenv';
dotenv.config();
const {
    connectionStream
} = process.env;
  
//Remember to make this into asynch and shit..
mongoose.connect(connectionStream, {
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
        headline: {
            type: String, 
            // unique has destroyed my collection..! Create a new one! D:
            // unique: true, 
            minlength: 2,
            maxlength: 100,
            required: true
        },
        note: {
            type: String,
            required: true
        },
        userID: {
            // type: Schema.Types.ObjectId,
            type: String,
            required: true
        },
    });
  

const SchemaClass = mongoose.model('note', schema);

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        //Shit is derpctated in the future.. remove uniuqe
        // unique: true
    },
    password: {
        type: String,
        minlength: 5,
        required: true
    }
})

const UserSchemaClass = mongoose.model('user', UserSchema);

export default {
 SchemaClass,
 UserSchemaClass
}

//skapa anvädar schemea


//Döp om till qoute model och anvädaren model
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