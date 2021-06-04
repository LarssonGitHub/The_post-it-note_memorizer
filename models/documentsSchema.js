import mongoose from 'mongoose';

// In Mongoose, you need to use models to create, read, update, or delete items from a MongoDB collection.
const Schema = mongoose.Schema;

const documentsSchema = new Schema({
        headline: {
            type: String, 
            // unique has destroyed my collection..! Create a new one! D:
            // unique: true, 
            minlength: 2,
            maxlength: 100,
            required: true
        },
        bodyText: {
            type: String,
            required: true
        },
        colorSelect: {
            type: String,
            required: true
        },
        userID: {
            // type: Schema.Types.ObjectId,
            type: String,
            required: true
        },
    });
  

const Documents = mongoose.model('note', documentsSchema);

export default {
    Documents
   }
   
