import express from 'express';
import routes from './routes/routes.js'
import path from 'path';

//Makes it possible to work with envoirmental files


const app = express();

import dotenv from 'dotenv';
dotenv.config();
const {
    PORT,
    TEST
} = process.env;


app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(path.resolve(), 'public')));
app.use(express.static(path.join(path.resolve(), 'assets')));
app.set('view engine', 'ejs')

app.use(routes.routes);
console.log(TEST);
app.listen(PORT, () => {
    console.log("I'm listening", PORT, "Lets fucking do this!");
})