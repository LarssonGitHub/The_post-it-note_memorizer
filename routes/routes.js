import controller from '../controller/controller.js';
import authControl from '../controller/authController.js';
import auth from '../middleware/auth.js'
import notify from '../middleware/notify.js' 

const router = express.Router();

import dotenv from 'dotenv';
import session, {
    MemoryStore
} from 'express-session';
import express from 'express';


dotenv.config();
const {
    SESSION_NAME,
    SESSION_SECRET,
} = process.env;


router.use(session({
    name: SESSION_NAME,
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MemoryStore(),
    cookie: {
        maxAge: null,
        sameSite: 'strict',
        secure: false,
    },
}));

router.use(notify.notify);

router.get('/', auth.validateUser, controller.getCollection);

router.get('/user/login', authControl.renderLogin)

router.post('/user/login', authControl.submitLogin)


router.get('/user/register', authControl.renderRegistrer)

router.post('/user/register', authControl.submitRegistrer)

router.get('/user/logout', auth.validateUser, authControl.logout)

// router.get('/id/:id', auth.validateUser, controller.getDocument);

router.post('/post', auth.validateUser, controller.createDocument);

router.put('/put/:id', auth.validateUser, controller.updateDocument);

router.delete('/delete/:id', auth.validateUser, controller.deleteDocument);

router.delete('/nuke/database', auth.validateUser, controller.deleteCollection);


//If it does not exist...
router.get('/*', controller.pageNotfound);
router.post('/*', controller.pageNotfound);
router.put('/*', controller.pageNotfound);
router.delete('/*', controller.pageNotfound);

export default {
    routes: router
}