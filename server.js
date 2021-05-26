import express from 'express';
import routes from './routes/routes.js'
import path from 'path';
//Makes it possible to work with envoirmental files
import dotenv from 'dotenv';
// import session, { MemoryStore } from 'express-session';

const app = express();


dotenv.config();
const {
PORT, SESSION_LIFETIME, NODE_ENV, SESSION_NAME, SESSION_SECRET, TEST
} = process.env;


// app.use(session({
//     name: SESSION_NAME,
//     secret: SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: new MemoryStore(),
//     cookie: {
//       maxAge: Number(SESSION_LIFETIME),
//       sameSite: 'strict',
//       secure: NODE_ENV === 'production',
//     },
//   }));




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