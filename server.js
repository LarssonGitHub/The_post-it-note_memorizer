import express from 'express';
import routes from './routes/routes.js'
import path from 'path';
//Makes it possible to work with envoirmental files
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const {
    connectionStream
} = process.env;

const port = process.env.PORT || 5000;

mongoose.connect(connectionStream, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
  console.log('Connection to DB Successful');
}) .catch (err => {
  console.log('Connection to DB Failed', err);
  process.exit()
})

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(express.static(path.join(path.resolve(), 'assets')));
app.set('view engine', 'ejs')

app.use(routes.routes);

app.listen(port, () => {
    console.log("I'm listening", port, "Server working, starting postitnoteapp");
})