
import controller from '../controller/controller.js';

const router = express.Router();

import dotenv from 'dotenv';
import session, {
    MemoryStore
} from 'express-session';
import express from 'express';



dotenv.config();
const {
    SESSION_LIFETIME,
    NODE_ENV,
    SESSION_NAME,
    SESSION_SECRET,
} = process.env;


router.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore(),
    cookie: {
        maxAge: Number(SESSION_LIFETIME),
        sameSite: 'strict',
        secure: NODE_ENV === 'production',
    },
}));

router.get('/', controller.validateUser, controller.getCollection);

router.get('/user/login', controller.renderLogin)

router.post('/user/login', controller.submitLogin)

router.get('/user/register', controller.renderRegistrer)

router.post('/user/register', controller.submitRegistrer)

router.get('/:id', controller.validateUser, controller.getDocument);

router.post('/', controller.validateUser, controller.createDocument);

router.put('/:id', controller.validateUser, controller.updateDocument);

router.delete('/:id', controller.validateUser, controller.deleteDocument);

router.delete('/nuke/database', controller.validateUser, controller.deleteCollection);


//If it does not exist...
router.get('*', controller.pageNotfound);
router.post('*', controller.pageNotfound);
router.put('*', controller.pageNotfound);
router.delete('*', controller.pageNotfound);

export default {
    routes: router
}