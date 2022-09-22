import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        //Shit is derpctated in the future.. remove uniuqe
        // unique: true
    },
    password: {
        type: String,
        // minlength: 5,
        required: true
    }
})

const Users = mongoose.model('user', UserSchema);

export default {
 Users
}
